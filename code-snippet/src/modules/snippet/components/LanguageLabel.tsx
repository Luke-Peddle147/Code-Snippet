import { cn } from "@/lib/utils";
import { getLanguageColor, getLanguageLabel } from "../lib/languages";

interface LanguageLabelProps {
  language: string;
  className?: string;
}

export function LanguageLabel({ language, className }: LanguageLabelProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        aria-hidden
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: getLanguageColor(language) }}
      />
      {getLanguageLabel(language)}
    </span>
  );
}