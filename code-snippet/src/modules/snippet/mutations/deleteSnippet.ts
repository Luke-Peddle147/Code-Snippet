import { httpClient } from "@/lib/httpClient/HttpClient";
import type { Result } from "@/types/results";

export const deleteSnippet = async (snippetId: number): Promise<Result<void>> =>
  httpClient.DELETE<void>(`/snippets/${snippetId}`);