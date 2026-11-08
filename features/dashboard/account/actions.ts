"use server";

import { getAuthContext } from "@/lib/auth";
import {
  AccountProfileState,
  AccountBusinessState,
  AccountSecurityState,
} from "./types";
import { revalidatePath } from "next/cache";
import { businessSchema } from "./schemas/business";
import { passwordSchema } from "./schemas/password";
import { z } from "zod";

export async function updateAccountLanguage(
  prevState: AccountProfileState,
  formData: FormData,
): Promise<AccountProfileState> {
  const { supabase, businessId } = await getAuthContext();

  const appLanguage = formData.get("appLanguage") as string;

  if (!appLanguage || (appLanguage !== "en" && appLanguage !== "ar")) {
    return {
      success: false,
      error: "Invalid language selection.",
    };
  }

  // 🛡️ Skip DB write if it's already the current language
  const { data: current } = await supabase
    .from("business")
    .select("app_language")
    .eq("id", businessId)
    .single();

  if (current?.app_language === appLanguage) {
    return {
      success: true,
      savedLanguage: appLanguage as "en" | "ar",
    };
  }

  const { error } = await supabase
    .from("business")
    .update({
      app_language: appLanguage,
    })
    .eq("id", businessId);

  if (error) {
    console.error("Failed to update app language:", error);
    return {
      success: false,
      error: "Failed to update user's app language.",
    };
  }

  revalidatePath("/dashboard/account");
  return {
    success: true,
    savedLanguage: appLanguage as "en" | "ar",
  };
}

export async function updateBusinessWorkspace(
  prevState: AccountBusinessState,
  formData: FormData,
): Promise<AccountBusinessState> {
  const { supabase, businessId } = await getAuthContext();

  const rawData = {
    businessNameEn: formData.get("businessNameEn"),
    businessNameAr: formData.get("businessNameAr"),
    city: formData.get("city"),
    district: formData.get("district") || "",
  };

  const result = businessSchema.safeParse(rawData);

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return {
      success: false,
      error: "Please check the highlighted errors below.",
      fieldErrors,
    };
  }

  // 🛡️ Skip DB write if already identical
  const { data: current } = await supabase
    .from("business")
    .select("name, name_arabic, city, district")
    .eq("id", businessId)
    .single();

  if (
    current &&
    current.name === result.data.businessNameEn &&
    current.name_arabic === result.data.businessNameAr &&
    current.city === result.data.city &&
    (current.district || "") === (result.data.district || "")
  ) {
    return {
      success: true,
      savedData: {
        businessNameEn: result.data.businessNameEn,
        businessNameAr: result.data.businessNameAr,
        city: result.data.city,
        district: result.data.district || "",
      },
    };
  }

  const { error } = await supabase
    .from("business")
    .update({
      name: result.data.businessNameEn,
      name_arabic: result.data.businessNameAr,
      city: result.data.city,
      district: result.data.district || null,
    })
    .eq("id", businessId);

  if (error) {
    console.error("Failed to update business workspace:", error);
    return {
      success: false,
      error: "Failed to update new business workspace settings.",
    };
  }

  revalidatePath("/dashboard/account");
  return {
    success: true,
    savedData: {
      businessNameEn: result.data.businessNameEn,
      businessNameAr: result.data.businessNameAr,
      city: result.data.city,
      district: result.data.district || "",
    },
  };
}

export async function updateAccountPassword(
  prevState: AccountSecurityState,
  formData: FormData,
) : Promise<AccountSecurityState> {
  const raw = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = passwordSchema.safeParse(raw);

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return {
      success: false,
      error: "Please check the password requirements below.",
      fieldErrors,
    };
  }
  const {supabase}=await getAuthContext()

  const{error}=await supabase.auth.updateUser({
    password:result.data.newPassword,
    current_password:result.data.currentPassword
  })
  
  if(error){
    return {
        success:false,
        error:"Incorrent current password"
    }
  }
  return {success:true}
}
