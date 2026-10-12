import type { KeyboardEvent } from "react";

const INDENT = "  ";

const PAIRS: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
  '"': '"',
  "'": "'",
  "`": "`",
};

const BLOCK_OPENERS = new Set(["(", "[", "{"]);
const QUOTES = new Set(['"', "'", "`"]);
const CLOSERS = new Set(Object.values(PAIRS));

export interface CodeEdit {
  from: number;
  to: number;
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

const moveCaret = (position: number): CodeEdit => ({
  from: position,
  to: position,
  text: "",
  selectionStart: position,
  selectionEnd: position,
});

const canAutoClose = (next: string | undefined) =>
  next === undefined || /\s/.test(next) || CLOSERS.has(next) || next === "," || next === ";";

function getEnterEdit(value: string, start: number, end: number): CodeEdit {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const indent = /^[ \t]*/.exec(value.slice(lineStart, start))?.[0] ?? "";
  const prev = value[start - 1];
  const next = value[end];
  const opensBlock = prev !== undefined && BLOCK_OPENERS.has(prev);

  if (opensBlock && next === PAIRS[prev]) {
    const caret = start + 1 + indent.length + INDENT.length;
    return {
      from: start,
      to: end,
      text: `\n${indent}${INDENT}\n${indent}`,
      selectionStart: caret,
      selectionEnd: caret,
    };
  }

  const text = `\n${indent}${opensBlock ? INDENT : ""}`;
  const caret = start + text.length;
  return { from: start, to: end, text, selectionStart: caret, selectionEnd: caret };
}

export function getCodeEdit(key: string, value: string, start: number, end: number): CodeEdit | null {
  const prev = value[start - 1];
  const next = value[end];
  const hasSelection = start !== end;

  if (key === "Enter") return getEnterEdit(value, start, end);

  if (key === "Backspace") {
    if (hasSelection || prev === undefined || PAIRS[prev] !== next) return null;
    return { from: start - 1, to: start + 1, text: "", selectionStart: start - 1, selectionEnd: start - 1 };
  }

  if (!hasSelection && CLOSERS.has(key) && next === key) return moveCaret(start + 1);

  if (!Object.hasOwn(PAIRS, key)) return null;
  const close = PAIRS[key];

  if (hasSelection) {
    return {
      from: start,
      to: end,
      text: `${key}${value.slice(start, end)}${close}`,
      selectionStart: start + 1,
      selectionEnd: end + 1,
    };
  }

  if (!canAutoClose(next)) return null;
  if (QUOTES.has(key) && prev !== undefined && /[\w\\]/.test(prev)) return null;

  return { from: start, to: end, text: `${key}${close}`, selectionStart: start + 1, selectionEnd: start + 1 };
}

function replaceSelection(textarea: HTMLTextAreaElement, text: string) {
  textarea.setRangeText(text, textarea.selectionStart, textarea.selectionEnd, "end");
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

export function handleCodeKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
  if (event.nativeEvent.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;

  const textarea = event.currentTarget;
  const edit = getCodeEdit(event.key, textarea.value, textarea.selectionStart, textarea.selectionEnd);
  if (!edit) return;

  event.preventDefault();

  if (edit.from !== edit.to || edit.text !== "") {
    textarea.setSelectionRange(edit.from, edit.to);
    replaceSelection(textarea, edit.text);
  }
  textarea.setSelectionRange(edit.selectionStart, edit.selectionEnd);
}