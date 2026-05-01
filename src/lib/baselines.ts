type NumericMetricRow = {
  skin_temp_delta_c: number;
  [key: string]: number | string;
};

const PLAUSIBLE_RANGES: Record<string, [number, number]> = {
  hrv_morning_ms: [35, 65],
  rhr_morning_bpm: [50, 70],
  sleep_total_min: [300, 600],
  steps: [0, 30000],
  vo2max: [35, 55],
  spo2_mean_pct: [93, 100],
  breathing_rate_rpm: [12, 20],
};

const median = (values: number[]) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export function isHealthyBaselineDay(row: NumericMetricRow): boolean {
  if (row.skin_temp_delta_c > 0.4) return false;

  for (const [metric, [min, max]] of Object.entries(PLAUSIBLE_RANGES)) {
    const value = row[metric];
    if (!isFiniteNumber(value)) return false;
    if (value < min || value > max) return false;
  }

  return true;
}

function healthyWindow<T extends NumericMetricRow>(rows: T[], days: number) {
  return rows.slice(-days).filter((row) => isHealthyBaselineDay(row));
}

export function rollingBaseline<T extends NumericMetricRow>(
  rows: T[],
  metric: keyof T,
  days = 14,
): number {
  const window = healthyWindow(rows, days)
    .map((row) => row[metric])
    .filter(isFiniteNumber);

  return median(window);
}

export function baselineRange<T extends NumericMetricRow>(
  rows: T[],
  metric: keyof T,
  days = 14,
): [number, number] {
  const window = healthyWindow(rows, days)
    .map((row) => row[metric])
    .filter(isFiniteNumber);

  if (!window.length) return [0, 0];

  const med = median(window);
  const absDeviations = window.map((value) => Math.abs(value - med));
  const mad = median(absDeviations);

  return [med - mad, med + mad];
}
