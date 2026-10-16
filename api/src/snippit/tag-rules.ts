export const MAX_TAGS = 10;
export const MAX_TAG_LENGTH = 30;
export const TAG_PATTERN = /^[a-z0-9][a-z0-9+#.-]*$/;

export const normalizeTag = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, '-');

export const normalizeTags = (value: unknown): unknown => {
  if (!Array.isArray(value)) return value;
  const tags = value
    .map((tag) => (typeof tag === 'string' ? normalizeTag(tag) : tag))
    .filter((tag) => tag !== '');
  return [...new Set(tags)];
};