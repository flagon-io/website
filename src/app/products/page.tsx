import type { Metadata } from "next";
import { Frame } from "@/components/frame";
import { HexField } from "@/components/hex-field";
import { FlagonPour } from "@/components/flagon-pour";
import { Schematic, SchematicGrid } from "@/components/schematic";
import { Section, SectionHeader } from "@/components/section";
import { Cta } from "@/components/cta";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Flagon is an AI-native platform for operating your whole system: connect your tools, operate them with AI over your real data, and drive everything from the dashboard, an assistant, or the API. Open source, self-hostable, and built in public.",
};

const PILLARS: { title: string; body: string }[] = [
  {
    title: "Your system, connected",
    body: "Bring your projects, teams, and the tools around them into one place, with shared context across all of it, instead of a slice of the truth in each dashboard.",
  },
  {
    title: "Operate with AI",
    body: "Ask in plain language and act on the answer. The assistant and agents work over your real data with your permissions. Reads run; changes are proposed for you to confirm.",
  },
  {
    title: "One surface, everywhere",
    body: "The dashboard, the assistant, the API, and MCP all drive the same permission-checked operations. Click it, ask it, script it, or point an agent at it.",
  },
];

const TRAITS: { title: string; body: string }[] = [
  {
    title: "Crafted, not cranked out",
    body: "Quality over quantity, down to the empty states and error copy. If a competitor could slap their logo on it and nobody would notice, it isn't finished.",
  },
  {
    title: "Open by default",
    body: "Open source and self-hostable. Your infrastructure, your data, no lock-in. Leaving is always an option, which is exactly why you won't want to.",
  },
  {
    title: "Priced without games",
    body: "A genuinely free tier, usage-based paid plans, and no bill shock. We make money when you're happy to pay, not when you're trapped.",
  },
  {
    title: "Built in public",
    body: "You watch it get made, argue with the decisions, and shape what comes next. No big reveal, no roadmap of maybes.",
  },
];

export default function ProductsPage() {
  return (
    <Frame>
      <main>
        {/* Hero */}
        <section className="relative isolate flex flex-col items-center justify-center px-6 pb-14 pt-20 text-center sm:pt-24">
          <HexField />
          <div className="rise">
            <FlagonPour className="relative h-32 w-32 sm:h-40 sm:w-40" />
          </div>
          <h1 className="mt-8 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            The platform for your whole system.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Flagon brings your tools into one place you can operate and reason
            about, with AI there when you want it. Connect your system, understand
            what&rsquo;s happening across it, and act on it, from the dashboard,
            the API, or an AI assistant.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Cta href="/docs">Explore the docs</Cta>
            <Cta href="/roadmap" variant="secondary">
              See the roadmap
            </Cta>
          </div>
        </section>

        {/* Pillars */}
        <Section divider>
          <SectionHeader
            title="One system, run with AI"
            lead="Connect the tools your work already lives in, then operate the whole thing, and let AI act on it, over your real data, safely."
          />
          <Schematic bleed className="mt-10">
            <SchematicGrid cols={3}>
              {PILLARS.map((p) => (
                <div key={p.title} className="p-6 sm:p-8">
                  <h3 className="text-base font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              ))}
            </SchematicGrid>
          </Schematic>
        </Section>

        {/* The standard */}
        <Section divider>
          <SectionHeader
            title="Held to a standard"
            lead="Every part of Flagon is built to the same bar, no matter which feature it is. Here's what that bar means in practice."
          />
          <Schematic bleed className="mt-10">
            <SchematicGrid cols={4}>
              {TRAITS.map((t) => (
                <div key={t.title} className="p-6 sm:p-8">
                  <h3 className="text-base font-semibold tracking-tight">{t.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                </div>
              ))}
            </SchematicGrid>
          </Schematic>
        </Section>

        {/* CTA */}
        <Section divider className="text-center">
          <div className="px-6 sm:px-8">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              See what&rsquo;s next
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
              We build in the open. See where the platform is on the roadmap, or
              read exactly who we&rsquo;re building it for.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Cta href="/docs">Explore the docs</Cta>
              <Cta href="/roadmap" variant="secondary">
                See the roadmap
              </Cta>
            </div>
          </div>
        </Section>
      </main>
    </Frame>
  );
}
