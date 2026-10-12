import { httpClient } from "@/lib/httpClient/HttpClient";
import type { Result } from "@/types/results";
import type { Snippet, SnippetInput } from "@/types/snippet";

export type CreateSnippetPayload = SnippetInput;

export const createSnippet = async (
  payload: CreateSnippetPayload
): Promise<Result<Snippet>> => httpClient.POST<Snippet>("/snippets", payload);