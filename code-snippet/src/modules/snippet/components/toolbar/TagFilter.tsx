"use client";

import { Check, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { TagSummary } from "@/types/snippet";
import { useTagSearch } from "../../hooks/useTagSearch";

interface TagFilterProps {
  tags: TagSummary[];
  selected: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
}

export function TagFilter({ tags, selected, onToggle, onClear }: TagFilterProps) {
  const search = useTagSearch(tags);

  return (
    <Popover onOpenChange={(open) => !open && search.setQuery("")}>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={tags.length === 0} aria-label="Filter by tags">
          <Tags />
          Tags
          {selected.length > 0 && (
            <span className="rounded bg-primary px-1.5 text-xs text-primary-foreground">
              {selected.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search tags…"
            value={search.query}
            onValueChange={search.setQuery}
          />
          <CommandList>
            <CommandEmpty>No matching tags.</CommandEmpty>
            <CommandGroup>
              {search.results.map((tag) => {
                const active = selected.includes(tag.name);
                return (
                  <CommandItem key={tag.name} value={tag.name} onSelect={() => onToggle(tag.name)}>
                    <Check className={cn("size-4", active ? "opacity-100" : "opacity-0")} />
                    <span className="text-muted-foreground">#</span>
                    {tag.name}
                    <span className="ml-auto text-xs text-muted-foreground">{tag.count}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {search.hiddenCount > 0 && (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                {search.hiddenCount} more. Keep typing to narrow down.
              </p>
            )}
          </CommandList>
          {selected.length > 0 && (
            <div className="border-t p-1">
              <Button variant="ghost" size="sm" className="w-full" onClick={onClear}>
                Clear selected tags
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}