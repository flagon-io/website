import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { buttonClasses } from "@/components/button";

/**
 * Shown when the docs API can't be reached (down, or not deployed yet). Honest
 * about the state and offers a way forward, rather than a bare 404 that would
 * imply the page doesn't exist. Deliberately holds no doc content: the docs live
 * in the API, and this is what "the API is briefly unavailable" looks like.
 */
export function DocsUnavailable() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center sm:py-32">
        <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">
          Documentation
        </p>
        <h1 className="mt-4 max-w-xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          The docs are briefly unavailable
        </h1>
        <p className="mt-5 max-w-md text-pretty text-muted-foreground">
          This page loads live from the Flagon API, which isn&rsquo;t answering
          right now. It&rsquo;s usually a moment. Try again, or head back to the
          docs home.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/docs" className={buttonClasses({ size: "lg" })}>
            Docs home
          </Link>
          <a
            href="https://ui.flagon.io"
            className={buttonClasses({ variant: "secondary", size: "lg" })}
          >
            Flagon UI
          </a>
        </div>
      </main>
    </div>
  );
}
