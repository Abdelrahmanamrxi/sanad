

export type BusinessType = "salon" | "brand" | "restaurant" | "clinic";

export interface BusinessSectorMeta {
  id: BusinessType;
  titleEn: string;
  titleAr: string;
  badgeEn: string;
  badgeAr: string;
  descriptionEn: string;
  descriptionAr: string;
  iconName: "scissors" | "shopping-bag" | "utensils" | "stethoscope";
  sampleItem: {
    titleEn: string;
    titleAr: string;
    subEn: string;
    subAr: string;
    tagEn: string;
    tagAr: string;
    actionEn: string;
    actionAr: string;
    price: string;
  };
}

export interface ColorPreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  description: string;
}

export interface OnboardingMutation{
  success:boolean,
  error?:string
}