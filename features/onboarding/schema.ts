import { z } from "zod";
import { EGYPT_CITIES } from "./constants";

const CITY_SET = new Set(
  EGYPT_CITIES.map((c) => {
    return c.cityEn;
  }),
);
const ARABIC_REGEX = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\d\-&.'()]+$/;


const hexColor = z
  .string()
  .regex(
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
    "Must be a valid hex color (e.g. #FF5733)",
  );

export const onboardingSchema = z.object({
  businessNameEn: z
    .string()
    .trim()
    .min(3, "Business name must be at least 3 characters")
    .max(40, "Business name is too long (max 40 characters)"),

  businessNameAr: z
    .string()
    .trim()
    .regex(ARABIC_REGEX, "Business name must be in arabic")
    .min(3, "Business name in arabic must be at least 3 characters.")
    .max(40, "Business name in arabic is too long"),

  businessType: z.enum(["salon", "restaurant", "clinic", "brand"], {
    message: "Please select a business type",
  }),

  city: z
    .string()
    .min(1, "Please select a city")
    .refine((c) => CITY_SET.has(c), "Please select a valid city"),

  district: z
    .string()
    .trim()
    .max(60, "District name is too long")
    .refine((val) => !val || val.length >= 2, {
      message: "District must be at least 2 characters",
    })
    .optional()
    .or(z.literal("")),

  primaryColor: hexColor,
  secondaryColor: hexColor,
  chatBgColor: hexColor,

  borderRadius: z
    .number({ message: "Border radius must be a number" })
    .int("Border radius must be a whole number")
    .min(0, "Border radius can't be negative")
    .max(32, "Border radius can't exceed 32px"),
});

export type OnboardingType=z.infer<typeof onboardingSchema>