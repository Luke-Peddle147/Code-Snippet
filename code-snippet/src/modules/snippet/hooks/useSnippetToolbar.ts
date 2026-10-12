import { useRef, type KeyboardEvent } from "react";
import { useHotkey } from "@/hooks/useHotkey";
import type { LanguageFilter, SnippetFilters } from "@/types/snippet";

export interface UseSnippetToolbarOptions {
  filters: SnippetFilters;
  onFiltersChange: (filters: SnippetFilters) => void;
  onCreate: () => void;
  creating: boolean;
}

export function useSnippetToolbar({
  filters,
  onFiltersChange,
  onCreate,
  creating,
}: UseSnippetToolbarOptions) {
  const searchRef = useRef<HTMLInputElement>(null);

  const update = (changes: Partial<SnippetFilters>) => onFiltersChange({ ...filters, ...changes });

  useHotkey("/", () => searchRef.current?.focus());
  useHotkey("n", () => {
    if (!creating) onCreate();
  });

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Escape") return;
    update({ search: "" });
    event.currentTarget.blur();
  };

  return {
    searchRef,
    setSearch: (search: string) => update({ search }),
    setLanguage: (language: LanguageFilter) => update({ language }),
    setFavoritesOnly: (favoritesOnly: boolean) => update({ favoritesOnly }),
    handleSearchKeyDown,
  };
}