"use client";

import { useId } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { handleCodeKeyDown } from "@/lib/codeEdit";
import { useSnippetForm } from "../../hooks/useSnippetForm";
import { LANGUAGES, type SnippetLanguage } from "../../lib/languages";
import type { Snippet, SnippetInput } from "@/types/snippet";
import { LanguageLabel } from "../LanguageLabel";

interface SnippetFormProps {
  initial?: Snippet;
  submitting: boolean;
  error: string | null;
  onSubmit: (input: SnippetInput) => void | Promise<void>;
  onCancel: () => void;
}

export function SnippetForm({ initial, submitting, error, onSubmit, onCancel }: SnippetFormProps) {
  const id = useId();
  const { values, setField, canSubmit, handleSubmit, handleKeyDown } = useSnippetForm({
    initial,
    submitting,
    onSubmit,
    onCancel,
  });

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="overflow-hidden rounded-xl border bg-card shadow-sm"
    >
      <header className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold tracking-tight">
          {initial ? "Edit snippet" : "New snippet"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {initial
            ? `Changes to “${initial.title}” are saved when you click Save.`
            : "Give it a name you'll search for later."}
        </p>
      </header>

      <div className="space-y-5 px-6 py-5">
        <div className="grid gap-4 sm:grid-cols-[1fr_13rem]">
          <div className="space-y-2">
            <Label htmlFor={`${id}-title`}>Title</Label>
            <Input
              id={`${id}-title`}
              value={values.title}
              onChange={(event) => setField("title", event.target.value)}
              maxLength={120}
              required
              autoFocus
              placeholder="Debounce function"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${id}-language`}>Language</Label>
            <Select
              value={values.language}
              onValueChange={(value) => setField("language", value as SnippetLanguage)}
            >
              <SelectTrigger id={`${id}-language`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <LanguageLabel language={option.value} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${id}-description`}>
            Description <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id={`${id}-description`}
            value={values.description}
            onChange={(event) => setField("description", event.target.value)}
            maxLength={500}
            placeholder="What it does and when to use it"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${id}-code`}>Code</Label>
          <Textarea
            id={`${id}-code`}
            value={values.code}
            onChange={(event) => setField("code", event.target.value)}
            onKeyDown={handleCodeKeyDown}
            required
            rows={16}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder="// paste or write your snippet here"
            className="min-h-72 resize-y border-zinc-800 bg-zinc-950 font-mono text-[13px] leading-6 text-zinc-100 shadow-inner [tab-size:2] placeholder:text-zinc-500 focus-visible:border-zinc-600 focus-visible:ring-zinc-500/30"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <footer className="flex items-center justify-between gap-3 border-t bg-muted/40 px-6 py-3">
        <p className="hidden text-xs text-muted-foreground sm:block">
          <kbd className="rounded border bg-card px-1.5 font-mono">Ctrl</kbd> +{" "}
          <kbd className="rounded border bg-card px-1.5 font-mono">Enter</kbd> to save,{" "}
          <kbd className="rounded border bg-card px-1.5 font-mono">Esc</kbd> to cancel
        </p>
        <div className="ml-auto flex gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            {submitting ? "Saving…" : initial ? "Save changes" : "Save snippet"}
          </Button>
        </div>
      </footer>
    </form>
  );
}