export const LANGUAGES = [
  {
    value: "typescript",
    label: "TypeScript",
    color: "#3178c6",
    highlight: "typescript",
    extensions: [".ts", ".tsx", ".mts", ".cts"],
  },
  {
    value: "javascript",
    label: "JavaScript",
    color: "#e5c62b",
    highlight: "javascript",
    extensions: [".js", ".jsx", ".mjs", ".cjs"],
  },
  {
    value: "python",
    label: "Python",
    color: "#3572a5",
    highlight: "python",
    extensions: [".py"],
  },
  {
    value: "java",
    label: "Java",
    color: "#b07219",
    highlight: "java",
    extensions: [".java"],
  },
  {
    value: "csharp",
    label: "C#",
    color: "#178600",
    highlight: "csharp",
    extensions: [".cs"],
  },
  {
    value: "go",
    label: "Go",
    color: "#00add8",
    highlight: "go",
    extensions: [".go"],
  },
  {
    value: "rust",
    label: "Rust",
    color: "#dea584",
    highlight: "rust",
    extensions: [".rs"],
  },
  {
    value: "sql",
    label: "SQL",
    color: "#e38c00",
    highlight: "sql",
    extensions: [".sql"],
  },
  {
    value: "bash",
    label: "Bash",
    color: "#89e051",
    highlight: "bash",
    extensions: [".sh", ".bash", ".zsh"],
  },
  {
    value: "powershell",
    label: "PowerShell",
    color: "#2b5ea7",
    highlight: "powershell",
    extensions: [".ps1", ".psm1"],
  },
  {
    value: "html",
    label: "HTML",
    color: "#e34c26",
    highlight: "markup",
    extensions: [".html", ".htm"],
  },
  {
    value: "css",
    label: "CSS",
    color: "#663399",
    highlight: "css",
    extensions: [".css"],
  },
  {
    value: "json",
    label: "JSON",
    color: "#6b7280",
    highlight: "json",
    extensions: [".json"],
  },
  {
    value: "yaml",
    label: "YAML",
    color: "#cb171e",
    highlight: "yaml",
    extensions: [".yml", ".yaml"],
  },
  {
    value: "markdown",
    label: "Markdown",
    color: "#083fa1",
    highlight: "markdown",
    extensions: [".md", ".markdown"],
  },
  {
    value: "other",
    label: "Other",
    color: "#a1a1aa",
    highlight: "text",
    extensions: [],
  },
] as const;

export type SnippetLanguage = (typeof LANGUAGES)[number]["value"];

export const DEFAULT_LANGUAGE: SnippetLanguage = "typescript";

const FALLBACK_COLOR = "#a1a1aa";

const findLanguage = (value: string) => LANGUAGES.find((language) => language.value === value);

export const toSnippetLanguage = (value: string): SnippetLanguage =>
  findLanguage(value) ? (value as SnippetLanguage) : "other";

export const getLanguageLabel = (value: string): string => findLanguage(value)?.label ?? value;

export const getLanguageColor = (value: string): string =>
  findLanguage(value)?.color ?? FALLBACK_COLOR;

export const getHighlightLanguage = (value: string): string =>
  findLanguage(value)?.highlight ?? "text";

export const getLanguageFromFileName = (fileName: string): SnippetLanguage | null => {
  const dot = fileName.lastIndexOf(".");
  if (dot === -1) return null;
  const extension = fileName.slice(dot).toLowerCase();
  return (
    LANGUAGES.find((language) => (language.extensions as readonly string[]).includes(extension))
      ?.value ?? null
  );
};

export const FILE_EXTENSIONS: string[] = LANGUAGES.flatMap((language) => [...language.extensions]);

export const countLines = (code: string): number => code.split("\n").length;