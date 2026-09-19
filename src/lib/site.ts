import type { ComponentType } from "react";
import {
  BookOpen,
  Boxes,
  Briefcase,
  Building2,
  Component,
  FlaskConical,
  Handshake,
  Info,
  Map,
  Megaphone,
  Newspaper,
  ScrollText,
  Users,
} from "lucide-react";
import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";

/**
 * Single source of truth for the company's identity and top-level navigation.
 * Everything that renders the name, the legal entity, links, or the nav reads
 * from here so there is exactly one place to change them.
 */

const links = {
  github: "https://github.com/flagon-io",
  /** The repo backing this site (used for "edit on GitHub" links). */
  repo: "https://github.com/flagon-io/website",
  /** The product app, on its own subdomain. */
  app: "https://app.flagon.io",
  /** Flagon UI, the design system, on its own subdomain. Open source, free to use. */
  ui: "https://ui.flagon.io",
  /** Where every "Start for free" CTA points. */
  signup: "https://app.flagon.io/signup",
  discord: "https://discord.gg/dtYQs6rPXN",
  email: "hey@flagon.io",
} as const;

type IconType = ComponentType<{ className?: string }>;

export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  icon?: IconType;
};
/** A dropdown: sections of links, rendered with a divider between sections. */
export type NavGroup = {
  label: string;
  sections: readonly (readonly NavLink[])[];
};
export type NavItem = NavLink | NavGroup;

/**
 * Top nav is product-shaped (PostHog model): the products/pricing/docs slots sit
 * up front, and the community + company pages collapse into grouped dropdowns.
 */
const nav: readonly NavItem[] = [
  { label: "Products", href: "/products" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  {
    label: "Community",
    sections: [
      [
        { label: "Blog", href: "/blog", icon: Newspaper },
        { label: "Flagon UI", href: links.ui, external: true, icon: Component },
        {
          label: "Discord",
          href: links.discord,
          external: true,
          icon: SiDiscord,
        },
        { label: "GitHub", href: links.github, external: true, icon: SiGithub },
      ],
    ],
  },
  {
    label: "Company",
    sections: [
      [
        { label: "About", href: "/about", icon: Info },
        { label: "Customers", href: "/customers", icon: Building2 },
        { label: "Handbook", href: "/handbook", icon: BookOpen },
        { label: "Roadmap", href: "/roadmap", icon: Map },
        { label: "Changelog", href: "/changelog", icon: ScrollText },
        { label: "Media", href: "/media", icon: Megaphone },
      ],
      [
        { label: "People", href: "/people", icon: Users },
        { label: "Small teams", href: "/teams", icon: Boxes },
        { label: "Careers", href: "/careers", icon: Briefcase },
        { label: "Side projects", href: "/side-projects", icon: FlaskConical },
        { label: "Partnerships", href: "/partnerships", icon: Handshake },
      ],
    ],
  },
];

export const site = {
  name: "Flagon",
  legalName: "Flagon, Inc.",
  domain: "flagon.io",
  url: "https://www.flagon.io",
  tagline: "We build software in the open.",
  description:
    "Flagon is a developer platform for operating your whole system: your projects, tools, and teams in one place, driven from the dashboard, the API, or an AI assistant. Powerful with AI, great without it. Open source, self-hostable, and built in the open.",
  links,
  nav,
} as const;

export function isNavGroup(item: NavItem): item is NavGroup {
  return "sections" in item;
}
