import { getSearchIndex } from "@/lib/search";

/** The client palette fetches this lazily on first open. The handbook portion is
 *  read live from the API, so the route renders per request. */
export async function GET() {
  return Response.json(await getSearchIndex());
}
