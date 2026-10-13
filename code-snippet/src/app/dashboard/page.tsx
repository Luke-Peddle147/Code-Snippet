import { Braces } from "lucide-react";
import { SnippetLibrary } from "@/modules/snippet/components/SnippetLibrary";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-360 space-y-8 px-8 py-10">
      <header className="flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Braces className="size-6" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Code Snippets</h1>
          <p className="mt-0.5 text-muted-foreground">
            Save, search, and reuse the code you keep rewriting.
          </p>
        </div>
      </header>

      <SnippetLibrary />
    </div>
  );
}