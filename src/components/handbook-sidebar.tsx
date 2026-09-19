import { SidebarNav, type SidebarGroup } from "@/components/sidebar";

type HandbookCategoryNav = {
  name: string | null;
  sections: { name: string; soon?: boolean; pages: { slug: string; title: string }[] }[];
}[];

/**
 * Handbook sidebar: maps the two-level handbook nav into the shared Sidebar.
 * Numbered chapters, "Soon" department rows, and grouped categories, all rendered
 * by the same component the docs use.
 */
export function HandbookSidebar({ categories }: { categories: HandbookCategoryNav }) {
  const groups: SidebarGroup[] = categories.map((c) => ({
    name: c.name,
    sections: c.sections.map((s) => ({
      name: s.name,
      disabled: s.soon,
      badge: s.soon ? "Soon" : undefined,
      items: s.pages.map((p, i) => ({
        href: `/handbook/${p.slug}`,
        title: p.title,
        number: s.name === "Chapters" ? i + 1 : undefined,
      })),
    })),
  }));

  return (
    <SidebarNav
      title="The Book of Flagon"
      homeHref="/handbook"
      homeLabel="Table of contents"
      groups={groups}
    />
  );
}
