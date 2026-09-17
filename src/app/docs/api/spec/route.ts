import { enrich, fetchSpec } from "@/lib/openapi";

/**
 * Same-origin proxy for the live Flagon OpenAPI document. The reference UI
 * fetches this instead of api.flagon.io directly, which sidesteps CORS and lets
 * us cache, revalidate, and add a friendly description while the spec is still
 * filling in. The spec itself is the source of truth; we never invent paths.
 */
export const revalidate = 300;

export async function GET() {
  const { spec, reachable } = await fetchSpec();
  return Response.json(enrich(spec), {
    headers: {
      "cache-control": reachable
        ? "public, s-maxage=300, stale-while-revalidate=600"
        : "public, s-maxage=60",
    },
  });
}
