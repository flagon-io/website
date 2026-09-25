import { SidebarNav, type SidebarGroup } from "@/components/sidebar";
import { docHref, type DocsNav } from "@/lib/docs";

/**
 * Product docs sidebar: maps the compiled docs nav (GET /docs/nav) into the
 * shared SidebarNav. Groups ("Get started", "Developers") are headings; each
 * section is a collapsible row (the one holding the current page opens); a
 * separator is a small sub-heading inside its section; planned pages get a
 * "Soon" pill, and a section with nothing written yet is marked as a whole.
 * Rendered both in the desktop rail and inside the mobile docked dropdown.
 */
export function DocsSidebar({ nav }: { nav: DocsNav }) {
  const groups: SidebarGroup[] = nav.groups.map((g) => ({
    name: g.title || null,
    sections: g.sections.map((s) => {
      const pages = s.items.filter((i) => i.type === "page");
      const allPlanned =
        pages.length > 0 && pages.every((p) => p.status === "planned");
      return {
        name: s.title,
        badge: allPlanned ? "Soon" : undefined,
        items: s.items.map((i) =>
          i.type === "separator"
            ? { separator: i.title }
            : {
                href: docHref(i.slug),
                title: i.title,
                badge: i.status === "planned" && !allPlanned ? "Soon" : undefined,
              },
        ),
      };
    }),
  }));

  return (
    <SidebarNav
      title="Documentation"
      homeHref="/docs"
      homeLabel="Overview"
      groups={groups}
      variant="compact"
    />
  );
}
