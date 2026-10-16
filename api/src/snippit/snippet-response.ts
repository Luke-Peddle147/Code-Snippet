import type { Snippet, Tag } from '../generated/prisma/client.js';

export type SnippetWithTags = Snippet & { tags: Tag[] };

export type SnippetResponse = Snippet & { tags: string[] };

export const SNIPPET_INCLUDE = {
  tags: { orderBy: { name: 'asc' } },
} as const;

export const toSnippetResponse = ({ tags, ...snippet }: SnippetWithTags): SnippetResponse => ({
  ...snippet,
  tags: tags.map((tag) => tag.name),
});