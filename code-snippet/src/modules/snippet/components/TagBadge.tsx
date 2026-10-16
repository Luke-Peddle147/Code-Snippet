import { cn } from "@/lib/utils";

interface TagBadgeProps {
  tag: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TagBadge({ tag, count, active = false, onClick, className }: TagBadgeProps) {
  const classes = cn(
    "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-muted/60 text-foreground/80",
    onClick && !active && "hover:border-ring/60 hover:bg-muted",
    className
  );

  const content = (
    <>
      <span className={active ? "opacity-70" : "text-muted-foreground"}>#</span>
      {tag}
      {count !== undefined && (
        <span className={active ? "opacity-70" : "text-muted-foreground"}>{count}</span>
      )}
    </>
  );

  if (!onClick) return <span className={classes}>{content}</span>;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(classes, "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50")}
    >
      {content}
    </button>
  );
}