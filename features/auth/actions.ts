"use server";
import type { User } from "./schemas/auth";
import { userSchema } from "./schemas/auth";
import createClient from "@/lib/supabase/server";
import { type AuthResult } from "./types";

export async function signUp(user: User): Promise<AuthResult> {
  const parseInfo = userSchema.safeParse(user);
  if (!parseInfo.success) {
    return {
      success: false,
      error: "Please correct the input errors in the form",
      fieldErrors: parseInfo.error.flatten().fieldErrors,
    };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parseInfo.data.email,
    password: parseInfo.data.password,
  });

  if (error) {
    if (error.code === "weak_password") {
      return { success: false, fieldErrors: { password: [error.message] } };
    }
    if (error.code === "over_email_send_rate_limit") {
      return { success: false, error: "Too many attempts. Try again later." };
    }
    return { success: false, error: "Something went wrong. Try again." };
  }

  return { success: true };
}