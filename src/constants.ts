/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import csvRaw from "../health_30d.csv?raw";
import { baselineRange, isHealthyBaselineDay, rollingBaseline } from "./lib/baselines";
import { HealthMetric } from "./types";

interface HealthCsvRow {
  date: string;
  day_of_week: string;
  hrv_morning_ms: number;
  rhr_morning_bpm: number;
  sleep_total_min: number;
  sleep_deep_min: number;
  sleep_rem_min: number;
  sleep_light_min: number;
  sleep_awake_min: number;
  sleep_bedtime: string;
  sleep_wake: string;
  sleep_consistency_pct: number;
  breathing_rate_rpm: number;
  steps: number;
  active_min_low: number;
  active_min_moderate: number;
  active_min_high: number;
  vo2max: number;
  calories_kcal: number;
  spo2_mean_pct: number;
  spo2_min_pct: number;
  skin_temp_delta_c: number;
  stress_mean: number;
  stress_peak: number;
}

const numberColumns: (keyof HealthCsvRow)[] = [
  "hrv_morning_ms",
  "rhr_morning_bpm",
  "sleep_total_min",
  "sleep_deep_min",
  "sleep_rem_min",
  "sleep_light_min",
  "sleep_awake_min",
  "sleep_consistency_pct",
  "breathing_rate_rpm",
  "steps",
  "active_min_low",
  "active_min_moderate",
  "active_min_high",
  "vo2max",
  "calories_kcal",
  "spo2_mean_pct",
  "spo2_min_pct",
  "skin_temp_delta_c",
  "stress_mean",
  "stress_peak",
];

const round1 = (value: number) => Math.round(value * 10) / 10;
const round0 = (value: number) => Math.round(value);
const average = (values: number[]) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0);
const last = <T,>(values: T[]) => values[values.length - 1];
const lastN = <T,>(values: T[], n: number) => values.slice(Math.max(0, values.length - n));

function parseCsv(input: string): HealthCsvRow[] {
  const lines = input.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",") as (keyof HealthCsvRow)[];
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row: Partial<HealthCsvRow> = {};
    headers.forEach((header, index) => {
      const value = values[index];
      row[header] = numberColumns.includes(header)
        ? Number.parseFloat(value)
        : value;
    });
    return row as HealthCsvRow;
  });
}

function trendFromLast7(values: number[], higherIsBetter = true): { trend: "up" | "down" | "stable"; change: number } {
  const recent = lastN(values, 7);
  if (recent.length < 2) return { trend: "stable", change: 0 };
  const delta = round1(recent[recent.length - 1] - recent[0]);
  if (Math.abs(delta) < 0.2) return { trend: "stable", change: 0 };

  const up = delta > 0;
  if (higherIsBetter) {
    return { trend: up ? "up" : "down", change: Math.abs(delta) };
  }
  return { trend: up ? "down" : "up", change: Math.abs(delta) };
}

function toSleepHours(minutes: number) {
  return round1(minutes / 60);
}

const rows = parseCsv(csvRaw);
const latest = last(rows);
export const HEALTH_DAILY_ROWS = rows;
export const HEALTH_LATEST_DAY = latest;

const hrvSeries = rows.map((row) => row.hrv_morning_ms);
const rhrSeries = rows.map((row) => row.rhr_morning_bpm);
const sleepSeries = rows.map((row) => toSleepHours(row.sleep_total_min));
const sleepConsistencySeries = rows.map((row) => row.sleep_consistency_pct);
const breathingSeries = rows.map((row) => row.breathing_rate_rpm);
const stepsSeries = rows.map((row) => row.steps);
const activeMinutesSeries = rows.map((row) => row.active_min_low + row.active_min_moderate + row.active_min_high);
const vo2Series = rows.map((row) => row.vo2max);
const caloriesSeries = rows.map((row) => row.calories_kcal);
const spo2Series = rows.map((row) => row.spo2_mean_pct);
const skinTempSeries = rows.map((row) => row.skin_temp_delta_c);
const stressSeries = rows.map((row) => row.stress_mean);

const sleepDebtHours = round1(
  lastN(rows, 7).reduce((debt, row) => debt + Math.max(0, 8 - toSleepHours(row.sleep_total_min)), 0),
);

function baselineFor(metric: keyof HealthCsvRow) {
  const value = round1(rollingBaseline(rows, metric, 14));
  const range = baselineRange(rows, metric, 14).map((v) => round1(v)) as [number, number];
  return { value, range };
}

const hrvBaseline = baselineFor("hrv_morning_ms");
const rhrBaseline = baselineFor("rhr_morning_bpm");
const sleepBaseline = baselineFor("sleep_total_min");
const sleepConsistencyBaseline = baselineFor("sleep_consistency_pct");
const breathingBaseline = baselineFor("breathing_rate_rpm");
const stepsBaseline = baselineFor("steps");
const activeMinutesBaseline = baselineFor("active_min_moderate");
const vo2Baseline = baselineFor("vo2max");
const caloriesBaseline = baselineFor("calories_kcal");
const spo2Baseline = baselineFor("spo2_mean_pct");
const skinTempBaseline = baselineFor("skin_temp_delta_c");
const stressBaseline = baselineFor("stress_mean");

const latestUnusual = !isHealthyBaselineDay(latest);

export const MOCK_METRICS: HealthMetric[] = [
  {
    id: "hrv",
    category: "recovery",
    label: "HRV",
    value: round0(latest.hrv_morning_ms),
    unit: "ms",
    chartStyle: "line",
    sparkline: lastN(hrvSeries, 14),
    baselineValue: hrvBaseline.value,
    baselineRange: hrvBaseline.range,
    unusual: latestUnusual,
    trend: trendFromLast7(hrvSeries).trend,
    change: trendFromLast7(hrvSeries).change,
    status: latest.hrv_morning_ms >= 47 ? "optimal" : latest.hrv_morning_ms >= 40 ? "warning" : "critical",
    description: "Morning HRV relative to your rolling baseline.",
    insight: "Reflects recovery and autonomic load.",
    sentence: "Slightly above baseline this morning.",
  },
  {
    id: "rhr",
    category: "recovery",
    label: "RHR",
    value: round1(latest.rhr_morning_bpm),
    unit: "bpm",
    chartStyle: "range",
    sparkline: lastN(rhrSeries, 14),
    baselineValue: rhrBaseline.value,
    baselineRange: rhrBaseline.range,
    unusual: latestUnusual,
    trend: trendFromLast7(rhrSeries, false).trend,
    change: trendFromLast7(rhrSeries, false).change,
    status: latest.rhr_morning_bpm <= 58 ? "optimal" : latest.rhr_morning_bpm <= 63 ? "warning" : "critical",
    description: "Morning resting heart rate.",
    insight: "Tracks cumulative fatigue and recovery state.",
    sentence: "Still within your expected baseline band.",
  },
  {
    id: "sleepDuration",
    category: "sleep",
    label: "Sleep duration",
    value: toSleepHours(latest.sleep_total_min),
    unit: "h",
    chartStyle: "bars",
    sparkline: lastN(sleepSeries, 14),
    baselineValue: round1(sleepBaseline.value / 60),
    baselineRange: [round1(sleepBaseline.range[0] / 60), round1(sleepBaseline.range[1] / 60)],
    unusual: latestUnusual,
    trend: trendFromLast7(sleepSeries).trend,
    change: trendFromLast7(sleepSeries).change,
    status: latest.sleep_total_min >= 420 ? "optimal" : latest.sleep_total_min >= 360 ? "warning" : "critical",
    description: "Total sleep time from bedtime to wake.",
    insight: `${sleepDebtHours}h debt over the past 7 days.`,
    sentence: "Sleep duration is below your ideal target window.",
  },
  {
    id: "sleepStages",
    category: "sleep",
    label: "Sleep stages",
    value: "Distribution",
    unit: "",
    chartStyle: "sleepStages",
    unusual: latestUnusual,
    segments: [
      { label: "Deep", value: round0((latest.sleep_deep_min / latest.sleep_total_min) * 100), color: "var(--sleep-deep)" },
      { label: "REM", value: round0((latest.sleep_rem_min / latest.sleep_total_min) * 100), color: "var(--sleep-rem)" },
      { label: "Light", value: round0((latest.sleep_light_min / latest.sleep_total_min) * 100), color: "var(--sleep-light)" },
      { label: "Awake", value: round0((latest.sleep_awake_min / latest.sleep_total_min) * 100), color: "var(--sleep-awake)" },
    ],
    trend: "stable",
    change: 0,
    status: "optimal",
    description: "Deep, REM, light, and awake split.",
    insight: "Architecture appears stable this week.",
    sentence: "Deep and REM are close to your weekly pattern.",
  },
  {
    id: "sleepRegularity",
    category: "sleep",
    label: "Sleep consistency",
    value: round0(latest.sleep_consistency_pct),
    unit: "%",
    chartStyle: "line",
    sparkline: lastN(sleepConsistencySeries, 14),
    baselineValue: sleepConsistencyBaseline.value,
    baselineRange: sleepConsistencyBaseline.range,
    unusual: latestUnusual,
    trend: trendFromLast7(sleepConsistencySeries).trend,
    change: trendFromLast7(sleepConsistencySeries).change,
    status: latest.sleep_consistency_pct >= 82 ? "optimal" : latest.sleep_consistency_pct >= 72 ? "warning" : "critical",
    description: "Bed/wake timing regularity score.",
    insight: "Consistency remains one of the biggest levers.",
    sentence: "Schedule drift is still affecting sleep quality.",
  },
  {
    id: "sleepRespRate",
    category: "sleep",
    label: "Breathing rate",
    value: round1(latest.breathing_rate_rpm),
    unit: "rpm",
    chartStyle: "range",
    sparkline: lastN(breathingSeries, 14),
    baselineValue: breathingBaseline.value,
    baselineRange: breathingBaseline.range,
    unusual: latestUnusual,
    trend: trendFromLast7(breathingSeries, false).trend,
    change: trendFromLast7(breathingSeries, false).change,
    status: latest.breathing_rate_rpm <= 16 ? "optimal" : latest.breathing_rate_rpm <= 18 ? "warning" : "critical",
    description: "Average sleeping respiratory rate.",
    insight: "Useful context around recovery and stress.",
    sentence: "No sustained respiratory elevation detected.",
  },
  {
    id: "sleepStepsPerDay",
    category: "sleep",
    label: "Steps",
    value: latest.steps,
    unit: "",
    chartStyle: "steps",
    sparkline: lastN(stepsSeries, 14),
    baselineValue: stepsBaseline.value,
    baselineRange: stepsBaseline.range,
    unusual: latestUnusual,
    trend: trendFromLast7(stepsSeries).trend,
    change: trendFromLast7(stepsSeries).change,
    status: latest.steps >= 8000 ? "optimal" : latest.steps >= 5500 ? "warning" : "critical",
    description: "Daily movement volume.",
    insight: "Activity volume supports sleep pressure.",
    sentence: "Step count remains above your baseline.",
  },
  {
    id: "activityStepsPerDay",
    category: "activity",
    label: "Steps",
    value: latest.steps,
    unit: "",
    chartStyle: "steps",
    sparkline: lastN(stepsSeries, 14),
    baselineValue: stepsBaseline.value,
    baselineRange: stepsBaseline.range,
    unusual: latestUnusual,
    trend: trendFromLast7(stepsSeries).trend,
    change: trendFromLast7(stepsSeries).change,
    status: latest.steps >= 8000 ? "optimal" : latest.steps >= 5500 ? "warning" : "critical",
    description: "Daily locomotion volume.",
    insight: "Strong contributor to daily output.",
    sentence: "You are trending above your weekly movement baseline.",
  },
  {
    id: "activeMinutes",
    category: "activity",
    label: "Active minutes",
    value: latest.active_min_low + latest.active_min_moderate + latest.active_min_high,
    unit: "min",
    chartStyle: "bars",
    sparkline: lastN(activeMinutesSeries, 14),
    baselineValue: activeMinutesBaseline.value,
    baselineRange: activeMinutesBaseline.range,
    unusual: latestUnusual,
    trend: trendFromLast7(activeMinutesSeries).trend,
    change: trendFromLast7(activeMinutesSeries).change,
    status: activeMinutesSeries[activeMinutesSeries.length - 1] >= 60 ? "optimal" : activeMinutesSeries[activeMinutesSeries.length - 1] >= 35 ? "warning" : "critical",
    description: "Low + moderate + high intensity minutes.",
    insight: "Intensity mix affects recovery the next day.",
    sentence: "Intensity stayed moderate through most of the week.",
  },
  {
    id: "vo2max",
    category: "activity",
    label: "VO2 max",
    value: round1(latest.vo2max),
    unit: "ml/kg/min",
    chartStyle: "line",
    sparkline: lastN(vo2Series, 14),
    baselineValue: vo2Baseline.value,
    baselineRange: vo2Baseline.range,
    unusual: latestUnusual,
    trend: trendFromLast7(vo2Series).trend,
    change: trendFromLast7(vo2Series).change,
    status: latest.vo2max >= 46 ? "optimal" : latest.vo2max >= 40 ? "warning" : "critical",
    description: "Estimated aerobic capacity.",
    insight: "Capacity remains broadly stable.",
    sentence: "VO2 max is holding steady near your baseline.",
  },
  {
    id: "caloriesBurned",
    category: "activity",
    label: "Calories burned",
    value: latest.calories_kcal,
    unit: "kcal",
    chartStyle: "radial",
    sparkline: lastN(caloriesSeries, 14),
    baselineValue: caloriesBaseline.value,
    baselineRange: caloriesBaseline.range,
    unusual: latestUnusual,
    trend: trendFromLast7(caloriesSeries).trend,
    change: trendFromLast7(caloriesSeries).change,
    status: latest.calories_kcal >= 2200 ? "optimal" : latest.calories_kcal >= 1800 ? "warning" : "critical",
    description: "Total daily expenditure.",
    insight: "Useful for training load and fueling context.",
    sentence: "Energy output is slightly above baseline this week.",
  },
  {
    id: "spo2",
    category: "sleep",
    label: "SpO2",
    value: round1(latest.spo2_mean_pct),
    unit: "%",
    chartStyle: "range",
    sparkline: lastN(spo2Series, 14),
    baselineValue: spo2Baseline.value,
    baselineRange: spo2Baseline.range,
    unusual: latestUnusual,
    trend: trendFromLast7(spo2Series).trend,
    change: trendFromLast7(spo2Series).change,
    status: latest.spo2_mean_pct >= 96 ? "optimal" : latest.spo2_mean_pct >= 94 ? "warning" : "critical",
    description: "Night oxygen saturation average.",
    insight: "Oxygenation is stable and healthy.",
    sentence: "No concerning drop in overnight oxygen saturation.",
  },
  {
    id: "skinTemp",
    category: "sleep",
    label: "Skin temperature",
    value: round1(latest.skin_temp_delta_c),
    unit: "delta C",
    chartStyle: "line",
    sparkline: lastN(skinTempSeries, 14),
    baselineValue: skinTempBaseline.value,
    baselineRange: skinTempBaseline.range,
    unusual: latest.skin_temp_delta_c > 0.4,
    trend: trendFromLast7(skinTempSeries, false).trend,
    change: trendFromLast7(skinTempSeries, false).change,
    status: Math.abs(latest.skin_temp_delta_c) <= 0.25 ? "optimal" : Math.abs(latest.skin_temp_delta_c) <= 0.4 ? "warning" : "critical",
    description: "Deviation from personal skin-temperature baseline.",
    insight: "Higher deltas can indicate physiological strain.",
    sentence: "Temperature signal is close to baseline right now.",
  },
  {
    id: "stressScore",
    category: "recovery",
    label: "Stress",
    value: latest.stress_mean,
    unit: "/100",
    chartStyle: "radial",
    sparkline: lastN(stressSeries, 14),
    baselineValue: stressBaseline.value,
    baselineRange: stressBaseline.range,
    unusual: latestUnusual,
    trend: trendFromLast7(stressSeries, false).trend,
    change: trendFromLast7(stressSeries, false).change,
    status: latest.stress_mean <= 45 ? "optimal" : latest.stress_mean <= 58 ? "warning" : "critical",
    description: "Daily stress mean from HRV + heart rate dynamics.",
    insight: "Stress burden is currently moderate.",
    sentence: "Stress remains within your baseline envelope.",
  },
];

export const HEALTH_DATA_CONTEXT = `
Current snapshot:
- Date: ${latest.date} (${latest.day_of_week})
- HRV: ${round0(latest.hrv_morning_ms)} ms
- RHR: ${round1(latest.rhr_morning_bpm)} bpm
- Sleep duration: ${toSleepHours(latest.sleep_total_min)} h
- Sleep consistency: ${round0(latest.sleep_consistency_pct)}%
- Breathing rate: ${round1(latest.breathing_rate_rpm)} rpm
- Steps: ${latest.steps}
- Active minutes: ${latest.active_min_low + latest.active_min_moderate + latest.active_min_high}
- VO2 max: ${round1(latest.vo2max)}
- Calories burned: ${latest.calories_kcal} kcal
- SpO2: ${round1(latest.spo2_mean_pct)}%
- Skin temperature delta: ${round1(latest.skin_temp_delta_c)} C
- Stress: ${latest.stress_mean}/100
- Sleep debt (last 7 days): ${sleepDebtHours} h

14-day baselines:
- HRV baseline: ${hrvBaseline.value} ms
- RHR baseline: ${rhrBaseline.value} bpm
- Sleep baseline: ${round1(sleepBaseline.value / 60)} h
- Stress baseline: ${stressBaseline.value}
`.trim();

export const INITIAL_AI_GREETING =
  `Good evening. HRV is ${round0(latest.hrv_morning_ms)} ms and sleep was ${toSleepHours(latest.sleep_total_min)}h last night. ` +
  "Would you like to focus on recovery, sleep, or activity today?";
