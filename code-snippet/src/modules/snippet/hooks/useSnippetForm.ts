import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { Snippet, SnippetFormValues, SnippetInput } from "@/types/snippet";
import { detectLanguage } from "../lib/detectLanguage";
import { getInitialFormValues, isFormComplete, toSnippetInput } from "../lib/snippetForm";

interface UseSnippetFormOptions {
  initial?: Snippet;
  submitting: boolean;
  onSubmit: (input: SnippetInput) => void | Promise<void>;
  onCancel: () => void;
}

const DETECT_DELAY_MS = 400;
const ESCAPE_HANDLED_BY = '[role="listbox"]';

export function useSnippetForm({ initial, submitting, onSubmit, onCancel }: UseSnippetFormOptions) {
  const [values, setValues] = useState<SnippetFormValues>(() => getInitialFormValues(initial));
  const [languagePicked, setLanguagePicked] = useState(initial !== undefined);

  const debouncedCode = useDebouncedValue(values.code, DETECT_DELAY_MS);
  const detection = useMemo(
    () => (languagePicked ? null : detectLanguage(debouncedCode)),
    [languagePicked, debouncedCode]
  );

  const detectedLanguage = detection?.status === "detected" ? detection.language : null;
  const detectionFailed = detection?.status === "undetected";

  const currentValues: SnippetFormValues = detectedLanguage
    ? { ...values, language: detectedLanguage }
    : values;
  

  const setField = <K extends keyof SnippetFormValues>(field: K, value: SnippetFormValues[K]) => {
    if (field === "language") setLanguagePicked(true);
    setValues((current) => ({ ...current, [field]: value }));
  };

  const canSubmit = isFormComplete(currentValues) && !submitting;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    const submitDetection = languagePicked ? null : detectLanguage(values.code);
    const language =
      submitDetection?.status === "detected" ? submitDetection.language : values.language;

    onSubmit(toSnippetInput({ ...values, language }));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.defaultPrevented) return;

    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      event.currentTarget.requestSubmit();
      return;
    }

    if (event.key === "Escape" && !submitting) {
      if ((event.target as HTMLElement).closest(ESCAPE_HANDLED_BY)) return;
      onCancel();
    }
  };

  return {
    values: currentValues,
    detectedLanguage,
    detectionFailed,
    setField,
    canSubmit,
    handleSubmit,
    handleKeyDown,
  };
}