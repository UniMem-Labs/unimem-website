export type Inquiry = {
  name: string;
  email: string;
  company: string;
  workflow: string;
  problem: string;
  message: string;
  website: string;
  startedAt: number;
  requestId: string;
};
export type FieldErrors = Partial<Record<keyof Inquiry, string>>;
const limits = {
  name: 100,
  email: 254,
  company: 150,
  workflow: 1500,
  problem: 2000,
  message: 3000,
} as const;
export function validateInquiry(
  value: unknown,
  now = Date.now(),
): { data?: Inquiry; errors: FieldErrors } {
  const errors: FieldErrors = {};
  if (!value || typeof value !== "object" || Array.isArray(value))
    return { errors: { name: "Please complete the inquiry form." } };
  const raw = value as Record<string, unknown>;
  const clean: Record<string, string> = {};
  for (const [key, limit] of Object.entries(limits)) {
    const v = raw[key];
    if (typeof v !== "string") {
      errors[key as keyof Inquiry] = "Please enter text in this field.";
      continue;
    }
    clean[key] = v.trim();
    if (key !== "message" && !clean[key])
      errors[key as keyof Inquiry] = "This field is required.";
    else if (v.length > limit)
      errors[key as keyof Inquiry] = `Use ${limit} characters or fewer.`;
    else if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(v))
      errors[key as keyof Inquiry] = "Remove unsupported control characters.";
  }
  if (clean.email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(clean.email))
    errors.email = "Enter a valid email address.";
  if (clean.name && /[\r\n]/.test(clean.name))
    errors.name = "Enter your name on one line.";
  if (typeof raw.website !== "string" || raw.website !== "")
    errors.website = "Unable to accept this submission.";
  if (
    typeof raw.startedAt !== "number" ||
    !Number.isFinite(raw.startedAt) ||
    now - raw.startedAt < 2000 ||
    now - raw.startedAt > 86_400_000
  )
    errors.startedAt =
      "Please take a moment, then submit again. Refresh this page if needed.";
  if (
    typeof raw.requestId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      raw.requestId,
    )
  )
    errors.requestId = "Refresh the page and try again.";
  return Object.keys(errors).length
    ? { errors }
    : {
        data: {
          ...clean,
          website: "",
          startedAt: raw.startedAt,
          requestId: raw.requestId,
        } as Inquiry,
        errors,
      };
}
export async function readBoundedJson(
  request: Request,
  limit = 12_288,
): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > limit)
    throw new Error("BODY_TOO_LARGE");
  if (!request.body) throw new Error("INVALID_JSON");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > limit) {
        await reader.cancel();
        throw new Error("BODY_TOO_LARGE");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}
