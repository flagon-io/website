import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Frame } from "@/components/frame";
import { HexField } from "@/components/hex-field";
import { FlagonPour } from "@/components/flagon-pour";
import { Schematic, SchematicGrid } from "@/components/schematic";
import { Section, SectionHeader, GUTTER } from "@/components/section";
import { Cta } from "@/components/cta";
import { site } from "@/lib/site";
import { getAllPosts, formatDate } from "@/lib/blog";

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <Frame>
      {/* Hero */}
      <section className="relative isolate flex flex-col items-center justify-center px-6 pb-14 pt-20 text-center sm:pt-24">
        <HexField />

        <div className="rise" style={{ animationDelay: "0ms" }}>
          <FlagonPour className="relative h-36 w-36 sm:h-44 sm:w-44" />
        </div>

        <h1
          className="rise mt-8 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
          style={{ animationDelay: "120ms" }}
        >
          Good software,{" "}
          <span className="bg-linear-to-r from-brand-bright to-brand bg-clip-text text-transparent">
            on tap.
          </span>
        </h1>

        <p
          className="rise mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          style={{ animationDelay: "180ms" }}
        >
          We make software, and we&rsquo;re building the company we always wanted
          to work for. A small crew of misfits, a handbook anyone can read, and a
          long game we mean to play. All of it public, because a company you can
          read is a company you can trust.
        </p>

        <div
          className="rise mt-9 flex flex-col items-center gap-3 sm:flex-row"
          style={{ animationDelay: "240ms" }}
        >
          <Cta href="/handbook">Read the handbook</Cta>
          <Cta href="/blog" variant="secondary">
            Read the blog
          </Cta>
        </div>
      </section>

      {/* The bet */}
      <Section divider>
        <SectionHeader
          title="Most software is built behind a curtain. We pulled ours down."
          lead="Handbooks, roadmaps, the messy decisions in between. Companies keep all of it hidden, then wonder why nobody trusts them. We decided the whole thing should be readable, so it is."
        />
        <Schematic bleed className="mt-10">
          <SchematicGrid cols={3}>
            <Pillar
              title="Open by default"
              body="Our handbook is public. Our reasoning is public. When we get something wrong, that's public too. If we can't say it out loud, we probably shouldn't be doing it."
            />
            <Pillar
              title="A crew of misfits"
              body="We're not assembling a machine. We're a small group of people who care about craft, allergic to pretense, and happier shipping one genuinely good thing than ten that are fine."
            />
            <Pillar
              title="The long game"
              body="No quick exit, no growth-at-all-costs. Flagon exists to keep making useful software, in public, for as long as it's worth doing."
            />
          </SchematicGrid>
        </Schematic>
      </Section>

      {/* How we operate */}
      <Section divider>
        <div className={`grid gap-10 ${GUTTER} lg:grid-cols-[1.2fr_1fr] lg:items-center`}>
          <div className="max-w-2xl">
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              A company you can read.
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              How we work isn&rsquo;t a secret we protect. It&rsquo;s a handbook
              you can open, argue with, and hold us to. The way we decide, what
              we value, how we pay people: it&rsquo;s written down in public,
              because the alternative is asking you to take our word for it.
            </p>
            <div className="mt-6">
              <Link
                href="/handbook"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand"
              >
                Read the handbook
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </Link>
            </div>
          </div>
          <Schematic className="flex flex-col divide-y divide-hairline">
            <Marker k="01" label="Decide in the open" />
            <Marker k="02" label="Ship when it's good, not when it's due" />
            <Marker k="03" label="Let the people using it steer" />
            <Marker k="04" label="Write down why" />
          </Schematic>
        </div>
      </Section>

      {/* Latest from the blog */}
      {posts.length > 0 && (
        <Section divider>
          <SectionHeader
            title="We write things down"
            lead="Notes from building a company in public: decisions, mistakes, and the occasional strong opinion."
          />
          <div className="mt-10">
            <Schematic bleed>
              <div className="divide-y divide-hairline">
                {posts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group flex flex-col gap-2 p-6 transition hover:bg-panel sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:p-8"
                  >
                    <div className="max-w-2xl">
                      <h3 className="text-lg font-semibold tracking-tight group-hover:text-brand">
                        {p.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-subtle">
                      {formatDate(p.date)}
                    </span>
                  </Link>
                ))}
              </div>
            </Schematic>
            <div className="mt-6 px-6 sm:px-8">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand"
              >
                All posts
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </Link>
            </div>
          </div>
        </Section>
      )}

      {/* Closing CTA */}
      <Section divider className="text-center">
        <div className={GUTTER}>
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            It&rsquo;s all in the open.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
            Read the handbook, follow the blog, or jump into Discord and tell us
            what you wish existed.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Cta href="/handbook">Read the handbook</Cta>
            <Cta href={site.links.discord} external variant="secondary">
              Join the Discord
            </Cta>
          </div>
        </div>
      </Section>
    </Frame>
  );
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-6 sm:p-8">
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function Marker({ k, label }: { k: string; label: string }) {
  return (
    <div className="flex items-center gap-4 p-5 sm:p-6">
      <span className="font-mono text-[11px] uppercase tracking-widest text-brand">{k}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
