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
    "Flagon is the source of truth for your organization's products and teams: defined once, kept in sync with the tools you already use, and held to a standard, crafted, open, priced without games, and built in public.",
};

const PILLARS: { title: string; body: string }[] = [
  {
    title: "Products",
    body: "Define a product once, with everything true about it in one place, instead of smeared across five tools that each disagree.",
  },
  {
    title: "Teams",
    body: "Teams, membership, and ownership as real, queryable objects, not a wiki page that went stale back in March.",
  },
  {
    title: "Sync, both ways",
    body: "Your definitions stay true in the systems you already use, pulled in and pushed back out, so nothing drifts.",
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
            The source of truth for your products and teams.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Flagon is where your organization defines its products, its teams,
            and who owns what, then keeps all of it in sync with the tools that
            structure already lives in. One place that&rsquo;s true, that
            everything else agrees with.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Cta href="/roadmap">See the roadmap</Cta>
            <Cta href="/handbook/who-we-build-for" variant="secondary">
              Who we build for
            </Cta>
          </div>
        </section>

        {/* Pillars */}
        <Section divider>
          <SectionHeader
            title="One place, kept in sync"
            lead="Define the shape of your organization once, and keep it true everywhere it needs to be."
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
              <Cta href="/roadmap">See the roadmap</Cta>
              <Cta href="/handbook/which-products-to-build" variant="secondary">
                How we decide what to build
              </Cta>
            </div>
          </div>
        </Section>
      </main>
    </Frame>
  );
}
