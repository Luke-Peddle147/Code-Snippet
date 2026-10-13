import type { KeyboardEvent } from "react";
import type { LanguageFilter, SnippetFilters } from "@/types/snippet";

export interface UseSnippetToolbarOptions {
  filters: SnippetFilters;
  onFiltersChange: (filters: SnippetFilters) => void;
}

export function useSnippetToolbar({ filters, onFiltersChange }: UseSnippetToolbarOptions) {
  const update = (changes: Partial<SnippetFilters>) => onFiltersChange({ ...filters, ...changes });

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Escape") return;
    update({ search: "" });
    event.currentTarget.blur();
  };

  return {
    setSearch: (search: string) => update({ search }),
    setLanguage: (language: LanguageFilter) => update({ language }),
    setFavoritesOnly: (favoritesOnly: boolean) => update({ favoritesOnly }),
    handleSearchKeyDown,
  };
}