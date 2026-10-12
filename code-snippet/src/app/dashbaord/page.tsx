import { Braces } from "lucide-react";
import { SnippetLibrary } from "@/modules/snippet/components/SnippetLibray";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-360 space-y-8 px-4 py-8 md:px-8 md:py-10">
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