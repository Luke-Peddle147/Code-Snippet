import { queryOptions } from "@tanstack/react-query";
import { httpClient } from "@/lib/httpClient/HttpClient";
import type { Snippet } from "@/types/snippet";

export const QUERY_KEY = "snippets";

const getSnippets = async () => httpClient.GET<Snippet[]>("/snippets");

export const getSnippetsOptions = () =>
  queryOptions({
    queryKey: [QUERY_KEY],
    queryFn: getSnippets,
  });