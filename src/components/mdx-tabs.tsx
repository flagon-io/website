"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * The interactive half of MDX <Tabs>: the tab list and panel switching. The
 * panels arrive already rendered on the server (so every tab's content is in
 * the HTML); this only decides which one is visible.
 *
 * Follows the WAI-ARIA tabs pattern: one tab stop (roving tabindex), arrow keys
 * move between tabs and activate them, Home/End jump to the ends. Tabs are keyed
 * by title, and choosing a title (say "API") switches every other tab group on
 * the page that has a tab with the same title, so a reader following the API
 * path through a page does not have to re-pick it in each group.
 */

const SYNC_EVENT = "flagon:docs-tab";

export function TabsClient({
  titles,
  panels,
}: {
  titles: string[];
  panels: ReactNode[];
}) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Follow a title picked in another group on the page.
  useEffect(() => {
    function onSync(e: Event) {
      const title = (e as CustomEvent<string>).detail;
      const i = titles.indexOf(title);
      if (i >= 0) setActive(i);
    }
    window.addEventListener(SYNC_EVENT, onSync);
    return () => window.removeEventListener(SYNC_EVENT, onSync);
  }, [titles]);

  function select(i: number, focus: boolean) {
    setActive(i);
    if (focus) tabRefs.current[i]?.focus();
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: titles[i] }));
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = titles.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    select(next, true);
  }

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-hairline">
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex gap-1 overflow-x-auto border-b border-hairline bg-panel px-2"
      >
        {titles.map((title, i) => {
          const selected = i === active;
          return (
            <button
              key={title}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i, false)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "relative -mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand",
                selected
                  ? "border-brand text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {title}
            </button>
          );
        })}
      </div>
      {panels.map((panel, i) => (
        <div
          key={titles[i]}
          role="tabpanel"
          id={`${baseId}-panel-${i}`}
          aria-labelledby={`${baseId}-tab-${i}`}
          hidden={i !== active}
          tabIndex={0}
          className="px-5 py-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand [&>*+*]:mt-4 [&>*:first-child]:mt-0"
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
