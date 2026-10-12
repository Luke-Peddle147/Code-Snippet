import { useState, type FormEvent, type KeyboardEvent } from "react";
import type { Snippet, SnippetFormValues, SnippetInput } from "@/types/snippet";
import { getInitialFormValues, isFormComplete, toSnippetInput } from "../lib/snippetForm";

interface UseSnippetFormOptions {
  initial?: Snippet;
  submitting: boolean;
  onSubmit: (input: SnippetInput) => void | Promise<void>;
  onCancel: () => void;
}

export function useSnippetForm({ initial, submitting, onSubmit, onCancel }: UseSnippetFormOptions) {
  const [values, setValues] = useState<SnippetFormValues>(() => getInitialFormValues(initial));

  const setField = <K extends keyof SnippetFormValues>(field: K, value: SnippetFormValues[K]) =>
    setValues((current) => ({ ...current, [field]: value }));

  const canSubmit = isFormComplete(values) && !submitting;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit(toSnippetInput(values));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      event.currentTarget.requestSubmit();
    }
    if (event.key === "Escape" && !submitting) {
      if ((event.target as HTMLElement).closest('[role="listbox"]')) return;
      onCancel();
    }
  };

  return { values, setField, canSubmit, handleSubmit, handleKeyDown };
}