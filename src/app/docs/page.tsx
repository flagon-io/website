import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Frame } from "@/components/frame";
import { DocsSearch } from "@/components/docs-search";
import { getProductDocsBySection } from "@/lib/docs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Product documentation for Flagon: guides, reference, and examples, built with the same care as the product and always current with what it actually does.",
};

type DocLink = { label: string; href: string; external?: boolean };
type Column = { title: string; links: DocLink[] };

export default async function DocsPage() {
  const sections = await getProductDocsBySection();

  // The "All docs" grid: product sections from the corpus, then curated columns
  // for the reference and company docs that live on their own surfaces. The
  // curated columns always exist, so the grid reads as intentional even while
  // the product docs are still filling in.
  const productColumns: Column[] = sections.map((g) => ({
    title: g.section,
    links: g.docs.map((d) => ({ label: d.title, href: `/docs/${d.slug}` })),
  }));

  const curatedColumns: Column[] = [
    { title: "Reference", links: [{ label: "API reference", href: "/docs/api" }] },
    {
      title: "The company",
      links: [
        { label: "Handbook", href: "/handbook" },
        { label: "Brand", href: "/handbook/brand-overview" },
      ],
    },
    {
      title: "More",
      links: [{ label: "Source on GitHub", href: site.links.github, external: true }],
    },
  ];

  const columns = [...productColumns, ...curatedColumns];

  return (
    <Frame>
      <main>
        {/* Hero: title, one line, and a prominent search. */}
        <section className="border-b border-hairline px-6 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              {site.name} docs
            </h1>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Everything you need to build, deploy, and operate on {site.name}. Written next to
              the code, so it&rsquo;s always current with what the product actually does.
            </p>
            <div className="mt-8">
              <DocsSearch />
            </div>
          </div>
        </section>

        {/* All docs: a grid of categories, each listing its pages. */}
        <section className="px-6 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight">All docs</h2>
            <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {columns.map((col) => (
                <div key={col.title}>
                  <h3 className="font-mono text-[11px] uppercase tracking-widest text-subtle">
                    {col.title}
                  </h3>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {col.links.map((link) =>
                      link.external ? (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-link transition hover:text-brand"
                          >
                            {link.label}
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                          </a>
                        </li>
                      ) : (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="text-sm text-link transition hover:text-brand"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Frame>
  );
}
