import { httpClient } from "@/lib/httpClient/HttpClient";
import type { Result } from "@/types/results";
import type { Snippet, SnippetInput } from "@/types/snippet";

export interface UpdateSnippetPayload extends Partial<SnippetInput> {
  snippetId: number;
}

export const updateSnippet = async (
  props: UpdateSnippetPayload
): Promise<Result<Snippet>> => {
  const { snippetId, ...body } = props;
  return httpClient.PATCH<Snippet>(`/snippets/${snippetId}`, body);
};