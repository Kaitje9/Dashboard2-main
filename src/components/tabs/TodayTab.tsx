import { HealthMetric } from "../../types";
import { HEALTH_DAILY_ROWS, HEALTH_LATEST_DAY } from "../../constants";
import { Sparkline } from "../charts/Sparkline";
import { Tooltip } from "../charts/Tooltip";
import { MetricTile } from "../metrics/MetricTile";
import { useMemo, useState } from "react";

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
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string; visible: boolean }>({
    x: 0,
    y: 0,
    content: "",
    visible: false,
  });

  const hrv = byId(metrics, "hrv");
  const sleep = byId(metrics, "sleepDuration");
  const steps = byId(metrics, "activityStepsPerDay");
  const stress = byId(metrics, "stressScore");
  const rhr = byId(metrics, "rhr");
  const sleepStages = byId(metrics, "sleepStages");
  const activeMinutes = byId(metrics, "activeMinutes");
  const vo2 = byId(metrics, "vo2max");
  const calories = byId(metrics, "caloriesBurned");
  const sleepConsistency = byId(metrics, "sleepRegularity");
  const spo2 = byId(metrics, "spo2");
  const breathing = byId(metrics, "sleepRespRate");

  const hrv14 = hrv?.sparkline?.slice(-14) ?? [];
  const hrvDates14 = useMemo(() => HEALTH_DAILY_ROWS.slice(-14).map((row) => row.date), []);
  const hrvMin = Math.min(...hrv14, hrv?.baselineRange?.[0] ?? Number.POSITIVE_INFINITY);
  const hrvMax = Math.max(...hrv14, hrv?.baselineRange?.[1] ?? Number.NEGATIVE_INFINITY);
  const hrvRange = (hrvMax - hrvMin) || 1;
  const xAt = (i: number) => (i / Math.max(1, hrv14.length - 1)) * 100;
  const yAt = (value: number) => 100 - ((value - hrvMin) / hrvRange) * 100;
  const hrvPolyline = hrv14
    .map((value, index) => `${xAt(index)},${yAt(value)}`)
    .join(" ");

  const latestSleepMinutes = HEALTH_LATEST_DAY.sleep_total_min;
  const baselineSleepMinutes = (sleep?.baselineValue ?? Number(sleep?.value ?? 0)) * 60;
  const sleepDiff = Math.round(latestSleepMinutes - baselineSleepMinutes);

  return (
    <div className="space-y-3">
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[10px]">
        {hrv && (
          <MetricTile
            label="HRV"
            value={hrv.value}
            unit={hrv.unit}
            delta={signedDelta(hrv)}
            deltaUnit={hrv.unit}
            status={statusFromTrend(hrv)}
            compact
            miniVisual={<Sparkline data={hrv.sparkline?.slice(-7) ?? []} baselineRange={hrv.baselineRange} height={20} />}
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
            compact
            miniVisual={
              <div style={{ display: "flex", height: 5, borderRadius: 2, overflow: "hidden", background: "var(--surface-sunken)" }}>
                {(sleepStages?.segments ?? []).map((segment) => (
                  <div key={segment.label} style={{ width: `${segment.value}%`, background: segment.color }} />
                ))}
              </div>
            }
          />
        )}
        {steps && (
          <MetricTile
            label="Steps"
            value={steps.value}
            unit=""
            delta={signedDelta(steps)}
            deltaUnit="steps"
            status={statusFromTrend(steps)}
            compact
            miniVisual={
              <div style={{ height: 22, display: "flex", alignItems: "flex-end", gap: 2 }}>
                {(steps.sparkline?.slice(-7) ?? []).map((value, index, arr) => {
                  const min = Math.min(...arr);
                  const max = Math.max(...arr);
                  const bar = ((value - min) / (max - min || 1)) * 100;
                  return (
                    <span
                      key={`steps-bar-${index}`}
                      style={{
                        flex: 1,
                        height: `${Math.max(3, bar)}%`,
                        borderRadius: 1,
                        background: "var(--accent-sage-500)",
                        opacity: 0.55 + index * 0.05,
                      }}
                    />
                  );
                })}
              </div>
            }
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
            compact
            miniVisual={<Sparkline data={stress.sparkline?.slice(-7) ?? []} baselineRange={stress.baselineRange} height={20} />}
          />
        )}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr",
          gap: 10,
          minHeight: 180,
        }}
      >
        <article style={{ background: "var(--surface-raised)", border: "var(--border-hairline)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", position: "relative" }}>
          <h3 style={{ marginBottom: "var(--space-2)" }}>HRV - last 14 days</h3>
          <div
            style={{ position: "relative" }}
            onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const xPct = (event.clientX - rect.left) / rect.width;
              const idx = Math.max(0, Math.min(hrv14.length - 1, Math.round(xPct * (hrv14.length - 1))));
              setTooltip({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
                content: `${new Date(hrvDates14[idx]).toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${hrv14[idx].toFixed(1)} ms`,
                visible: true,
              });
            }}
          >
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: 140 }}>
              {hrv?.baselineRange && (
                <rect
                  x="0"
                  y={yAt(hrv.baselineRange[1])}
                  width="100"
                  height={Math.max(2, yAt(hrv.baselineRange[0]) - yAt(hrv.baselineRange[1]))}
                  fill="var(--chart-band)"
                />
              )}
              {typeof hrv?.baselineValue === "number" && (
                <line
                  x1="0"
                  y1={yAt(hrv.baselineValue)}
                  x2="100"
                  y2={yAt(hrv.baselineValue)}
                  stroke="var(--chart-baseline)"
                  strokeWidth="0.8"
                  strokeDasharray="2 3"
                />
              )}
              <polyline
                fill="none"
                stroke={hrv14[hrv14.length - 1] >= hrv14[0] ? "var(--accent-sage-500)" : "var(--accent-coral-500)"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={hrvPolyline}
              />
              {hrv14.length > 0 && (
                <>
                  <circle cx={xAt(hrv14.length - 1)} cy={yAt(hrv14[hrv14.length - 1])} r="1.8" fill="var(--accent-sage-500)" />
                  <text x={Math.max(2, xAt(hrv14.length - 1) - 12)} y={Math.max(8, yAt(hrv14[hrv14.length - 1]) - 3)} fontSize="4" fill="var(--text-secondary)">
                    {`${hrv14[hrv14.length - 1].toFixed(1)} ms`}
                  </text>
                </>
              )}
              <text x="0" y="8" fontSize="4" fill="var(--text-tertiary)">{Math.round(hrvMax)}</text>
              <text x="0" y="52" fontSize="4" fill="var(--text-tertiary)">{Math.round((hrvMax + hrvMin) / 2)}</text>
              <text x="0" y="98" fontSize="4" fill="var(--text-tertiary)">{Math.round(hrvMin)}</text>
              <text x="0" y="100" fontSize="3.6" fill="var(--text-tertiary)">
                {new Date(hrvDates14[0] ?? "").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </text>
              <text x="44" y="100" fontSize="3.6" fill="var(--text-tertiary)">
                {new Date(hrvDates14[Math.floor(hrvDates14.length / 2)] ?? "").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </text>
              <text x="86" y="100" fontSize="3.6" fill="var(--text-tertiary)">
                {new Date(hrvDates14[hrvDates14.length - 1] ?? "").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </text>
            </svg>
            <Tooltip
              x={tooltip.x}
              y={tooltip.y}
              content={tooltip.content}
              visible={tooltip.visible}
              containerWidth={420}
              containerHeight={140}
            />
          </div>
          <p className="meta" style={{ marginTop: "var(--space-2)" }}>
            Steady recovery after last week's dip - your body is responding well to the rest days.
          </p>
        </article>

        <article style={{ background: "var(--surface-raised)", border: "var(--border-hairline)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)" }}>
          <h3 style={{ marginBottom: "var(--space-2)" }}>Last night's sleep</h3>
          {(sleepStages?.segments ?? []).map((segment) => (
            <div key={segment.label} style={{ display: "grid", gridTemplateColumns: "46px 1fr auto", gap: 8, alignItems: "center", marginBottom: 7 }}>
              <span className="meta">{segment.label}</span>
              <div style={{ height: 4, background: "var(--surface-sunken)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${segment.value}%`, height: "100%", background: segment.color }} />
              </div>
              <span className="meta">
                {`${Math.round((segment.value / 100) * latestSleepMinutes)}m ${segment.value}%`}
              </span>
            </div>
          ))}
          <p className="meta" style={{ marginTop: "var(--space-2)" }}>
            {`${formatSleep(sleep?.value ?? 0)} total - ${Math.abs(sleepDiff)}m ${sleepDiff < 0 ? "below" : "above"} your average`}
          </p>
          <p className="meta" style={{ marginTop: 4 }}>
            Deep sleep is solid at {sleepStages?.segments?.find((s) => s.label === "Deep")?.value ?? 0}%. The shorter total is the main variable.
          </p>
        </article>

        <article style={{ background: "var(--surface-raised)", border: "var(--border-hairline)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)" }}>
          <h3 style={{ marginBottom: "var(--space-2)" }}>Activity today</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, alignItems: "end", minHeight: 96 }}>
            {[
              { label: "Low", value: HEALTH_LATEST_DAY.active_min_low, color: "var(--text-tertiary)" },
              { label: "Mod", value: HEALTH_LATEST_DAY.active_min_moderate, color: "var(--signal-attention)" },
              { label: "High", value: HEALTH_LATEST_DAY.active_min_high, color: "var(--accent-coral-500)" },
            ].map((item) => {
              const max = Math.max(HEALTH_LATEST_DAY.active_min_low, HEALTH_LATEST_DAY.active_min_moderate, HEALTH_LATEST_DAY.active_min_high, 1);
              return (
                <div key={item.label} style={{ textAlign: "center" }}>
                  <div className="meta">{item.value}m</div>
                  <div style={{ height: 58, display: "flex", alignItems: "flex-end" }}>
                    <div style={{ width: "100%", height: `${Math.max(8, (item.value / max) * 100)}%`, background: item.color, borderRadius: 2 }} />
                  </div>
                  <div className="meta" style={{ marginTop: 3 }}>{item.label}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "var(--space-2)", borderTop: "var(--border-hairline)", paddingTop: "var(--space-2)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <div><span className="meta">VO2 max</span><div style={{ fontFamily: "var(--font-serif)", fontSize: 14 }}>{vo2?.value}</div></div>
            <div><span className="meta">Calories</span><div style={{ fontFamily: "var(--font-serif)", fontSize: 14 }}>{calories?.value}</div></div>
            <div><span className="meta">Steps</span><div style={{ fontFamily: "var(--font-serif)", fontSize: 14 }}>{steps?.value}</div></div>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[10px]">
        {[
          { key: "rhr", metric: rhr, unit: "bpm" },
          { key: "sleepConsistency", metric: sleepConsistency, unit: "%" },
          { key: "spo2", metric: spo2, unit: "%" },
          { key: "breathing", metric: breathing, unit: "rpm" },
        ].map(({ key, metric, unit }) => (
          <article
            key={key}
            style={{
              height: 64,
              background: "var(--surface-raised)",
              border: "var(--border-hairline)",
              borderRadius: "var(--radius-lg)",
              padding: "10px 12px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="label-caps">{metric?.label}</span>
              <span className="meta">{typeof metric?.baselineValue === "number" ? metric.baselineValue.toFixed(1) : "-"}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 60px", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 18 }}>{metric?.value}</span>
                <span className="meta">{unit}</span>
              </div>
              <Sparkline data={metric?.sparkline?.slice(-7) ?? []} baselineRange={metric?.baselineRange} height={18} />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
