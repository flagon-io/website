import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Frame } from "@/components/frame";
import { ApiReference } from "@/components/api-reference";
import { ApiEmptyState } from "@/components/api-empty-state";
import { fetchSpec, pathCount } from "@/lib/openapi";

export const metadata: Metadata = {
  title: "API reference",
  description:
    "Explore the Flagon API. A live, always-current reference generated from the OpenAPI spec, built in the open.",
};

// Reflect new endpoints a few times an hour without going stale.
export const revalidate = 300;

export default async function ApiReferencePage() {
  const { spec, reachable } = await fetchSpec();
  const count = pathCount(spec);
  const version = spec.info?.version ?? "0.0.0";

  return (
    <Frame>
      <main>
        {/* Slim context strip: where you are, and a link to the raw document. */}
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-6 py-3 sm:px-8">
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
            Docs
          </Link>
          <a
            href="https://api.flagon.io/openapi.json"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] uppercase tracking-widest text-subtle transition-colors hover:text-foreground"
          >
            openapi.json
          </a>
        </div>

        {count > 0 ? (
          <ApiReference spec={spec} />
        ) : (
          <ApiEmptyState version={version} reachable={reachable} />
        )}
      </main>
    </Frame>
  );
}
