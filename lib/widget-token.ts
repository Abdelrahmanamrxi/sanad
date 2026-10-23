
import "server-only";


import {z} from 'zod'

const SECRET=process.env.WIDGET_SESSION_SECRET!
const TOKEN_TTL_SECONDS = 60 * 60 * 24; // 24 Hours
const MAX_TOKEN_LENGTH=2048;

if (!SECRET) {
  throw new Error("WIDGET_SESSION_SECRET must be configured");
}

const WidgetSessionSchema=z.object({
    businessId:z.string().min(1).max(128),
    conversationId:z.string().min(1).max(128),
    visitorId:z.string().min(1).max(128),
    exp:z.number().int().positive()
})

type WidgetSessionPayload=z.infer<typeof WidgetSessionSchema>;

export type NewWidgetSession=Omit<WidgetSessionPayload,"exp">

let keyPromise:Promise<CryptoKey>
const encoder = new TextEncoder();

function getKey(): Promise<CryptoKey> {
  // Import the secret once and reuse the CryptoKey.
  if (!keyPromise) {
    keyPromise = crypto.subtle.importKey(
      "raw",
      encoder.encode(SECRET!),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
  }

  return keyPromise;
}

function encodeBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}

function decodeBase64Url(value: string): Buffer {
  // Only accept canonical Base64URL strings.
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    throw new Error("Invalid Base64URL");
  }

  const decoded = Buffer.from(value, "base64url");

  if (decoded.toString("base64url") !== value) {
    throw new Error("Non-canonical Base64URL");
  }

  return decoded;
}

export async function signWidgetSession(
  data: NewWidgetSession
): Promise<string> {
  // Validate even if callers are written in TypeScript.
  const validatedData = z
    .object({
      businessId: z.string().min(1).max(128),
      visitorId: z.string().min(1).max(128),
      conversationId: z.string().min(1).max(128),
    })
    .strict()
    .parse(data);

  const payload: WidgetSessionPayload = {
    ...validatedData,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  };

  const payloadB64 = encodeBase64Url(
    encoder.encode(JSON.stringify(payload))
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    await getKey(),
    encoder.encode(payloadB64)
  );

  return `${payloadB64}.${encodeBase64Url(
    new Uint8Array(signature)
  )}`;
}

// Verify the signature, payload structure, and expiration.
export async function verifyWidgetSession(
  token: string
): Promise<WidgetSessionPayload | null> {
  try {
    if (
      typeof token !== "string" ||
      token.length === 0 ||
      token.length > MAX_TOKEN_LENGTH
    ) {
      return null;
    }

    const parts = token.split(".");

    if (parts.length !== 2) return null;

    const [payloadB64, signatureB64] = parts;

    if (!payloadB64 || !signatureB64) return null;

    const payloadBytes = decodeBase64Url(payloadB64);
    const signatureBytes = decodeBase64Url(signatureB64);
    const signaturedBuffer=new Uint8Array(signatureBytes)

    // HMAC-SHA256 produces exactly 32 bytes.
    if (signatureBytes.length !== 32) return null;

    // Verify before trusting or parsing the payload.
    const isValid = await crypto.subtle.verify(
      "HMAC",
      await getKey(),
      signaturedBuffer,
      encoder.encode(payloadB64)
    );

    if (!isValid) return null;

    const parsed: unknown = JSON.parse(
      new TextDecoder("utf-8", { fatal: true }).decode(payloadBytes)
    );

    const result = WidgetSessionSchema.safeParse(parsed);

    if (!result.success) return null;

    const payload = result.data;
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp <= now) return null;

    return payload;
  } catch {
    // Malformed tokens and verification errors are rejected.
    return null;
  }
}