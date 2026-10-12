export const LANGUAGES = [
  { value: "typescript", label: "TypeScript", color: "#3178c6" },
  { value: "javascript", label: "JavaScript", color: "#e5c62b" },
  { value: "python", label: "Python", color: "#3572a5" },
  { value: "java", label: "Java", color: "#b07219" },
  { value: "csharp", label: "C#", color: "#178600" },
  { value: "go", label: "Go", color: "#00add8" },
  { value: "rust", label: "Rust", color: "#dea584" },
  { value: "sql", label: "SQL", color: "#e38c00" },
  { value: "bash", label: "Bash", color: "#89e051" },
  { value: "powershell", label: "PowerShell", color: "#2b5ea7" },
  { value: "html", label: "HTML", color: "#e34c26" },
  { value: "css", label: "CSS", color: "#663399" },
  { value: "json", label: "JSON", color: "#6b7280" },
  { value: "yaml", label: "YAML", color: "#cb171e" },
  { value: "markdown", label: "Markdown", color: "#083fa1" },
  { value: "other", label: "Other", color: "#a1a1aa" },
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

export const countLines = (code: string): number => code.split("\n").length;