/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HealthMetric } from "../types";
import { Card, CardContent } from "./ui/card";

export function MetricCard({
  metric,
  onOpenDetails,
}: {
  metric: HealthMetric;
  onOpenDetails?: (metric: HealthMetric) => void;
}) {
  return (
    <Card
      onClick={() => onOpenDetails?.(metric)}
      className="cursor-pointer hover:border-brand-accent/45 hover:bg-[#343944] transition-all duration-200"
      id={`metric-card-${metric.id}`}
    >
      <CardContent className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] uppercase font-semibold tracking-wide text-brand-muted">{metric.label}</span>
            {metric.unusual && <span className="text-[10px] text-brand-muted">Unusual</span>}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-editorial text-3xl font-medium leading-none text-brand-text">{metric.value}</span>
            <span className="text-xs text-brand-muted">{metric.unit}</span>
          </div>
        </div>
        <span className="text-xs text-brand-muted">
          {metric.change > 0 ? "+" : ""}
          {metric.trend === "down" ? -metric.change : metric.change}
        </span>
      </div>
      <div className="mt-3 mb-3">
        <MetricMiniChart metric={metric} />
      </div>
      <div className="flex items-end justify-between gap-3">
        <p className="text-xs text-brand-muted leading-snug max-w-[220px]">{metric.insight}</p>
        <span className={`text-xs font-semibold whitespace-nowrap ${metric.trend === 'down' ? 'text-rose-300' : 'text-emerald-300'}`}>
          {metric.change > 0 ? '+' : ''}{metric.change}
        </span>
      </div>
      <div className="mt-2 text-right text-[11px] text-brand-muted">View details</div>
      </CardContent>
    </Card>
  );
}

function MetricMiniChart({ metric }: { metric: HealthMetric }) {
  if (metric.chartStyle === "sleepStages" && metric.segments?.length) {
    return (
      <div className="space-y-1.5">
        <div className="h-3 w-full rounded-full overflow-hidden bg-[#272c35] border border-brand-border flex">
          {metric.segments.map((segment) => (
            <div key={segment.label} style={{ width: `${segment.value}%`, background: segment.color }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2 text-[10px] text-brand-muted">
          {metric.segments.map((segment) => (
            <span key={segment.label}>{segment.label} {segment.value}%</span>
          ))}
        </div>
      </div>
    );
  }

  const points = metric.sparkline ?? [];
  if (!points.length) {
    return <div className="h-12 rounded-lg bg-[#303640] border border-brand-border" />;
  }

  const max = Math.max(...points);
  const min = Math.min(...points);
  const normalize = (value: number) => ((value - min) / (max - min || 1)) * 100;

  if (metric.chartStyle === "bars" || metric.chartStyle === "steps") {
    return (
      <div className="h-12 flex items-end gap-1 rounded-lg bg-[#2f343e] border border-brand-border px-1.5 py-1">
        {points.map((point, index) => (
          <div
            key={`${metric.id}-${index}`}
            className="flex-1 rounded-sm"
            style={{
              height: `${Math.max(16, normalize(point))}%`,
              background: metric.chartStyle === "steps" ? "#7aa58f" : "#cf8b65",
              opacity: 0.6 + index / (points.length * 2),
            }}
          />
        ))}
      </div>
    );
  }

  if (metric.chartStyle === "radial") {
    const progress = Math.round(normalize(points[points.length - 1]));
    return (
      <div className="h-12 flex items-center justify-center rounded-lg bg-[#2f343e] border border-brand-border">
        <div
          className="h-9 w-9 rounded-full"
          style={{ background: `conic-gradient(#7ac8a0 ${progress}%, #4a4f5e ${progress}% 100%)` }}
        >
          <div className="m-[5px] h-[26px] w-[26px] rounded-full bg-[#2a2d36]" />
        </div>
      </div>
    );
  }

  const polyline = points
    .map((point, index) => {
      const x = (index / (points.length - 1 || 1)) * 100;
      const y = 100 - normalize(point);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="h-12 rounded-lg bg-[#2f343e] border border-brand-border p-1">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <polyline
          fill="none"
          stroke={metric.chartStyle === "range" ? "#cbb99f" : "#7ac8a0"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polyline}
        />
      </svg>
    </div>
  );
}
