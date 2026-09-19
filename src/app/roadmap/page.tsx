import type { Metadata } from "next";
import { Frame } from "@/components/frame";
import { Section, SectionHeader, GUTTER } from "@/components/section";
import { RoadmapBoard } from "@/components/roadmap-board";
import { Cta } from "@/components/cta";
import { site } from "@/lib/site";
import { getRoadmap } from "@/lib/roadmap";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "What Flagon is building, in the open: a multi-tenant platform in beta today, with products and teams, bidirectional sync, and a full developer surface on the way.",
};

export default async function RoadmapPage() {
  const roadmap = await getRoadmap();
  return (
    <Frame>
      <main>
        <Section divider={false}>
          <SectionHeader
            title="What we're building, in the open"
            lead="The platform foundation is in beta and running: multi-tenant organizations, access and security, a public API, and an AI assistant. Right now we're building out products and teams, and bidirectional sync with the systems your definitions already live in is what's next. It's a direction, not a set of dated promises, so it moves as we learn. Every item flows concept to alpha to beta, then leaves the board for the changelog once it's generally available."
          />
        </Section>

        <Section divider>
          <div className={GUTTER}>
            {roadmap.available ? (
              <RoadmapBoard
                items={roadmap.items}
                stages={roadmap.stages}
                teams={roadmap.teams}
              />
            ) : (
              <p className="rounded-xl border border-hairline bg-panel/40 px-5 py-8 text-center text-sm text-muted-foreground">
                The roadmap is currently unavailable. It loads live from the
                Flagon API, which isn&rsquo;t answering right now. Please check
                back in a moment.
              </p>
            )}
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
