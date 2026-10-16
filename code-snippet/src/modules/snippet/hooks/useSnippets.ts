import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Result } from "@/types/results";
import type { Snippet, TagSummary } from "@/types/snippet";
import { createSnippet, type CreateSnippetPayload } from "../mutations/CreateSnippet";
import { deleteSnippet } from "../mutations/deleteSnippet";
import { updateSnippet, type UpdateSnippetPayload } from "../mutations/updateSnippet";
import { QUERY_KEY as SNIPPETS_KEY, getSnippetsOptions } from "../queries/getSnippets";
import { QUERY_KEY as TAGS_KEY, getTagsOptions } from "../queries/getTags";

function fromResult<T>(result: Result<T> | undefined) {
  if (!result) return { data: undefined, error: null };
  if (result.error) return { data: undefined, error: result.error.message };
  return { data: result.data, error: null };
}

function useInvalidateSnippets() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: [SNIPPETS_KEY] }),
      queryClient.invalidateQueries({ queryKey: [TAGS_KEY] }),
    ]);
}

function useSaveMutation<P, T>(mutationFn: (payload: P) => Promise<Result<T>>) {
  const invalidate = useInvalidateSnippets();

  const mutation = useMutation({
    mutationFn,
    onSuccess: (result) => {
      if (!result.error) return invalidate();
    },
  });

  return {
    save: async (payload: P) => {
      const result = await mutation.mutateAsync(payload);
      return result.error ? null : result.data;
    },
    submitting: mutation.isPending,
    error: fromResult(mutation.data).error,
    resetError: mutation.reset,
  };
}

export function useSnippets() {
  const query = useQuery(getSnippetsOptions());
  const { data, error } = fromResult(query.data);

  return {
    snippets: data ?? [],
    loading: query.isPending,
    error,
    retry: () => void query.refetch(),
  };
}

const NO_TAGS: TagSummary[] = [];

export function useTags() {
  const query = useQuery(getTagsOptions());
  return fromResult(query.data).data ?? NO_TAGS;
}

export function useCreateSnippet() {
  return useSaveMutation((payload: CreateSnippetPayload) => createSnippet(payload));
}

export function useUpdateSnippet() {
  return useSaveMutation((payload: UpdateSnippetPayload) => updateSnippet(payload));
}

export function useDeleteSnippet() {
  const invalidate = useInvalidateSnippets();

  const mutation = useMutation({
    mutationFn: (snippetId: number) => deleteSnippet(snippetId),
    onSuccess: (result) => {
      if (!result.error) return invalidate();
    },
  });

  return {
    remove: async (snippetId: number) => {
      const result = await mutation.mutateAsync(snippetId);
      return !result.error;
    },
    deleting: mutation.isPending,
    error: fromResult(mutation.data).error,
    resetError: mutation.reset,
  };
}

export function useToggleFavorite() {
  const invalidate = useInvalidateSnippets();

  const mutation = useMutation({
    mutationFn: (payload: { snippetId: number; isFavorite: boolean }) => updateSnippet(payload),
    onSettled: () => invalidate(),
  });

  const pending = mutation.isPending ? mutation.variables : undefined;

  const isFavorite = (snippet: Snippet) =>
    pending?.snippetId === snippet.id ? pending.isFavorite : snippet.isFavorite;

  return {
    toggle: (snippet: Snippet) =>
      mutation.mutate({ snippetId: snippet.id, isFavorite: !isFavorite(snippet) }),
    isFavorite,
    error: fromResult(mutation.data).error,
  };
}