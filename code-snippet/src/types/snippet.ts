import type { SnippetLanguage } from "@/modules/snippet/lib/languages";

export interface Snippet {
  id: number;
  title: string;
  description: string | null;
  language: string;
  code: string;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SnippetInput {
  title: string;
  description: string | null;
  language: SnippetLanguage;
  code: string;
  tags: string[];
  isFavorite?: boolean;
}

export interface SnippetFormValues {
  title: string;
  description: string;
  language: SnippetLanguage;
  code: string;
  tags: string[];
}

export interface TagSummary {
  name: string;
  count: number;
}

export type LanguageFilter = SnippetLanguage | "all";

export interface SnippetFilters {
  search: string;
  language: LanguageFilter;
  favoritesOnly: boolean;
  tags: string[];
}

export type PanelMode = "view" | "create" | "edit";