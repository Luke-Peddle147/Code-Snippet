import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import csharp from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import powershell from "highlight.js/lib/languages/powershell";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import type { SnippetLanguage } from "./languages";

const DETECTORS = {
  bash: { definition: bash, language: "bash" },
  csharp: { definition: csharp, language: "csharp" },
  css: { definition: css, language: "css" },
  go: { definition: go, language: "go" },
  java: { definition: java, language: "java" },
  javascript: { definition: javascript, language: "javascript" },
  json: { definition: json, language: "json" },
  markdown: { definition: markdown, language: "markdown" },
  powershell: { definition: powershell, language: "powershell" },
  python: { definition: python, language: "python" },
  rust: { definition: rust, language: "rust" },
  sql: { definition: sql, language: "sql" },
  typescript: { definition: typescript, language: "typescript" },
  xml: { definition: xml, language: "html" },
  yaml: { definition: yaml, language: "yaml" },
} satisfies Record<string, { definition: typeof bash; language: SnippetLanguage }>;

type DetectorName = keyof typeof DETECTORS;

const DETECTOR_NAMES = Object.keys(DETECTORS) as DetectorName[];

for (const name of DETECTOR_NAMES) {
  hljs.registerLanguage(name, DETECTORS[name].definition);
}

const MIN_CODE_LENGTH = 20;
const MAX_SAMPLE_LENGTH = 5000;
const MIN_RELEVANCE = 3;

export type LanguageDetection =
  | { status: "detected"; language: SnippetLanguage }
  | { status: "undetected" };

const UNDETECTED: LanguageDetection = { status: "undetected" };

const isDetectorName = (name: string | undefined): name is DetectorName =>
  name !== undefined && Object.hasOwn(DETECTORS, name);

const isJavaScriptFamilyTie = (first: string, second: string | undefined) =>
  second !== undefined &&
  [first, second].sort().join() === "javascript,typescript";

export function detectLanguage(code: string): LanguageDetection | null {
  if (code.trim().length < MIN_CODE_LENGTH) return null;

  const result = hljs.highlightAuto(code.slice(0, MAX_SAMPLE_LENGTH), DETECTOR_NAMES);
  if (!isDetectorName(result.language) || result.relevance < MIN_RELEVANCE) return UNDETECTED;

  const runnerUp = result.secondBest;
  const tied = runnerUp !== undefined && runnerUp.relevance >= result.relevance;

  if (tied && isJavaScriptFamilyTie(result.language, runnerUp.language)) {
    return { status: "detected", language: "javascript" };
  }
  if (tied) return UNDETECTED;

  return { status: "detected", language: DETECTORS[result.language].language };
}