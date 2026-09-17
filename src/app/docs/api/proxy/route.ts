import { allowedApiOrigins, fetchSpec } from "@/lib/openapi";

/**
 * Forwards a "Try it" request to the API on the viewer's behalf. This exists so
 * the console works regardless of the API's CORS policy. It is NOT an open
 * proxy: the target origin must be one the spec itself declares (plus the API
 * origin), which blocks it from being pointed at arbitrary or internal hosts.
 * It adds no credentials of its own; the viewer supplies their own token.
 */
export const dynamic = "force-dynamic";

const ALLOWED_METHODS = new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
]);

const MAX_BODY = 200_000;

type Payload = {
  method?: unknown;
  url?: unknown;
  headers?: unknown;
  body?: unknown;
};

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const { method, url, headers, body } = payload;
  if (
    typeof method !== "string" ||
    typeof url !== "string" ||
    !ALLOWED_METHODS.has(method.toUpperCase())
  ) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return Response.json({ error: "Invalid URL." }, { status: 400 });
  }
  if (target.protocol !== "https:" && target.protocol !== "http:") {
    return Response.json({ error: "Unsupported protocol." }, { status: 400 });
  }

  const { spec } = await fetchSpec();
  const allowed = allowedApiOrigins(spec);
  if (!allowed.includes(target.origin)) {
    return Response.json(
      { error: `Requests are only allowed to: ${allowed.join(", ")}` },
      { status: 403 },
    );
  }

  const outHeaders = new Headers();
  if (headers && typeof headers === "object") {
    for (const [k, v] of Object.entries(headers as Record<string, unknown>)) {
      if (typeof v === "string") outHeaders.set(k, v);
    }
  }

  const started = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const upstream = await fetch(target.toString(), {
      method: method.toUpperCase(),
      headers: outHeaders,
      body: typeof body === "string" ? body : undefined,
      signal: controller.signal,
      redirect: "manual",
    });
    const text = await upstream.text();
    const responseHeaders: Record<string, string> = {};
    upstream.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    return Response.json({
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
      body: text.slice(0, MAX_BODY),
      durationMs: Date.now() - started,
    });
  } catch (e) {
    const message =
      e instanceof Error && e.name === "AbortError"
        ? "The request timed out."
        : e instanceof Error
          ? e.message
          : "Request failed.";
    return Response.json({ error: message }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
