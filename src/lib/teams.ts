/**
 * The canonical list of teams (really, the functions of the company), in one
 * place. The /teams page, the People page, and the roadmap all read from here,
 * so a team's name and blurb live once. These describe the shape of the company
 * by design; a function might be one person today or a whole team later. Add an
 * entry as we grow. Deep per-team handbook pages will grow under the handbook's
 * Resources section over time, not here.
 */
export const TEAMS = [
  {
    name: "Engineering",
    blurb: "Builds and runs the platform, and keeps it fast, safe, and boring in the good way.",
  },
  {
    name: "Product",
    blurb: "Decides what we build and, just as often, what we don't.",
  },
  {
    name: "Design",
    blurb: "Makes the work clear and considered, down to the empty states.",
  },
  {
    name: "Developer relations",
    blurb: "Meets the people who build on Flagon where they are, and brings their feedback home.",
  },
  {
    name: "Growth",
    blurb: "Helps the right people find Flagon and get value fast, without dark patterns.",
  },
  {
    name: "Marketing",
    blurb: "Tells the true story of what we're making, in public.",
  },
  {
    name: "Community",
    blurb: "Tends the room where the conversation and the feedback happen.",
  },
  {
    name: "Support",
    blurb: "Turns a rough edge into a fixed one, and carries the signal to the people who can act on it.",
  },
  {
    name: "Operations",
    blurb: "Keeps the company running so everyone else can do their best work.",
  },
] as const;

export type Team = (typeof TEAMS)[number]["name"];
