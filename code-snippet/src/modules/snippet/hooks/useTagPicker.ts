import { useState } from "react";
import type { TagSummary } from "@/types/snippet";
import { getTagError, MAX_TAGS, normalizeTag } from "../lib/tags";
import { useTagSearch } from "./useTagSearch";

interface UseTagPickerOptions {
  tags: string[];
  onChange: (tags: string[]) => void;
  available: TagSummary[];
}

export function useTagPicker({ tags, onChange, available }: UseTagPickerOptions) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const search = useTagSearch(available, tags);

  const candidate = normalizeTag(search.query);
  const alreadyExists =
    tags.includes(candidate) || available.some((tag) => tag.name === candidate);
  const candidateError = candidate === "" || alreadyExists ? null : getTagError(candidate, tags);
  const canCreate = candidate !== "" && !alreadyExists && candidateError === null;

  const add = (name: string) => {
    const tagError = getTagError(name, tags);
    if (tagError) {
      setError(tagError);
      return;
    }
    onChange([...tags, name]);
    search.setQuery("");
    setError(null);
  };

  const remove = (name: string) => {
    onChange(tags.filter((tag) => tag !== name));
    setError(null);
  };

  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (!next) search.setQuery("");
  };

  return {
    open,
    setOpen: changeOpen,
    query: search.query,
    setQuery: search.setQuery,
    results: search.results,
    hiddenCount: search.hiddenCount,
    candidate,
    canCreate,
    candidateError,
    full: tags.length >= MAX_TAGS,
    error,
    add,
    remove,
  };
}