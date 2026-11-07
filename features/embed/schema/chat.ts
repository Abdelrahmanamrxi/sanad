import {z} from "zod"

export const chatRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, { message: "Message content cannot be empty" })
    .max(4000, {
      message: "Message exceeds maximum length of 4,000 characters",
    }),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .optional()
    .default([]),
});