import { searchDocs } from "@/lib/docs";

/**
 * Same-origin proxy for documentation search. The docs search box (a client
 * component) hits this, and it forwards to the API's ranked /docs/search on the
 * server. Going through here keeps the browser same-origin (no CORS on the API)
 * and matches how the API reference proxies its spec.
 */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  const results = await searchDocs(q, 8);
  return Response.json({ results });
}
