import React from "react";
import { cn } from "@/lib/utils";

interface UsageMeterProps {
  label: string;
  used: number;
  limit: number;
  unit: string;
  footerText?: string;
  highlightWarning?: boolean;
}

export function UsageMeter({
  label,
  used,
  limit,
  unit,
  footerText,
}: UsageMeterProps) {
  const percentage = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  // 10 discrete segments
  const activeSegments = Math.min(Math.round((percentage / 100) * 10), 10);

  return (
    <div className="bg-card border border-border p-4 flex flex-col justify-between space-y-3 rounded-none shadow-xs">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "font-mono text-[11px] font-bold px-1.5 py-0.5 border rounded-none",
            isAtLimit
              ? "bg-destructive/10 text-destructive border-destructive/40"
              : isNearLimit
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/40"
                : "bg-primary/10 text-primary border-primary/30"
          )}
        >
          {percentage}%
        </span>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl font-mono font-bold text-foreground">
            {used.toLocaleString()}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            / {limit.toLocaleString()} {unit}
          </span>
        </div>

        {/* 10-Segment LED Meter */}
        <div className="grid grid-cols-10 gap-1 h-2 my-1.5" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, index) => {
            const isActive = index < activeSegments;
            return (
              <div
                key={index}
                className={cn(
                  "h-full transition-all duration-200",
                  isActive
                    ? isNearLimit
                      ? "bg-amber-500"
                      : "bg-primary"
                    : "bg-muted/70 border border-border/30"
                )}
              />
            );
          })}
        </div>
      </div>

      {footerText && (
        <div className="text-[11px] font-mono text-muted-foreground border-t border-border/60 pt-2 flex items-center justify-between">
          <span>{footerText}</span>
        </div>
      )}
    </div>
  );
}

