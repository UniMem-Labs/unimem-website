import { SITE } from "../src/lib/site";
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateInquiry, readBoundedJson } from "../src/lib/contact";
import { POST } from "../src/app/api/contact/route";
const body = () => ({
  name: "Test User",
  email: "test@example.com",
  company: "Example",
  workflow: "Coding tasks",
  problem: "Repeated context discovery",
  message: "",
  website: "",
  startedAt: Date.now() - 5000,
  requestId: "12345678-1234-4234-8234-123456789abc",
});
function req(data: unknown = body(), origin = SITE) {
  return new Request(`${SITE}/api/contact`, {
    method: "POST",
    headers: {
      origin,
      "Content-Type": "application/json",
      "x-vercel-forwarded-for": "192.0.2.1",
    },
    body: JSON.stringify(data),
  });
}
test("validation accepts complete input and trims fields", () => {
  const result = validateInquiry({ ...body(), name: "  Test User  " });
  assert.deepEqual(result.errors, {});
  assert.equal(result.data?.name, "Test User");
});
test("validation rejects malformed, missing, overlong, control, honeypot, and timing input", () => {
  for (const input of [
    null,
    [],
    {},
    { ...body(), email: "x\r\nBcc: bad" },
    { ...body(), name: "x\ny" },
    { ...body(), company: "a".repeat(151) },
    { ...body(), workflow: "\u0000" },
    { ...body(), website: "https://spam.example" },
    { ...body(), startedAt: Date.now() + 1 },
    { ...body(), requestId: "fake" },
  ])
    assert.ok(Object.keys(validateInquiry(input).errors).length > 0);
});
test("bounded body reader checks actual streamed bytes and invalid JSON", async () => {
  const data = new TextEncoder().encode("a".repeat(13_000));
  const stream = new ReadableStream({
    start(c) {
      c.enqueue(data);
      c.close();
    },
  });
  await assert.rejects(
    readBoundedJson(
      new Request(SITE, {
        method: "POST",
        body: stream,
        duplex: "half",
      } as RequestInit),
    ),
    /BODY_TOO_LARGE/,
  );
  await assert.rejects(
    readBoundedJson(new Request(SITE, { method: "POST", body: "{" })),
  );
});
test("contact rejects foreign origins, wrong media types, and invalid fields", async () => {
  assert.equal((await POST(req(body(), "https://evil.example"))).status, 403);
  assert.equal(
    (
      await POST(
        new Request(`${SITE}/api/contact`, {
          method: "POST",
          headers: {
            origin: SITE,
            "Content-Type": "text/plain",
          },
          body: "{}",
        }),
      )
    ).status,
    415,
  );
  assert.equal(
    (
      await POST(
        new Request(`${SITE}/api/contact`, {
          method: "POST",
          headers: { origin: SITE, "Content-Type": "application/json-invalid" },
          body: "{}",
        }),
      )
    ).status,
    415,
  );
  const response = await POST(req({ ...body(), email: "not-an-email" }));
  assert.equal(response.status, 400);
  assert.ok((await response.json()).errors.email);
});
test("unconfigured service fails explicitly instead of accepting a lost inquiry", async () => {
  const old = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  try {
    assert.equal((await POST(req())).status, 503);
  } finally {
    if (old !== undefined) process.env.RESEND_API_KEY = old;
  }
});
test("delivery uses durable rate limits, keyed IPs, idempotency, and text-only email", async () => {
  const originalFetch = globalThis.fetch;
  const savedEnv = { ...process.env };
  Object.assign(process.env, {
    VERCEL: "1",
    RESEND_API_KEY: "test-only",
    CONTACT_FROM: "test@unimem.org",
    CONTACT_TO: "test@example.com",
    UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
    UPSTASH_REDIS_REST_TOKEN: "test-only",
    CONTACT_RATE_LIMIT_SECRET: "test-only-secret",
  });
  const calls: { url: string; init?: RequestInit }[] = [];
  let mode: "ok" | "limited" | "rate-fail" | "send-fail" = "ok";
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).includes("upstash.io"))
      return mode === "rate-fail"
        ? new Response("{}", { status: 503 })
        : Response.json({ result: mode === "limited" ? 0 : 1 });
    return mode === "send-fail"
      ? new Response("{}", { status: 500 })
      : Response.json({ id: "test-delivery-id" });
  };
  const originalError = console.error;
  console.error = () => {};
  try {
    assert.equal((await POST(req())).status, 200);
    assert.equal(calls.length, 2);
    assert.ok(!String(calls[0].init?.body).includes("192.0.2.1"));
    const mail = JSON.parse(String(calls[1].init?.body));
    assert.equal(mail.reply_to, "test@example.com");
    assert.ok(!("html" in mail));
    const originalKey = new Headers(calls[1].init?.headers).get(
      "Idempotency-Key",
    );
    assert.match(
      originalKey!,
      /^inquiry-12345678-1234-4234-8234-123456789abc-[0-9a-f]{24}$/,
    );
    calls.length = 0;
    assert.equal((await POST(req())).status, 200);
    assert.equal(
      new Headers(calls[1].init?.headers).get("Idempotency-Key"),
      originalKey,
    );
    calls.length = 0;
    assert.equal(
      (
        await POST(
          req({ ...body(), problem: "Updated inquiry after a failed attempt" }),
        )
      ).status,
      200,
    );
    assert.notEqual(
      new Headers(calls[1].init?.headers).get("Idempotency-Key"),
      originalKey,
    );
    for (const [m, status] of [
      ["limited", 429],
      ["rate-fail", 503],
      ["send-fail", 503],
    ] as const) {
      mode = m;
      calls.length = 0;
      assert.equal((await POST(req())).status, status);
      if (m !== "send-fail") assert.equal(calls.length, 1);
    }
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalError;
    for (const k of Object.keys(process.env))
      if (!(k in savedEnv)) delete process.env[k];
    Object.assign(process.env, savedEnv);
  }
});
