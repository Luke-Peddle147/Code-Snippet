import type { SnippetLanguage } from "@/modules/snippet/lib/languages";

export interface Snippet {
  id: number;
  title: string;
  description: string | null;
  language: string;
  code: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SnippetInput {
  title: string;
  description: string | null;
  language: SnippetLanguage;
  code: string;
  isFavorite?: boolean;
}

export interface SnippetFormValues {
  title: string;
  description: string;
  language: SnippetLanguage;
  code: string;
}

export type LanguageFilter = SnippetLanguage | "all";

export interface SnippetFilters {
  search: string;
  language: LanguageFilter;
  favoritesOnly: boolean;
}

export type PanelMode = "view" | "create" | "edit";