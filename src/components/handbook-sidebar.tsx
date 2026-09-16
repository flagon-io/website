"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { HandbookNav, type HandbookNavData } from "@/components/handbook-nav";
import { cn } from "@/lib/cn";

/**
 * Handbook sidebar. On desktop the nav is always shown (the `lg:` classes win).
 * On mobile it collapses behind a toggle so 50-odd links don't bury the page,
 * and it closes itself again on navigation.
 */
export function HandbookSidebar({ categories }: { categories: HandbookNavData }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation (adjust-during-render, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <div>
      <div className="px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between rounded-md border border-hairline bg-panel px-3 py-2 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-brand"
        >
          Browse the handbook
          <ChevronDown
            className={cn("h-4 w-4 text-subtle transition-transform", open && "rotate-180")}
            strokeWidth={2}
          />
        </button>
      </div>
      <div className={cn("mt-4 lg:mt-0 lg:block", open ? "block" : "hidden")}>
        <HandbookNav categories={categories} />
      </div>
    </div>
  );
}
