import { Sidebar, SidebarNav, type SidebarGroup } from "@/components/sidebar";

type Doc = { slug: string; title: string; status?: string };

/**
 * Product docs sidebar: maps the corpus sections into the shared Sidebar. A flat
 * list of collapsible categories; planned pages get a "Soon" pill.
 */
export function DocsSidebar({ sections }: { sections: { section: string; docs: Doc[] }[] }) {
  const groups: SidebarGroup[] = [
    {
      name: null,
      sections: sections.map((s) => ({
        name: s.section,
        items: s.docs.map((d) => ({
          href: `/docs/${d.slug}`,
          title: d.title,
          badge: d.status === "planned" ? "Soon" : undefined,
        })),
      })),
    },
  ];

  return (
    <Sidebar toggleLabel="Browse docs">
      <SidebarNav title="Documentation" homeHref="/docs" homeLabel="All docs" groups={groups} />
    </Sidebar>
  );
}
