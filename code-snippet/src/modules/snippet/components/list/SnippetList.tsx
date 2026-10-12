"use client";

import { Braces, SearchX, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime, formatRelativeTime } from "@/lib/formatDate";
import { cn } from "@/lib/utils";
import { countLines } from "../../lib/languages";
import type { Snippet } from "@/types/snippet";
import { LanguageLabel } from "../LanguageLabel";

interface SnippetListProps {
  snippets: Snippet[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  selectedId: number | null;
  onSelect: (snippetId: number) => void;
  isFavorite: (snippet: Snippet) => boolean;
  onToggleFavorite: (snippet: Snippet) => void;
  filtersActive: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
}

export function SnippetList({
  snippets,
  totalCount,
  loading,
  error,
  onRetry,
  selectedId,
  onSelect,
  isFavorite,
  onToggleFavorite,
  filtersActive,
  onClearFilters,
  onCreate,
}: SnippetListProps) {
  if (loading) return <ListSkeleton />;

  if (error && totalCount === 0) {
    return (
      <Alert variant="destructive" className="bg-card">
        <AlertTitle>Snippets couldn&apos;t be loaded</AlertTitle>
        <AlertDescription>
          <p>{error}. Check that the API is running on port 3001.</p>
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (totalCount === 0) {
    return (
      <ListMessage
        icon={Braces}
        title="No snippets yet"
        body="Save a function or command you reuse, and it'll be here next time you need it."
        actionLabel="Create your first snippet"
        onAction={onCreate}
      />
    );
  }

  if (snippets.length === 0) {
    return (
      <ListMessage
        icon={SearchX}
        title="No matching snippets"
        body="Try a different search term or language."
        actionLabel={filtersActive ? "Clear filters" : undefined}
        onAction={filtersActive ? onClearFilters : undefined}
      />
    );
  }

  return (
    <div className="space-y-3">
      <p className="px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {snippets.length === totalCount
          ? `${totalCount} ${totalCount === 1 ? "snippet" : "snippets"}`
          : `${snippets.length} of ${totalCount} snippets`}
      </p>

      <ul className="space-y-2">
        {snippets.map((snippet) => (
          <SnippetListItem
            key={snippet.id}
            snippet={snippet}
            selected={snippet.id === selectedId}
            favorite={isFavorite(snippet)}
            onSelect={() => onSelect(snippet.id)}
            onToggleFavorite={() => onToggleFavorite(snippet)}
          />
        ))}
      </ul>
    </div>
  );
}

interface SnippetListItemProps {
  snippet: Snippet;
  selected: boolean;
  favorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

function SnippetListItem({ snippet, selected, favorite, onSelect, onToggleFavorite }: SnippetListItemProps) {
  const lines = countLines(snippet.code);

  return (
    <li
      className={cn(
        "group relative flex items-start overflow-hidden rounded-xl border bg-card shadow-xs transition-all",
        selected ? "border-primary/25 shadow-sm ring-2 ring-primary/10" : "hover:border-ring/50 hover:shadow-sm"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 w-1 transition-colors",
          selected ? "bg-primary" : "bg-transparent"
        )}
      />

      <button
        type="button"
        onClick={onSelect}
        aria-current={selected ? "true" : undefined}
        className="min-w-0 flex-1 rounded-xl py-3.5 pr-2 pl-5 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <p className="truncate font-medium">{snippet.title}</p>
        {snippet.description && (
          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{snippet.description}</p>
        )}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <LanguageLabel language={snippet.language} className="font-medium text-foreground/80" />
          <span>
            {lines} {lines === 1 ? "line" : "lines"}
          </span>
          <span title={formatDateTime(snippet.updatedAt)}>{formatRelativeTime(snippet.updatedAt)}</span>
        </div>
      </button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleFavorite}
        aria-pressed={favorite}
        aria-label={favorite ? `Remove ${snippet.title} from favorites` : `Add ${snippet.title} to favorites`}
        className={cn(
          "m-2 shrink-0 transition-opacity",
          !favorite && "sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
        )}
      >
        <Star className={favorite ? "fill-amber-400 text-amber-500" : "text-muted-foreground"} />
      </Button>
    </li>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-2 pt-7" aria-busy="true" aria-label="Loading snippets">
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="space-y-2.5 rounded-xl border bg-card px-5 py-4 shadow-xs">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

interface ListMessageProps {
  icon: LucideIcon;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}

function ListMessage({ icon: Icon, title, body, actionLabel, onAction }: ListMessageProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed bg-card/60 px-6 py-12 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <p className="mt-4 font-medium">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{body}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}