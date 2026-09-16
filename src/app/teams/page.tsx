import type { Metadata } from "next";
import { Frame } from "@/components/frame";
import { Section, SectionHeader, GUTTER } from "@/components/section";
import { Cta } from "@/components/cta";
import { TEAMS } from "@/lib/teams";

export const metadata: Metadata = {
  title: "Small teams",
  description:
    "How Flagon is organized: small, self-sufficient teams that own something end to end. A team might be one person or ten, and the page stays true either way.",
};

export default function TeamsPage() {
  return (
    <Frame>
      <main>
        <Section divider={false}>
          <SectionHeader
            title="Small teams"
            lead="We're organized into small, self-sufficient teams that each own something end to end, with a lot of ownership and not much process in the way. A team might be one person today or ten later, and the way it works stays the same."
          />
        </Section>

        <Section divider>
          <div className={GUTTER}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TEAMS.map((team) => (
                <div
                  key={team.name}
                  className="flex flex-col rounded-xl border border-hairline bg-card p-5"
                >
                  <h3 className="text-base font-semibold tracking-tight">{team.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {team.blurb}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section divider className="text-center">
          <div className={GUTTER}>
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Why we work in small teams
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
              Ownership only feels real when it's whole. The full reasoning, and
              how we intend to stay small as we grow, is in the handbook.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Cta href="/handbook/how-were-structured">Read how small teams work</Cta>
              <Cta href="/careers" variant="secondary">
                See careers
              </Cta>
            </div>
          </div>
        </Section>
      </main>
    </Frame>
  );
}
