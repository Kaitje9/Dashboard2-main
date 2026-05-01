import React from "react";

interface SparklineProps {
  data: number[];
  baseline?: number;
  baselineRange?: [number, number];
  color?: string;
  height?: number;
}

export function Sparkline({
  data,
  baseline,
  baselineRange,
  color,
  height = 36,
}: SparklineProps) {
  if (!data.length) {
    return <div style={{ height }} />;
  }

  const minData = Math.min(...data);
  const maxData = Math.max(...data);
  const min = Math.min(minData, baseline ?? minData, baselineRange?.[0] ?? minData);
  const max = Math.max(maxData, baseline ?? maxData, baselineRange?.[1] ?? maxData);
  const range = max - min || 1;

  const defaultColor =
    data[data.length - 1] < data[0]
      ? "var(--accent-coral-500)"
      : "var(--accent-sage-500)";
  const strokeColor = color ?? defaultColor;

  const x = (index: number) =>
    data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
  const y = (value: number) => 100 - ((value - min) / range) * 100;

  const points = data.map((value, index) => `${x(index)},${y(value)}`).join(" ");
  const lastX = x(data.length - 1);
  const lastY = y(data[data.length - 1]);

  const band =
    baselineRange &&
    (() => {
      const top = y(baselineRange[1]);
      const bottom = y(baselineRange[0]);
      const bandY = Math.min(top, bottom);
      const bandHeight = Math.max(2, Math.abs(bottom - top));
      return { y: bandY, height: bandHeight };
    })();

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ width: "100%", height }}
      aria-hidden
    >
      {band && (
        <rect
          x="0"
          y={band.y}
          width="100"
          height={band.height}
          fill="var(--chart-band)"
        />
      )}
      {typeof baseline === "number" && (
        <line
          x1="0"
          y1={y(baseline)}
          x2="100"
          y2={y(baseline)}
          stroke="var(--chart-baseline)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
      )}
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <circle cx={lastX} cy={lastY} r="2" fill={strokeColor} />
    </svg>
  );
}
