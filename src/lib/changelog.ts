import "server-only";
import { apiJson } from "./api";

/**
 * Client for the changelog the API owns. Entries live in the flagon repo
 * (changelog/), are compiled into a corpus embedded in the API, and served at
 * /changelog. This site is a pure client of that endpoint: it holds no copy, so
 * it can never drift from what the API actually has.
 *
 * When the API can't be reached (down, or the endpoint not deployed yet), the
 * page says the changelog is currently unavailable rather than showing a stale
 * baked-in copy. The request times out (see ./api) so a slow API can't stall a
 * render or the build.
 *
 * Mirrors src/lib/roadmap.ts and src/lib/docs.ts.
 */

export type ChangelogEntry = {
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD); entries arrive newest first. */
  date: string;
  /** Optional short badge, e.g. "Shipped", "New", "Improved", "Fixed". */
  tag?: string;
  /** Optional grouping, e.g. "Platform", "UI", "API". */
  area?: string;
  /** The Markdown note. */
  body: string;
};

export type Changelog = {
  entries: ChangelogEntry[];
  /**
   * false when the API couldn't be reached. The page shows an "unavailable"
   * state; an API that is up but has no entries yet is still available.
   */
  available: boolean;
};

/** The whole changelog in one request (it is small). Uses ISR (revalidate) so a
 * good response is cached and reused; when the API can't be reached, `available`
 * is false. */
export async function getChangelog(): Promise<Changelog> {
  const res = await apiJson<{ entries?: ChangelogEntry[] }>("/changelog");
  if (!res.ok) return { entries: [], available: false };
  return { entries: res.data.entries ?? [], available: true };
}

/**
 * Entries grouped by year, newest first, for a sectioned changelog. Preserves the
 * API's within-year (newest-first) ordering.
 */
export function byYear(
  entries: ChangelogEntry[],
): { year: string; entries: ChangelogEntry[] }[] {
  const groups: { year: string; entries: ChangelogEntry[] }[] = [];
  for (const entry of entries) {
    const year = entry.date.slice(0, 4);
    let group = groups.find((g) => g.year === year);
    if (!group) {
      group = { year, entries: [] };
      groups.push(group);
    }
    group.entries.push(entry);
  }
  return groups;
}
