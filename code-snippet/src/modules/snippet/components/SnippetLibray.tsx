"use client";

import { MousePointerClick } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSnippetLibrary } from "../hooks/useSnippetLibarey";
import { SnippetDetail } from "./detail/SnippetDetail";
import { SnippetForm } from "./form/SnippetForm";
import { SnippetList } from "./list/SnippetList";
import { SnippetToolbar } from "./toolbar/SnippetToolbar";

export function SnippetLibrary() {
  const {
    panelRef,
    list,
    filters,
    selection,
    favorites,
    createState,
    updateState,
    deleteState,
    actions,
  } = useSnippetLibrary();
  const { selected, mode } = selection;

  const renderPanel = () => {
    if (mode === "create") {
      return (
        <SnippetForm
          key="new"
          submitting={createState.submitting}
          error={createState.error}
          onSubmit={actions.create}
          onCancel={actions.cancelForm}
        />
      );
    }

    if (mode === "edit" && selected) {
      return (
        <SnippetForm
          key={`edit-${selected.id}`}
          initial={selected}
          submitting={updateState.submitting}
          error={updateState.error}
          onSubmit={actions.update}
          onCancel={actions.cancelForm}
        />
      );
    }

    if (selected) {
      return (
        <SnippetDetail
          key={selected.id}
          snippet={selected}
          favorite={favorites.isFavorite(selected)}
          onToggleFavorite={() => favorites.toggle(selected)}
          onEdit={actions.startEdit}
          onDelete={actions.remove}
          deleting={deleteState.deleting}
          deleteError={deleteState.error}
        />
      );
    }

    return <EmptyPanel />;
  };

  return (
    <section className="space-y-6">
      <SnippetToolbar
        filters={filters.value}
        onFiltersChange={filters.set}
        onCreate={actions.startCreate}
        creating={mode === "create"}
      />

      {favorites.error && (
        <Alert variant="destructive" className="bg-card">
          <AlertDescription>Couldn&apos;t update favorite: {favorites.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
        <SnippetList
          snippets={list.snippets}
          totalCount={list.totalCount}
          loading={list.loading}
          error={list.error}
          onRetry={list.retry}
          selectedId={selection.selectedId}
          onSelect={actions.select}
          isFavorite={favorites.isFavorite}
          onToggleFavorite={favorites.toggle}
          filtersActive={filters.active}
          onClearFilters={filters.clear}
          onCreate={actions.startCreate}
        />

        <div ref={panelRef} className="scroll-mt-6 lg:sticky lg:top-6">
          {renderPanel()}
        </div>
      </div>
    </section>
  );
}

function EmptyPanel() {
  return (
    <div className="hidden flex-col items-center justify-center rounded-xl border border-dashed bg-card/60 px-6 py-24 text-center lg:flex">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <MousePointerClick className="size-5 text-muted-foreground" />
      </div>
      <p className="mt-4 font-medium">No snippet selected</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick one from the list, or press{" "}
        <kbd className="rounded border bg-card px-1.5 font-mono text-xs">N</kbd> to create a new one.
      </p>
    </div>
  );
}