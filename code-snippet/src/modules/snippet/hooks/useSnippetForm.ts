import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { Snippet, SnippetFormValues, SnippetInput } from "@/types/snippet";
import { detectLanguage } from "../lib/detectLanguage";
import { readSnippetFile } from "../lib/snippetFile";
import { getInitialFormValues, isFormComplete, toSnippetInput } from "../lib/snippetForm";

interface UseSnippetFormOptions {
  initial?: Snippet;
  submitting: boolean;
  onSubmit: (input: SnippetInput) => void | Promise<void>;
  onCancel: () => void;
}

type LanguageSource = "default" | "manual" | "file";

const DETECT_DELAY_MS = 400;
const ESCAPE_HANDLED_BY = '[role="listbox"]';

export function useSnippetForm({ initial, submitting, onSubmit, onCancel }: UseSnippetFormOptions) {
  const [values, setValues] = useState<SnippetFormValues>(() => getInitialFormValues(initial));
  const [languageSource, setLanguageSource] = useState<LanguageSource>(
    initial ? "manual" : "default"
  );
  const [fileError, setFileError] = useState<string | null>(null);
  const [readingFile, setReadingFile] = useState(false);

  const shouldDetect = languageSource === "default";

  const debouncedCode = useDebouncedValue(values.code, DETECT_DELAY_MS);
  const detection = useMemo(
    () => (shouldDetect ? detectLanguage(debouncedCode) : null),
    [shouldDetect, debouncedCode]
  );

  const detectedLanguage = detection?.status === "detected" ? detection.language : null;
  const detectionFailed = detection?.status === "undetected";

  const currentValues: SnippetFormValues = detectedLanguage
    ? { ...values, language: detectedLanguage }
    : values;

  const setField = <K extends keyof SnippetFormValues>(field: K, value: SnippetFormValues[K]) => {
    if (field === "language") setLanguageSource("manual");
    if (field === "code") setFileError(null);
    setValues((current) => ({ ...current, [field]: value }));
  };

  const loadFile = async (file: File) => {
    setFileError(null);
    setReadingFile(true);
    const result = await readSnippetFile(file);
    setReadingFile(false);

    if (result.error !== undefined) {
      setFileError(result.error);
      return;
    }

    const { code, title, language } = result.data;
    setValues((current) => ({
      ...current,
      code,
      title: current.title.trim() ? current.title : title,
      language: language ?? current.language,
    }));

    if (language) setLanguageSource("file");
    else if (languageSource === "file") setLanguageSource("default");
  };

  const rejectFile = (message: string) => setFileError(message);

  const canSubmit = isFormComplete(currentValues) && !submitting && !readingFile;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    const submitDetection = shouldDetect ? detectLanguage(values.code) : null;
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
    languageFromFile: languageSource === "file",
    fileError,
    readingFile,
    setField,
    loadFile,
    rejectFile,
    canSubmit,
    handleSubmit,
    handleKeyDown,
  };
}