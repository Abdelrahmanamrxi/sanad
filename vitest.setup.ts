import { vi } from "vitest";

vi.mock("server-only", () => ({}));

process.env.WIDGET_SESSION_SECRET ??= "test-widget-session-secret-min-32-chars";
