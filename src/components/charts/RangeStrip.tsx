interface RangeStripProps {
  value: number;
  min: number;
  max: number;
  normalLow: number;
  normalHigh: number;
  orientation?: "horizontal" | "vertical";
  label?: string;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function RangeStrip({
  value,
  min,
  max,
  normalLow,
  normalHigh,
  orientation = "horizontal",
  label,
}: RangeStripProps) {
  const span = max - min || 1;
  const toPct = (v: number) => clamp01((v - min) / span) * 100;

  const lowPct = toPct(normalLow);
  const highPct = toPct(normalHigh);
  const valuePct = toPct(value);
  const inRange = value >= normalLow && value <= normalHigh;
  const markerColor = inRange
    ? "var(--accent-sage-500)"
    : "var(--accent-coral-500)";

  if (orientation === "vertical") {
    return (
      <div style={{ display: "inline-flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {label && <span className="meta">{label}</span>}
        <div
          style={{
            position: "relative",
            width: 4,
            height: 56,
            borderRadius: 999,
            overflow: "hidden",
            background: "var(--text-tertiary)",
            opacity: 0.35,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: `${lowPct}%`,
              height: `${Math.max(0, highPct - lowPct)}%`,
              background: "var(--accent-sage-bg)",
              opacity: 1,
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "50%",
              bottom: `calc(${valuePct}% - 4px)`,
              width: 8,
              height: 8,
              borderRadius: 999,
              transform: "translate(-50%, 50%)",
              background: markerColor,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      {label && <span className="meta">{label}</span>}
      <div
        style={{
          position: "relative",
          height: 4,
          borderRadius: 999,
          overflow: "hidden",
          background:
            "linear-gradient(to right, var(--text-tertiary) 0%, var(--text-tertiary) 100%)",
          opacity: 0.45,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${lowPct}%`,
            width: `${Math.max(0, highPct - lowPct)}%`,
            background: "var(--accent-sage-bg)",
            opacity: 1,
          }}
        />
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: `${valuePct}%`,
            width: 8,
            height: 8,
            borderRadius: 999,
            transform: "translate(-50%, -50%)",
            background: markerColor,
          }}
        />
      </div>
    </div>
  );
}
