import { Sparkline } from "../charts/Sparkline";

interface TrendCardProps {
  label: string;
  currentValue: string;
  sparklineData: number[];
  baselineRange?: [number, number];
  sentence: string;
}

export function TrendCard({
  label,
  currentValue,
  sparklineData,
  baselineRange,
  sentence,
}: TrendCardProps) {
  return (
    <article
      style={{
        background: "var(--surface-raised)",
        border: "var(--border-hairline)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)" }}>
        <span className="label-caps">{label}</span>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem" }}>{currentValue}</span>
      </div>
      <div style={{ marginTop: "var(--space-3)" }}>
        <Sparkline data={sparklineData} baselineRange={baselineRange} height={68} />
      </div>
      <p
        style={{
          marginTop: "var(--space-3)",
          fontSize: "var(--text-sm)",
          color: "var(--text-secondary)",
          lineHeight: 1.4,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {sentence}
      </p>
    </article>
  );
}
