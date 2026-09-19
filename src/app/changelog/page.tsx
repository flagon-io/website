import type { Metadata } from "next";
import Link from "next/link";
import { Frame } from "@/components/frame";
import { Section, SectionHeader, GUTTER } from "@/components/section";
import { Mdx } from "@/components/mdx";
import { Cta } from "@/components/cta";
import { getChangelog, byYear, type ChangelogEntry } from "@/lib/changelog";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Every change to Flagon, with a date and a plain-English note about what moved and why.",
};

/** Format an ISO date (YYYY-MM-DD) as "September 19, 2026", pinned to UTC so the
 * day never shifts with the server's timezone. */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function ChangelogPage() {
  const { entries, available } = await getChangelog();
  const years = byYear(entries);

  return (
    <Frame>
      <main>
        <Section divider={false}>
          <SectionHeader
            title="What changes, as it changes"
            lead="Every change to Flagon lands here with a date and a plain note about what moved and why. For where things are headed next, the roadmap is the place, and the blog is where we think out loud."
          />
        </Section>

        <Section divider>
          <div className={GUTTER}>
            {!available ? (
              <p className="rounded-xl border border-hairline bg-panel/40 px-5 py-8 text-center text-sm text-muted-foreground">
                The changelog is currently unavailable. It loads live from the
                Flagon API, which isn&rsquo;t answering right now. Please check
                back in a moment.
              </p>
            ) : entries.length === 0 ? (
              <p className="rounded-xl border border-dashed border-hairline px-5 py-8 text-center text-sm text-subtle">
                Nothing has shipped yet. The{" "}
                <Link
                  href="/roadmap"
                  className="text-brand underline-offset-4 hover:underline"
                >
                  roadmap
                </Link>{" "}
                is where the work in flight lives.
              </p>
            ) : (
              <div className="flex flex-col gap-16">
                {years.map((group) => (
                  <section key={group.year}>
                    <h2 className="mb-8 font-mono text-xs uppercase tracking-widest text-subtle">
                      {group.year}
                    </h2>
                    <div className="flex flex-col gap-12">
                      {group.entries.map((entry) => (
                        <Entry key={entry.slug} entry={entry} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </Section>

        <Section divider className="text-center">
          <div className={GUTTER}>
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              What&rsquo;s coming next
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
              The changelog is what shipped. The roadmap is where things are
              headed, in the open.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Cta href="/roadmap">See the roadmap</Cta>
              <Cta href="/blog" variant="secondary">
                Read the blog
              </Cta>
            </div>
          </div>
        </Section>
      </main>
    </Frame>
  );
}

/** One changelog entry: a dated note with optional badges and a Markdown body.
 * Laid out as a two-column row on wide screens (date rail + content) that stacks
 * on mobile. */
function Entry({ entry }: { entry: ChangelogEntry }) {
  return (
    <article
      id={entry.slug}
      className="grid scroll-mt-24 gap-3 border-t border-hairline pt-8 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8"
    >
      <div className="flex flex-col gap-2">
        <time dateTime={entry.date} className="text-sm text-subtle">
          {formatDate(entry.date)}
        </time>
        <div className="flex flex-wrap gap-1.5">
          {entry.tag ? (
            <span className="w-fit rounded-full bg-brand/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-brand">
              {entry.tag}
            </span>
          ) : null}
          {entry.area ? (
            <span className="w-fit rounded-full border border-hairline px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-subtle">
              {entry.area}
            </span>
          ) : null}
        </div>
      </div>

      <div className="min-w-0">
        <h3 className="text-xl font-semibold tracking-tight">
          <Link href={`#${entry.slug}`} className="hover:text-brand">
            {entry.title}
          </Link>
        </h3>
        <div className="prose mt-3 max-w-2xl">
          <Mdx source={entry.body} />
        </div>
      </div>
    </article>
  );
}
