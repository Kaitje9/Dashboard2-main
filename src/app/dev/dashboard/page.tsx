import { DashboardShell } from "../../../components/layout/DashboardShell";

export default function DevDashboardPage() {
  return (
    <DashboardShell sidebar={<div>Sidebar placeholder</div>}>
      <section>
        <h2>Recovery</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </section>
      <section>
        <h2>Sleep</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </section>
      <section>
        <h2>Activity</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </section>
    </DashboardShell>
  );
}
