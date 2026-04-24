/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DailyData, HealthMetric } from './types';

export const MOCK_METRICS: HealthMetric[] = [
  {
    id: 'recovery',
    label: 'Recovery',
    value: 84,
    unit: '%',
    trend: 'up',
    change: 12,
    status: 'optimal',
    description: 'A measure of your body’s readiness to take on strain, calculated from HRV, RHR, and Sleep.',
    insight: 'Your parasympathetic nervous system is dominant today.',
  },
  {
    id: 'strain',
    label: 'Daily Strain',
    value: 12.4,
    unit: '',
    trend: 'down',
    change: 2.1,
    status: 'optimal',
    description: 'Total cardiovascular load accumulated today, based on heart rate zones and duration.',
    insight: 'You are 85% of the way to your recommended daily load.',
  },
  {
    id: 'hrv',
    label: 'HRV',
    value: 68,
    unit: 'ms',
    trend: 'stable',
    change: 3,
    status: 'optimal',
    description: 'Heart Rate Variability is the variation in time between each heartbeat. Key indicator of nervous system health.',
    insight: 'Within 5% of your baseline average.',
  },
  {
    id: 'sleep',
    label: 'Sleep Performance',
    value: 8.2,
    unit: 'h',
    trend: 'up',
    change: 0.5,
    status: 'optimal',
    description: 'The amount of time you spent in bed vs. time asleep, weighted by sleep cycles.',
    insight: 'Deep sleep was 25% higher than your trailing average.',
  },
  {
    id: 'rhr',
    label: 'Resting HR',
    value: 52,
    unit: 'bpm',
    trend: 'down',
    change: 4,
    status: 'optimal',
    description: 'Your heart rate while at complete rest. Lower generally indicates better fitness.',
    insight: 'Trend is downward, indicating improved aerobic base.',
  },
  {
    id: 'respiratory',
    label: 'Respiratory Rate',
    value: 14.5,
    unit: 'rpm',
    trend: 'stable',
    change: 0.1,
    status: 'optimal',
    description: 'Number of breaths per minute during sleep. Elevated rates can indicate illness.',
    insight: 'Stable baseline indicates no respiratory distress.',
  }
];

export const MOCK_DAILY_HISTORY: DailyData[] = [
  { date: 'Mon', strain: 14.2, recovery: 78, sleepHours: 7.5, hrv: 62, rhr: 54 },
  { date: 'Tue', strain: 16.5, recovery: 45, sleepHours: 6.2, hrv: 55, rhr: 58 },
  { date: 'Wed', strain: 11.2, recovery: 82, sleepHours: 8.4, hrv: 70, rhr: 51 },
  { date: 'Thu', strain: 18.9, recovery: 32, sleepHours: 5.8, hrv: 48, rhr: 60 },
  { date: 'Fri', strain: 9.4, recovery: 91, sleepHours: 9.1, hrv: 75, rhr: 49 },
  { date: 'Sat', strain: 15.1, recovery: 68, sleepHours: 7.2, hrv: 65, rhr: 53 },
  { date: 'Sun', strain: 12.4, recovery: 84, sleepHours: 8.2, hrv: 68, rhr: 52 },
];
