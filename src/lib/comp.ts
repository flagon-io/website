/**
 * The Flagon compensation model.
 *
 * Base salary = benchmark x level modifier x step modifier x location factor.
 *
 * The numbers below are anchored to public market data as a starting point while
 * we finalize our own bands, so the framework is real and defensible today rather
 * than made up. They are not yet Flagon's finalized figures; we will set and
 * publish our own. Everything is tunable here, in one file: change a number and
 * every calculator on the site updates at once.
 *
 * Method for the SF benchmarks: engineering anchored at ~90th percentile of
 * market, other roles at ~50th percentile + 20%. Location factors follow the
 * market-rate (not cost-of-living) approach, GitLab-style.
 */

export type Role = {
  id: string;
  name: string;
  /** Group heading, e.g. "Engineering". */
  group: string;
  /** San Francisco benchmark salary for this role, in USD. */
  benchmark: number;
};

export type Level = {
  id: string;
  name: string;
  modifier: number;
  blurb: string;
};

export type Step = {
  id: string;
  name: string;
  /** [min, max] multiplier range for placement within a level. */
  range: [number, number];
  blurb: string;
};

export type Location = {
  id: string;
  name: string;
  factor: number;
};

// SF benchmarks (USD), a representative subset of a larger role table.
// Six engineering roles sit at the same $285k top-of-market anchor.
export const ROLES: Role[] = [
  { id: "product-engineer", name: "Product Engineer", group: "Engineering", benchmark: 285000 },
  { id: "backend-engineer", name: "Backend Engineer", group: "Engineering", benchmark: 285000 },
  { id: "full-stack-engineer", name: "Full Stack Engineer", group: "Engineering", benchmark: 285000 },
  { id: "data-engineer", name: "Data Engineer", group: "Engineering", benchmark: 285000 },
  { id: "site-reliability-engineer", name: "Site Reliability Engineer", group: "Engineering", benchmark: 285000 },
  { id: "front-end-developer", name: "Front End Developer", group: "Engineering", benchmark: 240000 },
  { id: "support-engineer", name: "Support Engineer", group: "Engineering", benchmark: 189000 },
  { id: "product-manager", name: "Product Manager", group: "Design & product", benchmark: 250000 },
  { id: "design-lead", name: "Design Lead", group: "Design & product", benchmark: 236000 },
  { id: "product-designer", name: "Product Designer", group: "Design & product", benchmark: 186000 },
  { id: "developer-advocate", name: "Developer Advocate", group: "Go-to-market", benchmark: 215700 },
  { id: "content-marketer", name: "Content Marketer", group: "Go-to-market", benchmark: 218000 },
  { id: "product-marketer", name: "Product Marketer", group: "Go-to-market", benchmark: 218000 },
  { id: "operations-finance-lead", name: "Operations & Finance Lead", group: "Operations & people", benchmark: 225000 },
  { id: "talent-partner", name: "Talent Partner", group: "Operations & people", benchmark: 210000 },
  { id: "people-operations-manager", name: "People Operations Manager", group: "Operations & people", benchmark: 153311 },
];

// Level modifiers. Senior is the 1.0 anchor; levels describe scope
// and impact, not tenure or status.
export const LEVELS: Level[] = [
  { id: "junior", name: "Junior", modifier: 0.59, blurb: "Building your craft on well-scoped work, with support around you." },
  { id: "intermediate", name: "Intermediate", modifier: 0.78, blurb: "Owning features end to end with little scaffolding." },
  { id: "senior", name: "Senior", modifier: 1.0, blurb: "Owning ambiguous, important problems. The anchor the whole system is measured against." },
  { id: "staff", name: "Staff", modifier: 1.2, blurb: "Impact spanning whole areas; you shape how others build." },
  { id: "director", name: "Director", modifier: 1.4, blurb: "Accountable for outcomes at the scale of the organization." },
];

// Step ranges. You can grow a lot inside a level without changing
// levels; each step is a [min, max] band, which is why pay shows as a range.
export const STEPS: Step[] = [
  { id: "learning", name: "Learning", range: [0.85, 0.94], blurb: "New to the level and growing into its full scope." },
  { id: "established", name: "Established", range: [0.95, 1.04], blurb: "Solidly at the level. Where you land when you join." },
  { id: "thriving", name: "Thriving", range: [1.05, 1.1], blurb: "Consistently exceeding what the level asks for." },
  { id: "expert", name: "Expert", range: [1.11, 1.2], blurb: "One of the people others look to at this level." },
];

// Location factors (a representative subset of a larger
// table). The benchmark is the San Francisco number, so SF = 1.0 and every other
// market is a factor <= 1.0. It's cost of market, not cost of living, with a
// floor of 0.8 in the US and 0.6 everywhere else.
export const LOCATIONS: Location[] = [
  { id: "sf", name: "San Francisco Bay Area", factor: 1.0 },
  { id: "nyc", name: "New York City", factor: 1.0 },
  { id: "boston", name: "Boston", factor: 0.95 },
  { id: "seattle", name: "Seattle", factor: 0.94 },
  { id: "san-diego", name: "San Diego", factor: 0.91 },
  { id: "chicago", name: "Chicago", factor: 0.88 },
  { id: "austin", name: "Austin", factor: 0.86 },
  { id: "los-angeles", name: "Los Angeles", factor: 0.85 },
  { id: "denver", name: "Denver / Boulder", factor: 0.85 },
  { id: "us-remote", name: "United States (most areas)", factor: 0.85 },
  { id: "us-floor", name: "United States (lowest-cost areas)", factor: 0.8 },
  { id: "toronto", name: "Toronto", factor: 0.75 },
  { id: "london", name: "London", factor: 0.75 },
  { id: "singapore", name: "Singapore", factor: 0.75 },
  { id: "dublin", name: "Dublin", factor: 0.7 },
  { id: "vancouver", name: "Vancouver", factor: 0.7 },
  { id: "berlin", name: "Berlin", factor: 0.65 },
  { id: "amsterdam", name: "Amsterdam", factor: 0.65 },
  { id: "paris", name: "Paris", factor: 0.6 },
  { id: "row", name: "Rest of world (floor)", factor: 0.6 },
];

export function computeSalary(
  benchmark: number,
  levelMod: number,
  stepMod: number,
  locationFactor: number,
): number {
  const raw = benchmark * levelMod * stepMod * locationFactor;
  // Round to the nearest $500 so the figure reads like a real band.
  return Math.round(raw / 500) * 500;
}

export function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
