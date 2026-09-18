import { PenLine } from "lucide-react";

/**
 * Rendered in place of the article body for a `planned` page: one we have mapped
 * out in the structure but not written yet. Says so plainly and offers a way to
 * help, rather than showing an empty page.
 */
export function DocComingSoon({ slug }: { slug: string }) {
  return (
    <div className="mt-10 max-w-2xl rounded-xl border border-dashed border-hairline bg-panel p-6">
      <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">Not written yet</p>
      <h2 className="mt-3 text-lg font-semibold tracking-tight">This page is on the way</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        We&rsquo;ve mapped this page into the docs but haven&rsquo;t written it yet. It lands as
        this part of the platform does. Want to help? Flagon is open source, so you can write it
        with us.
      </p>
      <a
        href={`https://github.com/flagon-io/flagon/blob/main/docs/${slug}.mdx`}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
      >
        <PenLine className="h-4 w-4" aria-hidden />
        Write this page on GitHub
      </a>
    </div>
  );
}
