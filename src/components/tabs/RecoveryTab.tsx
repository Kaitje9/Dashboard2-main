import { useMemo, useState } from "react";
import { HEALTH_DAILY_ROWS } from "../../constants";
import { HealthMetric } from "../../types";
import { MetricTile } from "../metrics/MetricTile";
import { Sparkline } from "../charts/Sparkline";
import { Tooltip } from "../charts/Tooltip";

interface RecoveryTabProps {
  metrics: HealthMetric[];
}

interface RowLike {
  date: string;
  hrv_morning_ms: number;
  rhr_morning_bpm: number;
  sleep_total_min: number;
  stress_mean: number;
  stress_peak: number;
  skin_temp_delta_c: number;
  breathing_rate_rpm: number;
}

const rows = HEALTH_DAILY_ROWS as unknown as RowLike[];

const byId = (metrics: HealthMetric[], id: string) =>
  metrics.find((metric) => metric.id === id);

const range = (values: number[]) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return { min, max, span: max - min || 1 };
};

const xAt = (idx: number, len: number) => (idx / Math.max(1, len - 1)) * 100;
const yAt = (value: number, min: number, span: number) => 100 - ((value - min) / span) * 100;

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

function getIllnessWindow(data: RowLike[]) {
  const indices = data
    .map((row, idx) => (row.skin_temp_delta_c > 0.4 ? idx : -1))
    .filter((idx) => idx >= 0);
  if (!indices.length) return null;
  return { start: indices[0], end: indices[indices.length - 1] };
}

function linearRegression(points: { x: number; y: number }[]) {
  const n = points.length || 1;
  const sumX = points.reduce((acc, p) => acc + p.x, 0);
  const sumY = points.reduce((acc, p) => acc + p.y, 0);
  const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumXX = points.reduce((acc, p) => acc + p.x * p.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export function RecoveryTab({ metrics }: RecoveryTabProps) {
  const [zoneHover, setZoneHover] = useState(false);
  const hrvMetric = byId(metrics, "hrv");
  const rhrMetric = byId(metrics, "rhr");
  const stressMetric = byId(metrics, "stressScore");
  const breathingMetric = byId(metrics, "sleepRespRate");
  const skinMetric = byId(metrics, "skinTemp");

  const hrv30 = rows.map((row) => row.hrv_morning_ms);
  const rhr30 = rows.map((row) => row.rhr_morning_bpm);
  const stressMean14 = rows.slice(-14).map((row) => row.stress_mean);
  const stressPeak14 = rows.slice(-14).map((row) => row.stress_peak);
  const skin30 = rows.map((row) => row.skin_temp_delta_c);
  const illnessWindow = getIllnessWindow(rows);

  const hrvBounds = range(hrv30);
  const rhrBounds = range(rhr30);
  const stressBounds = range([...stressMean14, ...stressPeak14]);
  const skinBounds = range(skin30);

  const hrvPolyline = hrv30
    .map((value, idx) => `${xAt(idx, hrv30.length)},${yAt(value, hrvBounds.min, hrvBounds.span)}`)
    .join(" ");
  const rhrPolyline = rhr30
    .map((value, idx) => `${xAt(idx, rhr30.length)},${yAt(value, rhrBounds.min, rhrBounds.span)}`)
    .join(" ");
  const stressMeanLine = stressMean14
    .map((value, idx) => `${xAt(idx, stressMean14.length)},${yAt(value, stressBounds.min, stressBounds.span)}`)
    .join(" ");
  const stressPeakLine = stressPeak14
    .map((value, idx) => `${xAt(idx, stressPeak14.length)},${yAt(value, stressBounds.min, stressBounds.span)}`)
    .join(" ");
  const skinLine = skin30
    .map((value, idx) => `${xAt(idx, skin30.length)},${yAt(value, skinBounds.min, skinBounds.span)}`)
    .join(" ");

  const correlationPoints = rows.map((row) => ({
    x: row.sleep_total_min,
    y: row.hrv_morning_ms,
  }));
  const corrX = range(correlationPoints.map((p) => p.x));
  const corrY = range(correlationPoints.map((p) => p.y));
  const regression = linearRegression(correlationPoints);
  const trendY1 = regression.slope * corrX.min + regression.intercept;
  const trendY2 = regression.slope * corrX.max + regression.intercept;

  const hrvTrendUp = hrv30[hrv30.length - 1] >= hrv30[0];
  const rhrAboveBaseline = typeof rhrMetric?.baselineValue === "number"
    ? Number(rhrMetric.value) > rhrMetric.baselineValue
    : true;

  const hrvRange30 = hrvMetric?.baselineRange;
  const rhrRange30 = rhrMetric?.baselineRange;

  const xLabel = (idx: number) =>
    new Date(rows[idx]?.date ?? "").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const firstLabel = xLabel(0);
  const midLabel = xLabel(Math.floor(rows.length / 2));
  const lastLabel = xLabel(rows.length - 1);

  return (
    <div className="space-y-3">
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[10px]">
        {hrvMetric && (
          <MetricTile
            label="HRV"
            value={hrvMetric.value}
            unit={hrvMetric.unit}
            delta={signedDelta(hrvMetric)}
            deltaUnit={hrvMetric.unit}
            status={statusFromTrend(hrvMetric)}
            compact
            miniVisual={<Sparkline data={hrvMetric.sparkline?.slice(-7) ?? []} baselineRange={hrvMetric.baselineRange} height={20} />}
          />
        )}
        {rhrMetric && (
          <MetricTile
            label="RHR"
            value={rhrMetric.value}
            unit={rhrMetric.unit}
            delta={signedDelta(rhrMetric)}
            deltaUnit={rhrMetric.unit}
            status={statusFromTrend(rhrMetric)}
            compact
            miniVisual={<Sparkline data={rhrMetric.sparkline?.slice(-7) ?? []} baselineRange={rhrMetric.baselineRange} height={20} />}
          />
        )}
        {stressMetric && (
          <MetricTile
            label="Stress"
            value={stressMetric.value}
            unit="/100"
            delta={signedDelta(stressMetric)}
            deltaUnit="pts"
            status={statusFromTrend(stressMetric)}
            compact
            miniVisual={<Sparkline data={stressMetric.sparkline?.slice(-7) ?? []} baselineRange={stressMetric.baselineRange} height={20} />}
          />
        )}
        {breathingMetric && (
          <MetricTile
            label="Breathing rate"
            value={breathingMetric.value}
            unit={breathingMetric.unit}
            delta={signedDelta(breathingMetric)}
            deltaUnit={breathingMetric.unit}
            status={statusFromTrend(breathingMetric)}
            compact
            miniVisual={<Sparkline data={breathingMetric.sparkline?.slice(-7) ?? []} baselineRange={breathingMetric.baselineRange} height={20} />}
          />
        )}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-[10px]">
        <article style={{ background: "var(--surface-raised)", border: "var(--border-hairline)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", position: "relative" }}>
          <h3>HRV - 30 days</h3>
          <div
            style={{ position: "relative", marginTop: "var(--space-2)" }}
            onMouseEnter={() => setZoneHover(true)}
            onMouseLeave={() => setZoneHover(false)}
          >
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: 160 }}>
              {illnessWindow && (
                <rect
                  x={xAt(illnessWindow.start, rows.length)}
                  y={0}
                  width={Math.max(1, xAt(illnessWindow.end + 1, rows.length) - xAt(illnessWindow.start, rows.length))}
                  height={100}
                  fill="rgba(212,99,62,0.06)"
                />
              )}
              {hrvRange30 && (
                <rect
                  x={0}
                  y={yAt(hrvRange30[1], hrvBounds.min, hrvBounds.span)}
                  width={100}
                  height={Math.max(2, yAt(hrvRange30[0], hrvBounds.min, hrvBounds.span) - yAt(hrvRange30[1], hrvBounds.min, hrvBounds.span))}
                  fill="var(--chart-band)"
                />
              )}
              {typeof hrvMetric?.baselineValue === "number" && (
                <line
                  x1={0}
                  y1={yAt(hrvMetric.baselineValue, hrvBounds.min, hrvBounds.span)}
                  x2={100}
                  y2={yAt(hrvMetric.baselineValue, hrvBounds.min, hrvBounds.span)}
                  stroke="var(--chart-baseline)"
                  strokeWidth={0.9}
                  strokeDasharray="2 3"
                />
              )}
              <polyline
                fill="none"
                stroke={hrvTrendUp ? "var(--accent-sage-500)" : "var(--accent-coral-500)"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                points={hrvPolyline}
              />
              <text x={1} y={8} fontSize={4} fill="var(--text-tertiary)">{Math.round(hrvBounds.max)}</text>
              <text x={1} y={98} fontSize={4} fill="var(--text-tertiary)">{Math.round(hrvBounds.min)}</text>
              <text x={0} y={100} fontSize={3.6} fill="var(--text-tertiary)">{firstLabel}</text>
              <text x={43} y={100} fontSize={3.6} fill="var(--text-tertiary)">{midLabel}</text>
              <text x={86} y={100} fontSize={3.6} fill="var(--text-tertiary)">{lastLabel}</text>
            </svg>
            <Tooltip
              x={20}
              y={26}
              visible={zoneHover && Boolean(illnessWindow)}
              content="Illness detected - excluded from baseline"
              containerWidth={560}
              containerHeight={160}
            />
          </div>
          <p className="meta" style={{ marginTop: "var(--space-2)" }}>
            Recovery lifted after the illness period - your system appears responsive to easier days.
          </p>
        </article>

        <article style={{ background: "var(--surface-raised)", border: "var(--border-hairline)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)" }}>
          <h3>RHR - 30 days</h3>
          <div style={{ marginTop: "var(--space-2)" }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: 160 }}>
              {rhrRange30 && (
                <rect
                  x={0}
                  y={yAt(rhrRange30[1], rhrBounds.min, rhrBounds.span)}
                  width={100}
                  height={Math.max(2, yAt(rhrRange30[0], rhrBounds.min, rhrBounds.span) - yAt(rhrRange30[1], rhrBounds.min, rhrBounds.span))}
                  fill="var(--chart-band)"
                />
              )}
              {typeof rhrMetric?.baselineValue === "number" && (
                <line
                  x1={0}
                  y1={yAt(rhrMetric.baselineValue, rhrBounds.min, rhrBounds.span)}
                  x2={100}
                  y2={yAt(rhrMetric.baselineValue, rhrBounds.min, rhrBounds.span)}
                  stroke="var(--chart-baseline)"
                  strokeWidth={0.9}
                  strokeDasharray="2 3"
                />
              )}
              <polyline
                fill="none"
                stroke={rhrAboveBaseline ? "var(--accent-coral-500)" : "var(--accent-sage-500)"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                points={rhrPolyline}
              />
              <text x={1} y={8} fontSize={4} fill="var(--text-tertiary)">{Math.round(rhrBounds.max)}</text>
              <text x={1} y={98} fontSize={4} fill="var(--text-tertiary)">{Math.round(rhrBounds.min)}</text>
              <text x={0} y={100} fontSize={3.6} fill="var(--text-tertiary)">{firstLabel}</text>
              <text x={43} y={100} fontSize={3.6} fill="var(--text-tertiary)">{midLabel}</text>
              <text x={86} y={100} fontSize={3.6} fill="var(--text-tertiary)">{lastLabel}</text>
            </svg>
          </div>
          <p className="meta" style={{ marginTop: "var(--space-2)" }}>
            Elevated RHR lingered after April 17 - your cardiovascular recovery lags behind how you may feel.
          </p>
        </article>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-[10px]">
        <article style={{ background: "var(--surface-raised)", border: "var(--border-hairline)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)" }}>
          <h3>Stress - 14 days</h3>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: 140, marginTop: 8 }}>
            <polyline
              fill="none"
              stroke="var(--accent-coral-500)"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={stressMeanLine}
            />
            <polyline
              fill="none"
              stroke="var(--accent-coral-500)"
              strokeOpacity={0.45}
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={stressPeakLine}
            />
            <text x={86} y={16} fontSize={4} fill="var(--accent-coral-500)">mean</text>
            <text x={86} y={24} fontSize={4} fill="var(--text-tertiary)">peak</text>
          </svg>
          <p className="meta">
            Stress climbed without a full reset - a deliberate low-load day may restore range faster.
          </p>
        </article>

        <article style={{ background: "var(--surface-raised)", border: "var(--border-hairline)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)" }}>
          <h3>Recovery correlation</h3>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: 140, marginTop: 8 }}>
            {correlationPoints.map((point, idx) => {
              const x = ((point.x - corrX.min) / (corrX.span || 1)) * 100;
              const y = 100 - ((point.y - corrY.min) / (corrY.span || 1)) * 100;
              const aboveSleep = point.x >= (sleepMetricBaselineMinutes() ?? point.x);
              const aboveHrv = point.y >= (hrvMetric?.baselineValue ?? point.y);
              const color = aboveSleep && aboveHrv
                ? "var(--accent-sage-500)"
                : !aboveSleep && !aboveHrv
                  ? "var(--accent-coral-500)"
                  : "var(--text-tertiary)";
              return <circle key={`corr-${idx}`} cx={x} cy={y} r={1.8} fill={color} />;
            })}
            <line
              x1={0}
              y1={100 - ((trendY1 - corrY.min) / (corrY.span || 1)) * 100}
              x2={100}
              y2={100 - ((trendY2 - corrY.min) / (corrY.span || 1)) * 100}
              stroke="var(--chart-projection)"
              strokeWidth={1}
            />
          </svg>
          <p className="meta">
            Nights over seven hours tend to align with higher next-morning HRV - sleep quality compounds recovery.
          </p>
        </article>

        <article style={{ background: "var(--surface-raised)", border: "var(--border-hairline)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)" }}>
          <h3>Skin temperature</h3>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: 140, marginTop: 8 }}>
            <polyline
              fill="none"
              stroke="var(--text-secondary)"
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={skinLine}
            />
            {skin30.map((value, idx) => {
              const x = xAt(idx, skin30.length);
              const y = yAt(value, skinBounds.min, skinBounds.span);
              return (
                <circle
                  key={`skin-${idx}`}
                  cx={x}
                  cy={y}
                  r={value > 0.4 ? 2.1 : 1.5}
                  fill={value > 0.4 ? "var(--accent-coral-500)" : "var(--text-tertiary)"}
                />
              );
            })}
          </svg>
          <p className="meta">
            Temperature spikes can lead HRV drops by one to two days - useful as an early warning signal.
          </p>
        </article>
      </section>
    </div>
  );

  function sleepMetricBaselineMinutes() {
    const sleepMetric = byId(metrics, "sleepDuration");
    if (!sleepMetric) return undefined;
    if (typeof sleepMetric.baselineValue === "number") return sleepMetric.baselineValue * 60;
    const asNumber = Number(sleepMetric.value);
    return Number.isFinite(asNumber) ? asNumber * 60 : undefined;
  }
}
