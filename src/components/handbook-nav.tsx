"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

type NavSection = { name: string; pages: { slug: string; title: string }[] };

/** Two-level structure: top-level categories, each holding collapsible sections. */
export type HandbookNavData = {
  name: string | null;
  sections: NavSection[];
}[];

/**
 * The handbook sidebar. Two levels, mirroring the PostHog handbook: a top run of
 * ungrouped sections (Start here, Chapters), then labelled categories (Working
 * here, Resources) whose sub-sections are each a full-width collapsible row
 * (Radix Accordion, so keyboard + aria are handled). The section holding the
 * current page starts open, and navigating into a collapsed one opens it.
 */
export function HandbookNav({ categories }: { categories: HandbookNavData }) {
  const pathname = usePathname();
  const allSections = categories.flatMap((c) => c.sections);

  const activeSection = allSections.find((s) =>
    s.pages.some((p) => `/handbook/${p.slug}` === pathname),
  )?.name;

  const [open, setOpen] = useState<string[]>(
    activeSection ? [activeSection] : allSections[0] ? [allSections[0].name] : [],
  );

  // Keep the section that owns the current page open as the route changes,
  // without collapsing what the reader has opened (adjust-during-render).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (activeSection && !open.includes(activeSection)) {
      setOpen((o) => (o.includes(activeSection) ? o : [...o, activeSection]));
    }
  }

  return (
    <nav className="text-[13px]">
      <p className="px-4 pb-1 pt-1 text-[13px] font-semibold tracking-tight text-foreground">
        The Book of Flagon
      </p>
      <Link
        href="/handbook"
        aria-current={pathname === "/handbook" ? "page" : undefined}
        className={cn(
          "flex px-4 py-2.5 font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand",
          pathname === "/handbook"
            ? "text-brand"
            : "text-muted-foreground hover:bg-panel hover:text-foreground",
        )}
      >
        Table of contents
      </Link>

      <Accordion.Root
        type="multiple"
        value={open}
        onValueChange={setOpen}
        className="flex flex-col border-t border-hairline"
      >
        {categories.map((category) => (
          <div key={category.name ?? "_top"}>
            {category.name ? (
              <p className="border-b border-hairline bg-panel/30 px-4 pb-1.5 pt-4 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-subtle">
                {category.name}
              </p>
            ) : null}
            {category.sections.map((section) => (
              <SectionItem
                key={section.name}
                section={section}
                pathname={pathname}
                indented={category.name !== null}
              />
            ))}
          </div>
        ))}
      </Accordion.Root>
    </nav>
  );
}

function SectionItem({
  section,
  pathname,
  indented,
}: {
  section: NavSection;
  pathname: string;
  indented: boolean;
}) {
  const numbered = section.name === "Chapters";
  return (
    <Accordion.Item value={section.name} className="border-b border-hairline">
      <Accordion.Header>
        <Accordion.Trigger
          className={cn(
            "group flex w-full items-center gap-2 py-2.5 pr-4 font-mono text-[11px] uppercase tracking-widest text-subtle outline-none transition-colors hover:bg-panel hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand data-[state=open]:text-foreground",
            indented ? "pl-6" : "pl-4",
          )}
        >
          <ChevronRight
            className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90"
            strokeWidth={2}
            aria-hidden
          />
          <span className="flex-1 text-left">{section.name}</span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="acc-content overflow-hidden">
        <ul className="flex flex-col pb-2">
          {section.pages.map((page, i) => {
            const href = `/handbook/${page.slug}`;
            const active = pathname === href;
            return (
              <li key={page.slug}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-baseline gap-2 border-l-2 py-2 pr-4 leading-snug outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand",
                    // Numbered rows reserve a number column, so they can start
                    // flush; unnumbered rows skip it and sit much closer in.
                    numbered ? "pl-4" : indented ? "pl-7" : "pl-5",
                    active
                      ? "border-brand bg-panel font-medium text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-panel hover:text-foreground",
                  )}
                >
                  {numbered ? (
                    <span
                      className={cn(
                        "w-5 shrink-0 font-mono text-[10px] tabular-nums",
                        active ? "text-brand" : "text-subtle",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1">{page.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Accordion.Content>
    </Accordion.Item>
  );
}
