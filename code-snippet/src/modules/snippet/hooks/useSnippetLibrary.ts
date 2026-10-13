import { useState } from "react";
import type { PanelMode, SnippetFilters, SnippetInput } from "@/types/snippet";
import { DEFAULT_FILTERS, filterSnippets, hasActiveFilters } from "../lib/filterSnippets";
import {
  useCreateSnippet,
  useDeleteSnippet,
  useSnippets,
  useToggleFavorite,
  useUpdateSnippet,
} from "./useSnippets";

export function useSnippetLibrary() {
  const { snippets, loading, error, retry } = useSnippets();
  const createSnippet = useCreateSnippet();
  const updateSnippet = useUpdateSnippet();
  const deleteSnippet = useDeleteSnippet();
  const favorites = useToggleFavorite();

  const [filters, setFilters] = useState<SnippetFilters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mode, setMode] = useState<PanelMode>("view");

  const visibleSnippets = filterSnippets(snippets, filters);
  const selected = snippets.find((snippet) => snippet.id === selectedId) ?? null;

  const select = (snippetId: number) => {
    deleteSnippet.resetError();
    setSelectedId(snippetId);
    setMode("view");
  };

  const startCreate = () => {
    createSnippet.resetError();
    setMode("create");
  };

  const startEdit = () => {
    updateSnippet.resetError();
    setMode("edit");
  };

  const cancelForm = () => setMode("view");

  const create = async (input: SnippetInput) => {
    const created = await createSnippet.save(input);
    if (!created) return;
    setSelectedId(created.id);
    setMode("view");
  };

  const update = async (input: SnippetInput) => {
    if (!selected) return;
    const updated = await updateSnippet.save({ snippetId: selected.id, ...input });
    if (updated) setMode("view");
  };

  const remove = async () => {
    if (!selected) return;
    const deleted = await deleteSnippet.remove(selected.id);
    if (deleted) setSelectedId(null);
  };

  return {
    list: {
      snippets: visibleSnippets,
      totalCount: snippets.length,
      loading,
      error,
      retry,
    },
    filters: {
      value: filters,
      set: setFilters,
      clear: () => setFilters(DEFAULT_FILTERS),
      active: hasActiveFilters(filters),
    },
    selection: { selectedId, selected, mode },
    favorites,
    createState: { submitting: createSnippet.submitting, error: createSnippet.error },
    updateState: { submitting: updateSnippet.submitting, error: updateSnippet.error },
    deleteState: { deleting: deleteSnippet.deleting, error: deleteSnippet.error },
    actions: { select, startCreate, startEdit, cancelForm, create, update, remove },
  };
}