import { z } from "zod";
import { ARABIC_REGEX } from "@/features/onboarding/schema";
import { EGYPT_CITIES } from "@/lib/constant";

export const CITY_SET = new Set(
  EGYPT_CITIES.map((c) => {
    return c.cityEn;
  }),
);

export const businessSchema = z.object({
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
});

export type BusinessInput = z.infer<typeof businessSchema>;
