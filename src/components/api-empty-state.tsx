import Link from "next/link";
import { ArrowUpRight, BookOpen, FileJson2, type LucideIcon } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Section, SectionHeader, GUTTER } from "@/components/section";
import { site } from "@/lib/site";

type LinkCard = {
  title: string;
  body: string;
  href: string;
  external?: boolean;
  icon: LucideIcon | typeof SiGithub;
};

const CARDS: LinkCard[] = [
  {
    title: "The raw OpenAPI document",
    body: "The live spec this page is generated from. Point your own tools, generators, or clients straight at it.",
    href: "https://api.flagon.io/openapi.json",
    external: true,
    icon: FileJson2,
  },
  {
    title: "Follow along on GitHub",
    body: "The API is built in the open. Watch endpoints land in the commit history as they ship.",
    href: site.links.github,
    external: true,
    icon: SiGithub,
  },
  {
    title: "The handbook",
    body: "How we build, why the API is shaped the way it is, and where the platform is headed.",
    href: "/handbook",
    icon: BookOpen,
  },
];

/**
 * Shown while the API has no endpoints published yet. Honest and on-brand: the
 * reference is live and wired to the real spec, and it fills in the moment
 * endpoints ship. The full explorer replaces this automatically once paths exist.
 */
export function ApiEmptyState({
  version,
  reachable,
}: {
  version: string;
  reachable: boolean;
}) {
  return (
    <>
      <Section divider={false}>
        <SectionHeader
          title="The API reference builds in the open."
          lead="This page is generated live from the OpenAPI document the API publishes. There are no endpoints to explore just yet. As the API ships them, they appear here on their own, fully browsable, with schemas, examples, and a console to try them."
        />
        <div className={`mt-6 ${GUTTER}`}>
          <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-subtle">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                reachable ? "bg-brand" : "bg-subtle"
              }`}
              aria-hidden
            />
            {reachable ? "Live" : "Offline"} · api.flagon.io · v{version} · 0 endpoints
          </p>
        </div>
      </Section>

      <Section divider>
        <div className={GUTTER}>
          <div className="grid gap-4 sm:grid-cols-3">
            {CARDS.map((c) => {
              const Icon = c.icon;
              const inner = (
                <>
                  <Icon className="h-5 w-5 text-brand" />
                  <h3 className="mt-4 flex items-center gap-1 text-base font-semibold tracking-tight group-hover:text-brand">
                    {c.title}
                    {c.external ? (
                      <ArrowUpRight
                        className="h-3.5 w-3.5 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                        strokeWidth={2}
                      />
                    ) : null}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                </>
              );
              const cls =
                "group flex flex-col rounded-xl border border-hairline bg-card p-6 transition hover:border-mark";
              return c.external ? (
                <a key={c.title} href={c.href} target="_blank" rel="noreferrer" className={cls}>
                  {inner}
                </a>
              ) : (
                <Link key={c.title} href={c.href} className={cls}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
}
