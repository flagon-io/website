import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * Shared page shell: a centered, hairline-railed content column with a
 * full-bleed header and footer. Pages provide their own <main> and any
 * page-specific backdrop (e.g. the homepage hero's HexField).
 */
export function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-1 flex-col">
      {/* Keyboard users can jump the nav straight to the content. */}
      <a
        href="#content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-3 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-primary-foreground"
      >
        Skip to content
      </a>

      <SiteHeader />

      <div
        id="content"
        tabIndex={-1}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col border-x border-hairline outline-none"
      >
        {children}
        <SiteFooter />
      </div>
    </div>
  );
}
