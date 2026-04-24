/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DailyData, HealthMetric } from './types';

export const MOCK_DAILY_HISTORY: DailyData[] = [
  { date: 'W1 Mon', strain: 11.2, recovery: 86, sleepHours: 8.3, hrv: 70, rhr: 51 },
  { date: 'W1 Tue', strain: 13.8, recovery: 80, sleepHours: 7.9, hrv: 67, rhr: 53 },
  { date: 'W1 Wed', strain: 15.6, recovery: 71, sleepHours: 7.2, hrv: 63, rhr: 55 },
  { date: 'W1 Thu', strain: 17.1, recovery: 59, sleepHours: 6.6, hrv: 58, rhr: 57 },
  { date: 'W1 Fri', strain: 18.3, recovery: 48, sleepHours: 6.1, hrv: 54, rhr: 59 },
  { date: 'W1 Sat', strain: 10.1, recovery: 78, sleepHours: 8.4, hrv: 69, rhr: 52 },
  { date: 'W1 Sun', strain: 8.9, recovery: 90, sleepHours: 9.0, hrv: 74, rhr: 49 },
  { date: 'W2 Mon', strain: 14.4, recovery: 76, sleepHours: 7.4, hrv: 65, rhr: 54 },
  { date: 'W2 Tue', strain: 16.2, recovery: 63, sleepHours: 6.8, hrv: 60, rhr: 56 },
  { date: 'W2 Wed', strain: 12.3, recovery: 79, sleepHours: 8.1, hrv: 68, rhr: 52 },
  { date: 'W2 Thu', strain: 18.8, recovery: 42, sleepHours: 5.9, hrv: 50, rhr: 60 },
  { date: 'W2 Fri', strain: 19.2, recovery: 38, sleepHours: 5.7, hrv: 48, rhr: 61 },
  { date: 'W2 Sat', strain: 11.4, recovery: 72, sleepHours: 7.8, hrv: 64, rhr: 54 },
  { date: 'W2 Sun', strain: 9.7, recovery: 88, sleepHours: 8.9, hrv: 73, rhr: 50 },
  { date: 'W3 Mon', strain: 13.6, recovery: 82, sleepHours: 8.0, hrv: 69, rhr: 52 },
  { date: 'W3 Tue', strain: 15.2, recovery: 74, sleepHours: 7.5, hrv: 65, rhr: 53 },
  { date: 'W3 Wed', strain: 17.6, recovery: 56, sleepHours: 6.4, hrv: 56, rhr: 58 },
  { date: 'W3 Thu', strain: 12.1, recovery: 83, sleepHours: 8.2, hrv: 70, rhr: 51 },
  { date: 'W3 Fri', strain: 14.8, recovery: 77, sleepHours: 7.6, hrv: 66, rhr: 53 },
  { date: 'W3 Sat', strain: 10.5, recovery: 87, sleepHours: 8.8, hrv: 72, rhr: 50 },
  { date: 'W3 Sun', strain: 9.9, recovery: 91, sleepHours: 9.1, hrv: 75, rhr: 49 },
  { date: 'W4 Mon', strain: 16.8, recovery: 62, sleepHours: 6.7, hrv: 59, rhr: 56 },
  { date: 'W4 Tue', strain: 18.1, recovery: 54, sleepHours: 6.3, hrv: 55, rhr: 58 },
  { date: 'W4 Wed', strain: 11.9, recovery: 85, sleepHours: 8.5, hrv: 71, rhr: 51 },
  { date: 'W4 Thu', strain: 13.1, recovery: 81, sleepHours: 8.1, hrv: 68, rhr: 52 },
  { date: 'W4 Fri', strain: 12.4, recovery: 84, sleepHours: 8.2, hrv: 68, rhr: 52 },
  { date: 'W4 Sat', strain: 10.8, recovery: 89, sleepHours: 8.9, hrv: 73, rhr: 50 },
  { date: 'W4 Sun', strain: 9.5, recovery: 92, sleepHours: 9.3, hrv: 76, rhr: 48 },
];

const average = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

const toOneDecimal = (value: number) => Math.round(value * 10) / 10;
const toInteger = (value: number) => Math.round(value);

const latest = MOCK_DAILY_HISTORY[MOCK_DAILY_HISTORY.length - 1];
const last7Days = MOCK_DAILY_HISTORY.slice(-7);
const previous7Days = MOCK_DAILY_HISTORY.slice(-14, -7);
const last28Days = MOCK_DAILY_HISTORY.slice(-28);

const sleepTargetHours = 8;
const sleepDebtHours = Math.max(
  0,
  toOneDecimal(
    last7Days.reduce((debt, day) => debt + Math.max(0, sleepTargetHours - day.sleepHours), 0)
  )
);
const strainBalance =
  average(last7Days.map(day => day.strain)) - average(previous7Days.map(day => day.strain));

export const MOCK_METRICS: HealthMetric[] = [
  {
    id: 'recovery',
    label: 'Recovery',
    value: latest.recovery,
    unit: '%',
    trend: latest.recovery >= average(previous7Days.map(day => day.recovery)) ? 'up' : 'down',
    change: toInteger(latest.recovery - average(previous7Days.map(day => day.recovery))),
    status: latest.recovery >= 67 ? 'optimal' : latest.recovery >= 45 ? 'warning' : 'critical',
    description: 'A measure of your body’s readiness to take on strain, calculated from HRV, RHR, and sleep.',
    insight: 'Recovery is strongest after your two lowest-strain days this week.',
  },
  {
    id: 'strain',
    label: 'Daily Strain',
    value: latest.strain,
    unit: '',
    trend: latest.strain >= average(previous7Days.map(day => day.strain)) ? 'up' : 'down',
    change: toOneDecimal(latest.strain - average(previous7Days.map(day => day.strain))),
    status: latest.strain <= 16 ? 'optimal' : latest.strain <= 18 ? 'warning' : 'critical',
    description: 'Total cardiovascular load accumulated today, based on heart rate zones and duration.',
    insight: `7-day training load is ${strainBalance >= 0 ? 'up' : 'down'} ${Math.abs(
      toOneDecimal(strainBalance)
    )} vs the previous week.`,
  },
  {
    id: 'hrv',
    label: 'HRV',
    value: latest.hrv,
    unit: 'ms',
    trend: latest.hrv >= average(previous7Days.map(day => day.hrv)) ? 'up' : 'down',
    change: toInteger(latest.hrv - average(previous7Days.map(day => day.hrv))),
    status: latest.hrv >= 62 ? 'optimal' : latest.hrv >= 55 ? 'warning' : 'critical',
    description: 'Heart Rate Variability reflects autonomic nervous system balance and recovery readiness.',
    insight: `7-day HRV average: ${toInteger(average(last7Days.map(day => day.hrv)))} ms.`,
  },
  {
    id: 'sleep',
    label: 'Sleep Performance',
    value: toOneDecimal(latest.sleepHours),
    unit: 'h',
    trend: latest.sleepHours >= average(previous7Days.map(day => day.sleepHours)) ? 'up' : 'down',
    change: toOneDecimal(latest.sleepHours - average(previous7Days.map(day => day.sleepHours))),
    status: latest.sleepHours >= 7.5 ? 'optimal' : latest.sleepHours >= 6.5 ? 'warning' : 'critical',
    description: 'Sleep duration and consistency across the week, weighted toward recovery quality.',
    insight: `${sleepDebtHours.toFixed(1)}h sleep debt accumulated over the last 7 days.`,
  },
  {
    id: 'rhr',
    label: 'Resting HR',
    value: latest.rhr,
    unit: 'bpm',
    trend: latest.rhr <= average(previous7Days.map(day => day.rhr)) ? 'down' : 'up',
    change: toInteger(Math.abs(latest.rhr - average(previous7Days.map(day => day.rhr)))),
    status: latest.rhr <= 53 ? 'optimal' : latest.rhr <= 57 ? 'warning' : 'critical',
    description: 'Your heart rate while at complete rest. Lower values generally indicate stronger aerobic recovery.',
    insight: `Lowest RHR this month: ${Math.min(...last28Days.map(day => day.rhr))} bpm.`,
  },
  {
    id: 'respiratory',
    label: 'Respiratory Rate',
    value: 14.2,
    unit: 'rpm',
    trend: 'stable',
    change: 0.2,
    status: 'optimal',
    description: 'Number of breaths per minute during sleep. Elevated rates can indicate stress or illness.',
    insight: 'Breathing baseline is stable with low nightly variance.',
  },
  {
    id: 'sleepDebt',
    label: 'Sleep Debt (7d)',
    value: sleepDebtHours,
    unit: 'h',
    trend: sleepDebtHours <= 2 ? 'down' : 'up',
    change: toOneDecimal(sleepDebtHours),
    status: sleepDebtHours <= 2 ? 'optimal' : sleepDebtHours <= 4 ? 'warning' : 'critical',
    description: 'The cumulative amount of sleep below your 8-hour target over the trailing 7 days.',
    insight: sleepDebtHours <= 2 ? 'Recovery reserve is healthy.' : 'Prioritize earlier bedtime for 2-3 nights.',
  },
];

export const HEALTH_DATA_CONTEXT = `
Current snapshot:
- Recovery: ${latest.recovery}%
- Strain: ${latest.strain}
- Sleep last night: ${latest.sleepHours}h
- HRV: ${latest.hrv}ms
- Resting HR: ${latest.rhr}bpm
- Respiratory rate: 14.2 rpm

Trends:
- 7-day avg recovery: ${toInteger(average(last7Days.map(day => day.recovery)))}%
- 7-day avg strain: ${toOneDecimal(average(last7Days.map(day => day.strain)))}
- 7-day avg sleep: ${toOneDecimal(average(last7Days.map(day => day.sleepHours)))}h
- 7-day avg HRV: ${toInteger(average(last7Days.map(day => day.hrv)))}ms
- 7-day avg RHR: ${toInteger(average(last7Days.map(day => day.rhr)))}bpm
- Sleep debt (7d): ${sleepDebtHours}h
- Previous week avg strain: ${toOneDecimal(average(previous7Days.map(day => day.strain)))}
`.trim();

export const INITIAL_AI_GREETING =
  `Good morning. Recovery is ${latest.recovery}% and your 7-day sleep average is ` +
  `${toOneDecimal(average(last7Days.map(day => day.sleepHours)))}h. ` +
  `Would you like a training recommendation for today based on this trend?`;
