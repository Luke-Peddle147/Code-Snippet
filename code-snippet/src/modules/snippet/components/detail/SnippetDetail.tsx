"use client";

import { useState } from "react";
import { Check, Copy, Pencil, Star, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { formatDateTime, formatRelativeTime } from "@/lib/formatDate";
import { cn } from "@/lib/utils";
import { countLines, getHighlightLanguage, getLanguageLabel } from "../../lib/languages";
import {
  codeBlockStyle,
  codeTagStyle,
  codeTheme,
  lineNumberStyle,
  SyntaxHighlighter,
} from "@/lib/syntaxHighlighter";
import type { Snippet } from "@/types/snippet";
import { LanguageLabel } from "../LanguageLabel";

interface SnippetDetailProps {
  snippet: Snippet;
  favorite: boolean;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
  deleteError: string | null;
}

export function SnippetDetail({
  snippet,
  favorite,
  onToggleFavorite,
  onEdit,
  onDelete,
  deleting,
  deleteError,
}: SnippetDetailProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const lines = countLines(snippet.code);

  return (
    <article className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight break-words">{snippet.title}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <LanguageLabel language={snippet.language} className="font-medium text-foreground/80" />
              <span>
                {lines} {lines === 1 ? "line" : "lines"}
              </span>
              <span title={formatDateTime(snippet.updatedAt)}>
                Updated {formatRelativeTime(snippet.updatedAt)}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onToggleFavorite}
              aria-pressed={favorite}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              className={cn(favorite && "border-amber-300 bg-amber-50 hover:bg-amber-100")}
            >
              <Star className={favorite ? "fill-amber-400 text-amber-500" : undefined} />
            </Button>

            <Button variant="outline" onClick={onEdit}>
              <Pencil />
              Edit
            </Button>

            <AlertDialog open={confirmOpen} onOpenChange={(open) => !deleting && setConfirmOpen(open)}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Delete snippet"
                  className="text-destructive hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
                >
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete “{snippet.title}”?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes the snippet and its code. It can&apos;t be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {deleteError && (
                  <Alert variant="destructive">
                    <AlertDescription>{deleteError}</AlertDescription>
                  </Alert>
                )}

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>Keep it</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(event) => {
                      event.preventDefault();
                      onDelete();
                    }}
                    disabled={deleting}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    {deleting ? "Deleting…" : "Delete snippet"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {snippet.description && (
          <p className="max-w-prose leading-relaxed text-foreground/80">{snippet.description}</p>
        )}
      </header>

      <div className="px-6 pb-6">
        <CodeBlock code={snippet.code} language={snippet.language} />
      </div>
    </article>
  );
}

interface CodeBlockProps {
  code: string;
  language: string;
}

function CodeBlock({ code, language }: CodeBlockProps) {
  const { copy, status } = useCopyToClipboard();

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-inner">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-4 py-2">
        <span className="font-mono text-xs text-zinc-400">{getLanguageLabel(language)}</span>
        <button
          type="button"
          onClick={() => copy(code)}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-zinc-300 outline-none transition-colors hover:bg-zinc-800 hover:text-white focus-visible:ring-2 focus-visible:ring-zinc-500"
        >
          {status === "copied" ? (
            <Check className="size-3.5 text-emerald-400" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {status === "copied" ? "Copied" : status === "error" ? "Copy failed" : "Copy"}
        </button>
        <span aria-live="polite" className="sr-only">
          {status === "copied" ? "Code copied to clipboard" : status === "error" ? "Copy failed" : ""}
        </span>
      </div>

      <SyntaxHighlighter
        language={getHighlightLanguage(language)}
        style={codeTheme}
        customStyle={codeBlockStyle}
        codeTagProps={{ style: codeTagStyle }}
        lineNumberStyle={lineNumberStyle}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}