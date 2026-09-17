import type { ReactNode } from "react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { cn } from "@/lib/cn";
import { CompCalculator } from "@/components/comp-calculator";
import {
  MarkTreatments,
  MarkSizes,
  MarkMotion,
  Palette,
  TypeSpecimen,
  MarkUsage,
} from "@/components/brand-blocks";

/** Callout box usable inside MDX: <Callout>…</Callout> or type="warn". */
function Callout({
  children,
  type = "note",
  title,
}: {
  children: ReactNode;
  type?: "note" | "warn" | "brand";
  title?: string;
}) {
  const tone =
    type === "warn"
      ? "border-destructive/40 bg-destructive/5"
      : type === "brand"
        ? "border-brand/40 bg-brand/5"
        : "border-hairline bg-panel";
  return (
    <div className={cn("my-6 rounded-lg border p-4 text-sm leading-relaxed", tone)}>
      {title ? <p className="mb-1 font-semibold text-foreground">{title}</p> : null}
      <div className="text-muted-foreground [&>p]:m-0">{children}</div>
    </div>
  );
}

/** Internal links go through next/link; external links open in a new tab. */
function Anchor({ href = "", children, ...props }: React.ComponentProps<"a">) {
  const external = /^https?:\/\//.test(href);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

const components = {
  a: Anchor,
  Callout,
  CompCalculator,
  MarkTreatments,
  MarkSizes,
  MarkMotion,
  Palette,
  TypeSpecimen,
  MarkUsage,
};

const prettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  keepBackground: false,
};

/**
 * Renders an MDX string as a server component, with GitHub-flavoured markdown,
 * slugged + linkable headings, and dual-theme code highlighting. Wrap the output
 * in a `.prose` container for typographic styling.
 */
export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypePrettyCode, prettyCodeOptions],
            [
              rehypeAutolinkHeadings,
              {
                behavior: "wrap",
                properties: { className: ["heading-anchor"] },
              },
            ],
          ],
        },
      }}
    />
  );
}
