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

    const {error}=await supabase.from("business").insert({
        owner_id:user?.id,
        name:formValues.businessNameEn,
        name_arabic:formValues.businessNameAr,
        primary_color:formValues.primaryColor,
        secondary_color:formValues.secondaryColor,
        city:formValues.city,
        district:formValues.district,
        border_radius:formValues.borderRadius,
        background_color:formValues.chatBgColor,
        type:formValues.businessType
    }).select().single()

    if(error){
        return {success:false,error:error.message}
    }

    return {success:true}
}