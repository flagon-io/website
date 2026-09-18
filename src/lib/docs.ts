import "server-only";

/**
 * Client for the product documentation the API owns. The docs live in the flagon
 * repo, are compiled into a corpus embedded in the API, and served at /docs*.
 * This site is a pure client of those routes: it holds no copy, so it can never
 * drift from what the API actually has.
 *
 * For now every request fetches fresh (no caching), so what the API has is what
 * the site shows, with zero cache/revalidation wiring to configure. It is the
 * simplest thing to roll out; caching or build-time generation can be layered on
 * later without touching callers.
 */

const API_ORIGIN = (process.env.FLAGON_API_URL ?? "https://api.flagon.io").replace(/\/+$/, "");

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
  try {
    const res = await fetch(`${API_ORIGIN}${path}`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`docs api responded ${res.status}`);
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

/** All public docs, in the API's stable (section, order, title) order. */
export async function getDocs(): Promise<DocMeta[]> {
  const body = await api<{ docs?: DocMeta[] }>("/docs", {});
  return body.docs ?? [];
}

/** One public doc by slug, or null (unknown slug, internal doc, or API down). */
export async function getDoc(slug: string): Promise<DocPage | null> {
  const body = await api<{ doc?: DocPage }>(`/docs/page?slug=${encodeURIComponent(slug)}`, {});
  return body.doc ?? null;
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
export async function getDocsBySection(): Promise<{ section: string; docs: DocMeta[] }[]> {
  const groups: { section: string; docs: DocMeta[] }[] = [];
  for (const doc of await getDocs()) {
    const section = doc.section ?? "Docs";
    // Group case-insensitively so "Platform" and "platform" don't fragment into
    // two columns; the first-seen label wins (docs arrive section-sorted, so the
    // Title-Case form sorts first).
    let group = groups.find((g) => g.section.toLowerCase() === section.toLowerCase());
    if (!group) {
      group = { section, docs: [] };
      groups.push(group);
    }
    group.docs.push(doc);
  }
  return groups;
}

/**
 * Product docs grouped by section, excluding the handbook (which has its own
 * surface at /handbook). This is the "All docs" taxonomy: the grid on the docs
 * landing and the sidebar on doc pages both read it, so they always agree.
 */
export async function getProductDocsBySection(): Promise<{ section: string; docs: DocMeta[] }[]> {
  return (await getDocsBySection())
    .map((g) => ({ ...g, docs: g.docs.filter((d) => !d.slug.startsWith("handbook/")) }))
    .filter((g) => g.docs.length > 0);
}
