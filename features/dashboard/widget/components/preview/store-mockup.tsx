"use client";

import React from "react";
import { Search, ShoppingBag, Sparkles, Tag } from "lucide-react";
import type { StoreTheme } from "../../types";

interface StoreMockupProps {
  storeTheme: StoreTheme;
}

export default function StoreMockup({ storeTheme }: StoreMockupProps) {
  const isDark = storeTheme === "dark";

  return (
    <div className="flex h-full flex-col select-none opacity-90 pointer-events-none">
      {/* ── Top Announcement Banner ── */}
      <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-1.5 text-center text-[11px] font-sans font-medium text-amber-900 dark:text-amber-200 flex items-center justify-center gap-1.5">
        <Sparkles className="size-3 text-amber-600 dark:text-amber-400" />
        <span>Seasonal Promotion: Free express shipping on all orders over 200 SAR • 14-Day Free Returns</span>
      </div>

      {/* ── Store Navigation Bar ── */}
      <header
        className={`border-b px-5 py-3.5 flex items-center justify-between shrink-0 transition-colors ${
          isDark
            ? "border-stone-800 bg-stone-900/90 text-stone-100"
            : "border-stone-200 bg-white/95 text-stone-900"
        }`}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="size-2 bg-emerald-500 inline-block" />
            <span className="font-heading font-black text-sm tracking-wider uppercase">
              NOOR BOUTIQUE
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-4 text-xs font-sans text-stone-500 dark:text-stone-400">
            <span className="font-medium text-foreground">Home</span>
            <span>Products</span>
            <span>Best Sellers</span>
            <span>Store Policies</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`hidden sm:flex items-center gap-2 px-2.5 py-1 text-xs border ${
              isDark
                ? "border-stone-800 bg-stone-950 text-stone-400"
                : "border-stone-200 bg-stone-50 text-stone-500"
            }`}
          >
            <Search className="size-3" />
            <span className="text-[11px] font-sans">Search store...</span>
          </div>

          <div
            className={`flex items-center gap-1.5 border px-2.5 py-1 text-xs font-mono font-medium ${
              isDark
                ? "border-stone-800 bg-stone-850 text-stone-200"
                : "border-stone-200 bg-stone-100 text-stone-800"
            }`}
          >
            <ShoppingBag className="size-3.5 text-emerald-500" />
            <span>2 Items</span>
          </div>
        </div>
      </header>

      {/* ── Store Body & Product Showcase ── */}
      <div className="flex-1 overflow-hidden p-5 sm:p-7 space-y-6">
        {/* Hero Card */}
        <div
          className={`p-6 border flex flex-col justify-between shadow-2xs ${
            isDark
              ? "border-stone-800 bg-gradient-to-r from-stone-900 via-stone-900/90 to-stone-950"
              : "border-stone-200 bg-gradient-to-r from-stone-50 via-white to-stone-100"
          }`}
        >
          <div className="max-w-md space-y-2 text-start">
            <div className="inline-flex items-center gap-1 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <span>Spring Edition 2026 Collection</span>
            </div>
            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">
              Handcrafted Luxury Leather & Lifestyle
            </h2>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              Designed with sustainable craftsmanship, premium materials, and 2-year comprehensive store warranty.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
          {[
            {
              title: "Executive Chronograph Watch",
              price: "480 SAR",
              tag: "Best Seller",
              tagColor: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              grad: isDark ? "from-emerald-950/30 to-stone-900" : "from-emerald-50/60 to-stone-100",
            },
            {
              title: "Classic Leather Travel Bag",
              price: "320 SAR",
              tag: "New Arrival",
              tagColor: "border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
              grad: isDark ? "from-indigo-950/30 to-stone-900" : "from-indigo-50/60 to-stone-100",
            },
            {
              title: "RFID Shield Smart Wallet",
              price: "145 SAR",
              tag: "20% OFF",
              tagColor: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
              grad: isDark ? "from-amber-950/30 to-stone-900" : "from-amber-50/60 to-stone-100",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`border p-3.5 flex flex-col gap-2.5 shadow-2xs ${
                isDark ? "border-stone-800 bg-stone-900" : "border-stone-200 bg-white"
              }`}
            >
              <div
                className={`h-28 w-full border border-border/50 bg-gradient-to-br ${item.grad} flex flex-col items-center justify-center p-2 text-center`}
              >
                <Tag className="size-5 opacity-40 mb-1" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  NOOR // PRODUCT 0{idx + 1}
                </span>
              </div>

              <div className="space-y-1.5 text-start">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold truncate font-sans text-foreground">
                    {item.title}
                  </span>
                  <span className={`text-[9px] font-mono border px-1.5 py-0.2 shrink-0 ${item.tagColor}`}>
                    {item.tag}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {item.price}
                  </span>
                  <span className="text-[10px] text-muted-foreground line-through font-mono">
                    {parseInt(item.price) + 60} SAR
                  </span>
                </div>
              </div>

              <div
                className={`h-7 w-full text-xs flex items-center justify-center font-sans font-medium border transition-colors ${
                  isDark
                    ? "border-stone-700 bg-stone-800 text-stone-200"
                    : "border-stone-300 bg-stone-100 text-stone-800"
                }`}
              >
                Add to Cart
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
