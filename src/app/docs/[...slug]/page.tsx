import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ScrollReset } from "@/components/scroll-reset";
import { Mdx } from "@/components/mdx";
import { Toc } from "@/components/toc";
import { DocsSidebar } from "@/components/docs-sidebar";
import { DocComingSoon } from "@/components/doc-coming-soon";
import { extractToc } from "@/lib/toc";
import { getDoc, getProductDocsBySection } from "@/lib/docs";
import { site } from "@/lib/site";

type Params = { slug: string[] };

// Rendered per request from the live API for now (docs.ts fetches with no
// caching), so pages always match what the API has, with nothing to configure.

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDoc(slug.join("/"));
  if (!doc) return {};
  return {
    title: `${doc.title} · Docs`,
    description: doc.description,
  };
}

export default async function DocPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const path = slug.join("/");

  // The handbook shares the corpus but has its own surface; canonicalize.
  if (path.startsWith("handbook/")) {
    redirect(`/handbook/${path.slice("handbook/".length)}`);
  }

  const [doc, sections] = await Promise.all([getDoc(path), getProductDocsBySection()]);
  if (!doc) notFound();

  const planned = doc.status === "planned";
  const toc = planned ? [] : extractToc(doc.body);

  const flat = sections.flatMap((g) => g.docs.filter((d) => d.status !== "planned"));
  const idx = flat.findIndex((d) => d.slug === path);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;
  const year = new Date().getFullYear();

  return (
    <div className="relative flex flex-1 flex-col">
      <a
        href="#content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-3 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-primary-foreground"
      >
        Skip to content
      </a>

      <SiteHeader />

      <div className="mx-auto w-full max-w-7xl border-x border-hairline lg:flex lg:h-[calc(100dvh-4rem)] lg:flex-col lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:min-h-0 lg:flex-1 lg:grid-cols-[276px_minmax(0,1fr)] lg:overflow-hidden">
          {/* Left rail: own scroll on desktop; collapses behind a toggle on mobile. */}
          <aside className="border-b border-hairline py-4 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:border-b-0 lg:border-r lg:py-0">
            <DocsSidebar sections={sections} />
          </aside>

          {/* Content: own scroll on desktop. */}
          <div id="content" tabIndex={-1} className="min-w-0 outline-none lg:h-full lg:overflow-y-auto">
            <ScrollReset targetId="content" />
            <div className="px-6 py-10 sm:px-8 lg:px-10">
              <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-12">
                <div className="min-w-0">
                  <article>
                    <nav
                      aria-label="Breadcrumb"
                      className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-subtle"
                    >
                      <Link href="/docs" className="transition hover:text-foreground">
                        Docs
                      </Link>
                      {doc.section ? (
                        <>
                          <span aria-hidden>/</span>
                          <span className="text-foreground">{doc.section}</span>
                        </>
                      ) : null}
                    </nav>
                    <header className="mt-4 border-b border-hairline pb-8">
                      <h1 className="text-balance text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">
                        {doc.title}
                      </h1>
                      {doc.description ? (
                        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                          {doc.description}
                        </p>
                      ) : null}
                    </header>

                    {planned ? (
                      <DocComingSoon slug={path} />
                    ) : (
                      <div className="prose mt-10 max-w-2xl">
                        <Mdx source={doc.body} />
                      </div>
                    )}
                  </article>

                  {!planned && (
                    <div className="mt-12 max-w-2xl border-t border-hairline pt-6">
                      <a
                        href={`https://github.com/flagon-io/flagon/blob/main/docs/${path}.mdx`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[11px] uppercase tracking-widest text-subtle transition hover:text-foreground"
                      >
                        Edit this page on GitHub →
                      </a>
                    </div>
                  )}

                  {(prev || next) && (
                    <nav className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
                      {prev ? (
                        <Link
                          href={`/docs/${prev.slug}`}
                          className="group rounded-lg border border-hairline p-5 transition hover:bg-panel"
                        >
                          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-subtle">
                            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} /> Previous
                          </span>
                          <p className="mt-2 font-medium tracking-tight group-hover:text-brand">
                            {prev.title}
                          </p>
                        </Link>
                      ) : (
                        <span />
                      )}
                      {next ? (
                        <Link
                          href={`/docs/${next.slug}`}
                          className="group rounded-lg border border-hairline p-5 text-right transition hover:bg-panel"
                        >
                          <span className="flex items-center justify-end gap-1.5 font-mono text-[10px] uppercase tracking-widest text-subtle">
                            Next <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                          </span>
                          <p className="mt-2 font-medium tracking-tight group-hover:text-brand">
                            {next.title}
                          </p>
                        </Link>
                      ) : (
                        <span />
                      )}
                    </nav>
                  )}
                </div>

                <aside className="hidden xl:block xl:sticky xl:top-2 xl:max-h-[calc(100dvh-8rem)] xl:self-start xl:overflow-y-auto xl:overscroll-contain">
                  <Toc items={toc} />
                </aside>
              </div>
            </div>
          </div>
        </div>

        <footer className="border-t border-hairline">
          <div className="flex flex-col items-center gap-2 px-6 py-4 font-mono text-[11px] uppercase tracking-widest text-subtle sm:flex-row sm:justify-between sm:px-8">
            <p>
              © {year} {site.legalName}
            </p>
            <p>Built in public · {site.domain}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
