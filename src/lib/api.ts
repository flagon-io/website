import "server-only";

/**
 * The one place the site knows how to reach the Flagon API, and the one place
 * that decides how a request is allowed to fail. Every content surface the API
 * owns (docs, roadmap, changelog) goes through here, so they all time out the
 * same way and degrade the same way instead of each rolling their own.
 *
 * The API is the source of truth whenever it answers. When it does not, callers
 * decide how to degrade (a committed fallback, an empty list, an "unavailable"
 * state), using the distinction this returns between "the API answered, just not
 * with what you asked for" (reachable) and "the API never answered" (a network
 * error or timeout).
 */

/** The API origin. Overridable per environment; defaults to production. */
export const API_ORIGIN = (
  process.env.FLAGON_API_URL ?? "https://api.flagon.io"
).replace(/\/+$/, "");

/** How long to wait on the API before giving up, so a slow or hanging API can
 * never stall a page render or the production build. */
const TIMEOUT_MS = 4000;

/**
 * The outcome of an API read:
 * - `{ ok: true, data }` - a 2xx JSON response.
 * - `{ ok: false, reachable: true, status }` - the API answered with a non-2xx
 *   (e.g. a 404 for an unknown resource, or a 503 while an endpoint is still
 *   deploying). The API is up; it just didn't have what we asked for.
 * - `{ ok: false, reachable: false }` - no answer at all: a network error, a
 *   timeout, or unparseable JSON. Treat as "the API is down or not deployed."
 */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; reachable: true; status: number }
  | { ok: false; reachable: false };

type Options = {
  /** Seconds to cache a good response (ISR). Ignored when `cache` is set. */
  revalidate?: number;
  /** Force a fetch cache mode (e.g. "no-store") instead of ISR. */
  cache?: RequestCache;
};

/**
 * Fetch JSON from the API with a hard timeout, never throwing. `path` is a
 * root-relative path like "/roadmap".
 */
export async function apiJson<T>(
  path: string,
  opts: Options = {},
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${API_ORIGIN}${path}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      ...(opts.cache
        ? { cache: opts.cache }
        : { next: { revalidate: opts.revalidate ?? 300 } }),
    });
    if (!res.ok) return { ok: false, reachable: true, status: res.status };
    return { ok: true, data: (await res.json()) as T };
  } catch {
    return { ok: false, reachable: false };
  }
}
