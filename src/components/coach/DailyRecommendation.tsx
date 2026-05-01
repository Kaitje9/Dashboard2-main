type RecommendationStatus = "Push" | "Maintain" | "Rest";

interface DailyRecommendationProps {
  status?: RecommendationStatus;
  reason?: string;
}

const statusStyles: Record<RecommendationStatus, { bg: string; color: string }> = {
  Push: { bg: "var(--accent-sage-bg)", color: "var(--accent-sage-700)" },
  Maintain: { bg: "var(--signal-attention-bg)", color: "var(--signal-attention)" },
  Rest: { bg: "var(--accent-coral-bg)", color: "var(--accent-coral-700)" },
};

export function DailyRecommendation({
  status = "Maintain",
  reason = "HRV is solid but sleep was short. Keep intensity moderate today.",
}: DailyRecommendationProps) {
  const style = statusStyles[status];
  return (
    <section
      style={{
        padding: "var(--space-4)",
        borderBottom: "var(--border-hairline)",
        marginBottom: "var(--space-3)",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--radius-pill)",
          padding: "0 var(--space-3)",
          height: "1.75rem",
          background: style.bg,
          color: style.color,
          fontSize: "var(--text-sm)",
          fontWeight: "var(--weight-medium)",
        }}
      >
        {status}
      </span>
      <p className="lead" style={{ marginTop: "var(--space-3)" }}>
        {reason}
      </p>
    </section>
  );
}
