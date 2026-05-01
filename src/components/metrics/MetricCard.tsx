import { Sparkline } from "../charts/Sparkline";

interface MetricCardProps {
  label: string;
  value: number | string;
  unit: string;
  delta?: number;
  deltaSuffix?: string;
  baseline?: string;
  trend?: "up" | "down" | "flat";
  sparklineData?: number[];
  baselineRange?: [number, number];
  sentence?: string;
  unusual?: boolean;
  onClick?: () => void;
}

export function MetricCard({
  label,
  value,
  unit,
  delta,
  deltaSuffix,
  baseline,
  trend = "flat",
  sparklineData,
  baselineRange,
  sentence,
  unusual,
  onClick,
}: MetricCardProps) {
  const deltaColor =
    typeof delta === "number"
      ? delta > 0
        ? "var(--accent-sage-500)"
        : delta < 0
          ? "var(--accent-coral-500)"
          : "var(--text-tertiary)"
      : "var(--text-tertiary)";

  return (
    <article
      onClick={onClick}
      style={{
        background: "var(--surface-raised)",
        borderRadius: "var(--radius-lg)",
        border: "var(--border-hairline)",
        padding: "var(--space-5)",
        transition: "border-color var(--duration-normal) var(--ease-out)",
        cursor: onClick ? "pointer" : "default",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.borderColor = "var(--border-default)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.borderColor = "var(--border-subtle)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-2)" }}>
        <div className="label-caps">{label}</div>
        {unusual && <span className="meta">Unusual</span>}
      </div>
      <div
        style={{
          marginTop: "var(--space-2)",
          display: "flex",
          alignItems: "baseline",
          gap: "var(--space-2)",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)" }}>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "2rem",
              lineHeight: "1.1",
              color: "var(--text-primary)",
              fontVariantNumeric: "tabular-nums lining-nums",
            }}
          >
            {value}
          </span>
          <span style={{ fontSize: "var(--text-sm)", color: "var(--text-tertiary)" }}>{unit}</span>
        </div>
        {typeof delta === "number" && (
          <span
            style={{
              color: deltaColor,
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-medium)",
              fontVariantNumeric: "tabular-nums lining-nums",
            }}
          >
            {delta > 0 ? "+" : ""}
            {delta}
            {deltaSuffix ? ` ${deltaSuffix}` : ""}
          </span>
        )}
      </div>
      <div style={{ marginTop: "var(--space-3)", minHeight: 64 }}>
        {sparklineData && sparklineData.length >= 3 ? (
          <Sparkline data={sparklineData} baselineRange={baselineRange} height={64} />
        ) : (
          <span className="meta">Need more data</span>
        )}
      </div>
      <p
        style={{
          marginTop: "var(--space-3)",
          fontSize: "var(--text-sm)",
          color:
            trend === "up"
              ? "var(--accent-sage-500)"
              : trend === "down"
                ? "var(--accent-coral-500)"
                : "var(--text-secondary)",
        }}
      >
        {sentence ?? "Trend context will appear here."}
      </p>
      <div style={{ marginTop: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
        {baseline}
      </div>
      <div style={{ marginTop: "var(--space-3)" }}>
        <button
          type="button"
          onClick={onClick}
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-secondary)",
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: onClick ? "pointer" : "default",
          }}
        >
          View details
        </button>
      </div>
    </article>
  );
}
