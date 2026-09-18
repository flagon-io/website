import { BookOpen } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";

/**
 * Shown when the handbook can't be loaded from the API (e.g. the API is briefly
 * unreachable or not yet deployed). The handbook is served live from the product
 * repo's docs corpus, so this is normally a transient state. We say so plainly
 * and offer the source on GitHub, rather than showing a broken or empty page.
 */
export function HandbookUnavailable() {
  return (
    <div className="mx-auto max-w-lg py-20 text-center sm:py-28">
      <BookOpen className="mx-auto h-6 w-6 text-subtle" strokeWidth={1.5} aria-hidden />
      <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-subtle">Handbook</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Back in a moment</h1>
      <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
        The handbook loads from our API, which isn&rsquo;t reachable right now. This is
        usually brief, so give it a minute and refresh.
      </p>
      <a
        href="https://github.com/flagon-io/flagon/tree/main/docs/handbook"
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
      >
        <SiGithub className="h-4 w-4" />
        Read the handbook on GitHub
      </a>
    </div>
  );
}
