import type { ReactNode } from "react";
import { CopyButton } from "@/components/api/copy-button";

const TOKEN =
  /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

/** Lightweight JSON syntax coloring without a highlighter dependency. */
function colorize(json: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  TOKEN.lastIndex = 0;

  while ((match = TOKEN.exec(json))) {
    if (match.index > last) nodes.push(json.slice(last, match.index));
    if (match[1]) {
      const isKey = Boolean(match[2]);
      nodes.push(
        <span
          key={key++}
          className={isKey ? "text-sky-700 dark:text-sky-300" : "text-emerald-700 dark:text-emerald-400"}
        >
          {match[1]}
        </span>,
      );
      if (match[2]) nodes.push(match[2]);
    } else if (match[3]) {
      nodes.push(
        <span key={key++} className="text-violet-700 dark:text-violet-300">
          {match[3]}
        </span>,
      );
    } else if (match[4]) {
      nodes.push(
        <span key={key++} className="text-amber-700 dark:text-amber-400">
          {match[4]}
        </span>,
      );
    }
    last = TOKEN.lastIndex;
  }
  if (last < json.length) nodes.push(json.slice(last));
  return nodes;
}

/** A copyable, syntax-colored JSON sample. */
export function JsonBlock({ value, label = "Example" }: { value: unknown; label?: string }) {
  const json = JSON.stringify(value, null, 2);

  return (
    <div>
      <div className="flex items-center justify-between border-b border-hairline bg-panel px-4 py-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">
          {label}
        </span>
        <CopyButton text={json} />
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed">
        <code>{colorize(json)}</code>
      </pre>
    </div>
  );
}
