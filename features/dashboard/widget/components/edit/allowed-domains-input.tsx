"use client";

import React, { useState } from "react";
import { Globe, Plus, X, AlertCircle, ShieldCheck } from "lucide-react";

interface AllowedDomainsInputProps {
  domains: string[];
  onChange: (domains: string[]) => void;
  error?: string | null;
}

export function cleanDomain(raw: string): string {
  if (!raw) return "";
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/^\./, "")
    .split(":")[0];
}

export default function AllowedDomainsInput({
  domains = [],
  onChange,
  error,
}: AllowedDomainsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  const handleAddDomain = (domainToAdd?: string) => {
    const raw = domainToAdd !== undefined ? domainToAdd : inputValue;
    const cleaned = cleanDomain(raw);

    if (!cleaned) {
      setInputError("Please enter a valid domain name");
      return;
    }

    // Basic domain validation regex (alphanumeric, dots, hyphens, or localhost)
    const domainRegex = /^(localhost|([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,})$/i;
    if (!domainRegex.test(cleaned) && cleaned !== "localhost") {
      setInputError("Invalid domain format (e.g. yourstore.com or store.salla.sa)");
      return;
    }

    if (domains.includes(cleaned)) {
      setInputError("This domain is already in your allowed list");
      return;
    }

    const updated = [...domains, cleaned];
    onChange(updated);
    setInputValue("");
    setInputError(null);
  };

  const handleRemoveDomain = (domainToRemove: string) => {
    const updated = domains.filter((d) => d !== domainToRemove);
    onChange(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      handleAddDomain();
    }
  };

  const isEmpty = domains.length === 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Globe className="size-3.5 text-primary" />
          <span>Authorized Domains (Whitelist)</span>
          <span className="text-destructive font-bold text-xs">*</span>
        </label>
        <span
          className={`font-mono text-[10px] px-1.5 py-0.5 border ${
            isEmpty
              ? "border-destructive/40 bg-destructive/10 text-destructive font-bold"
              : "border-border bg-muted/60 text-muted-foreground font-semibold"
          } rounded-none`}
        >
          {domains.length} {domains.length === 1 ? "Domain" : "Domains"}
        </span>
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (inputError) setInputError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g. yourstore.com or store.salla.sa"
            className={`w-full border ${
              isEmpty || error || inputError
                ? "border-destructive/60 focus:border-destructive"
                : "border-border focus:border-primary"
            } bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 ${
              isEmpty || error || inputError
                ? "focus:ring-destructive/30"
                : "focus:ring-primary/30"
            } transition-all rounded-none shadow-2xs`}
          />
        </div>
        <button
          type="button"
          onClick={() => handleAddDomain()}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-xs font-semibold cursor-pointer rounded-none shadow-2xs transition-colors shrink-0"
        >
          <Plus className="size-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Input or general error message */}
      {(inputError || error || isEmpty) && (
        <div className="flex items-start gap-1.5 text-[11px] text-destructive bg-destructive/10 border border-destructive/20 p-2 rounded-none">
          <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
          <span className="leading-tight">
            {inputError ||
              error ||
              "At least one allowed domain is required. Specify the domain where your widget will be embedded."}
          </span>
        </div>
      )}

      {/* Domain Chip / Tag List */}
      {domains.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {domains.map((domain) => (
            <span
              key={domain}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted/70 border border-border text-foreground font-mono text-[11px] shadow-2xs rounded-none"
            >
              <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{domain}</span>
              <button
                type="button"
                onClick={() => handleRemoveDomain(domain)}
                className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer rounded-none ms-1"
                title={`Remove ${domain}`}
                aria-label={`Remove ${domain}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Quick Add Suggestions when list is empty or for local dev */}
      {isEmpty && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
          <span>Quick add:</span>
          <button
            type="button"
            onClick={() => handleAddDomain("http://localhost.com")}
            className="px-2 py-0.5 bg-muted border border-border hover:border-primary text-foreground font-mono text-[10px] cursor-pointer rounded-none transition-colors"
          >
            + localhost
          </button>
        </div>
      )}

      {/* Informational Guidance */}
      <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
        Only storefronts matching these domains will be authorized to initialize the assistant. Subdomains are automatically included (e.g. adding <code className="font-mono text-[10px] bg-muted px-1 py-0.5">salla.sa</code> also allows <code className="font-mono text-[10px] bg-muted px-1 py-0.5">mystore.salla.sa</code>).
      </p>
    </div>
  );
}
