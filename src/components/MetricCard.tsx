/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { HealthMetric } from "../types";
import { Button } from "./ui/button";
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
      <CardContent className="p-5 flex justify-between items-start">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase font-semibold tracking-wide text-brand-muted">{metric.label}</span>
        <div className="flex items-baseline gap-1.5">
          <span className="font-editorial text-4xl font-medium leading-none text-brand-text">{metric.value}</span>
          <span className="text-sm text-brand-muted">{metric.unit}</span>
        </div>
        <p className="text-sm text-brand-muted leading-snug max-w-[240px]">{metric.insight}</p>
      </div>
      
      <div className="flex flex-col items-end gap-2.5">
        <div className={`p-2 rounded-lg ${
          metric.id === 'sleep' ? 'bg-[#7488ff]/14 text-[#c0caff]' : 
          metric.id === 'strain' ? 'bg-[#cf8b65]/20 text-[#e7b79f]' : 
          'bg-brand-accent/12 text-brand-accent'
        }`}>
          {metric.trend === 'up' && <TrendingUp className="w-4 h-4" />}
          {metric.trend === 'down' && <TrendingDown className="w-4 h-4" />}
          {metric.trend === 'stable' && <Minus className="w-4 h-4" />}
        </div>
        <span className={`text-xs font-semibold ${metric.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit}%
        </span>
        <Button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenDetails?.(metric);
          }}
          variant="ghost"
          size="sm"
          className="h-auto py-1"
        >
          View details
        </Button>
      </div>
      </CardContent>
    </Card>
  );
}
