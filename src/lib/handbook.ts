import "server-only";
import { listSlugs, readCollection, readDoc } from "@/lib/content";

export type HandbookPage = {
  slug: string;
  title: string;
  description: string;
  section: string;
  order: number;
  readingMinutes: number;
  content: string;
};

export type HandbookSection = {
  name: string;
  pages: HandbookPage[];
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
  { name: "Product", category: "Resources", soon: true },
  { name: "Support", category: "Resources", soon: true },
];

const SECTION_ORDER = SECTIONS.map((s) => s.name);

function toPage(d: {
  slug: string;
  content: string;
  data: Record<string, unknown>;
  readingMinutes: number;
}): HandbookPage {
  return {
    slug: d.slug,
    title: String(d.data.title ?? d.slug),
    description: String(d.data.description ?? ""),
    section: String(d.data.section ?? "Chapters"),
    order: Number(d.data.order ?? 100),
    readingMinutes: d.readingMinutes,
    content: d.content,
  };
}

export function listHandbookSlugs(): string[] {
  return listSlugs("handbook");
}

export function getHandbookPage(slug: string): HandbookPage | null {
  const d = readDoc("handbook", slug);
  return d ? toPage(d) : null;
}

/** All pages grouped into ordered sub-sections, each section's pages ordered. */
export function getHandbookSections(): HandbookSection[] {
  const pages = readCollection("handbook").map(toPage);
  const bySection = new Map<string, HandbookPage[]>();
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
export function getHandbookNav(): HandbookCategory[] {
  const withPages = new Map(getHandbookSections().map((s) => [s.name, s]));
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
  for (const s of getHandbookSections()) {
    if (!seen.has(s.name)) add(null, s);
  }
  return cats;
}

/** Flat, reading-order list of pages (for prev/next navigation). */
export function getHandbookOrder(): HandbookPage[] {
  return getHandbookSections().flatMap((s) => s.pages);
}
