"use client";

import {
  Building2,
  MapPin,
  Copy,
  Check,
  AlertCircle,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type AccountData, type AccountBusinessState } from "../types";
import { useState, useActionState } from "react";
import { EGYPT_CITIES } from "@/lib/constant";
import { updateBusinessWorkspace } from "../actions";

interface AccountBusinessWorkspaceProps {
  initialData: AccountData;
}

const initialState: AccountBusinessState = {};

export default function AccountBusinessWorkspace({
  initialData,
}: AccountBusinessWorkspaceProps) {
  const [copiedId, setCopiedId] = useState(false);

  // Form input states
  const [businessNameEn, setBusinessNameEn] = useState(
    initialData.business.name || "",
  );
  const [businessNameAr, setBusinessNameAr] = useState(
    initialData.business.nameArabic || "",
  );
  const [city, setCity] = useState(initialData.business.city || "Cairo");
  const [district, setDistrict] = useState(initialData.business.district || "");

  const [state, formAction, isPending] = useActionState(
    updateBusinessWorkspace,
    initialState,
  );

  // Derived baseline from server response or initialData (pure during render - no useEffect)
  const currentSaved = state.savedData ?? {
    businessNameEn: initialData.business.name || "",
    businessNameAr: initialData.business.nameArabic || "",
    city: initialData.business.city || "Cairo",
    district: initialData.business.district || "",
  };

  // Purely derived isDirty boolean
  const isDirty =
    businessNameEn.trim() !== currentSaved.businessNameEn.trim() ||
    businessNameAr.trim() !== currentSaved.businessNameAr.trim() ||
    city !== currentSaved.city ||
    district.trim() !== currentSaved.district.trim();

  const handleCopyId = () => {
    navigator.clipboard.writeText(initialData.business.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <section className="bg-card border border-border p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="flex items-center gap-2 border-b border-border/80 pb-3">
        <Building2 className="size-4 text-primary" />
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          Business Workspace
        </h2>
      </div>

      {/* Top Level Error Banner */}
      {state.error && (
        <div className="p-3 border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Top Level Success Banner (hidden automatically once user re-dirties form) */}
      {state.success && !isDirty && (
        <div className="p-3 border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <Check className="size-4 shrink-0" />
          <span>Business workspace updated successfully.</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Business English Name */}
          <div className="space-y-1.5">
            <label className="font-sans text-xs font-semibold text-foreground">
              Business Legal Name (English)
            </label>
            <input
              type="text"
              name="businessNameEn"
              value={businessNameEn}
              onChange={(e) => setBusinessNameEn(e.target.value)}
              placeholder="e.g. Al Nour Dental Center"
              className={`w-full border bg-background px-3 py-2 text-sm text-foreground focus:outline-none transition-colors ${
                state.fieldErrors?.businessNameEn
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-primary"
              }`}
            />
            {state.fieldErrors?.businessNameEn && (
              <span className="text-[11px] text-destructive block">
                {state.fieldErrors.businessNameEn[0]}
              </span>
            )}
          </div>

          {/* Business Arabic Name */}
          <div className="space-y-1.5">
            <label className="font-sans text-xs font-semibold text-foreground">
              Business Name (Arabic)
            </label>
            <input
              type="text"
              dir="rtl"
              name="businessNameAr"
              value={businessNameAr}
              onChange={(e) => setBusinessNameAr(e.target.value)}
              placeholder="مثال: مركز النور لطب الأسنان"
              className={`w-full border bg-background px-3 py-2 text-sm text-foreground focus:outline-none transition-colors ${
                state.fieldErrors?.businessNameAr
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-primary"
              }`}
            />
            {state.fieldErrors?.businessNameAr && (
              <span className="text-[11px] text-destructive block">
                {state.fieldErrors.businessNameAr[0]}
              </span>
            )}
          </div>
        </div>

        {/* Location (City & District) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary" />
              <label className="font-sans text-xs font-semibold text-foreground">
                Operating City
              </label>
            </div>
            <select
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`w-full border bg-background px-3 py-2 text-sm text-foreground focus:outline-none transition-colors rounded-none cursor-pointer ${
                state.fieldErrors?.city
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-primary"
              }`}
            >
              {EGYPT_CITIES.map((c) => (
                <option key={c.cityEn} value={c.cityEn}>
                  {c.cityEn} — {c.cityAr} ({c.regionEn})
                </option>
              ))}
            </select>
            {state.fieldErrors?.city && (
              <span className="text-[11px] text-destructive block">
                {state.fieldErrors.city[0]}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="font-sans text-xs font-semibold text-foreground">
              District / Area
            </label>
            <input
              type="text"
              name="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. New Cairo, Maadi, Dokki"
              className={`w-full border bg-background px-3 py-2 text-sm text-foreground focus:outline-none transition-colors ${
                state.fieldErrors?.district
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-primary"
              }`}
            />
            {state.fieldErrors?.district && (
              <span className="text-[11px] text-destructive block">
                {state.fieldErrors.district[0]}
              </span>
            )}
          </div>
        </div>

        {/* Workspace ID & Public Tenant Identifier */}
        <div className="border-t border-border/60 pt-4 space-y-2">
          <label className="font-sans text-xs font-semibold text-foreground">
            Workspace Tenant ID
          </label>
          <p className="font-sans text-xs text-muted-foreground">
            Unique database identifier for this business workspace. Referenced by
            client-side widgets and webhook dispatches.
          </p>

          <div className="flex items-center gap-2">
            <div className="flex-1 border border-border bg-muted/30 px-3 py-2 font-mono text-xs text-foreground select-all truncate">
              {initialData.business.id}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyId}
              className="shrink-0 font-sans text-xs font-semibold"
            >
              {copiedId ? (
                <>
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 text-muted-foreground" />
                  <span>Copy ID</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Action Button with anti-spam & loading states */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={!isDirty || isPending}
            size="default"
            className="font-sans text-xs font-semibold px-6 shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader className="size-3.5 animate-spin" />
                Saving Workspace...
              </span>
            ) : (
              "Save Business Settings"
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}
