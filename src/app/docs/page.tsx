import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Rocket, Compass, Server } from "lucide-react";
import { SiGithub, SiDiscord } from "@icons-pack/react-simple-icons";
import { Frame } from "@/components/frame";
import { DocsSearch } from "@/components/docs-search";
import { buttonClasses } from "@/components/button";
import { getProductDocsBySection } from "@/lib/docs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Product documentation for Flagon: build, deploy, and operate your projects, drivable from the dashboard, the assistant, or the API.",
};

const FEATURED = [
  {
    title: "Introduction",
    body: "What Flagon is, what you can do with it, and how the pieces fit.",
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

export default async function DocsPage() {
  const all = await getProductDocsBySection();
  // Open source gets its own strip below; keep it out of the product grid.
  const grid = all.filter((g) => g.section.toLowerCase() !== "open source");

  return (
    <Frame>
      <main>
        {/* Hero: what it is, the two first moves, and search. */}
        <section className="border-b border-hairline px-6 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Build on {site.name}
            </h1>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Everything you need to build, deploy, and operate your projects, from the dashboard,
              the assistant, or the API. Written next to the code, so it&rsquo;s always current.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/docs/get-started/quickstart" className={buttonClasses({ size: "lg" })}>
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
            <div className="mt-10">
              <DocsSearch />
            </div>
          </div>
        </section>

        {/* Start here: the pages most people want first. */}
        <section className="border-b border-hairline px-6 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight">Start here</h2>
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
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* All docs: every product category and its pages. */}
        <section className="px-6 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight">All docs</h2>
            <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {grid.map((col) => (
                <div key={col.section}>
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
          </div>
        </section>

        {/* Open source & community: a dedicated corner, not the framing. */}
        <section className="border-t border-hairline px-6 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-lg font-semibold tracking-tight">Open source &amp; community</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {site.name} is open source and built in the open. Read the source, run it yourself,
              or help shape where it goes.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <Link
                href="/docs/open-source/contributing"
                className="text-link transition hover:text-brand"
              >
                Contributing
              </Link>
              <Link href="/handbook" className="text-link transition hover:text-brand">
                Handbook
              </Link>
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
    </Frame>
  );
}
