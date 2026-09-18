import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Frame } from "@/components/frame";
import { Section, SectionHeader, GUTTER } from "@/components/section";
import { Schematic, SchematicGrid } from "@/components/schematic";
import { Cta } from "@/components/cta";
import { AuthorCard } from "@/components/author-card";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { getFounder } from "@/lib/people";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free until you need more, and fair when you do: the whole core product free with fixed limits, pay-as-you-go with a ceiling you set once you add a card, and SSO, SAML, and self-hosting free on every plan. No per-seat tax, no security tax, no bill shock.",
};

type Tier = {
  name: string;
  price: string;
  cadence?: string;
  tagline: string;
  features: string[];
  cta?: { label: string; href: string; external?: boolean };
  featured?: boolean;
  /** Not available yet, shown as a future plan with no CTA. */
  future?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    tagline: "Everything a team needs to run on Flagon, free for good.",
    features: [
      "The whole product, every feature",
      "Unlimited teammates, no per-seat fee",
      "SSO, SAML, and SCIM, free",
      "Generous usage limits",
      "Community support in Discord",
    ],
    cta: { label: "Start for free", href: site.links.signup, external: true },
  },
  {
    name: "Pay-as-you-go",
    price: "Usage-based",
    tagline:
      "Add a card and the fixed limits lift. Pay for what you use, capped where you say.",
    features: [
      "Everything in Free, at limits you control",
      "Priced per unit, with a spend cap",
      "Faster sync and full audit history",
      "Priority support from the builders",
    ],
    cta: { label: "Start for free", href: site.links.signup, external: true },
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    tagline:
      "For large orgs that need SLAs, dedicated support, and single-tenant deployments.",
    features: [
      "SLAs and dedicated support",
      "Single-tenant deployment",
      "Priority security review",
      "Custom terms and procurement",
    ],
    future: true,
  },
];

type Cell = boolean | string;
type CompareGroup = {
  group: string;
  rows: { feature: string; values: [Cell, Cell, Cell] }[];
};

const COMPARE: CompareGroup[] = [
  {
    group: "Platform",
    rows: [
      {
        feature: "The full product, every feature",
        values: [true, true, true],
      },
      { feature: "Projects", values: ["1", "Unlimited", "Unlimited"] },
      {
        feature: "Teams and teammates",
        values: ["Unlimited", "Unlimited", "Unlimited"],
      },
      {
        feature: "Data retention",
        values: [
          "Short window",
          "Up to 7 years, configurable",
          "Up to 7 years, configurable",
        ],
      },
      {
        feature: "Usage limits",
        values: ["Generous", "Higher, usage-based", "Custom"],
      },
      {
        feature: "Audit history",
        values: ["Full", "Full, exportable", "Full, exportable"],
      },
    ],
  },
  {
    group: "Teams and access",
    rows: [
      {
        feature: "Roles and permissions",
        values: ["Advanced", "Advanced", "Advanced"],
      },
      { feature: "SSO and SAML", values: [true, true, true] },
      { feature: "SCIM provisioning", values: [true, true, true] },
    ],
  },
  {
    group: "Sync and integrations",
    rows: [
      { feature: "Import from external systems", values: [true, true, true] },
      { feature: "Push definitions outward", values: [true, true, true] },
      { feature: "Sync frequency", values: ["Standard", "Fast", "Fast"] },
      { feature: "Public API, SDKs, and CLI", values: [true, true, true] },
    ],
  },
  {
    group: "Support",
    rows: [
      { feature: "Community support", values: [true, true, true] },
      {
        feature: "Priority support from the builders",
        values: [false, true, true],
      },
      { feature: "Dedicated support and SLAs", values: [false, false, true] },
    ],
  },
  {
    group: "Security and control",
    rows: [
      { feature: "Open source and self-hostable", values: [true, true, true] },
      { feature: "Export your data any time", values: [true, true, true] },
      { feature: "Signed DPA", values: [true, true, true] },
      { feature: "Single-tenant deployment", values: [false, false, true] },
      { feature: "Priority security review", values: [false, false, true] },
    ],
  },
];

const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: "Free is actually free",
    body: "Not a 14-day trial wearing a costume. The free tier is generous, permanent, and enough to do real work.",
  },
  {
    title: "No bill shock, ever",
    body: "Usage-based, with caps you control. You will never open an invoice and gasp. If pricing surprises you, we got it wrong.",
  },
  {
    title: "No security tax",
    body: "SSO, SAML, SCIM, and self-hosting are free on every plan, including the free one. Security is not an upsell.",
  },
  {
    title: "Never per seat",
    body: "Invite everyone who should see the work. Charging by the head just teaches companies to lock people out of their own tools.",
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Is the free tier really free?",
    a: "Yes, and permanently. No credit card, no countdown, no feature held hostage. Plenty of teams run on it and never pay us a cent, and that's fine, it's not a loophole we're waiting to close.",
  },
  {
    q: "Do I have to pay for SSO?",
    a: "No. SSO, SAML, and SCIM are free on every plan, including the free one. The 'SSO tax', where security is locked behind an enterprise upsell, is a dark pattern, and we're not doing it.",
  },
  {
    q: "How does pay-as-you-go work?",
    a: "Add a card and the fixed free limits lift. From there you pay per unit for what you actually use, and you set a spend cap, so an invoice can never run past the number you chose.",
  },
  {
    q: "Do I need a card to use everything?",
    a: "No. The whole core product runs on the free tier with no card. A couple of features that cost us real money to run ask for a card before you start them, the same as most tools do. Even then you set a spend cap, so there's no surprise.",
  },
  {
    q: "Why only one project on the free tier?",
    a: "Free is one project with a shorter data retention window, which is plenty for a side project or a small team getting started. That's the only real limit. Paid plans lift it entirely: create as many projects and teams as you like, because we don't cap those.",
  },
  {
    q: "How long do you keep my data?",
    a: "On free we hold it for a short window, enough to be useful without hoarding it. On paid plans retention is configurable up to seven years, so you keep exactly as much history as you need and nothing you don't.",
  },
  {
    q: "Do you charge per seat?",
    a: "No, on any plan. Invite your whole team. Charging by the head just teaches companies to lock people out of their own tools, and we won't do that.",
  },
  {
    q: "What about Enterprise?",
    a: "It's coming as we grow: SLAs, dedicated support, single-tenant deployments, and the procurement side of things. It isn't available yet, and the things people usually gate behind it, like SSO, are already free here.",
  },
  {
    q: "Can I run it myself?",
    a: "Yes. Flagon is open source and self-hostable on your own infrastructure, on every plan. Same product, your servers, your data.",
  },
];

export default function PricingPage() {
  const founder = getFounder();
  return (
    <Frame>
      <main>
        {/* Hero */}
        <Section divider={false}>
          <SectionHeader
            title="Free until you need more. Fair when you do."
            lead="You get the whole core product for free, with fixed limits you don't have to manage. When you need past those limits, or a feature that costs us real money to run, you add a card and it's pay-as-you-go, with a ceiling you set. No per-seat tax, no security tax, no bill shock."
          />
          <div
            className={`mt-8 flex flex-col items-start gap-x-4 gap-y-3 sm:flex-row sm:items-center ${GUTTER}`}
          >
            <Cta href={site.links.signup} external>
              Start for free
            </Cta>
            <span className="text-sm text-subtle">
              No credit card. Not a trial.
            </span>
          </div>
        </Section>

        {/* Free, then pay-as-you-go: the whole model in two cards */}
        <Section divider>
          <SectionHeader
            title="Free, then pay-as-you-go"
            lead="There's no plan to pick. You're on the free tier until you add a card, and adding one turns on pay-as-you-go with a ceiling you set. A couple of features that cost us real money ask for a card before you start, the same as most tools, but the core product doesn't."
          />
          <div className={`mt-10 ${GUTTER}`}>
            <div className="grid gap-4 lg:grid-cols-3 lg:items-stretch">
              <PlanCard
                label="No card needed"
                name="Free"
                price="$0 forever"
                tagline="The whole core product, free, with fixed limits you don't have to manage or think about."
                features={[
                  "The whole product, every feature",
                  "One project, unlimited teammates",
                  "SSO, SAML, and SCIM, free",
                  "Short data retention window",
                  "Community support in Discord",
                ]}
                note="The limits are fixed and can't be blown past, so a free account can't run up a bill."
                cta={{ label: "Start for free", href: site.links.signup }}
              />
              <PlanCard
                label="Once you add a card"
                name="Pay-as-you-go"
                price="Usage-based"
                featured
                tagline="A card lifts the fixed limits. You pay per unit for what you use, and you're the one who sets the ceiling."
                features={[
                  "Everything in Free, at limits you control",
                  "Unlimited projects and teams",
                  "Retention up to 7 years, configurable",
                  "Priced per unit, with a spend cap you set",
                  "Faster sync, full audit history, priority support",
                ]}
                note="You pick the spend cap. Going viral turns into a bigger number you chose, never a surprise."
                cta={{ label: "Start for free", href: site.links.signup }}
              />
              <PlanCard
                label="For large orgs"
                name="Enterprise"
                price="Custom"
                soon
                tagline="SLAs, dedicated support, and single-tenant deployments, for when you need them. Not on deck yet, coming as we grow."
                features={[
                  "SLAs and dedicated support",
                  "Single-tenant deployment",
                  "Priority security review",
                  "Custom terms and procurement",
                ]}
              />
            </div>
          </div>
        </Section>

        {/* Compare the plans */}
        <Section divider>
          <SectionHeader
            title="Compare the plans"
            lead="The whole picture in one table. Everything the free tier includes, and what each plan adds. Enterprise is coming as we grow."
          />
          <div className={`mt-10 ${GUTTER}`}>
            <ComparisonTable />
          </div>
        </Section>

        {/* Principles */}
        <Section divider>
          <SectionHeader
            title="The rules we charge by"
            lead="The specific promises behind the pricing, that you can hold us to."
          />
          <Schematic bleed className="mt-10">
            <SchematicGrid cols={4}>
              {PRINCIPLES.map((p) => (
                <div key={p.title} className="p-6 sm:p-8">
                  <h3 className="text-base font-semibold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              ))}
            </SchematicGrid>
          </Schematic>
          <div className={`mt-6 ${GUTTER}`}>
            <Link
              href="/handbook/priced-below-cost"
              className="text-sm font-medium text-link underline underline-offset-2"
            >
              Why our prices are what they are, in the handbook
            </Link>
          </div>
        </Section>

        {/* Founder note */}
        <Section divider>
          <div className={GUTTER}>
            <div className="mx-auto max-w-2xl rounded-xl border border-hairline bg-panel p-6 sm:p-8">
              {founder ? (
                <AuthorCard
                  name={founder.name}
                  role={founder.role}
                  photo={founder.photo}
                />
              ) : null}
              <h2 className="mt-6 text-lg font-semibold tracking-tight">
                A straight word about money
              </h2>
              <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
                <li className="flex gap-2.5">
                  <span aria-hidden className="text-brand">
                    &rarr;
                  </span>
                  We&rsquo;d genuinely rather you use Flagon free and tell a
                  friend than pay and feel it.
                </li>
                <li className="flex gap-2.5">
                  <span aria-hidden className="text-brand">
                    &rarr;
                  </span>
                  Nothing here is a loss-leader we plan to make expensive once
                  you depend on it.
                </li>
                <li className="flex gap-2.5">
                  <span aria-hidden className="text-brand">
                    &rarr;
                  </span>
                  SSO isn&rsquo;t behind a wall. Charging extra for security is
                  a scam, and we won&rsquo;t run one.
                </li>
                <li className="flex gap-2.5">
                  <span aria-hidden className="text-brand">
                    &rarr;
                  </span>
                  It&rsquo;s open source. If you&rsquo;d rather run it yourself
                  forever, the door&rsquo;s right there.
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section divider>
          <SectionHeader title="Questions, answered plainly" />
          <div className={`mt-8 ${GUTTER}`}>
            <div className="mx-auto max-w-3xl divide-y divide-hairline border-y border-hairline">
              {FAQ.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-medium outline-none transition-colors hover:text-brand focus-visible:text-brand [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span
                      aria-hidden
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-hairline text-subtle transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-5 pr-10 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Section>

        {/* CTA */}
        <Section divider className="text-center">
          <div className={GUTTER}>
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Start free. Stay if it earns it.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
              No credit card, no countdown timer, no fake &ldquo;only 2 seats
              left,&rdquo; no salesperson who suddenly knows your first name.
              Use it for real, and pay us only when you&rsquo;ve outgrown free
              and it&rsquo;s worth it.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Cta href={site.links.signup} external>
                Start for free
              </Cta>
              <Cta href="/handbook/how-we-make-money" variant="secondary">
                How we make money
              </Cta>
            </div>
          </div>
        </Section>
      </main>
    </Frame>
  );
}

function PlanCard({
  label,
  name,
  price,
  tagline,
  features,
  note,
  cta,
  featured = false,
  soon = false,
}: {
  label: string;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  note?: string;
  cta?: { label: string; href: string };
  featured?: boolean;
  /** A plan that isn't available yet: muted, dashed, with a "Coming later" mark. */
  soon?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border p-6 sm:p-8",
        soon
          ? "border-dashed border-hairline bg-panel/30"
          : featured
            ? "border-brand/30 bg-panel/50"
            : "border-hairline bg-card",
      )}
    >
      <div className="flex items-center gap-2">
        {soon ? (
          <span className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-subtle">
            Coming later
          </span>
        ) : (
          <>
            <span
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                featured ? "bg-brand" : "border border-subtle",
              )}
              aria-hidden
            />
            <span className="font-mono text-[11px] uppercase tracking-widest text-subtle">
              {label}
            </span>
          </>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h3
          className={cn(
            "text-xl font-semibold tracking-tight",
            soon && "text-muted-foreground",
          )}
        >
          {name}
        </h3>
        <span className="text-sm text-subtle">{price}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {tagline}
      </p>

      <ul className="mt-6 flex flex-1 flex-col gap-3 border-t border-hairline pt-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <Check
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                soon ? "text-subtle" : "text-brand",
              )}
              strokeWidth={2.5}
            />
            <span className="text-muted-foreground">{f}</span>
          </li>
        ))}
      </ul>

      {note ? (
        <p className="mt-6 border-t border-hairline pt-4 text-xs leading-relaxed text-subtle">
          {note}
        </p>
      ) : null}

      <div className="mt-6">
        {cta ? (
          <Cta
            href={cta.href}
            external
            variant={featured ? "primary" : "secondary"}
            className="w-full"
          >
            {cta.label}
          </Cta>
        ) : (
          <div className="w-full rounded-md border border-dashed border-hairline px-4 py-2 text-center text-sm text-subtle">
            Coming as we grow
          </div>
        )}
      </div>
    </div>
  );
}

function ValueCell({ value }: { value: Cell }) {
  if (value === true)
    return (
      <Check
        className="mx-auto h-4 w-4 text-brand"
        strokeWidth={2.5}
        aria-label="Included"
      />
    );
  if (value === false)
    return (
      <Minus
        className="mx-auto h-4 w-4 text-subtle"
        strokeWidth={2}
        aria-label="Not included"
      />
    );
  return <span className="text-muted-foreground">{value}</span>;
}

function ComparisonTable() {
  const plans = TIERS.map((t) => ({
    name: t.name,
    featured: t.featured,
    future: t.future,
  }));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-170 border-collapse text-sm">
        <thead>
          <tr className="border-b border-hairline">
            <th className="w-2/5 py-4 pr-4 text-left" />
            {plans.map((p) => (
              <th
                key={p.name}
                className={cn(
                  "px-4 py-4 text-center align-bottom text-base font-semibold tracking-tight",
                  p.featured && "text-brand",
                )}
              >
                {p.name}
                {p.future && (
                  <span className="mt-1 block font-mono text-[9px] font-normal uppercase tracking-widest text-subtle">
                    Coming later
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE.map((group) => (
            <Fragment key={group.group}>
              <tr>
                <td
                  colSpan={4}
                  className="border-b border-hairline bg-panel/60 px-1 py-2.5 font-mono text-[11px] uppercase tracking-widest text-subtle"
                >
                  {group.group}
                </td>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.feature} className="border-b border-hairline">
                  <td className="py-3.5 pr-4 text-muted-foreground">
                    {row.feature}
                  </td>
                  {row.values.map((v, i) => (
                    <td
                      key={i}
                      className={cn(
                        "px-4 py-3.5 text-center",
                        plans[i]?.featured && "bg-brand/4",
                      )}
                    >
                      <ValueCell value={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
