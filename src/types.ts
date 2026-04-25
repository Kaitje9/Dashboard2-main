/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HealthMetric {
  id: string;
  label: string;
  value: number | string;
  unit: string;
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
