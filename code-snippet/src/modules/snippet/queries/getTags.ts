import { queryOptions } from "@tanstack/react-query";
import { httpClient } from "@/lib/httpClient/HttpClient";
import type { TagSummary } from "@/types/snippet";

export const QUERY_KEY = "tags";

const getTags = async () => httpClient.GET<TagSummary[]>("/tags");

export const getTagsOptions = () =>
  queryOptions({
    queryKey: [QUERY_KEY],
    queryFn: getTags,
  });