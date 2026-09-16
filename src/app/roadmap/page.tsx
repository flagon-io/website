import type { Metadata } from "next";
import { Frame } from "@/components/frame";
import { Section, SectionHeader, GUTTER } from "@/components/section";
import { RoadmapBoard } from "@/components/roadmap-board";
import { Cta } from "@/components/cta";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "What Flagon is building, in the open. Right now that's the platform itself: a multi-tenant home for your products and teams, kept in sync with the tools you already use.",
};

export default function RoadmapPage() {
  return (
    <Frame>
      <main>
        <Section divider={false}>
          <SectionHeader
            title="What we're building, in the open"
            lead="Right now that's the Flagon platform itself: a multi-tenant home for your products and teams that stays in sync with the systems those definitions already live in. It's a direction, not a set of dated promises, so it moves as we learn. Every item flows concept to alpha to beta, then leaves the board for the changelog."
          />
        </Section>

        <Section divider>
          <div className={GUTTER}>
            <RoadmapBoard />
          </div>
        </Section>

        <Section divider className="text-center">
          <div className={GUTTER}>
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Tell us what matters
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
              This roadmap is a conversation, not a decree. If something here is
              wrong, missing, or in the wrong order, say so.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Cta href={site.links.discord} external>
                Weigh in on Discord
              </Cta>
              <Cta href="/handbook/decisions" variant="secondary">
                How we decide
              </Cta>
            </div>
          </div>
        </Section>
      </main>
    </Frame>
  );
}
