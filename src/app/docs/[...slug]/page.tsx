import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Mdx } from "@/components/mdx";
import { Toc } from "@/components/toc";
import { Frame } from "@/components/frame";
import { DocsSidebar } from "@/components/docs-sidebar";
import { DocsSearch } from "@/components/docs-search";
import { DocComingSoon } from "@/components/doc-coming-soon";
import { extractToc } from "@/lib/toc";
import { getDoc, getProductDocsBySection } from "@/lib/docs";

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

  // The handbook shares the corpus but has its own surface. Unified search can
  // surface a handbook page here, so send it to its canonical /handbook URL
  // rather than rendering a duplicate under /docs.
  if (path.startsWith("handbook/")) {
    redirect(`/handbook/${path.slice("handbook/".length)}`);
  }

  const [doc, sections] = await Promise.all([getDoc(path), getProductDocsBySection()]);
  if (!doc) notFound();

  const planned = doc.status === "planned";
  const toc = planned ? [] : extractToc(doc.body);

  // Flat reading order across sections, for prev/next.
  const flat = sections.flatMap((g) => g.docs);
  const idx = flat.findIndex((d) => d.slug === path);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  return (
    <Frame>
      <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
        {/* Left rail: every section and page, current one marked. */}
        <aside className="hidden border-r border-hairline lg:block">
          <div className="lg:sticky lg:top-8 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:overscroll-contain px-6 py-8">
            <DocsSidebar sections={sections} currentSlug={path} />
          </div>
        </aside>

        <main className="min-w-0 px-6 py-10 sm:px-8 lg:px-10">
          {/* Search stays reachable on every page (press "/" to focus). */}
          <div className="mb-8 max-w-3xl">
            <DocsSearch />
          </div>

          {/* Mobile: the section nav collapses into a disclosure. */}
          <details className="mb-8 rounded-lg border border-hairline lg:hidden">
            <summary className="cursor-pointer px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-subtle">
              Browse docs
            </summary>
            <div className="border-t border-hairline px-4 py-4">
              <DocsSidebar sections={sections} currentSlug={path} />
            </div>
          </details>

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

              {/* Docs are the single source of truth in the product repo: edit them
                  next to the code they describe. Planned pages carry their own
                  "write this" link, so the edit link is only for real articles. */}
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

            <aside className="hidden xl:block xl:sticky xl:top-10 xl:max-h-[calc(100dvh-8rem)] xl:self-start xl:overflow-y-auto xl:overscroll-contain">
              <Toc items={toc} />
            </aside>
          </div>
        </main>
      </div>
    </Frame>
  );
}
