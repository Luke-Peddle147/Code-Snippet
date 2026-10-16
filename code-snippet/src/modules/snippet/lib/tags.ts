import type { TagSummary } from "@/types/snippet";

export const MAX_TAGS = 10;
export const MAX_TAG_LENGTH = 30;
export const MAX_TAG_RESULTS = 50;

const TAG_PATTERN = /^[a-z0-9][a-z0-9+#.-]*$/;

export const normalizeTag = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, "-");

export function getTagError(tag: string, current: string[]): string | null {
  if (current.length >= MAX_TAGS) return `A snippet can have at most ${MAX_TAGS} tags.`;
  if (tag.length > MAX_TAG_LENGTH) return `Tags must be ${MAX_TAG_LENGTH} characters or fewer.`;
  if (!TAG_PATTERN.test(tag)) {
    return "Use letters, numbers and + # . - only, starting with a letter or number.";
  }
  return null;
}

export const toggleTag = (tags: string[], tag: string): string[] =>
  tags.includes(tag) ? tags.filter((current) => current !== tag) : [...tags, tag];

interface SearchTagsOptions {
  exclude?: string[];
  limit?: number;
}

export function searchTags(
  tags: TagSummary[],
  query: string,
  { exclude = [], limit = MAX_TAG_RESULTS }: SearchTagsOptions = {}
): { results: TagSummary[]; total: number } {
  const term = normalizeTag(query);
  const startsWithTerm = (tag: TagSummary) => (term !== "" && tag.name.startsWith(term) ? 0 : 1);

  const matches = tags
    .filter((tag) => !exclude.includes(tag.name) && tag.name.includes(term))
    .sort(
      (a, b) =>
        startsWithTerm(a) - startsWithTerm(b) || b.count - a.count || a.name.localeCompare(b.name)
    );

  return { results: matches.slice(0, limit), total: matches.length };
}