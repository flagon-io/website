import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/mdx";
import { Toc } from "@/components/toc";
import { Frame } from "@/components/frame";
import { extractToc } from "@/lib/toc";
import { getDoc } from "@/lib/docs";

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
  const doc = await getDoc(path);
  if (!doc) notFound();

  const toc = extractToc(doc.body);

  return (
    <Frame>
      <main className="w-full px-4 py-12 sm:px-6 lg:px-10">
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-12">
          <div className="min-w-0">
            <article>
              <header className="border-b border-hairline pb-8">
                <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">
                  {doc.section ?? "Docs"}
                </p>
                <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">
                  {doc.title}
                </h1>
                {doc.description ? (
                  <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                    {doc.description}
                  </p>
                ) : null}
              </header>

              <div className="prose mt-10 max-w-2xl">
                <Mdx source={doc.body} />
              </div>
            </article>

            {/* Docs are the single source of truth in the product repo: edit them
                next to the code they describe. */}
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
          </div>

          <aside className="hidden xl:block xl:sticky xl:top-10 xl:max-h-[calc(100dvh-8rem)] xl:self-start xl:overflow-y-auto xl:overscroll-contain">
            <Toc items={toc} />
          </aside>
        </div>
      </main>
    </Frame>
  );
}
