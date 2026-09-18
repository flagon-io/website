"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";

type Hit = {
  doc: { slug: string; title: string; description?: string; section?: string };
  snippet: string;
};

function isEditable(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    (el as HTMLElement).isContentEditable
  );
}

/**
 * Prominent documentation search. Queries the same-origin proxy (which forwards
 * to the API's ranked search) as the reader types, and shows results in an
 * accessible combobox: press "/" anywhere to focus it, arrow keys move, Enter
 * opens, Escape closes.
 */
export function DocsSearch() {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  // Debounced fetch, with the in-flight request aborted when the query changes.
  // Clearing on an empty query happens in onChange (a user event), so the effect
  // body never calls setState synchronously.
  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/docs/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { results?: Hit[] };
        setHits(data.results ?? []);
        setActive(0);
        setOpen(true);
      } catch {
        // Abort or API hiccup: leave the last results, don't flash an error.
      }
    }, 150);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [query]);

  // "/" focuses search from anywhere on the page, unless the reader is already
  // typing somewhere.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && !isEditable(document.activeElement)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close when focus leaves the whole widget.
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function go(hit: Hit | undefined) {
    if (!hit) return;
    setOpen(false);
    router.push(`/docs/${hit.doc.slug}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || hits.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % hits.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + hits.length) % hits.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(hits[active]);
    }
  }

  const showPanel = open && query.trim().length > 0;

  return (
    <div ref={rootRef} className="relative">
      <div className="flex items-center gap-3 rounded-xl border border-hairline bg-panel px-4 py-3.5 focus-within:border-mark">
        <Search className="h-5 w-5 shrink-0 text-subtle" strokeWidth={2} aria-hidden />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-activedescendant={showPanel && hits.length ? `${listId}-${active}` : undefined}
          aria-autocomplete="list"
          aria-label="Search the docs"
          autoComplete="off"
          placeholder="Search the docs…"
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            if (!v.trim()) {
              setHits([]);
              setOpen(false);
            }
          }}
          onFocus={() => hits.length > 0 && setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full bg-transparent text-base outline-none placeholder:text-subtle"
        />
        <kbd
          aria-hidden
          className="hidden shrink-0 rounded border border-hairline px-1.5 py-0.5 font-mono text-[11px] text-subtle sm:inline"
        >
          /
        </kbd>
      </div>

      {showPanel && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-hairline bg-card shadow-lg">
          {hits.length > 0 ? (
            <ul id={listId} role="listbox" aria-label="Search results">
              {hits.map((hit, i) => (
                <li
                  key={hit.doc.slug}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    go(hit);
                  }}
                  className={`cursor-pointer border-b border-hairline px-4 py-3 last:border-b-0 ${
                    i === active ? "bg-panel" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {hit.doc.section ? (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-subtle">
                        {hit.doc.section}
                      </span>
                    ) : null}
                    <span className="text-sm font-semibold tracking-tight">{hit.doc.title}</span>
                    {i === active ? (
                      <CornerDownLeft className="ml-auto h-3.5 w-3.5 text-subtle" aria-hidden />
                    ) : null}
                  </div>
                  {hit.snippet ? (
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {hit.snippet}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              No matches for &ldquo;{query.trim()}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
