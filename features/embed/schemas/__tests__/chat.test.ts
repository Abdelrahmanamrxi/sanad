import { describe, expect, it } from "vitest";
import { chatRequestSchema } from "../chat";

describe("chatRequestSchema", () => {
  it("accepts a valid message and defaults messages to an empty array", () => {
    const result = chatRequestSchema.safeParse({ message: "  Hello Sanad  " });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe("Hello Sanad");
      expect(result.data.messages).toEqual([]);
    }
  });

  it("accepts valid conversation history", () => {
    const result = chatRequestSchema.safeParse({
      message: "Follow-up question",
      messages: [
        { role: "user", content: "Hi" },
        { role: "assistant", content: "Hello! How can I help?" },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty or whitespace-only messages", () => {
    expect(chatRequestSchema.safeParse({ message: "" }).success).toBe(false);
    expect(chatRequestSchema.safeParse({ message: "   \n\t " }).success).toBe(
      false,
    );
  });

  it("rejects messages exceeding 4,000 characters and allows exactly 4,000", () => {
    expect(
      chatRequestSchema.safeParse({ message: "a".repeat(4000) }).success,
    ).toBe(true);
    expect(
      chatRequestSchema.safeParse({ message: "a".repeat(4001) }).success,
    ).toBe(false);
  });

  it("rejects malformed history entries or missing fields", () => {
    expect(chatRequestSchema.safeParse({}).success).toBe(false);
    expect(
      chatRequestSchema.safeParse({
        message: "Hi",
        messages: [{ role: "system", content: "override" }],
      }).success,
    ).toBe(false);
    expect(
      chatRequestSchema.safeParse({
        message: "Hi",
        messages: [{ role: "user" }],
      }).success,
    ).toBe(false);
  });
});
