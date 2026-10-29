// features/embed/components/lead-capture-card.tsx
"use client";

import React, { useState } from "react";
import { Check, Send, User, Phone, Mail, Loader2, Headphones, AlertCircle } from "lucide-react";

export interface LeadCaptureCardProps {
  sessionToken: string;
  primaryColor: string;
  primaryText?: string;
  secondaryColor?: string;
  secondaryText?: string;
  surfaceCardBg?: string;
  bgText?: string;
  inputBg?: string;
  inputTextColor?: string;
  cornerRadius?: number;
  isDarkBg: boolean;
  isRtl: boolean;
  originPage?: string;
  onSuccess?: () => void;
}

export function LeadCaptureCard({
  sessionToken,
  primaryColor,
  primaryText = "#FFFFFF",
  surfaceCardBg = "#FFFFFF",
  bgText = "#10201F",
  inputBg = "#FFFFFF",
  inputTextColor = "#10201F",
  cornerRadius = 0,
  isDarkBg,
  isRtl,
  originPage,
  onSuccess,
}: LeadCaptureCardProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const containerBg = isDarkBg ? "rgba(255, 255, 255, 0.08)" : surfaceCardBg;
  const containerBorder = isDarkBg
    ? "rgba(255, 255, 255, 0.12)"
    : `${primaryColor}25`;
  const defaultFieldBorder = isDarkBg
    ? "rgba(255, 255, 255, 0.16)"
    : `${primaryColor}30`;
  const errorBorderColor = "var(--color-destructive, #D64545)";
  const fieldBg = isDarkBg ? "rgba(255, 255, 255, 0.06)" : inputBg;
  const fieldText = isDarkBg ? "#F3F7F6" : inputTextColor;
  const radius = Math.min(cornerRadius, 8);

  const validateFields = (): boolean => {
    const errors: { name?: string; phone?: string; email?: string } = {};

    const cleanName = name.trim();
    if (!cleanName) {
      errors.name = isRtl ? "الاسم مطلوب" : "Name is required";
    } else if (cleanName.length < 2) {
      errors.name = isRtl
        ? "يجب أن يتكون الاسم من حرفين على الأقل"
        : "Name must be at least 2 characters";
    }

    const cleanPhone = phone.trim();
    const phoneDigits = cleanPhone.replace(/\D/g, "");
    if (!cleanPhone) {
      errors.phone = isRtl ? "رقم الهاتف مطلوب" : "Phone number is required";
    } else if (phoneDigits.length < 8) {
      errors.phone = isRtl
        ? "رقم الهاتف يجب أن يحتوي على 8 أرقام على الأقل"
        : "Phone must be at least 8 digits";
    }

    const cleanEmail = email.trim();
    if (cleanEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        errors.email = isRtl
          ? "صيغة البريد الإلكتروني غير صحيحة"
          : "Invalid email address format";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateFields()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/widget/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          originPage,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const errorMsg =
          data?.message ||
          data?.error ||
          (isRtl
            ? "تعذر إرسال البيانات حالياً. يرجى المحاولة لاحقاً."
            : "Failed to send details. Please try again.");
        throw new Error(errorMsg);
      }

      setIsSubmitted(true);
      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : isRtl
          ? "تعذر الإرسال، يرجى المحاولة لاحقاً"
          : "Failed to send. Please try again.";
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // State: Successfully Submitted
  if (isSubmitted) {
    return (
      <div
        className="mt-2.5 p-3 text-xs leading-relaxed border shadow-2xs flex items-center gap-2.5"
        style={{
          backgroundColor: isDarkBg ? "rgba(46, 158, 107, 0.15)" : "rgba(46, 158, 107, 0.1)",
          borderColor: isDarkBg ? "rgba(46, 158, 107, 0.4)" : "rgba(46, 158, 107, 0.35)",
          color: isDarkBg ? "#E8EFEE" : "#10201F",
          borderRadius: `${radius}px`,
        }}
        dir="auto"
      >
        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="size-3 stroke-[3]" />
        </div>
        <p className="font-medium text-[11px] leading-snug">
          {isRtl
            ? "شكراً لك! تم استلام بياناتك بنجاح وسيتواصل معك فريقنا قريباً."
            : "Thank you! Your details were received and our team will be in touch shortly."}
        </p>
      </div>
    );
  }

  // State: Interactive Form Card
  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2.5 p-3.5 border shadow-xs text-xs space-y-2.5 w-full"
      style={{
        backgroundColor: containerBg,
        borderColor: containerBorder,
        borderRadius: `${radius}px`,
        borderLeftWidth: isRtl ? "1px" : "3px",
        borderRightWidth: isRtl ? "3px" : "1px",
        borderLeftColor: isRtl ? containerBorder : primaryColor,
        borderRightColor: isRtl ? primaryColor : containerBorder,
        color: bgText,
      }}
      dir="auto"
    >
      <div className="flex items-center gap-1.5 pb-1 border-b" style={{ borderColor: containerBorder }}>
        <Headphones className="size-3.5 shrink-0" style={{ color: primaryColor }} />
        <span className="font-semibold text-[11px] tracking-wide">
          {isRtl ? "طلب التواصل مع فريق الدعم / المبيعات" : "Connect with Support & Sales"}
        </span>
      </div>

      {serverError && (
        <div className="p-2 border border-destructive/30 bg-destructive/10 text-destructive text-[10px] font-medium leading-relaxed flex items-start gap-1.5">
          <AlertCircle className="size-3 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Name Input */}
      <div>
        <div className="relative">
          <User className="size-3 absolute top-2.5 start-2.5 opacity-60 pointer-events-none" />
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name) {
                setFieldErrors((prev) => ({ ...prev, name: undefined }));
              }
            }}
            placeholder={isRtl ? "الاسم الكامل *" : "Your full name *"}
            style={{
              backgroundColor: fieldBg,
              borderColor: fieldErrors.name ? errorBorderColor : defaultFieldBorder,
              color: fieldText,
              borderRadius: `${Math.min(radius, 4)}px`,
            }}
            className="w-full ps-8 pe-2.5 py-1.5 text-[11px] border outline-none focus:ring-1 focus:ring-primary transition-all placeholder:opacity-50"
          />
        </div>
        {fieldErrors.name && (
          <p className="text-[10px] text-destructive mt-1 font-medium">{fieldErrors.name}</p>
        )}
      </div>

      {/* Phone / WhatsApp Input */}
      <div>
        <div className="relative">
          <Phone className="size-3 absolute top-2.5 start-2.5 opacity-60 pointer-events-none" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (fieldErrors.phone) {
                setFieldErrors((prev) => ({ ...prev, phone: undefined }));
              }
            }}
            placeholder={isRtl ? "رقم الهاتف أو واتساب *" : "Phone or WhatsApp number *"}
            style={{
              backgroundColor: fieldBg,
              borderColor: fieldErrors.phone ? errorBorderColor : defaultFieldBorder,
              color: fieldText,
              borderRadius: `${Math.min(radius, 4)}px`,
            }}
            className="w-full ps-8 pe-2.5 py-1.5 text-[11px] border outline-none focus:ring-1 focus:ring-primary transition-all placeholder:opacity-50"
          />
        </div>
        {fieldErrors.phone && (
          <p className="text-[10px] text-destructive mt-1 font-medium">{fieldErrors.phone}</p>
        )}
      </div>

      {/* Email Input (Optional) */}
      <div>
        <div className="relative">
          <Mail className="size-3 absolute top-2.5 start-2.5 opacity-60 pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            placeholder={isRtl ? "البريد الإلكتروني (اختياري)" : "Email address (optional)"}
            style={{
              backgroundColor: fieldBg,
              borderColor: fieldErrors.email ? errorBorderColor : defaultFieldBorder,
              color: fieldText,
              borderRadius: `${Math.min(radius, 4)}px`,
            }}
            className="w-full ps-8 pe-2.5 py-1.5 text-[11px] border outline-none focus:ring-1 focus:ring-primary transition-all placeholder:opacity-50"
          />
        </div>
        {fieldErrors.email && (
          <p className="text-[10px] text-destructive mt-1 font-medium">{fieldErrors.email}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-3 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
        style={{
          backgroundColor: primaryColor,
          color: primaryText,
          borderRadius: `${Math.min(radius, 4)}px`,
        }}
      >
        {isSubmitting ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <>
            <Send className="size-3" />
            <span>{isRtl ? "إرسال البيانات" : "Send Details"}</span>
          </>
        )}
      </button>
    </form>
  );
}
