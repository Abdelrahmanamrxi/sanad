import { WeeklyTrafficProps } from "../types";

export default function DailyTraffic({
  weeklyTraffic,
}: {
  weeklyTraffic: WeeklyTrafficProps[];
}) {
  const maxTraffic = Math.max(...weeklyTraffic.map((d) => d.total), 1);
  const totalWeeklyChats = weeklyTraffic.reduce((sum, d) => sum + d.total, 0);
  const totalAiAnswered = weeklyTraffic.reduce(
    (sum, d) => sum + d.aiAnswered,
    0
  );
  const totalNeedsReview = weeklyTraffic.reduce(
    (sum, d) => sum + d.needsReview,
    0
  );

  const aiAnsweredPct =
    totalWeeklyChats > 0
      ? ((totalAiAnswered / totalWeeklyChats) * 100).toFixed(1)
      : "0";
  const needsReviewPct =
    totalWeeklyChats > 0
      ? ((totalNeedsReview / totalWeeklyChats) * 100).toFixed(1)
      : "0";

  const busiest = weeklyTraffic.reduce(
    (max, d) => (d.total > max.total ? d : max),
    { day: "—", total: 0, aiAnswered: 0, needsReview: 0 }
  );

  const yStep1 = Math.round(maxTraffic);
  const yStep2 = Math.round(maxTraffic * 0.66);
  const yStep3 = Math.round(maxTraffic * 0.33);

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Daily Traffic */}
      <div className="border border-border bg-card p-5 lg:col-span-3 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Daily Traffic
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Weekly conversation volume: AI answered vs escalated for review
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2 bg-success" />
              AI Answered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2 bg-destructive" />
              Needs Review
            </span>
          </div>
        </div>

        {/* Dynamic Full-Height Bar Chart with Y-Axis Gridlines */}
        <div className="relative my-4 flex-1 min-h-[220px] flex flex-col justify-between">
          {/* Horizontal reference gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7">
            <div className="flex items-center border-b border-border/40 border-dashed">
              <span className="w-7 font-mono text-[9px] text-muted-foreground/60">
                {yStep1}
              </span>
            </div>
            <div className="flex items-center border-b border-border/40 border-dashed">
              <span className="w-7 font-mono text-[9px] text-muted-foreground/60">
                {yStep2}
              </span>
            </div>
            <div className="flex items-center border-b border-border/40 border-dashed">
              <span className="w-7 font-mono text-[9px] text-muted-foreground/60">
                {yStep3}
              </span>
            </div>
            <div className="flex items-center border-b border-border/70">
              <span className="w-7 font-mono text-[9px] text-muted-foreground/60">
                0
              </span>
            </div>
          </div>

          {/* Bars container */}
          <div className="relative z-10 flex h-full items-end gap-2 ps-8 pe-2 pb-1">
            {weeklyTraffic.map((day) => {
              const aiAnsweredH =
                maxTraffic > 0 && day.aiAnswered > 0
                  ? (day.aiAnswered / maxTraffic) * 100
                  : 0;
              const needsReviewH =
                maxTraffic > 0 && day.needsReview > 0
                  ? (day.needsReview / maxTraffic) * 100
                  : 0;

              return (
                <div
                  key={day.day}
                  className="flex flex-1 flex-col items-center h-full justify-end"
                >
                  <div className="flex w-full items-end justify-center gap-1.5 h-full">
                    {/* AI Answered Bar (Resolved & Active combined) */}
                    <div
                      className={`w-2/5 transition-all ${
                        aiAnsweredH > 0
                          ? "bg-success hover:opacity-85"
                          : "bg-transparent pointer-events-none"
                      }`}
                      style={{ height: `${aiAnsweredH}%` }}
                      title={`AI Answered: ${day.aiAnswered}`}
                    />
                    {/* Needs Review Bar (Escalated chats) */}
                    <div
                      className={`w-2/5 transition-all ${
                        needsReviewH > 0
                          ? "bg-destructive hover:opacity-85"
                          : "bg-transparent pointer-events-none"
                      }`}
                      style={{ height: `${needsReviewH}%` }}
                      title={`Needs Review: ${day.needsReview}`}
                    />
                  </div>
                  <div className="mt-2 flex flex-col items-center leading-none">
                    <span className="font-mono text-[11px] font-medium text-foreground">
                      {day.day}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground mt-0.5">
                      {day.total}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Structured breakdown metrics */}
        <div className="grid grid-cols-2 gap-2.5 border-t border-border pt-4 sm:grid-cols-4">
          <div className="border border-border bg-background p-2.5">
            <span className="block font-mono text-[10px] uppercase text-muted-foreground">
              Weekly Volume
            </span>
            <span className="font-mono text-sm font-bold text-foreground">
              {totalWeeklyChats.toLocaleString()}
            </span>
          </div>

          <div className="border border-border bg-background p-2.5">
            <span className="block font-mono text-[10px] uppercase text-muted-foreground">
              AI Answered
            </span>
            <span className="font-mono text-sm font-bold text-success">
              {totalAiAnswered.toLocaleString()}{" "}
              <span className="text-[10px] font-normal text-muted-foreground">
                ({aiAnsweredPct}%)
              </span>
            </span>
          </div>

          <div className="border border-border bg-background p-2.5">
            <span className="block font-mono text-[10px] uppercase text-muted-foreground">
              Needs Review
            </span>
            <span className="font-mono text-sm font-bold text-destructive">
              {totalNeedsReview.toLocaleString()}{" "}
              <span className="text-[10px] font-normal text-muted-foreground">
                ({needsReviewPct}%)
              </span>
            </span>
          </div>

          <div className="border border-border bg-background p-2.5">
            <span className="block font-mono text-[10px] uppercase text-muted-foreground">
              Busiest Day
            </span>
            <span className="font-mono text-sm font-bold text-foreground">
              {busiest.day}{" "}
              <span className="text-[10px] font-normal text-muted-foreground">
                ({busiest.total})
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
