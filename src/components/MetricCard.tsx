/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { HealthMetric } from "../types";

export function MetricCard({
  metric,
  onOpenDetails,
}: {
  metric: HealthMetric;
  onOpenDetails?: (metric: HealthMetric) => void;
}) {
  return (
    <div
      onClick={() => onOpenDetails?.(metric)}
      className="bg-brand-card rounded-xl p-5 border border-brand-border flex justify-between items-start cursor-pointer shadow-sm hover:shadow-md transition-shadow"
      id={`metric-card-${metric.id}`}
    >
      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase font-semibold tracking-wide text-brand-muted">{metric.label}</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-brand-text">{metric.value}</span>
          <span className="text-sm text-brand-muted">{metric.unit}</span>
        </div>
        <p className="text-sm text-brand-muted leading-snug max-w-[240px]">{metric.insight}</p>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <div className={`p-2 rounded-lg ${
          metric.id === 'sleep' ? 'bg-[#3E92F9]/10 text-[#3E92F9]' : 
          metric.id === 'strain' ? 'bg-brand-accent/10 text-brand-accent' : 
          'bg-brand-muted/10 text-brand-muted'
        }`}>
          {metric.trend === 'up' && <TrendingUp className="w-4 h-4" />}
          {metric.trend === 'down' && <TrendingDown className="w-4 h-4" />}
          {metric.trend === 'stable' && <Minus className="w-4 h-4" />}
        </div>
        <span className={`text-xs font-semibold ${metric.change >= 0 ? 'text-brand-accent' : 'text-rose-600'}`}>
          {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit}%
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenDetails?.(metric);
          }}
          className="text-xs text-brand-muted hover:text-brand-text transition-colors"
        >
          View details
        </button>
      </div>
    </div>
  );
}
