import { HealthMetric } from "../../types";
import { MetricTile } from "../metrics/MetricTile";
import { TrendCard } from "../metrics/TrendCard";

interface TodayTabProps {
  metrics: HealthMetric[];
}

const byId = (metrics: HealthMetric[], id: string) =>
  metrics.find((metric) => metric.id === id);

const formatSleep = (hoursValue: number | string) => {
  const numeric = typeof hoursValue === "number" ? hoursValue : Number(hoursValue);
  if (!Number.isFinite(numeric)) return `${hoursValue}`;
  const totalMinutes = Math.round(numeric * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
};

const signedDelta = (metric?: HealthMetric) => {
  if (!metric) return undefined;
  if (metric.trend === "down") return -metric.change;
  if (metric.trend === "stable") return 0;
  return metric.change;
};

const statusFromTrend = (metric?: HealthMetric): "in-range" | "above" | "below" | "neutral" => {
  if (!metric || metric.trend === "stable") return "neutral";
  return metric.trend === "up" ? "in-range" : "below";
};

export function TodayTab({ metrics }: TodayTabProps) {
  const hrv = byId(metrics, "hrv");
  const sleep = byId(metrics, "sleepDuration");
  const steps = byId(metrics, "activityStepsPerDay");
  const stress = byId(metrics, "stressScore");
  const rhr = byId(metrics, "rhr");

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {hrv && (
          <MetricTile
            label="HRV"
            value={hrv.value}
            unit={hrv.unit}
            delta={signedDelta(hrv)}
            deltaUnit={hrv.unit}
            status={statusFromTrend(hrv)}
          />
        )}
        {sleep && (
          <MetricTile
            label="Sleep"
            value={formatSleep(sleep.value)}
            unit=""
            delta={signedDelta(sleep)}
            deltaUnit="h"
            status={statusFromTrend(sleep)}
          />
        )}
        {steps && (
          <MetricTile
            label="Steps"
            value={steps.value}
            unit=""
            delta={signedDelta(steps)}
            deltaUnit="%"
            status={statusFromTrend(steps)}
          />
        )}
        {stress && (
          <MetricTile
            label="Stress"
            value={stress.value}
            unit="/100"
            delta={signedDelta(stress)}
            deltaUnit="pts"
            status={statusFromTrend(stress)}
          />
        )}
      </section>

      <section className="space-y-3">
        <h2>Last seven days</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {hrv && (
            <TrendCard
              label="HRV"
              currentValue={`${hrv.value} ${hrv.unit}`}
              sparklineData={hrv.sparkline?.slice(-7) ?? []}
              baselineRange={hrv.baselineRange}
              sentence="Above your 14-day baseline — a sign of good recovery."
            />
          )}
          {rhr && (
            <TrendCard
              label="RHR"
              currentValue={`${rhr.value} ${rhr.unit}`}
              sparklineData={rhr.sparkline?.slice(-7) ?? []}
              baselineRange={rhr.baselineRange}
              sentence="Stable, no signs of accumulated fatigue."
            />
          )}
          {sleep && (
            <TrendCard
              label="Sleep duration"
              currentValue={`${sleep.value} ${sleep.unit}`}
              sparklineData={sleep.sparkline?.slice(-7) ?? []}
              baselineRange={sleep.baselineRange}
              sentence="Below your usual range for the second night."
            />
          )}
          {steps && (
            <TrendCard
              label="Steps"
              currentValue={`${steps.value}`}
              sparklineData={steps.sparkline?.slice(-7) ?? []}
              baselineRange={steps.baselineRange}
              sentence="Tracking ahead of your weekly average."
            />
          )}
        </div>
      </section>
    </div>
  );
}
