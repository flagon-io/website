import "server-only";
import { apiJson } from "./api";

/**
 * Client for the product documentation the API owns. The docs live in the flagon
 * repo, are compiled into a corpus embedded in the API, and served at /docs*.
 * This site is a pure client of those routes: it holds no copy, so it can never
 * drift from what the API actually has.
 *
 * Every request fetches fresh (no caching), so what the API has is what the site
 * shows. Reads go through the shared api helper, so a slow or unreachable API
 * times out and degrades (an empty list, or an "unavailable" lookup) rather than
 * hanging or throwing.
 */

export type DocVisibility = "public" | "internal";

export type DocMeta = {
  slug: string;
  title: string;
  description?: string;
  section?: string;
  visibility: DocVisibility;
  /** "planned" marks a placeholder page (shown in nav, renders a stub state). */
  status?: string;
  order?: number;
};

export type DocPage = DocMeta & {
  headings?: string[];
  body: string;
};

export type DocHit = {
  doc: DocMeta;
  score: number;
  snippet: string;
};

async function api<T>(path: string, fallback: T): Promise<T> {
  const res = await apiJson<T>(path, { cache: "no-store" });
  return res.ok ? res.data : fallback;
}

/** All public docs, in the API's stable (section, order, title) order. */
export async function getDocs(): Promise<DocMeta[]> {
  const body = await api<{ docs?: DocMeta[] }>("/docs", {});
  return body.docs ?? [];
}

/**
 * The result of looking up one doc, distinguishing "not found" (the API is up,
 * there is just no such public doc) from "unavailable" (the API never answered),
 * so the page can 404 the former but show a retry state for the latter instead
 * of 404-ing every doc while the API is down.
 */
export type DocLookup =
  | { state: "ok"; doc: DocPage }
  | { state: "not-found" }
  | { state: "unavailable" };

/** One public doc by slug. */
export async function getDoc(slug: string): Promise<DocLookup> {
  const res = await apiJson<{ doc?: DocPage }>(
    `/docs/page?slug=${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    },
  );
  if (res.ok)
    return res.data.doc
      ? { state: "ok", doc: res.data.doc }
      : { state: "not-found" };
  // Reachable but non-2xx (unknown slug / internal doc) is a genuine miss;
  // unreachable means the API is down or not deployed yet.
  return res.reachable ? { state: "not-found" } : { state: "unavailable" };
}

/** Ranked public docs for a free-text query. */
export async function searchDocs(query: string, limit = 5): Promise<DocHit[]> {
  const q = query.trim();
  if (!q) return [];
  const body = await api<{ results?: DocHit[] }>(
    `/docs/search?q=${encodeURIComponent(q)}&limit=${limit}`,
    {},
  );
  return body.results ?? [];
}

/** Public doc slugs, for generateStaticParams (prebuild known pages). */
export async function getDocSlugs(): Promise<string[]> {
  return (await getDocs()).map((d) => d.slug);
}

/** Docs grouped by section, preserving the API's order, for a sidebar. */
export async function getDocsBySection(): Promise<
  { section: string; docs: DocMeta[] }[]
> {
  const groups: { section: string; docs: DocMeta[] }[] = [];
  for (const doc of await getDocs()) {
    const section = doc.section ?? "Docs";
    // Group case-insensitively so "Platform" and "platform" don't fragment into
    // two columns; the first-seen label wins (docs arrive section-sorted, so the
    // Title-Case form sorts first).
    let group = groups.find(
      (g) => g.section.toLowerCase() === section.toLowerCase(),
    );
    if (!group) {
      group = { section, docs: [] };
      groups.push(group);
    }
    group.docs.push(doc);
  }
  return groups;
}

/**
 * Curated order for the "All docs" categories: a deliberate reading order (Get
 * started first, then the platform, the AI/agent surface, then reference and
 * operations), rather than alphabetical. Sections not listed here fall to the end
 * in alphabetical order, so a new category still appears without a code change.
 */
const DOCS_SECTION_ORDER = [
  "Get started",
  "Platform",
  "Deploying",
  "Context",
  "Agents",
  "AI",
  "MCP hub",
  "Skills",
  "Metrics",
  "Observability",
  "API",
  "CLI",
  "Governance",
  "Self hosting",
];

function sectionRank(section: string): number {
  const i = DOCS_SECTION_ORDER.findIndex(
    (s) => s.toLowerCase() === section.toLowerCase(),
  );
  return i < 0 ? DOCS_SECTION_ORDER.length : i;
}

/**
 * Product docs grouped by section in curated order, excluding the handbook
 * (which has its own surface at /handbook). This is the "All docs" taxonomy: the
 * grid on the docs landing and the sidebar on doc pages both read it, so they
 * always agree.
 */
export async function getProductDocsBySection(): Promise<
  { section: string; docs: DocMeta[] }[]
> {
  return (await getDocsBySection())
    .map((g) => ({
      ...g,
      docs: g.docs.filter(
        (d) => !d.slug.startsWith("handbook/") && d.slug !== DOCS_INDEX_SLUG,
      ),
    }))
    .filter((g) => g.docs.length > 0)
    .sort(
      (a, b) =>
        sectionRank(a.section) - sectionRank(b.section) ||
        a.section.localeCompare(b.section),
    );
}

/** Slug of the docs landing page (docs/index.mdx), rendered at /docs. */
export const DOCS_INDEX_SLUG = "index";

export type DocsNavPage = {
  type: "page";
  slug: string;
  title: string;
  status?: string;
};
export type DocsNavSeparator = { type: "separator"; title: string };
export type DocsNavItem = DocsNavPage | DocsNavSeparator;

export type DocsNavSection = {
  /** Top-level docs folder; every page slug in it starts with `<folder>/`. */
  folder: string;
  title: string;
  items: DocsNavItem[];
};

export type DocsNavGroup = {
  /** Group heading ("Get started"). Empty for the ungrouped fallback. */
  title: string;
  sections: DocsNavSection[];
};

/** The grouped docs navigation, as compiled from the meta.json files. */
export type DocsNav = {
  index?: DocsNavPage;
  groups: DocsNavGroup[];
};

/**
 * The docs navigation. Reads the API's compiled nav (GET /docs/nav); when the
 * API predates that route, falls back to the flat section list so the sidebar
 * still renders (one ungrouped run of sections, the previous behavior).
 */
export async function getDocsNav(): Promise<DocsNav> {
  const res = await apiJson<{ nav?: DocsNav }>("/docs/nav", {
    cache: "no-store",
  });
  if (res.ok && res.data.nav && Array.isArray(res.data.nav.groups)) {
    return res.data.nav;
  }
  const sections = await getProductDocsBySection();
  return {
    groups: [
      {
        title: "",
        sections: sections.map((s) => ({
          folder: s.docs[0]?.slug.split("/")[0] ?? s.section,
          title: s.section,
          items: s.docs.map((d) => ({
            type: "page" as const,
            slug: d.slug,
            title: d.title,
            status: d.status,
          })),
        })),
      },
    ],
  };
}

/** A page in reading order, with where it sits in the nav. */
export type DocsNavEntry = DocsNavPage & {
  group?: string;
  section?: string;
};

/** Every page in nav reading order: the landing page, then each section's. */
export function flattenDocsNav(nav: DocsNav): DocsNavEntry[] {
  const out: DocsNavEntry[] = [];
  if (nav.index) out.push(nav.index);
  for (const g of nav.groups) {
    for (const s of g.sections) {
      for (const it of s.items) {
        if (it.type === "page") {
          out.push({ ...it, group: g.title || undefined, section: s.title });
        }
      }
    }
  }
  return out;
}

/** URL of a docs page; the landing page lives at /docs itself. */
export function docHref(slug: string): string {
  return slug === DOCS_INDEX_SLUG ? "/docs" : `/docs/${slug}`;
}
