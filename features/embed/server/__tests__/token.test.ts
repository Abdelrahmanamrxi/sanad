import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { signWidgetSession, verifyWidgetSession } from "../token";

const validSession = {
  businessId: "biz-123",
  conversationId: "conv-456",
  visitorId: "vis-789",
};

describe("widget session token", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("signs and verifies a valid session token", async () => {
    const token = await signWidgetSession(validSession);
    const verified = await verifyWidgetSession(token);

    expect(verified).not.toBeNull();
    expect(verified?.businessId).toBe(validSession.businessId);
    expect(verified?.conversationId).toBe(validSession.conversationId);
    expect(verified?.visitorId).toBe(validSession.visitorId);
    expect(verified?.exp).toBe(Math.floor(Date.now() / 1000) + 60 * 60 * 24);
  });

  it("rejects invalid input when signing", async () => {
    await expect(
      signWidgetSession({ ...validSession, businessId: "" }),
    ).rejects.toThrow();

    await expect(
      signWidgetSession({
        ...validSession,
        extraField: "not-allowed",
      } as never),
    ).rejects.toThrow();
  });

  it("rejects a tampered payload", async () => {
    const token = await signWidgetSession(validSession);
    const [payloadB64, sigB64] = token.split(".");
    const tamperedPayload = Buffer.from(
      JSON.stringify({
        ...validSession,
        businessId: "biz-999",
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    ).toString("base64url");

    expect(tamperedPayload).not.toBe(payloadB64);
    await expect(
      verifyWidgetSession(`${tamperedPayload}.${sigB64}`),
    ).resolves.toBeNull();
  });

  it("rejects a tampered signature", async () => {
    const token = await signWidgetSession(validSession);
    const [payloadB64, sigB64] = token.split(".");
    const flippedChar = sigB64[0] === "A" ? "B" : "A";
    const tamperedSig = `${flippedChar}${sigB64.slice(1)}`;

    await expect(
      verifyWidgetSession(`${payloadB64}.${tamperedSig}`),
    ).resolves.toBeNull();
  });

  it("rejects malformed or oversized tokens", async () => {
    await expect(verifyWidgetSession("")).resolves.toBeNull();
    await expect(verifyWidgetSession("no-dot-here")).resolves.toBeNull();
    await expect(verifyWidgetSession("a.b.c")).resolves.toBeNull();
    await expect(verifyWidgetSession("invalid!.sig!")).resolves.toBeNull();
    await expect(verifyWidgetSession("a".repeat(2049))).resolves.toBeNull();
  });

  it("rejects expired tokens and accepts tokens right before expiry", async () => {
    const token = await signWidgetSession(validSession);

    // 1 second before 24h TTL
    vi.advanceTimersByTime((60 * 60 * 24 - 1) * 1000);
    await expect(verifyWidgetSession(token)).resolves.not.toBeNull();

    // At exact expiration timestamp (exp <= now)
    vi.advanceTimersByTime(1000);
    await expect(verifyWidgetSession(token)).resolves.toBeNull();
  });
});
