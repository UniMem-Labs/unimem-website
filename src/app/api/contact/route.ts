import { createHash, createHmac } from "node:crypto";
import { isIP } from "node:net";
import { readBoundedJson, validateInquiry } from "@/lib/contact";
import { SITE } from "@/lib/site";
export const runtime = "nodejs";
const headers = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};
function response(status: number, message: string, extra = {}) {
  return Response.json({ message, ...extra }, { status, headers });
}
function isAllowedOrigin(origin: string | null) {
  if (!origin) return false;
  const allowed = [SITE];
  if (process.env.VERCEL_URL) allowed.push(`https://${process.env.VERCEL_URL}`);
  if (process.env.NODE_ENV !== "production")
    allowed.push("http://localhost:3000", "http://127.0.0.1:3000");
  return allowed.includes(origin);
}
const rateScript = `local n = redis.call('INCR', KEYS[1])
if n == 1 then redis.call('EXPIRE', KEYS[1], 600) end
local total = redis.call('INCR', KEYS[2])
if total == 1 then redis.call('EXPIRE', KEYS[2], 86400) end
if n > 5 or total > 500 then return 0 end
return 1`;
export async function POST(request: Request) {
  if (!isAllowedOrigin(request.headers.get("origin")))
    return response(403, "Submit this form from the UniMem website.");
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    return response(415, "Send the inquiry as JSON.");
  let value: unknown;
  try {
    value = await readBoundedJson(request);
  } catch (err) {
    return response(
      err instanceof Error && err.message === "BODY_TOO_LARGE" ? 413 : 400,
      "The inquiry could not be read. Please shorten it and try again.",
    );
  }
  const { data, errors } = validateInquiry(value);
  if (!data)
    return response(400, "Please check the highlighted fields.", { errors });
  const {
    RESEND_API_KEY,
    CONTACT_FROM,
    CONTACT_TO,
    UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN,
    CONTACT_RATE_LIMIT_SECRET,
  } = process.env;
  if (
    !RESEND_API_KEY ||
    !CONTACT_FROM ||
    !CONTACT_TO ||
    !UPSTASH_REDIS_REST_URL ||
    !UPSTASH_REDIS_REST_TOKEN ||
    !CONTACT_RATE_LIMIT_SECRET
  )
    return response(
      503,
      "The inquiry form is temporarily unavailable. Please use the email link on this page.",
    );
  let ip = "local-development";
  if (process.env.VERCEL === "1") {
    ip = (
      request.headers.get("x-vercel-forwarded-for") ||
      request.headers.get("x-forwarded-for") ||
      ""
    )
      .split(",")[0]
      .trim();
    if (!isIP(ip))
      return response(
        503,
        "The inquiry service is temporarily unavailable. Please use the email link.",
      );
  } else if (process.env.NODE_ENV === "production") {
    return response(
      503,
      "The inquiry service needs its production proxy configuration. Please use the email link.",
    );
  }
  const digest = createHmac("sha256", CONTACT_RATE_LIMIT_SECRET)
    .update(ip)
    .digest("hex");
  try {
    const redis = new URL(UPSTASH_REDIS_REST_URL);
    if (redis.protocol !== "https:" || !redis.hostname.endsWith(".upstash.io"))
      throw new Error("RATE_LIMIT_CONFIGURATION");
    const rate = await fetch(redis, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        "EVAL",
        rateScript,
        "2",
        `inquiry:ip:${digest}`,
        `inquiry:global:${new Date().toISOString().slice(0, 10)}`,
      ]),
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (!rate.ok) throw new Error("RATE_LIMIT_UNAVAILABLE");
    const result = await rate.json();
    if (result.result === 0)
      return response(
        429,
        "Too many inquiries. Please wait ten minutes or use the email link.",
      );
    if (result.result !== 1) throw new Error("RATE_LIMIT_INVALID_RESPONSE");
    const text = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Company: ${data.company}`,
      "",
      "Agent / workflow:",
      data.workflow,
      "",
      "Memory / context problem:",
      data.problem,
      "",
      "Optional message:",
      data.message || "(none)",
    ].join("\n");
    const contentDigest = createHash("sha256")
      .update(
        JSON.stringify([
          data.name,
          data.email,
          data.company,
          data.workflow,
          data.problem,
          data.message,
        ]),
      )
      .digest("hex")
      .slice(0, 24);
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `inquiry-${data.requestId}-${contentDigest}`,
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        reply_to: data.email,
        subject: "UniMem workflow inquiry",
        text,
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!sent.ok) throw new Error("DELIVERY_UNAVAILABLE");
    const resultSent = await sent.json();
    if (typeof resultSent.id !== "string" || !resultSent.id)
      throw new Error("DELIVERY_INVALID_RESPONSE");
    return response(
      200,
      "Your inquiry has been accepted for delivery. We’ll reply to the email you provided.",
    );
  } catch {
    // No request bodies, IP addresses, provider response bodies, or credentials are logged.
    console.error("inquiry_delivery_unavailable");
    return response(
      503,
      "We could not confirm delivery. Please retry or use the email link.",
    );
  }
}
