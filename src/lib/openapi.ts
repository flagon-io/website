/**
 * One place that knows how to reach the live Flagon OpenAPI document and shape
 * it for display. Used by the same-origin proxy route (which the reference UI
 * fetches) and by the reference page (which decides between the live explorer
 * and the "building in the open" state based on how many endpoints exist yet).
 */

const UPSTREAM = "https://api.flagon.io/openapi.json";

/** Same-origin path the reference UI fetches (proxied, cached, enriched). */
export const SPEC_PROXY_PATH = "/docs/api/spec";

const REVALIDATE = 300;

export type Spec = {
  openapi?: string;
  info?: { title?: string; version?: string; description?: string };
  paths?: Record<string, unknown>;
  [key: string]: unknown;
};

const FALLBACK: Spec = {
  openapi: "3.1.0",
  info: { title: "Flagon API", version: "0.0.0" },
  paths: {},
};

export function pathCount(spec: Spec): number {
  return spec.paths ? Object.keys(spec.paths).length : 0;
}

/** Add a friendly description when the upstream document doesn't carry one. */
export function enrich(spec: Spec): Spec {
  const info = { ...(spec.info ?? {}) };
  if (!info.description) {
    info.description =
      pathCount(spec) === 0
        ? "The Flagon API is being built in the open. This reference is generated live from the OpenAPI document at api.flagon.io, so endpoints, schemas, and examples appear here the moment they ship."
        : "Generated live from the OpenAPI document at api.flagon.io. Built in the open, and always current with what the API actually does.";
  }
  return { ...spec, info };
}

export async function fetchSpec(): Promise<{ spec: Spec; reachable: boolean }> {
  try {
    const res = await fetch(UPSTREAM, {
      headers: { accept: "application/json" },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error(`upstream responded ${res.status}`);
    return { spec: (await res.json()) as Spec, reachable: true };
  } catch {
    return { spec: FALLBACK, reachable: false };
  }
}

/* ------------------------------------------------------------------ *
 * Model helpers for the bespoke reference renderer. OpenAPI documents
 * are loosely typed JSON, so we lean on small guards instead of `any`.
 * ------------------------------------------------------------------ */

export type JsonObject = { [key: string]: unknown };

export const HTTP_METHODS = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "options",
  "head",
  "trace",
] as const;
export type HttpMethod = (typeof HTTP_METHODS)[number];

export type ApiOperation = {
  method: HttpMethod;
  path: string;
  id: string;
  summary?: string;
  description?: string;
  deprecated: boolean;
  parameters: JsonObject[];
  requestBody?: JsonObject;
  responses: JsonObject;
};

export type ApiTagGroup = {
  name: string;
  description?: string;
  operations: ApiOperation[];
};

export function asObject(value: unknown): JsonObject | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : undefined;
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function slugify(...parts: (string | undefined)[]): string {
  return parts
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Resolve a local `#/...` JSON pointer against the document. */
export function resolveRef(spec: Spec, ref: string): JsonObject | undefined {
  if (!ref.startsWith("#/")) return undefined;
  const parts = ref
    .slice(2)
    .split("/")
    .map((p) => p.replace(/~1/g, "/").replace(/~0/g, "~"));
  let current: unknown = spec;
  for (const part of parts) {
    const obj = asObject(current);
    if (!obj) return undefined;
    current = obj[part];
  }
  return asObject(current);
}

export function refName(ref: string): string {
  return ref.split("/").pop() ?? "schema";
}

export function serversList(spec: Spec): string[] {
  return asArray((spec as JsonObject).servers)
    .map((s) => asString(asObject(s)?.url))
    .filter((u): u is string => Boolean(u));
}

/** Flatten paths x methods into a single list of operations, in document order. */
export function listOperations(spec: Spec): ApiOperation[] {
  const operations: ApiOperation[] = [];
  const paths = asObject(spec.paths) ?? {};
  for (const [path, rawItem] of Object.entries(paths)) {
    const item = asObject(rawItem);
    if (!item) continue;
    const shared = asArray(item.parameters).map(asObject).filter(Boolean) as JsonObject[];
    for (const method of HTTP_METHODS) {
      const op = asObject(item[method]);
      if (!op) continue;
      const own = asArray(op.parameters).map(asObject).filter(Boolean) as JsonObject[];
      operations.push({
        method,
        path,
        id: slugify(method, path),
        summary: asString(op.summary),
        description: asString(op.description),
        deprecated: op.deprecated === true,
        parameters: [...shared, ...own],
        requestBody: asObject(op.requestBody),
        responses: asObject(op.responses) ?? {},
      });
    }
  }
  return operations;
}

/** Group operations by their first tag, honoring any declared tag order. */
export function groupByTag(spec: Spec): ApiTagGroup[] {
  const operations = listOperations(spec);
  const order: string[] = [];
  const buckets = new Map<string, ApiOperation[]>();
  const descriptions = new Map<string, string>();

  for (const raw of asArray((spec as JsonObject).tags)) {
    const tag = asObject(raw);
    const name = asString(tag?.name);
    if (!name) continue;
    if (!buckets.has(name)) {
      buckets.set(name, []);
      order.push(name);
    }
    const desc = asString(tag?.description);
    if (desc) descriptions.set(name, desc);
  }

  for (const op of operations) {
    const raw = asObject(spec.paths?.[op.path] as unknown);
    const method = raw ? asObject(raw[op.method]) : undefined;
    const name = asString(asArray(method?.tags)[0]) ?? "Endpoints";
    if (!buckets.has(name)) {
      buckets.set(name, []);
      order.push(name);
    }
    buckets.get(name)!.push(op);
  }

  return order
    .filter((name) => (buckets.get(name)?.length ?? 0) > 0)
    .map((name) => ({
      name,
      description: descriptions.get(name),
      operations: buckets.get(name)!,
    }));
}

function primitiveExample(type: string | undefined, format: string | undefined): unknown {
  switch (type) {
    case "integer":
    case "number":
      return 0;
    case "boolean":
      return true;
    case "string":
      switch (format) {
        case "date-time":
          return "2026-01-01T00:00:00Z";
        case "date":
          return "2026-01-01";
        case "uuid":
          return "00000000-0000-0000-0000-000000000000";
        case "email":
          return "user@flagon.io";
        case "uri":
        case "url":
          return "https://flagon.io";
        default:
          return "string";
      }
    default:
      return null;
  }
}

/** Synthesize a representative example value for a schema (honoring example/default). */
export function exampleForSchema(
  spec: Spec,
  schema: JsonObject,
  seen: Set<string> = new Set(),
  depth = 0,
): unknown {
  if (depth > 6) return null;
  let s = schema;

  const ref = asString(s.$ref);
  if (ref) {
    if (seen.has(ref)) return null;
    const target = resolveRef(spec, ref);
    if (target) {
      seen = new Set(seen).add(ref);
      s = target;
    }
  }

  if (s.example !== undefined) return s.example;
  if (s.default !== undefined) return s.default;

  const allOf = asArray(s.allOf).map(asObject).filter((x): x is JsonObject => Boolean(x));
  if (allOf.length) {
    const merged: Record<string, unknown> = {};
    for (const part of allOf) {
      const ex = exampleForSchema(spec, part, new Set(seen), depth + 1);
      if (ex && typeof ex === "object" && !Array.isArray(ex)) Object.assign(merged, ex);
    }
    for (const [k, v] of Object.entries(asObject(s.properties) ?? {})) {
      merged[k] = exampleForSchema(spec, asObject(v) ?? {}, new Set(seen), depth + 1);
    }
    return merged;
  }

  const variants = asArray(s.oneOf).length ? asArray(s.oneOf) : asArray(s.anyOf);
  if (variants.length) {
    const first = asObject(variants[0]);
    if (first) return exampleForSchema(spec, first, new Set(seen), depth + 1);
  }

  if (Array.isArray(s.enum) && s.enum.length) return s.enum[0];

  const type = asString(s.type);
  const props = asObject(s.properties);
  if (type === "object" || props) {
    const obj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props ?? {})) {
      obj[k] = exampleForSchema(spec, asObject(v) ?? {}, new Set(seen), depth + 1);
    }
    return obj;
  }

  if (type === "array") {
    const items = asObject(s.items) ?? {};
    return [exampleForSchema(spec, items, new Set(seen), depth + 1)];
  }

  return primitiveExample(type, asString(s.format));
}
