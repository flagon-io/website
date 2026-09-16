import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A marketing section with consistent vertical rhythm. Full-bleed Schematic
 * frames provide the horizontal rules, so sections carry no top border by
 * default. Pass `divider` for a full-width hairline on a text-only transition.
 */
export function Section({
  children,
  className,
  divider = false,
}: {
  children: ReactNode;
  className?: string;
  divider?: boolean;
}) {
  return (
    <section
      className={cn("py-12 sm:py-14", divider && "border-t border-hairline", className)}
    >
      {children}
    </section>
  );
}

/** The content gutter, aligned with Schematic cell padding. */
export const GUTTER = "px-6 sm:px-8";

/**
 * A left-aligned section heading with an optional lead. Deliberately plain: a
 * heading and a sentence, no kicker label. The heading carries the section.
 */
export function SectionHeader({
  title,
  lead,
  align = "left",
  className,
}: {
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(GUTTER, className)}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {lead ? (
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{lead}</p>
        ) : null}
      </div>
    </div>
  );
}
