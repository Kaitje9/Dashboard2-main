import { ReactNode } from "react";
import { EditorialHeader } from "./EditorialHeader";

interface DashboardShellProps {
  children: ReactNode;
  sidebar: ReactNode;
  name?: string | null;
  date?: Date;
}

export function DashboardShell({ children, sidebar, name, date }: DashboardShellProps) {
  return (
    <div
      style={{
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "var(--space-4)",
      }}
    >
      <style>{`
        @media (min-width: 960px) {
          .dashboard-shell-container {
            padding-left: var(--space-6);
            padding-right: var(--space-6);
          }
          .dashboard-shell-grid {
            grid-template-columns: minmax(0, 1fr) var(--sidebar-width);
          }
        }
      `}</style>

      <div className="dashboard-shell-container">
        <EditorialHeader name={name} date={date} />
        <div
          className="dashboard-shell-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-6)",
            alignItems: "start",
          }}
        >
          <main>{children}</main>
          <aside>{sidebar}</aside>
        </div>
      </div>
    </div>
  );
}
