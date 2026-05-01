interface EditorialHeaderProps {
  name?: string | null;
  date?: Date;
  summaryLine?: string;
}

export function EditorialHeader({
  name,
  date = new Date(),
  summaryLine = "HRV trends slightly above your baseline. Three highlights below.",
}: EditorialHeaderProps) {
  const safeName = name?.trim();
  const greeting = safeName ? `Here's your day, ${safeName}.` : "Here's your day.";
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  return (
    <header style={{ marginBottom: "var(--space-5)" }}>
      <h1>{greeting}</h1>
      <p className="meta">{formattedDate}</p>
      <p className="lead" style={{ maxWidth: "60ch", marginTop: "var(--space-2)" }}>
        {summaryLine}
      </p>
    </header>
  );
}
