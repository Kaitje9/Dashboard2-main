type TopBarTab = "today" | "recovery" | "sleep" | "activity";
type TopBarStatus = "Push" | "Maintain" | "Rest";

interface TopBarProps {
  name?: string | null;
  activeTab: TopBarTab;
  onTabChange: (tab: TopBarTab) => void;
  status?: TopBarStatus;
  date?: Date;
}

const TABS: TopBarTab[] = ["today", "recovery", "sleep", "activity"];

const statusStyles: Record<TopBarStatus, { bg: string; color: string; dot: string }> = {
  Push: {
    bg: "var(--accent-sage-bg)",
    color: "var(--accent-sage-700)",
    dot: "var(--accent-sage-500)",
  },
  Maintain: {
    bg: "var(--signal-attention-bg)",
    color: "var(--signal-attention)",
    dot: "var(--signal-attention)",
  },
  Rest: {
    bg: "var(--accent-coral-bg)",
    color: "var(--accent-coral-700)",
    dot: "var(--accent-coral-500)",
  },
};

const toLabel = (tab: TopBarTab) => tab[0].toUpperCase() + tab.slice(1);

export function TopBar({
  name,
  activeTab,
  onTabChange,
  status = "Maintain",
  date = new Date(),
}: TopBarProps) {
  const greeting = name?.trim()
    ? `Here's your day, ${name.trim()}.`
    : "Here's your day.";
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);

  const statusStyle = statusStyles[status];

  return (
    <header
      style={{
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "var(--space-5)",
        paddingRight: "var(--space-5)",
        background: "var(--surface-base)",
        borderBottom: "var(--border-hairline)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20, minWidth: 0 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {greeting}
        </h1>
        <nav
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            borderRadius: 999,
            padding: 3,
            background: "rgba(239,234,227,0.04)",
          }}
        >
          {TABS.map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                style={{
                  border: "none",
                  background: active ? "rgba(239,234,227,0.10)" : "transparent",
                  color: active ? "var(--text-primary)" : "var(--text-tertiary)",
                  borderRadius: 999,
                  padding: "5px 10px",
                  fontSize: 11,
                  lineHeight: 1.1,
                  cursor: "pointer",
                }}
              >
                {toLabel(tab)}
              </button>
            );
          })}
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{formattedDate}</span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            borderRadius: "var(--radius-pill)",
            padding: "3px 9px",
            background: statusStyle.bg,
            color: statusStyle.color,
            fontSize: 11,
            lineHeight: 1.1,
            fontWeight: "var(--weight-medium)",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: 999,
              background: statusStyle.dot,
            }}
          />
          {status}
        </span>
      </div>
    </header>
  );
}
