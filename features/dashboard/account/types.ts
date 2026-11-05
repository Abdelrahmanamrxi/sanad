import type { PlanTier } from "@/features/billing/plans";

export interface AccountData {
  user: {
    id: string;
    email: string;
    fullName: string;
    createdAt?: string;
  };
  business: {
    id: string;
    name: string;
    nameArabic: string;
    appLanguage: "en" | "ar";
    city?: string;
    district?: string;
    createdAt?: string;
  };
  widget: {
    defaultLanguage: "auto" | "ar" | "en";
    botName?: string;
  };
  planTier: PlanTier;
}

export type AccountProfileState = {
  success?: boolean;
  error?: string;
  savedLanguage?: "en" | "ar";
};

export type AccountBusinessState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  savedData?: {
    businessNameEn: string;
    businessNameAr: string;
    city: string;
    district: string;
  };
};

export type AccountSecurityState={
  success?:boolean,
  error?:string,
  fieldErrors?:Record<string,string[] | undefined>
}

