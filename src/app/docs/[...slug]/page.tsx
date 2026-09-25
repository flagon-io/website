import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DocView } from "@/components/doc-view";
import { DocsUnavailable } from "@/components/docs-unavailable";
import { DOCS_INDEX_SLUG, getDoc, getDocsNav } from "@/lib/docs";

type Params = { slug: string[] };

// Rendered per request from the live API for now (docs.ts fetches with no
// caching), so pages always match what the API has, with nothing to configure.

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lookup = await getDoc(slug.join("/"));
  if (lookup.state !== "ok") return {};
  return {
    title: `${lookup.doc.title} · Docs`,
    description: lookup.doc.description,
  };
}

export default async function DocPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const path = slug.join("/");

  // The handbook shares the corpus but has its own surface; canonicalize.
  if (path.startsWith("handbook/")) {
    redirect(`/handbook/${path.slice("handbook/".length)}`);
  }
  // The landing page (docs/index.mdx) lives at /docs itself.
  if (path === DOCS_INDEX_SLUG) redirect("/docs");

  const [lookup, nav] = await Promise.all([getDoc(path), getDocsNav()]);
  // The API never answered: show a retry state, not a 404 for every doc.
  if (lookup.state === "unavailable") return <DocsUnavailable />;
  // The API is up and there is no such public doc.
  if (lookup.state !== "ok") notFound();

  return <DocView doc={lookup.doc} nav={nav} />;
}
