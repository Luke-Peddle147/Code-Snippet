import { useState } from "react";
import type { TagSummary } from "@/types/snippet";
import { searchTags } from "../lib/tags";

export function useTagSearch(available: TagSummary[], exclude: string[] = []) {
  const [query, setQuery] = useState("");
  const { results, total } = searchTags(available, query, { exclude });

  return { query, setQuery, results, total, hiddenCount: total - results.length };
}