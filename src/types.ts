/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HealthMetric {
  id: string;
  category: 'recovery' | 'sleep' | 'activity' | 'context';
  label: string;
  value: number | string;
  unit: string;
  chartStyle: 'line' | 'bars' | 'sleepStages' | 'range' | 'radial' | 'steps';
  sparkline?: number[];
  baselineValue?: number;
  baselineRange?: [number, number];
  unusual?: boolean;
  sentence?: string;
  segments?: { label: string; value: number; color: string }[];
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'optimal' | 'warning' | 'critical';
  description: string;
  insight: string;
  composition?: string[];
  goalImpact?: string;
  trendNote?: string;
}

export interface DailyData {
  date: string;
  strain: number;
  recovery: number;
  sleepHours: number;
  hrv: number;
  rhr: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ParticipantProfile {
  firstName: string;
  ageRange: string;
  gender: string;
  primarySports: string;
  weeklySleepQuality: string;
  activityLevel: string;
  recoveryFeeling: string;
  currentGoal: string;
}
