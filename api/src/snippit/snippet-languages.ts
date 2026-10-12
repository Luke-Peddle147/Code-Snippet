export const SNIPPET_LANGUAGES = [
  'typescript',
  'javascript',
  'python',
  'java',
  'csharp',
  'go',
  'rust',
  'sql',
  'bash',
  'powershell',
  'html',
  'css',
  'json',
  'yaml',
  'markdown',
  'other',
] as const;

export type SnippetLanguage = (typeof SNIPPET_LANGUAGES)[number];