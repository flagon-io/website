import { getSearchIndex } from "@/lib/search";

/** Prerendered at build time; the client palette fetches it lazily on first open. */
export const dynamic = "force-static";

export function GET() {
  return Response.json(getSearchIndex());
}
