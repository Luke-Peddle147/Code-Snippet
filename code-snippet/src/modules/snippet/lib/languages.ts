export const LANGUAGES = [
  { value: "typescript", label: "TypeScript", color: "#3178c6", highlight: "typescript" },
  { value: "javascript", label: "JavaScript", color: "#e5c62b", highlight: "javascript" },
  { value: "python", label: "Python", color: "#3572a5", highlight: "python" },
  { value: "java", label: "Java", color: "#b07219", highlight: "java" },
  { value: "csharp", label: "C#", color: "#178600", highlight: "csharp" },
  { value: "go", label: "Go", color: "#00add8", highlight: "go" },
  { value: "rust", label: "Rust", color: "#dea584", highlight: "rust" },
  { value: "sql", label: "SQL", color: "#e38c00", highlight: "sql" },
  { value: "bash", label: "Bash", color: "#89e051", highlight: "bash" },
  { value: "powershell", label: "PowerShell", color: "#2b5ea7", highlight: "powershell" },
  { value: "html", label: "HTML", color: "#e34c26", highlight: "markup" },
  { value: "css", label: "CSS", color: "#663399", highlight: "css" },
  { value: "json", label: "JSON", color: "#6b7280", highlight: "json" },
  { value: "yaml", label: "YAML", color: "#cb171e", highlight: "yaml" },
  { value: "markdown", label: "Markdown", color: "#083fa1", highlight: "markdown" },
  { value: "other", label: "Other", color: "#a1a1aa", highlight: "text" },
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

export const countLines = (code: string): number => code.split("\n").length;