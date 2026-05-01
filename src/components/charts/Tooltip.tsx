interface TooltipProps {
  x: number;
  y: number;
  content: string;
  visible: boolean;
  containerWidth: number;
  containerHeight: number;
}

export function Tooltip({
  x,
  y,
  content,
  visible,
  containerWidth,
  containerHeight,
}: TooltipProps) {
  if (!visible) return null;

  const tooltipWidth = 170;
  const tooltipHeight = 34;
  const clampedX = Math.max(8, Math.min(containerWidth - tooltipWidth - 8, x + 8));
  const clampedY = Math.max(8, Math.min(containerHeight - tooltipHeight - 8, y - tooltipHeight - 8));

  return (
    <div
      style={{
        position: "absolute",
        left: clampedX,
        top: clampedY,
        maxWidth: tooltipWidth,
        background: "var(--surface-raised)",
        border: "var(--border-hairline)",
        borderRadius: "var(--radius-md)",
        padding: "6px 10px",
        fontSize: 11,
        lineHeight: 1.25,
        pointerEvents: "none",
        color: "var(--text-primary)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {content}
    </div>
  );
}
