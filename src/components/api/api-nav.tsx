"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { MethodBadge } from "@/components/api/method-badge";

type NavOperation = { id: string; method: string; path: string; summary?: string };
type NavGroup = { name: string; operations: NavOperation[] };

/**
 * Sticky operation index with live filtering and scrollspy. Clicking (or deep
 * linking to) an entry opens that endpoint's detail. The endpoint sections
 * themselves are server-rendered; this only observes and drives them.
 */
export function ApiNav({ groups }: { groups: NavGroup[] }) {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((group) => ({
        ...group,
        operations: group.operations.filter((op) =>
          `${op.method} ${op.path} ${op.summary ?? ""}`.toLowerCase().includes(q),
        ),
      }))
      .filter((group) => group.operations.length > 0);
  }, [groups, query]);

  // Highlight whichever endpoint is currently near the top of the viewport.
  useEffect(() => {
    const els = groups
      .flatMap((group) => group.operations.map((op) => document.getElementById(op.id)))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-64px 0px -70% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [groups]);

  // Open the endpoint targeted by the current hash (deep links, back/forward).
  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!id) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) {
        el.open = true;
        setActiveId(id);
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  const openTarget = (id: string) => (_event: MouseEvent) => {
    const el = document.getElementById(id);
    if (el instanceof HTMLDetailsElement) el.open = true;
    setActiveId(id);
  };

  return (
    <aside className="hidden border-r border-hairline lg:block">
      <div className="sticky top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto px-3 py-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter endpoints"
          aria-label="Filter endpoints"
          className="mb-4 w-full rounded-md border border-hairline bg-panel px-3 py-1.5 text-[13px] text-foreground placeholder:text-subtle focus:border-mark focus:outline-none"
        />
        {filtered.map((group) => (
          <div key={group.name} className="mb-5">
            <p className="px-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">
              {group.name}
            </p>
            <ul className="mt-2 space-y-0.5">
              {group.operations.map((op) => (
                <li key={op.id}>
                  <a
                    href={`#${op.id}`}
                    onClick={openTarget(op.id)}
                    className={`flex items-center gap-2 rounded-md px-2 py-1 transition-colors ${
                      activeId === op.id
                        ? "bg-panel text-foreground"
                        : "text-muted-foreground hover:bg-panel hover:text-foreground"
                    }`}
                  >
                    <MethodBadge method={op.method} />
                    <span className="truncate font-mono text-[12px]">{op.path}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {filtered.length === 0 ? (
          <p className="px-2 text-[13px] text-subtle">No matching endpoints.</p>
        ) : null}
      </div>
    </aside>
  );
}
