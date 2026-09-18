import Link from "next/link";

type SidebarDoc = { slug: string; title: string; status?: string };
type Section = { section: string; docs: SidebarDoc[] };

/**
 * Persistent navigation rail for the docs: every section and its pages, with the
 * current page marked. Server-rendered from the same corpus taxonomy as the
 * landing grid, so the two never disagree.
 */
export function DocsSidebar({
  sections,
  currentSlug,
}: {
  sections: Section[];
  currentSlug: string;
}) {
  return (
    <nav aria-label="Documentation" className="flex flex-col gap-7 py-2">
      <Link
        href="/docs"
        className="font-mono text-[11px] uppercase tracking-widest text-subtle transition hover:text-foreground"
      >
        ← All docs
      </Link>
      {sections.map((group) => (
        <div key={group.section}>
          <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">
            {group.section}
          </p>
          <ul className="mt-3 flex flex-col gap-0.5">
            {group.docs.map((doc) => {
              const active = doc.slug === currentSlug;
              const planned = doc.status === "planned";
              return (
                <li key={doc.slug}>
                  <Link
                    href={`/docs/${doc.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition ${
                      active
                        ? "bg-panel font-medium text-brand"
                        : planned
                          ? "text-subtle hover:text-muted-foreground"
                          : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {doc.title}
                    {planned ? (
                      <span className="rounded border border-hairline px-1 py-0.5 font-mono text-[9px] uppercase tracking-widest text-subtle">
                        Soon
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
