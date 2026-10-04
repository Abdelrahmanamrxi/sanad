"use server";
import type { User } from "./schemas/auth";
import { userSchema } from "./schemas/auth";
import createClient from "@/lib/supabase/server";
import { type AuthResult,type VerifyOTPResult } from "./types";
;

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

export async function verifyOtp(email:string,token:string):Promise<VerifyOTPResult>{
  const supabase=await createClient()

  const cleanEmail = email.trim().toLowerCase();
  const cleanToken = token.trim().replace(/[-\s]/g, "");

  if(!cleanEmail || !cleanToken){
    return {success:false,error:"Email and Verification Code are required."}
  }

  const{error}=await supabase.auth.verifyOtp({
    email:cleanEmail,
    token:cleanToken,
    type:'signup'
  })

   if (error) {

    if (error.code === "otp_expired") {
      return { 
        success: false, 
        error: "Invalid or expired verification code. Please check your code or request a new one." 
      };
    }

    if (error.code === "over_email_send_rate_limit") {
      return { 
        success: false, 
        error: "Too many attempts. Please wait a moment before trying again." 
      };
    }

    return { success: false, error: error.message || "Failed to verify code." };
  }

  return {success:true}

}

export const resendOTP = async (email: string): Promise<VerifyOTPResult> => {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: "Email is required to resend code." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: cleanEmail,
  });

  if (error) {
    if (error.code === "over_email_send_rate_limit") {
      return {
        success: false,
        error: "Too many attempts. Please wait a minute before requesting another code.",
      };
    }
    return { success: false, error: error.message || "Failed to resend code." };
  }
  return { success: true };
};