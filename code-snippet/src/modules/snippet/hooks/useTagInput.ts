import { useState, type KeyboardEvent } from "react";
import { getTagError, normalizeTag } from "../lib/tags";

interface UseTagInputOptions {
  tags: string[];
  onChange: (tags: string[]) => void;
  available: string[];
}

const MAX_SUGGESTIONS = 6;
const SEPARATORS = new Set(["Enter", ","]);

export function useTagInput({ tags, onChange, available }: UseTagInputOptions) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const query = normalizeTag(draft);
  const suggestions = available
    .filter((tag) => !tags.includes(tag) && (query === "" || tag.includes(query)))
    .slice(0, MAX_SUGGESTIONS);

  const addTag = (raw: string) => {
    const tag = normalizeTag(raw);
    if (tag === "") return;
    if (tags.includes(tag)) {
      setDraft("");
      return;
    }

    const tagError = getTagError(tag, tags);
    if (tagError) {
      setError(tagError);
      return;
    }

    onChange([...tags, tag]);
    setDraft("");
    setError(null);
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((current) => current !== tag));
    setError(null);
  };

  const updateDraft = (value: string) => {
    setDraft(value);
    setError(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (SEPARATORS.has(event.key)) {
      event.preventDefault();
      addTag(draft);
      return;
    }

    if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
      return;
    }

    if (event.key === "Escape" && draft !== "") {
      event.stopPropagation();
      updateDraft("");
    }
  };

  return {
    draft,
    error,
    suggestions,
    updateDraft,
    addTag,
    removeTag,
    handleKeyDown,
    commitDraft: () => addTag(draft),
  };
}