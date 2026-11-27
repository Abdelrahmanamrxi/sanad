import { beforeEach, describe, expect, it, vi } from "vitest";

const { rpcMock } = vi.hoisted(() => ({
  rpcMock: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({
  supabaseAdminClient: {
    rpc: rpcMock,
  },
}));

import { checkWidgetRateLimit } from "../rate-limiter";

describe("checkWidgetRateLimit", () => {
  beforeEach(() => {
    rpcMock.mockReset();
  });

  it("allows requests when RPC returns true and uses expected key/limit", async () => {
    rpcMock.mockResolvedValue({ data: true, error: null });

    const allowed = await checkWidgetRateLimit("biz-1", "203.0.113.10");

    expect(allowed).toBe(true);
    expect(rpcMock).toHaveBeenCalledWith("check_widget_rate_limit", {
      p_key: "rate:biz-1:203.0.113.10",
      p_max_requests: 10,
    });
  });

  it("blocks requests when RPC returns false", async () => {
    rpcMock.mockResolvedValue({ data: false, error: null });

    const allowed = await checkWidgetRateLimit("biz-1", "203.0.113.10");

    expect(allowed).toBe(false);
  });

  it("normalizes null and ::1 IPs to 127.0.0.1", async () => {
    rpcMock.mockResolvedValue({ data: true, error: null });

    await checkWidgetRateLimit("biz-1", null);
    expect(rpcMock).toHaveBeenLastCalledWith("check_widget_rate_limit", {
      p_key: "rate:biz-1:127.0.0.1",
      p_max_requests: 10,
    });

    await checkWidgetRateLimit("biz-1", "::1");
    expect(rpcMock).toHaveBeenLastCalledWith("check_widget_rate_limit", {
      p_key: "rate:biz-1:127.0.0.1",
      p_max_requests: 10,
    });
  });

  it("fails open when the RPC returns an error", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    rpcMock.mockResolvedValue({
      data: null,
      error: { message: "connection timeout" },
    });

    const allowed = await checkWidgetRateLimit("biz-1", "203.0.113.10");

    expect(allowed).toBe(true);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
