/// <reference types="react-syntax-highlighter" />

import type { CSSProperties } from "react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import csharp from "react-syntax-highlighter/dist/esm/languages/prism/csharp";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import go from "react-syntax-highlighter/dist/esm/languages/prism/go";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import powershell from "react-syntax-highlighter/dist/esm/languages/prism/powershell";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import rust from "react-syntax-highlighter/dist/esm/languages/prism/rust";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";

const PRISM_LANGUAGES = {
  bash,
  csharp,
  css,
  go,
  java,
  javascript,
  json,
  markdown,
  markup,
  powershell,
  python,
  rust,
  sql,
  typescript,
  yaml,
};

for (const [name, definition] of Object.entries(PRISM_LANGUAGES)) {
  SyntaxHighlighter.registerLanguage(name, definition);
}

const MONO_FONT = "var(--font-geist-mono), ui-monospace, monospace";

export const codeTheme = oneDark;

export const codeBlockStyle: CSSProperties = {
  margin: 0,
  padding: "1rem 0",
  maxHeight: "65vh",
  overflow: "auto",
  background: "transparent",
  fontSize: "13px",
  lineHeight: "1.5rem",
};

export const codeTagStyle: CSSProperties = {
  fontFamily: MONO_FONT,
  fontSize: "inherit",
  lineHeight: "inherit",
  background: "transparent",
};

export const lineNumberStyle: CSSProperties = {
  minWidth: "3em",
  paddingRight: "1rem",
  color: "#52525b",
  userSelect: "none",
};

export { SyntaxHighlighter };