import type { Snippet, SnippetFilters } from "@/types/snippet";

export const DEFAULT_FILTERS: SnippetFilters = {
  search: "",
  language: "all",
  favoritesOnly: false,
};

export const hasActiveFilters = (filters: SnippetFilters): boolean =>
  filters.search.trim() !== "" || filters.language !== "all" || filters.favoritesOnly;

export function filterSnippets(snippets: Snippet[], filters: SnippetFilters): Snippet[] {
  const term = filters.search.trim().toLowerCase();

  return snippets.filter((snippet) => {
    if (filters.favoritesOnly && !snippet.isFavorite) return false;
    if (filters.language !== "all" && snippet.language !== filters.language) return false;
    if (!term) return true;

    return [snippet.title, snippet.description ?? "", snippet.code].some((field) =>
      field.toLowerCase().includes(term)
    );
  });
}