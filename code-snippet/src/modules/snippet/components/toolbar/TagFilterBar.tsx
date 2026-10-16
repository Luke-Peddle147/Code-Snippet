"use client";

import { X } from "lucide-react";

interface TagFilterBarProps {
  selected: string[];
  onRemove: (tag: string) => void;
  onClear: () => void;
}

export function TagFilterBar({ selected, onRemove, onClear }: TagFilterBarProps) {
  if (selected.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-xs text-muted-foreground">Filtered by</span>
      {selected.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onRemove(tag)}
          aria-label={`Stop filtering by ${tag}`}
          className="inline-flex items-center gap-1 rounded-md border border-primary bg-primary py-0.5 pr-1 pl-2 text-xs font-medium text-primary-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <span className="opacity-70">#</span>
          {tag}
          <X className="size-3 opacity-70" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="ml-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Clear
      </button>
    </div>
  );
}