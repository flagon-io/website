import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Rocket,
  Compass,
  Server,
  Sparkles,
} from "lucide-react";
import { SiGithub, SiDiscord } from "@icons-pack/react-simple-icons";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { buttonClasses } from "@/components/button";
import { getProductDocsBySection } from "@/lib/docs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Documentation for Flagon, the developer platform for operating your whole system, from the dashboard, the API, or an AI assistant.",
};

const FEATURED = [
  {
    title: "Introduction",
    body: "What Flagon is, what you can do with it, and where it's going.",
    href: "/docs/get-started/introduction",
    icon: Compass,
  },
  {
    title: "Quickstart",
    body: "From nothing to your first project in a few minutes.",
    href: "/docs/get-started/quickstart",
    icon: Rocket,
  },
  {
    title: "Self-hosting",
    body: "Run the whole platform yourself. It's open source end to end.",
    href: "/docs/self-hosting/overview",
    icon: Server,
  },
];

const PROMPTS = [
  "What changed across my projects this week?",
  "Create a project called billing-api",
  "Which members have admin on this org?",
];

export default async function DocsPage() {
  const all = await getProductDocsBySection();
  const grid = all.filter((g) => g.section.toLowerCase() !== "open source");

  return (
    <div className="relative flex flex-1 flex-col">
      <a
        href="#content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-3 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-primary-foreground"
      >
        Skip to content
      </a>
      <SiteHeader />

      <main id="content" tabIndex={-1} className="outline-none">
        {/* Hero: full-bleed band, product-first, with search. */}
        <section className="border-b border-hairline bg-linear-to-b from-panel/40 to-transparent">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-24">
            <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">
              Documentation
            </p>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Build and operate your whole system.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {site.name} is the developer platform for everything you build and
              run: operate it from the dashboard, the API, or an AI assistant.
              Powerful with AI, great without it.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/docs/get-started/quickstart"
                className={buttonClasses({ size: "lg" })}
              >
                Quickstart
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/docs/get-started/introduction"
                className={buttonClasses({ variant: "secondary", size: "lg" })}
              >
                Introduction
              </Link>
            </div>
            <p className="mt-6 text-sm text-subtle">
              Looking for something? Press{" "}
              <kbd className="rounded border border-hairline bg-panel px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                ⌘K
              </kbd>{" "}
              to search the docs, handbook, and more.
            </p>
          </div>
        </section>

        {/* Operate by asking: sells the AI-hub value with real example prompts. */}
        <section className="border-b border-hairline bg-panel/30">
          <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
            <div className="flex items-center gap-2">
              <Sparkles
                className="h-5 w-5 text-brand"
                strokeWidth={2}
                aria-hidden
              />
              <h2 className="text-2xl font-semibold tracking-tight">
                Operate by asking
              </h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The assistant works over your real data, with your permissions.
              Reads run; changes are proposed for you to confirm. It gets more
              powerful as you connect more of your system.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {PROMPTS.map((p) => (
                <div
                  key={p}
                  className="rounded-xl border border-hairline bg-card p-4 font-mono text-[13px] leading-relaxed text-muted-foreground"
                >
                  <span className="text-brand">&gt;</span> {p}
                </div>
              ))}
            </div>
            <Link
              href="/docs/ai/assistant"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
            >
              About the assistant
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </section>

        {/* Start here. */}
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Start here
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURED.map((c) => {
                const Icon = c.icon;
                return (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="group flex flex-col rounded-xl border border-hairline bg-card p-6 transition hover:border-mark"
                  >
                    <Icon className="h-5 w-5 text-brand" strokeWidth={2} />
                    <h3 className="mt-4 text-base font-semibold tracking-tight group-hover:text-brand">
                      {c.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {c.body}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* All docs: a bordered grid of every category, in curated order. */}
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
            <h2 className="text-2xl font-semibold tracking-tight">All docs</h2>
            {grid.length === 0 ? (
              <p className="mt-8 max-w-2xl rounded-xl border border-hairline bg-panel/40 px-5 py-4 text-sm text-muted-foreground">
                The full index is loading from the Flagon API. Browse the
                highlights above, or press{" "}
                <kbd className="rounded border border-hairline bg-panel px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                  ⌘K
                </kbd>{" "}
                to search.
              </p>
            ) : (
              <div className="mt-10 grid grid-cols-1 border-l border-t border-hairline sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {grid.map((col) => (
                  <div
                    key={col.section}
                    className="border-b border-r border-hairline p-6"
                  >
                    <h3 className="font-mono text-[11px] uppercase tracking-widest text-subtle">
                      {col.section}
                    </h3>
                    <ul className="mt-4 flex flex-col gap-2.5">
                      {col.docs.map((doc) => (
                        <li key={doc.slug}>
                          <Link
                            href={`/docs/${doc.slug}`}
                            className="inline-flex items-center gap-2 text-sm text-link transition hover:text-brand"
                          >
                            {doc.title}
                            {doc.status === "planned" ? (
                              <span className="rounded border border-hairline px-1 py-0.5 font-mono text-[9px] uppercase tracking-widest text-subtle">
                                Soon
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Open source & community: a dedicated corner, not the framing. */}
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
            <h2 className="text-lg font-semibold tracking-tight">
              Open source &amp; community
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {site.name} is open source and built in the open. Read the source,
              run it yourself, or help shape where it goes.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <Link
                href="/docs/open-source/contributing"
                className="text-link transition hover:text-brand"
              >
                Contributing
              </Link>
              <Link
                href="/handbook"
                className="text-link transition hover:text-brand"
              >
                Handbook
              </Link>
              <a
                href={site.links.ui}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-link transition hover:text-brand"
              >
                Flagon UI
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
              <a
                href={site.links.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-link transition hover:text-brand"
              >
                <SiGithub className="h-4 w-4" />
                Source on GitHub
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
              <a
                href={site.links.discord}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-link transition hover:text-brand"
              >
                <SiDiscord className="h-4 w-4" />
                Discord
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
