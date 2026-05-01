interface MetricTileProps {
  label: string;
  value: number | string;
  unit: string;
  delta?: number;
  deltaUnit?: string;
  status: "in-range" | "above" | "below" | "neutral";
  miniVisual?: React.ReactNode;
  compact?: boolean;
}

const statusColor: Record<MetricTileProps["status"], string> = {
  "in-range": "var(--accent-sage-500)",
  above: "var(--accent-coral-500)",
  below: "var(--accent-coral-500)",
  neutral: "var(--text-tertiary)",
};

export function MetricTile({
  label,
  value,
  unit,
  delta,
  deltaUnit,
  status,
  miniVisual,
  compact = false,
}: MetricTileProps) {
  const color = statusColor[status];
  return (
    <article
      style={{
        minHeight: 100,
        padding: compact ? "12px 14px" : "var(--space-4)",
        background: "var(--surface-raised)",
        border: "var(--border-hairline)",
        borderRadius: "var(--radius-lg)",
        borderLeft: `2px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2)" }}>
        <span className="label-caps">{label}</span>
        {typeof delta === "number" && (
          <span style={{ fontSize: 11, color, fontVariantNumeric: "tabular-nums lining-nums" }}>
            {delta > 0 ? "+" : ""}
            {delta}
            {deltaUnit ? ` ${deltaUnit}` : ""}
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)" }}>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.75rem",
            fontVariantNumeric: "tabular-nums lining-nums",
          }}
        >
          {value}
        </span>
        <span style={{ fontSize: "var(--text-sm)", color: "var(--text-tertiary)" }}>{unit}</span>
      </div>
      <div>{miniVisual}</div>
    </article>
  );
}
