import GithubSlugger from "github-slugger";

export type TocItem = { depth: 2 | 3; text: string; id: string };

/** Strip the markdown we allow in headings down to visible text. */
function stripMarkdown(input: string): string {
  return input
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1") // bold/italic
    .replace(/&rsquo;|&#8217;/g, "’")
    .replace(/&amp;/g, "&")
    .trim();
}

/**
 * Pull the H2/H3 headings out of a raw MDX string, with ids that match the ones
 * rehype-slug assigns at render time (both use github-slugger over the visible
 * heading text, in document order, so duplicates dedupe identically). Fenced
 * code blocks are skipped so a `## ` inside a code sample isn't treated as a
 * heading.
 */
export function extractToc(mdx: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inFence = false;

  for (const line of mdx.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length === 2 ? 2 : 3;
    const text = stripMarkdown(match[2]);
    items.push({ depth, text, id: slugger.slug(text) });
  }

  return items;
}
