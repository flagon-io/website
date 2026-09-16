/**
 * The Flagon roadmap. Managing it is deliberately simple: every item is one
 * object in the ROADMAP array below. To move something as it progresses, change
 * its `stage`. To add something, add an object. To hand it to another team,
 * change its `team`. That's the whole workflow; the board re-groups, re-counts,
 * and re-filters itself.
 *
 * Stages read left to right as it matures: concept -> alpha -> beta. Anything
 * that reaches general availability leaves the board and lands in the changelog.
 */

export type Stage = "concept" | "alpha" | "beta";

export type RoadmapItem = {
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
};

export const STAGE_META: Record<Stage, { label: string; blurb: string }> = {
  concept: { label: "Concept", blurb: "Committed to building, still taking shape." },
  alpha: { label: "Alpha", blurb: "An early build, rough and moving fast." },
  beta: { label: "Beta", blurb: "Ready to try, close to done." },
};

export const STAGE_ORDER: Stage[] = ["concept", "alpha", "beta"];

/**
 * Today the only thing on the roadmap is the Flagon platform itself: a
 * multi-tenant home where people define and manage their products and teams,
 * kept in sync with the external systems those definitions already live in.
 */
export const ROADMAP: RoadmapItem[] = [
  {
    stage: "concept",
    team: "Engineering",
    tag: "Foundation",
    title: "The Flagon platform",
    summary:
      "The foundation everything else builds on: a multi-tenant home where people define and manage their products and teams, kept in sync with the systems those definitions already live in.",
    includes: [
      "Multi-tenant from the first commit",
      "Products and teams as first-class objects",
      "Ownership, membership, and access control",
      "Bidirectional sync with external systems",
      "A public API, SDKs, and a CLI",
    ],
  },
];

/** Distinct teams present on the board, for the filter. */
export function roadmapTeams(): string[] {
  return [...new Set(ROADMAP.map((i) => i.team))].sort();
}
