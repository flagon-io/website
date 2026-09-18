import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Code,
  Compass,
  GraduationCap,
  Package,
  Palette,
  Rocket,
  Server,
  type LucideIcon,
} from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Frame } from "@/components/frame";
import { Section, SectionHeader, GUTTER } from "@/components/section";
import { site } from "@/lib/site";
import { getDocsBySection } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Product documentation, built with the same care as the product itself. Guides, reference, SDKs, and more, growing alongside the platform.",
};

type Card = {
  title: string;
  body: string;
  href: string;
  external?: boolean;
  icon: LucideIcon | typeof SiGithub;
};

const AVAILABLE: Card[] = [
  {
    title: "API reference",
    body: "Explore every endpoint, schema, and example, generated live from the OpenAPI spec and always current with what the API actually does.",
    href: "/docs/api",
    icon: Code,
  },
  {
    title: "The handbook",
    body: "How the whole company works, in ~60 pages. The most thorough thing we've documented so far.",
    href: "/handbook",
    icon: BookOpen,
  },
  {
    title: "Brand",
    body: "The mark, the palette, the type, and how to use them. Everything the brand is built on, in the handbook.",
    href: "/handbook/brand-overview",
    icon: Palette,
  },
  {
    title: "Source on GitHub",
    body: "This whole site is open source. Read it, fork it, or open a pull request against the handbook.",
    href: site.links.github,
    external: true,
    icon: SiGithub,
  },
];

const PLANNED: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Get started",
    body: "Install Flagon and ship your first real thing in minutes, not an afternoon.",
    icon: Rocket,
  },
  {
    title: "Guides",
    body: "Task-focused walkthroughs for the things people actually sit down to do.",
    icon: Compass,
  },
  {
    title: "SDKs & libraries",
    body: "First-class clients for the languages and frameworks you already build in.",
    icon: Package,
  },
  {
    title: "Self-hosting",
    body: "Run Flagon on your own infrastructure, step by step, with nothing hidden.",
    icon: Server,
  },
  {
    title: "Tutorials",
    body: "Longer worked examples that go from an empty project to something shipped.",
    icon: GraduationCap,
  },
];

export default async function DocsPage() {
  // Product docs only. The handbook lives in the same corpus but has its own
  // surface at /handbook, so it is excluded here by its slug prefix.
  const sections = (await getDocsBySection())
    .map((g) => ({ ...g, docs: g.docs.filter((d) => !d.slug.startsWith("handbook/")) }))
    .filter((g) => g.docs.length > 0);

  return (
    <Frame>
      <main>
        <Section divider={false}>
          <SectionHeader
            title="Docs, built like the product."
            lead="Product guides, reference, and examples live here, built with the same care as the product itself. Docs are part of the product, not an afterthought. The handbook is already the most thorough thing we've documented, and the product reference grows here alongside the platform."
          />
        </Section>

        {/* Live product docs, served by the API straight from the product repo.
            Rendered only when there are pages, so it stays quiet until docs ship. */}
        {sections.length > 0 && (
          <Section divider>
            <SectionHeader
              title="Product documentation"
              lead="Written next to the code they describe, so they are always current with what the product actually does."
            />
            <div className={`mt-10 ${GUTTER}`}>
              <div className="flex flex-col gap-10">
                {sections.map((group) => (
                  <div key={group.section}>
                    <h3 className="font-mono text-[11px] uppercase tracking-widest text-subtle">
                      {group.section}
                    </h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {group.docs.map((doc) => (
                        <Link
                          key={doc.slug}
                          href={`/docs/${doc.slug}`}
                          className="group flex flex-col rounded-xl border border-hairline bg-card p-6 transition hover:border-mark"
                        >
                          <h4 className="text-base font-semibold tracking-tight group-hover:text-brand">
                            {doc.title}
                          </h4>
                          {doc.description ? (
                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                              {doc.description}
                            </p>
                          ) : null}
                          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                            Read
                            <ArrowRight
                              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                              strokeWidth={2}
                            />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* Available now */}
        <Section divider>
          <SectionHeader title="What you can read today" />
          <div className={`mt-10 ${GUTTER}`}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {AVAILABLE.map((c) => {
                const Icon = c.icon;
                const inner = (
                  <>
                    <Icon className="h-5 w-5 text-brand" />
                    <h3 className="mt-4 text-base font-semibold tracking-tight group-hover:text-brand">
                      {c.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                      Open
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                        strokeWidth={2}
                      />
                    </span>
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

        {/* Planned */}
        <Section divider>
          <SectionHeader
            title="What will live here"
            lead="The shape of the docs. Each area grows as its part of the platform does."
          />
          <div className={`mt-10 ${GUTTER}`}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PLANNED.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.title}
                    className="flex flex-col rounded-xl border border-dashed border-hairline bg-panel p-6"
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-subtle" strokeWidth={2} />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-subtle">
                        Planned
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-semibold tracking-tight">{c.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>
      </main>
    </Frame>
  );
}
