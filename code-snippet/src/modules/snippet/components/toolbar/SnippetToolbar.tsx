"use client";

import { Plus, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { useSnippetToolbar, type UseSnippetToolbarOptions } from "../../hooks/useSnippetToolbar";
import { LANGUAGES } from "../../lib/languages";
import type { LanguageFilter } from "@/types/snippet";
import { LanguageLabel } from "../LanguageLabel";

export function SnippetToolbar(props: UseSnippetToolbarOptions) {
  const { filters, onCreate, creating } = props;
  const { searchRef, setSearch, setLanguage, setFavoritesOnly, handleSearchKeyDown } =
    useSnippetToolbar(props);

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-xs sm:flex-row sm:items-center">
      <div className="relative w-full sm:max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchRef}
          type="search"
          value={filters.search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search titles, descriptions and code"
          aria-label="Search snippets"
          className="border-transparent bg-muted pr-10 pl-9 shadow-none focus-visible:bg-card"
        />
        {!filters.search && (
          <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded border bg-card px-1.5 font-mono text-[11px] text-muted-foreground">
            /
          </kbd>
        )}
      </div>

      <Select value={filters.language} onValueChange={(value) => setLanguage(value as LanguageFilter)}>
        <SelectTrigger className="w-full sm:w-44" aria-label="Filter by language">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All languages</SelectItem>
          {LANGUAGES.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <LanguageLabel language={option.value} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Toggle
        variant="outline"
        pressed={filters.favoritesOnly}
        onPressedChange={setFavoritesOnly}
        aria-label="Show favorites only"
        className="data-[state=on]:border-amber-300 data-[state=on]:bg-amber-50 data-[state=on]:text-amber-900"
      >
        <Star className={filters.favoritesOnly ? "fill-amber-400 text-amber-500" : undefined} />
        Favorites
      </Toggle>

      <Button onClick={onCreate} disabled={creating} className="sm:ml-auto">
        <Plus />
        New snippet
        <kbd className="ml-1 hidden rounded bg-primary-foreground/15 px-1.5 font-mono text-[11px] sm:inline">
          N
        </kbd>
      </Button>
    </div>
  );
}