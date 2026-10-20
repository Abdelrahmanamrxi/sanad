'use server'
import createClient from "@/lib/supabase/server";
import  {type  OnboardingType } from "./schema";
import { type OnboardingMutation } from "./types";

export async function createBusiness(formValues:OnboardingType):Promise<OnboardingMutation>{
    const supabase=await createClient()

    const {data:{user}}=await supabase.auth.getUser()
    

    if (!user) {
        return { success: false, error: "Authentication required. Please sign in to save your business workspace." };
    }

    // 1. Insert core business identity
    const { data: business, error: businessError } = await supabase.from("business").insert({
        owner_id: user.id,
        name: formValues.businessNameEn,
        name_arabic: formValues.businessNameAr,
        city: formValues.city,
        district: formValues.district,
        type: formValues.businessType,
    }).select("id").single();

    if (businessError || !business) {
        return { success: false, error: businessError?.message || "Failed to create business workspace." };
    }

    // 2. Insert initial widget settings for this business
    const { error: widgetError } = await supabase.from("widget_settings").insert({
        business_id: business.id,
        primary_color: formValues.primaryColor,
        secondary_color: formValues.secondaryColor,
        background_color: formValues.chatBgColor,
        border_radius: formValues.borderRadius,
        corner_radius: 0,
        bot_name: formValues.businessNameEn ? `${formValues.businessNameEn} Support` : "Sanad AI Support",
    });

    if (widgetError) {
        return { success: false, error: widgetError.message };
    }

    return { success: true };
}