"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Scissors,
  ShoppingBag,
  UtensilsCrossed,
  Stethoscope,
  SendHorizontal,
  Paperclip,
  MoreVertical,
  Phone,
  Sparkles,
  MapPin,
  User,
  CheckCheck,
  Building2,
} from "lucide-react";
import { BusinessType } from "../types";
import { cn } from "@/lib/utils";

interface LiveStudioChatPreviewProps {
  businessNameEn: string;
  businessNameAr: string;
  businessType: BusinessType;
  city: string;
  district?: string;
  primaryColor: string;
  secondaryColor: string;
  chatBgColor: string;
  borderRadius: number;
}

// Function to calculate readable text color based on background hex
function getContrastTextColor(hex: string): string {
  if (!hex || hex === "transparent") return "#10201F";
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? "#0C1615" : "#FFFFFF";
}

const SECTOR_CHAT_DATA = {
  salon: {
    icon: Scissors,
    tagEn: "CUSTOMER CARE",
    tagAr: "خدمة العملاء",
    greetingEn:
      "Welcome to {name}! How can we help you today? Feel free to ask about our hair & skincare services, treatment packages in {city}, or working hours.",
    greetingAr:
      "أهلاً بك في {name}! كيف يمكننا مساعدتك اليوم؟ يسعدنا الإجابة عن أي استفسار حول خدمات العناية بالشعر، الباقات في {city}، أو ساعات العمل.",
    userQueryEn: "Hi! What hair therapy packages do you offer and what are your opening hours in {city}?",
    userQueryAr: "مرحباً، ما هي باقات علاج الشعر المتوفرة لديكم وما هي ساعات العمل في {city}؟",
    replyEn: "We are open daily from 11:00 AM to 9:00 PM in {city}. Our hair therapy packages start from 650 EGP and include a complimentary hair & scalp consultation.",
    replyAr: "نرحب بك يومياً من ١١:٠٠ ص حتى ٩:٠٠ م في {city}. تبدأ باقات علاج الشعر من ٦٥٠ ج.م مع فحص وتقييم مجاني للشعر وفروة الرأس.",
    chips: [
      { en: "Treatment Packages & Pricing", ar: "باقات وأسعار الخدمات" },
      { en: "Working Hours & Schedule", ar: "أوقات ومواعيد العمل" },
      { en: "Branch Location in {city}", ar: "العنوان والوصول في {city}" },
    ],
  },
  brand: {
    icon: ShoppingBag,
    tagEn: "STORE SUPPORT",
    tagAr: "خدمة المتجر",
    greetingEn:
      "Hello and welcome to {name}! How can we assist you? Feel free to ask about our Egyptian cotton apparel, sizing guide, or delivery across {city}.",
    greetingAr:
      "مرحباً بك في {name}! كيف يمكننا مساعدتك؟ نسعد بالرد على استفسارات المقاسات، الخامات، وتفاصيل التوصيل في {city}.",
    userQueryEn: "Do you have the linen collection in size Large, and how fast is delivery in {city}?",
    userQueryAr: "هل تتوفر تشكيلة الكتان بمقاس L، وكم يستغرق التوصيل في {city}؟",
    replyEn: "Yes, size Large is available in our Egyptian linen line. Delivery in {city} arrives within 24 to 48 hours with order tracking.",
    replyAr: "نعم متوفر مقاس L في تشكيلة الكتان المصري الفاخر. التوصيل داخل {city} يستغرق من ٢٤ إلى ٤٨ ساعة فقط مع تتبع فوري للشحنة.",
    chips: [
      { en: "Fabric & Material Details", ar: "تفاصيل الخامات والجودة" },
      { en: "Delivery Timelines in {city}", ar: "مدة وتكلفة التوصيل" },
      { en: "Exchange & Return Policy", ar: "سياسة الاستبدال والاسترجاع" },
    ],
  },
  restaurant: {
    icon: UtensilsCrossed,
    tagEn: "GUEST RELATIONS",
    tagAr: "خدمة الضيوف",
    greetingEn:
      "Welcome to {name} in {city}! We're happy to answer questions about our dining menu, chef's specials, outdoor seating, or parking.",
    greetingAr:
      "أهلاً بك في {name} ({city})! يسعدنا الرد على أي استفسارات تخص قائمة الطعام، أطباق الشيف، الجلسات الخارجية، أو مواقف السيارات.",
    userQueryEn: "Hi! Do you offer vegetarian options and do you have outdoor terrace seating?",
    userQueryAr: "مرحباً، هل تتوفر لديكم خيارات نباتية وهل توجد جلسات خارجية؟",
    replyEn: "Yes! We feature fresh artisan vegetarian dishes alongside our signature menu, and our outdoor garden terrace in {city} is open all evening.",
    replyAr: "نعم بالتأكيد! نوفر خيارات نباتية طازجة بجانب أطباقنا المميزة، وتراس الحديقة الخارجي في {city} متاح طوال المساء.",
    chips: [
      { en: "Explore Full Digital Menu", ar: "قائمة الطعام الرقمية" },
      { en: "Outdoor & Terrace Info", ar: "معلومات الجلسات الخارجية" },
      { en: "Location & Valet Service", ar: "العنوان وخدمة الفاليه" },
    ],
  },
  clinic: {
    icon: Stethoscope,
    tagEn: "PATIENT DESK",
    tagAr: "مكتب المراجعين",
    greetingEn:
      "Welcome to {name}. How can we assist you with our medical specialties, clinic working hours, or accepted insurance providers in {city}?",
    greetingAr:
      "مرحباً بك في {name}. يسعدنا الرد على استفساراتكم بشأن التخصصات الطبية، مواعيد عمل العيادات، وشركات التأمين في {city}.",
    userQueryEn: "Do you accept health insurance and what are the clinic working hours in {city}?",
    userQueryAr: "هل تقبلون بطاقات التأمين الطبي وما هي مواعيد عمل العيادة في {city}؟",
    replyEn: "Yes, we partner with premier health insurance networks. Our clinics in {city} operate daily from 10:00 AM to 9:00 PM for all inquiries.",
    replyAr: "نعم، نتعامل مع كبرى شبكات التأمين الطبي المعتمدة. وتعمل عياداتنا في {city} يومياً من ١٠:٠٠ ص حتى ٩:٠٠ م لاستقبال الاستفسارات.",
    chips: [
      { en: "Accepted Insurance Networks", ar: "شبكات التأمين المعتمدة" },
      { en: "Specialties & Doctors", ar: "التخصصات والاستشاريين" },
      { en: "Clinic Hours & Location", ar: "مواعيد وفروع العيادة" },
    ],
  },
};

export function LiveStudioChatPreview({
  businessNameEn,
  businessNameAr,
  businessType,
  city,
  district,
  primaryColor,
  secondaryColor,
  chatBgColor,
  borderRadius,
}: LiveStudioChatPreviewProps) {
  const [activeLang, setActiveLang] = useState<"EN" | "AR">("EN");

  const chatData = SECTOR_CHAT_DATA[businessType] || SECTOR_CHAT_DATA.salon;
  const SectorIcon = chatData.icon;

  const displayNameEn = businessNameEn.trim() || "Your Business";
  const displayNameAr = businessNameAr.trim() || "منشأتك";
  const displayCity = city || "Cairo";
  const locationLabel = `${displayCity}, Egypt${district ? ` · ${district}` : ""}`;

  const primaryText = getContrastTextColor(primaryColor);
  const secondaryText = getContrastTextColor(secondaryColor);

  // Scaled radii for child elements based on main container roundness
  const bubbleRadius = `${Math.min(borderRadius, 14)}px`;
  const chipRadius = `${Math.min(borderRadius, 8)}px`;
  const inputRadius = `${Math.min(borderRadius, 10)}px`;
  const buttonRadius = `${Math.min(borderRadius, 8)}px`;
  const avatarRadius = `${Math.min(borderRadius, 10)}px`;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 sm:p-5 lg:p-7 overflow-hidden select-none">
      {/* Blueprint Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                            linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top Preview Control Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-border/80 pb-2.5 mb-4">
        <div className="flex items-center gap-2">
          <div className="size-2 bg-primary animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground">
            LIVE STUDIO // REAL-TIME BUSINESS CHAT PREVIEW
          </span>
        </div>

        {/* Language switch toggle */}
        <div className="flex items-center border border-border bg-card p-0.5 rounded-none">
          <button
            type="button"
            onClick={() => setActiveLang("EN")}
            className={cn(
              "px-2 py-0.5 text-[10px] font-mono uppercase transition-colors rounded-none cursor-pointer",
              activeLang === "EN"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setActiveLang("AR")}
            className={cn(
              "px-2 py-0.5 text-[10px] font-mono uppercase transition-colors rounded-none cursor-pointer",
              activeLang === "AR"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            عربي
          </button>
        </div>
      </div>

      {/* Center: Dynamic Chat Surface */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-auto w-full">
        <motion.div
          layout
          style={{
            backgroundColor: chatBgColor,
            borderRadius: `${borderRadius}px`,
          }}
          className="w-full max-w-lg shadow-2xl border border-border transition-all duration-200 flex flex-col h-[520px] max-h-[75vh] overflow-hidden"
        >
          {/* ==================================================== */}
          {/* CHAT HEADER */}
          {/* ==================================================== */}
          <div
            style={{
              borderTopLeftRadius: `${Math.max(0, borderRadius - 1)}px`,
              borderTopRightRadius: `${Math.max(0, borderRadius - 1)}px`,
            }}
            className="p-3.5 border-b border-border/70 flex items-center justify-between bg-card/70 backdrop-blur-sm shrink-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Sector / Brand Avatar in Primary Color */}
              <div
                className="size-10 shrink-0 flex items-center justify-center border border-transparent transition-all"
                style={{
                  backgroundColor: primaryColor,
                  color: primaryText,
                  borderRadius: avatarRadius,
                }}
              >
                <SectorIcon className="size-5" />
              </div>

              {/* Title & Online Presence */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-sm text-foreground truncate">
                    {activeLang === "EN" ? displayNameEn : displayNameAr}
                  </h3>
                  <span
                    className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 shrink-0 font-medium"
                    style={{
                      backgroundColor: secondaryColor,
                      color: secondaryText,
                      borderRadius: chipRadius,
                    }}
                  >
                    {activeLang === "EN" ? chatData.tagEn : chatData.tagAr}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 bg-success inline-block" />
                    <span className="font-mono text-[10px]">
                      {activeLang === "EN" ? "Online Now" : "متصل الآن"}
                    </span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 truncate text-[10px]">
                    <MapPin className="size-2.5 text-primary shrink-0" />
                    <span className="truncate">{locationLabel}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-1 text-muted-foreground">

              <button
                type="button"
                className="size-7 flex items-center justify-center hover:text-foreground transition-colors cursor-pointer"
                title="Options"
              >
                <MoreVertical className="size-3.5" />
              </button>
            </div>
          </div>

          {/* ==================================================== */}
          {/* CHAT MESSAGES STREAM */}
          {/* ==================================================== */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {/* Timestamp Divider */}
            <div className="flex items-center justify-center">
              <span
                style={{ borderRadius: chipRadius }}
                className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-2 py-0.5 bg-muted/40 border border-border/40"
              >
                {activeLang === "EN" ? "Today · Cairo Time" : "اليوم · توقيت القاهرة"}
              </span>
            </div>

            {/* Business Welcome Message */}
            <div className="flex items-start gap-2.5 max-w-[88%]">
              <div
                className="size-6 shrink-0 flex items-center justify-center border border-border/60 text-[10px] font-mono mt-0.5"
                style={{
                  backgroundColor: primaryColor,
                  color: primaryText,
                  borderRadius: avatarRadius,
                }}
              >
                <SectorIcon className="size-3.5" />
              </div>

              <div className="space-y-1">
                <div
                  style={{ borderRadius: bubbleRadius }}
                  className="p-3 border border-border/80 bg-card text-card-foreground leading-relaxed shadow-xs"
                >
                  <p>
                    {activeLang === "EN"
                      ? chatData.greetingEn
                          .replace("{name}", displayNameEn)
                          .replace("{city}", displayCity)
                      : chatData.greetingAr
                          .replace("{name}", displayNameAr)
                          .replace("{city}", displayCity)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground px-1">
                  <span>{activeLang === "EN" ? "CUSTOMER CARE" : "خدمة العملاء"}</span>
                  <span>·</span>
                  <span>10:30 AM</span>
                </div>
              </div>
            </div>

            {/* Customer Message Bubble */}
            <div className="flex items-start justify-end gap-2.5 max-w-[85%] ms-auto">
              <div className="space-y-1 text-end">
                <div
                  className="p-3 leading-relaxed text-start shadow-xs"
                  style={{
                    backgroundColor: primaryColor,
                    color: primaryText,
                    borderRadius: bubbleRadius,
                  }}
                >
                  <p>
                    {activeLang === "EN"
                      ? chatData.userQueryEn.replace("{city}", displayCity)
                      : chatData.userQueryAr.replace("{city}", displayCity)}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-1 text-[9px] font-mono text-muted-foreground px-1">
                  <span>10:31 AM</span>
                  <CheckCheck className="size-3 text-primary" />
                </div>
              </div>

              <div
                style={{ borderRadius: avatarRadius }}
                className="size-6 shrink-0 flex items-center justify-center border border-border bg-muted text-muted-foreground text-[10px] font-mono mt-0.5"
              >
                <User className="size-3.5" />
              </div>
            </div>

            {/* Business Reply with Inquiries / Information Chips */}
            <div className="flex items-start gap-2.5 max-w-[92%]">
              <div
                className="size-6 shrink-0 flex items-center justify-center border border-border/60 text-[10px] font-mono mt-0.5"
                style={{
                  backgroundColor: primaryColor,
                  color: primaryText,
                  borderRadius: avatarRadius,
                }}
              >
                <SectorIcon className="size-3.5" />
              </div>

              <div className="space-y-2.5 w-full">
                <div
                  style={{ borderRadius: bubbleRadius }}
                  className="p-3 border border-border/80 bg-card text-card-foreground leading-relaxed shadow-xs"
                >
                  <p>
                    {activeLang === "EN"
                      ? chatData.replyEn.replace("{city}", displayCity)
                      : chatData.replyAr.replace("{city}", displayCity)}
                  </p>
                </div>

                {/* Information / Quick Inquiries Chips (NO booking) */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground block">
                    {activeLang === "EN" ? "Common Inquiries:" : "استفسارات شائعة:"}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {chatData.chips.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        style={{
                          borderColor: idx === 0 ? primaryColor : "var(--border)",
                          backgroundColor: idx === 0 ? `${primaryColor}15` : "var(--card)",
                          color: idx === 0 ? primaryColor : "var(--foreground)",
                          borderRadius: chipRadius,
                        }}
                        className="text-start py-1.5 px-2.5 border text-xs font-medium transition-transform active:translate-y-px cursor-pointer flex items-center justify-between gap-2"
                      >
                        <span className="truncate">
                          {activeLang === "EN"
                            ? chip.en.replace("{city}", displayCity)
                            : chip.ar.replace("{city}", displayCity)}
                        </span>
                        <Sparkles className="size-3 shrink-0 opacity-70" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* CHAT INPUT BAR (Voice button removed as requested) */}
          {/* ==================================================== */}
          <div
            style={{
              borderBottomLeftRadius: `${Math.max(0, borderRadius - 1)}px`,
              borderBottomRightRadius: `${Math.max(0, borderRadius - 1)}px`,
            }}
            className="p-3 border-t border-border/70 bg-card/60 backdrop-blur-sm shrink-0"
          >
            <div
              style={{ borderRadius: inputRadius }}
              className="flex items-center gap-2 border border-border bg-background px-3 py-1.5"
            >
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
                title="Attach"
              >
                <Paperclip className="size-4" />
              </button>

              <input
                type="text"
                readOnly
                placeholder={
                  activeLang === "EN"
                    ? "Type your message or inquiry..."
                    : "اكتب رسالتك أو استفسارك هنا..."
                }
                dir={activeLang === "AR" ? "rtl" : "ltr"}
                className="flex-1 bg-transparent border-none text-xs text-foreground placeholder:text-muted-foreground outline-none py-1"
              />

              <button
                type="button"
                style={{
                  backgroundColor: primaryColor,
                  color: primaryText,
                  borderRadius: buttonRadius,
                }}
                className="size-7 flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer"
              >
                <SendHorizontal className="size-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Diagnostics Strip */}
      <div className="relative z-10 pt-3 border-t border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className="size-3.5 border border-border inline-block shrink-0"
              style={{ backgroundColor: chatBgColor }}
            />
            <span className="text-muted-foreground text-[11px]">
              CANVAS BG: <span className="text-foreground uppercase">{chatBgColor}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className="size-3.5 border border-border inline-block shrink-0"
              style={{ backgroundColor: primaryColor }}
            />
            <span className="text-muted-foreground text-[11px]">
              PRIMARY: <span className="text-foreground uppercase">{primaryColor}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className="size-3.5 border border-border inline-block shrink-0"
              style={{ backgroundColor: secondaryColor }}
            />
            <span className="text-muted-foreground text-[11px]">
              ACCENT: <span className="text-foreground uppercase">{secondaryColor}</span>
            </span>
          </div>
        </div>

        <div className="text-[10px] font-mono text-muted-foreground">
          BORDER RADIUS: <span className="text-primary font-bold">{borderRadius}PX</span>
        </div>
      </div>
    </div>
  );
}
