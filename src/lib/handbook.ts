import "server-only";
import readingTime from "reading-time";
import { getDoc, getDocs, type DocMeta } from "@/lib/docs";

/**
 * The handbook is served by the API, straight from the flagon repo's docs
 * corpus (slugs under "handbook/"). This site is a pure client: it holds no copy,
 * so the handbook can never drift from the source. These helpers shape the
 * corpus into the structures the handbook UI already expects; the section
 * taxonomy below is presentation that stays here.
 */

const PREFIX = "handbook/";

/** Metadata for one page (no body): enough for nav, lists, search, sitemap. */
export type HandbookMeta = {
  slug: string;
  title: string;
  description: string;
  section: string;
  order: number;
};

/** A full page, with its rendered-from Markdown body and reading estimate. */
export type HandbookPage = HandbookMeta & {
  readingMinutes: number;
  content: string;
};

export type HandbookSection = {
  name: string;
  pages: HandbookMeta[];
  /** A department we'll build out later: shown disabled with a "Soon" pill. */
  soon?: boolean;
};

/**
 * A top-level sidebar grouping. `name === null` is the ungrouped run at the top
 * (Start here, Chapters), rendered without a category header. Named categories
 * (Working here, Resources) hold several collapsible sub-sections, matching the
 * two-level shape of the PostHog handbook.
 */
export type HandbookCategory = {
  name: string | null;
  sections: HandbookSection[];
};

/**
 * Every sub-section, in sidebar order, tagged with the category it belongs to.
 * This is the single source of truth for handbook structure: a page's frontmatter
 * `section:` must match one of these names to be placed; anything else falls to
 * the end as its own top-level section.
 */
const SECTIONS: { name: string; category: string | null; soon?: boolean }[] = [
  { name: "Chapters", category: null },
  // Working here: how the company operates, day to day.
  { name: "How we work", category: "Working here" },
  { name: "Tools & processes", category: "Working here" },
  { name: "People ops", category: "Working here" },
  { name: "Pay & perks", category: "Working here" },
  { name: "Hiring", category: "Working here" },
  // Resources: departmental guides, alphabetical. `soon` renders a disabled
  // placeholder with a "Soon" pill for a department we'll build out later.
  { name: "Brand", category: "Resources" },
  { name: "Community", category: "Resources", soon: true },
  { name: "Content", category: "Resources", soon: true },
  { name: "Design", category: "Resources", soon: true },
  { name: "Developer relations", category: "Resources", soon: true },
  { name: "Engineering", category: "Resources" },
  { name: "Growth", category: "Resources", soon: true },
  { name: "Marketing", category: "Resources", soon: true },
  { name: "Operations", category: "Resources", soon: true },
  { name: "Product", category: "Resources" },
  { name: "Support", category: "Resources", soon: true },
];

const SECTION_ORDER = SECTIONS.map((s) => s.name);

/** The website-facing slug (no "handbook/" prefix). */
function pageSlug(corpusSlug: string): string {
  return corpusSlug.slice(PREFIX.length);
}

function toMeta(d: DocMeta): HandbookMeta {
  return {
    slug: pageSlug(d.slug),
    title: d.title,
    description: d.description ?? "",
    section: d.section ?? "Chapters",
    order: d.order ?? 100,
  };
}

/** Every handbook page's metadata, from the corpus. */
async function handbookMetas(): Promise<HandbookMeta[]> {
  const docs = await getDocs();
  return docs.filter((d) => d.slug.startsWith(PREFIX)).map(toMeta);
}

export async function listHandbookSlugs(): Promise<string[]> {
  return (await handbookMetas()).map((p) => p.slug);
}

export async function getHandbookPage(slug: string): Promise<HandbookPage | null> {
  const doc = await getDoc(`${PREFIX}${slug}`);
  if (!doc) return null;
  return {
    slug,
    title: doc.title,
    description: doc.description ?? "",
    section: doc.section ?? "Chapters",
    order: doc.order ?? 100,
    readingMinutes: Math.max(1, Math.round(readingTime(doc.body).minutes)),
    content: doc.body,
  };
}

/** All pages grouped into ordered sub-sections, each section's pages ordered. */
export async function getHandbookSections(): Promise<HandbookSection[]> {
  const pages = await handbookMetas();
  const bySection = new Map<string, HandbookMeta[]>();
  for (const p of pages) {
    const list = bySection.get(p.section) ?? [];
    list.push(p);
    bySection.set(p.section, list);
  }

  const known = SECTION_ORDER.filter((s) => bySection.has(s));
  const extra = [...bySection.keys()].filter((s) => !SECTION_ORDER.includes(s)).sort();

  return [...known, ...extra].map((name) => ({
    name,
    pages: (bySection.get(name) ?? []).sort(
      (a, b) => a.order - b.order || a.title.localeCompare(b.title),
    ),
  }));
}

/**
 * Sections grouped under their categories, in order, for the two-level sidebar.
 * Includes `soon` placeholder sections (declared in SECTIONS, no pages yet) so
 * the departments we plan to build show up disabled with a "Soon" pill.
 */
export async function getHandbookNav(): Promise<HandbookCategory[]> {
  const withPages = new Map((await getHandbookSections()).map((s) => [s.name, s]));
  const seen = new Set<string>();
  const cats: HandbookCategory[] = [];
  const add = (category: string | null, section: HandbookSection) => {
    const last = cats[cats.length - 1];
    if (last && last.name === category) last.sections.push(section);
    else cats.push({ name: category, sections: [section] });
  };

  for (const def of SECTIONS) {
    seen.add(def.name);
    const populated = withPages.get(def.name);
    if (populated) add(def.category, populated);
    else if (def.soon) add(def.category, { name: def.name, pages: [], soon: true });
    // a known section with no pages and no `soon` flag is simply omitted
  }
  // Any section that has pages but isn't declared in SECTIONS: append at the end.
  for (const s of await getHandbookSections()) {
    if (!seen.has(s.name)) add(null, s);
  }
  return cats;
}

/** Flat, reading-order list of page metadata (for prev/next navigation). */
export async function getHandbookOrder(): Promise<HandbookMeta[]> {
  return (await getHandbookSections()).flatMap((s) => s.pages);
}
