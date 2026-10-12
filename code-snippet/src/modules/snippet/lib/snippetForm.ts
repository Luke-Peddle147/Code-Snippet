import type { Snippet, SnippetFormValues, SnippetInput } from "@/types/snippet";
import { DEFAULT_LANGUAGE, toSnippetLanguage } from "./languages";

export const getInitialFormValues = (initial?: Snippet): SnippetFormValues => ({
  title: initial?.title ?? "",
  description: initial?.description ?? "",
  language: initial ? toSnippetLanguage(initial.language) : DEFAULT_LANGUAGE,
  code: initial?.code ?? "",
});

export const isFormComplete = (values: SnippetFormValues): boolean =>
  values.title.trim() !== "" && values.code.trim() !== "";

export const toSnippetInput = (values: SnippetFormValues): SnippetInput => ({
  title: values.title.trim(),
  description: values.description.trim() || null,
  language: values.language,
  code: values.code,
});