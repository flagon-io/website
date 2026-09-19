import "server-only";
import { apiJson } from "./api";

/**
 * Client for the roadmap the API owns. The roadmap lives in the flagon repo
 * (roadmap/), is compiled into a corpus embedded in the API, and served at
 * /roadmap. This site is a pure client of that endpoint: it holds no copy of the
 * items, so it can never drift from what the API actually has.
 *
 * When the API can't be reached (down, or the endpoint not deployed yet), the
 * page says the roadmap is currently unavailable rather than showing a stale
 * baked-in copy. The request times out (see ./api) so a slow API can't stall a
 * render or the build.
 *
 * Mirrors src/lib/docs.ts and src/lib/changelog.ts.
 */

export type Stage = "concept" | "alpha" | "beta";

export type RoadmapItem = {
  slug: string;
  title: string;
  stage: Stage;
  /** The team that owns it (also what the board filters by). */
  team: string;
  /** Optional short badge, e.g. "Foundation" or "New". */
  tag?: string;
  /** Shown when a card is opened. A sentence or two on what it is. */
  summary?: string;
  /** Optional "what it covers" points, shown in the card detail. */
  includes?: string[];
  order?: number;
};

/** A stage column's display metadata, as the API provides it. */
export type StageInfo = { stage: Stage; label: string; blurb: string };

export type Roadmap = {
  items: RoadmapItem[];
  stages: StageInfo[];
  teams: string[];
  /**
   * false when the API couldn't be reached. The page shows an "unavailable"
   * state; an API that is up but simply has no items yet is still available.
   */
  available: boolean;
};

/** The whole board in one request. Uses ISR (revalidate) so a good response is
 * cached and reused; when the API can't be reached, `available` is false. */
export async function getRoadmap(): Promise<Roadmap> {
  const res = await apiJson<Partial<Roadmap>>("/roadmap");
  if (!res.ok) return { items: [], stages: [], teams: [], available: false };
  return {
    items: res.data.items ?? [],
    stages: res.data.stages ?? [],
    teams: res.data.teams ?? [],
    available: true,
  };
}
