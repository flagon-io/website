import { Fragment } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ScrollReset } from "@/components/scroll-reset";
import { Mdx } from "@/components/mdx";
import { Toc } from "@/components/toc";
import { DocsSidebar } from "@/components/docs-sidebar";
import { MobileSidebar } from "@/components/sidebar";
import { DocComingSoon } from "@/components/doc-coming-soon";
import { extractToc } from "@/lib/toc";
import {
  DOCS_INDEX_SLUG,
  docHref,
  flattenDocsNav,
  type DocPage,
  type DocsNav,
} from "@/lib/docs";
import { site } from "@/lib/site";

/**
 * One docs page in the full docs shell: the grouped sidebar, the article
 * (breadcrumb of group and section, title, MDX body), previous/next in nav
 * reading order, and the "On this page" rail. Shared by the /docs landing
 * (docs/index.mdx) and every /docs/<slug> page so they always look alike.
 */
export function DocView({ doc, nav }: { doc: DocPage; nav: DocsNav }) {
  const path = doc.slug;
  const isIndex = path === DOCS_INDEX_SLUG;
  const planned = doc.status === "planned";
  const toc = planned ? [] : extractToc(doc.body);

  const flat = flattenDocsNav(nav);
  const here = flat.find((d) => d.slug === path);
  const crumbs = isIndex
    ? []
    : [here?.group, here?.section ?? doc.section].filter(
        (c): c is string => Boolean(c),
      );

  const readable = flat.filter((d) => d.status !== "planned");
  const idx = readable.findIndex((d) => d.slug === path);
  const prev = idx > 0 ? readable[idx - 1] : null;
  const next = idx >= 0 && idx < readable.length - 1 ? readable[idx + 1] : null;
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
          {/* Mobile: a nav bar docked under the header while the page scrolls. */}
          <MobileSidebar toggleLabel="Browse docs">
            <DocsSidebar nav={nav} />
          </MobileSidebar>

          {/* Left rail: own scroll, shown inline from lg up. */}
          <aside className="hidden border-hairline lg:block lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:border-r">
            <DocsSidebar nav={nav} />
          </aside>

          {/* Content: own scroll on desktop. */}
          <div
            id="content"
            tabIndex={-1}
            className="min-w-0 outline-none lg:h-full lg:overflow-y-auto"
          >
            <ScrollReset targetId="content" />
            <div className="px-6 py-10 sm:px-8 lg:px-10">
              <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-12">
                <div className="min-w-0">
                  <article>
                    <nav
                      aria-label="Breadcrumb"
                      className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-subtle"
                    >
                      <Link
                        href="/docs"
                        className="transition hover:text-foreground"
                      >
                        Docs
                      </Link>
                      {crumbs.map((c, i) => (
                        <Fragment key={`${i}-${c}`}>
                          <span aria-hidden>/</span>
                          <span
                            className={
                              i === crumbs.length - 1
                                ? "text-foreground"
                                : undefined
                            }
                          >
                            {c}
                          </span>
                        </Fragment>
                      ))}
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
                          href={docHref(prev.slug)}
                          className="group rounded-lg border border-hairline p-5 transition hover:bg-panel"
                        >
                          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-subtle">
                            <ArrowLeft
                              className="h-3.5 w-3.5"
                              strokeWidth={2}
                            />{" "}
                            Previous
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
                          href={docHref(next.slug)}
                          className="group rounded-lg border border-hairline p-5 text-right transition hover:bg-panel"
                        >
                          <span className="flex items-center justify-end gap-1.5 font-mono text-[10px] uppercase tracking-widest text-subtle">
                            Next{" "}
                            <ArrowRight
                              className="h-3.5 w-3.5"
                              strokeWidth={2}
                            />
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
