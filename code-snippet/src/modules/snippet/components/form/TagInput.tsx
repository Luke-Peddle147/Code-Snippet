"use client";

import { Plus, X } from "lucide-react";
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
import type { TagSummary } from "@/types/snippet";
import { useTagPicker } from "../../hooks/useTagPicker";
import { MAX_TAGS } from "../../lib/tags";

interface TagInputProps {
  id: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  available: TagSummary[];
}

export function TagInput({ id, tags, onChange, available }: TagInputProps) {
  const picker = useTagPicker({ tags, onChange, available });

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md border bg-muted/60 py-0.5 pr-1 pl-2 text-xs font-medium"
          >
            <span className="text-muted-foreground">#</span>
            {tag}
            <button
              type="button"
              onClick={() => picker.remove(tag)}
              aria-label={`Remove tag ${tag}`}
              className="rounded-sm p-0.5 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}

        <Popover open={picker.open} onOpenChange={picker.setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id}
              type="button"
              variant="outline"
              size="sm"
              disabled={picker.full}
              aria-describedby={`${id}-hint`}
              className="h-7 border-dashed text-xs"
            >
              <Plus className="size-3.5" />
              {tags.length === 0 ? "Add tags" : "Add tag"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search or create a tag…"
                value={picker.query}
                onValueChange={picker.setQuery}
              />
              <CommandList>
                <CommandEmpty>
                  {picker.candidateError ??
                    (picker.query ? "No matching tags." : "No tags yet. Type to create one.")}
                </CommandEmpty>

                {picker.results.length > 0 && (
                  <CommandGroup heading={picker.query ? "Matching tags" : "Popular tags"}>
                    {picker.results.map((tag) => (
                      <CommandItem
                        key={tag.name}
                        value={tag.name}
                        onSelect={() => picker.add(tag.name)}
                      >
                        <span className="text-muted-foreground">#</span>
                        {tag.name}
                        <span className="ml-auto text-xs text-muted-foreground">{tag.count}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {picker.canCreate && (
                  <CommandGroup>
                    <CommandItem
                      value={`__create__${picker.candidate}`}
                      onSelect={() => picker.add(picker.candidate)}
                    >
                      <Plus className="size-4" />
                      Create “{picker.candidate}”
                    </CommandItem>
                  </CommandGroup>
                )}

                {picker.hiddenCount > 0 && (
                  <p className="px-3 py-2 text-xs text-muted-foreground">
                    {picker.hiddenCount} more. Keep typing to narrow down.
                  </p>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {picker.error ? (
        <p id={`${id}-hint`} role="alert" className="text-xs text-destructive">
          {picker.error}
        </p>
      ) : (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          Search your existing tags or create new ones. Up to {MAX_TAGS}.
        </p>
      )}
    </div>
  );
}