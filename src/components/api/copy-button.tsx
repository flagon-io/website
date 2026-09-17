"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copy-to-clipboard control for code samples. */
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard unavailable (insecure context); nothing useful to do.
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-panel px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Check className="h-3 w-3 text-brand" strokeWidth={2.5} /> : <Copy className="h-3 w-3" strokeWidth={2} />}
      {copied ? "Copied" : label}
    </button>
  );
}
