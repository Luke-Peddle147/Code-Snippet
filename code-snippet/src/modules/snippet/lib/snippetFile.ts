import { ErrorCode, type Accept, type FileRejection } from "react-dropzone";
import type { Result } from "@/types/results";
import { FILE_EXTENSIONS, getLanguageFromFileName, type SnippetLanguage } from "./languages";

export const MAX_FILE_BYTES = 512 * 1024;
export const MAX_FILE_LABEL = "512 KB";
const MAX_TITLE_LENGTH = 120;

export const FILE_ACCEPT: Accept = { "text/*": [...FILE_EXTENSIONS, ".txt"] };

const BINARY_TYPE_PREFIXES = ["image/", "video/", "audio/", "font/"];
const BINARY_TYPES = new Set(["application/pdf", "application/zip", "application/octet-stream"]);

export interface SnippetFileContents {
  code: string;
  title: string;
  language: SnippetLanguage | null;
}

export const titleFromFileName = (fileName: string): string => {
  const dot = fileName.lastIndexOf(".");
  const base = dot > 0 ? fileName.slice(0, dot) : fileName;
  return base.slice(0, MAX_TITLE_LENGTH);
};

const hasBinaryType = (file: File) =>
  BINARY_TYPES.has(file.type) || BINARY_TYPE_PREFIXES.some((prefix) => file.type.startsWith(prefix));

export async function readSnippetFile(file: File): Promise<Result<SnippetFileContents, string>> {
  if (file.size > MAX_FILE_BYTES) {
    return { error: `${file.name} is larger than ${MAX_FILE_LABEL}.` };
  }
  const language = getLanguageFromFileName(file.name);
  if (!language && hasBinaryType(file)) {
    return { error: `${file.name} isn't a text file.` };
  }

  const code = await file.text();
  if (code.includes("\u0000")) {
    return { error: `${file.name} isn't a text file.` };
  }
  if (code.trim() === "") {
    return { error: `${file.name} is empty.` };
  }

  return {
    data: {
      code,
      title: titleFromFileName(file.name),
      language,
    },
  };
}

export function describeRejection({ file, errors }: FileRejection): string {
  switch (errors[0]?.code) {
    case ErrorCode.FileTooLarge:
      return `${file.name} is larger than ${MAX_FILE_LABEL}.`;
    case ErrorCode.FileInvalidType:
      return `${file.name} isn't a supported file type.`;
    case ErrorCode.TooManyFiles:
      return "Add one file at a time.";
    default:
      return `${file.name} couldn't be loaded.`;
  }
}