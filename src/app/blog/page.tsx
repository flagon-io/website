import type { Metadata } from "next";
import Link from "next/link";
import { Frame } from "@/components/frame";
import { Section, SectionHeader } from "@/components/section";
import { Schematic } from "@/components/schematic";
import { Cta } from "@/components/cta";
import { getAllPosts, formatDate } from "@/lib/blog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes from building a software company in public: decisions, mistakes, and the occasional strong opinion.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <Frame>
      <main>
        <Section divider={false}>
          <SectionHeader
            title="We write things down"
            lead="Notes from building a company in the open: how we decide, what we get wrong, and the occasional strong opinion we're willing to defend."
          />
        </Section>

        <Section divider>
          <Schematic bleed>
            {posts.length === 0 ? (
              <div className="mx-auto max-w-md px-6 py-20 text-center sm:py-24">
                <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">
                  Nothing here yet
                </p>
                <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                  We&rsquo;d rather write nothing than write filler.
                </h2>
                <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                  There&rsquo;s no blog here yet, and we&rsquo;re not going to pad it
                  out to look busy. When we&rsquo;ve got something worth your time, a
                  real decision, a mistake we made, an opinion we&rsquo;ll defend,
                  it&rsquo;ll show up here. Until then, the thinking lives in the
                  handbook.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Cta href="/handbook">Read the handbook</Cta>
                  <Cta href={site.links.discord} external variant="secondary">
                    Follow along in Discord
                  </Cta>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-hairline">
                {posts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group block p-6 transition hover:bg-panel sm:p-8"
                  >
                    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-subtle">
                      <span>{formatDate(p.date)}</span>
                      <span>·</span>
                      <span>{p.readingMinutes} min</span>
                      {p.tags[0] ? (
                        <>
                          <span>·</span>
                          <span className="text-brand">{p.tags[0]}</span>
                        </>
                      ) : null}
                    </div>
                    <h2 className="mt-3 text-xl font-semibold tracking-tight group-hover:text-brand sm:text-2xl">
                      {p.title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                    <p className="mt-4 text-sm text-subtle">
                      by {p.author}
                      {p.role ? `, ${p.role}` : ""}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </Schematic>
        </Section>
      </main>
    </Frame>
  );
}
