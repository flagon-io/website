import {
  type JsonObject,
  type Spec,
  asArray,
  asObject,
  asString,
  refName,
  resolveRef,
} from "@/lib/openapi";
import { Markdown } from "@/components/api/markdown";

const MAX_DEPTH = 5;

type Flat = { schema: JsonObject; name?: string; circular?: boolean };

/** Resolve a $ref and flatten a single allOf into one describable schema. */
function flatten(spec: Spec, schema: JsonObject, seen: Set<string>): Flat {
  let name: string | undefined;
  let s = schema;

  const ref = asString(s.$ref);
  if (ref) {
    name = refName(ref);
    if (seen.has(ref)) return { schema: s, name, circular: true };
    const target = resolveRef(spec, ref);
    if (target) {
      seen.add(ref);
      s = target;
    }
  }

  const parts = asArray(s.allOf)
    .map(asObject)
    .filter((x): x is JsonObject => Boolean(x));
  if (parts.length) {
    const properties: JsonObject = {};
    const required: string[] = [];
    const ownProps = asObject(s.properties);
    for (const part of parts) {
      const flat = flatten(spec, part, new Set(seen));
      Object.assign(properties, asObject(flat.schema.properties) ?? {});
      for (const r of asArray(flat.schema.required)) {
        if (typeof r === "string") required.push(r);
      }
    }
    if (ownProps) Object.assign(properties, ownProps);
    for (const r of asArray(s.required)) if (typeof r === "string") required.push(r);
    return {
      schema: { type: "object", properties, required, description: s.description },
      name,
    };
  }

  return { schema: s, name };
}

/** Short, human label for a schema's type (e.g. "string · uuid", "Pet[]", "A | B"). */
export function typeLabel(spec: Spec, schema: JsonObject): string {
  const { schema: s, name } = flatten(spec, schema, new Set());
  const type = asString(s.type);

  if (name && (type === "object" || asObject(s.properties))) return name;

  if (type === "array") {
    const items = asObject(s.items) ?? {};
    return `${typeLabel(spec, items)}[]`;
  }

  const variants = asArray(s.oneOf).length ? asArray(s.oneOf) : asArray(s.anyOf);
  if (variants.length) {
    return variants.map((v) => typeLabel(spec, asObject(v) ?? {})).join(" | ");
  }

  if (Array.isArray(s.enum)) return `${type ?? "string"} · enum`;

  const format = asString(s.format);
  return (type ?? "object") + (format ? ` · ${format}` : "");
}

/** If a property has a nested object shape worth expanding, return it. */
function nestedOf(
  spec: Spec,
  schema: JsonObject,
): { schema: JsonObject; kind: string } | undefined {
  const { schema: s } = flatten(spec, schema, new Set());
  if (asObject(s.properties)) return { schema: s, kind: "properties" };
  if (asString(s.type) === "array") {
    const items = asObject(s.items);
    if (items) {
      const flatItems = flatten(spec, items, new Set()).schema;
      if (asObject(flatItems.properties)) {
        return { schema: flatItems, kind: "item properties" };
      }
    }
  }
  return undefined;
}

function enumValues(spec: Spec, schema: JsonObject): unknown[] {
  const { schema: s } = flatten(spec, schema, new Set());
  if (Array.isArray(s.enum)) return s.enum;
  if (asString(s.type) === "array") {
    const items = asObject(s.items);
    if (items && Array.isArray(items.enum)) return items.enum;
  }
  return [];
}

function PropertyRow({
  spec,
  name,
  schema,
  required,
  depth,
}: {
  spec: Spec;
  name: string;
  schema: JsonObject;
  required: boolean;
  depth: number;
}) {
  const { schema: resolved } = flatten(spec, schema, new Set());
  const description = asString(resolved.description) ?? asString(schema.description);
  const values = enumValues(spec, schema);
  const nested = nestedOf(spec, schema);

  return (
    <li className="px-4 py-2.5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <code className="font-mono text-[13px] font-medium text-foreground">{name}</code>
        <span className="font-mono text-[11px] text-brand">{typeLabel(spec, schema)}</span>
        {required ? (
          <span className="font-mono text-[10px] uppercase tracking-wide text-red-600 dark:text-red-400">
            required
          </span>
        ) : null}
      </div>
      {description ? (
        <Markdown inline className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </Markdown>
      ) : null}
      {values.length ? (
        <p className="mt-1.5 flex flex-wrap gap-1">
          {values.slice(0, 24).map((v) => (
            <code
              key={String(v)}
              className="rounded bg-panel px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
            >
              {String(v)}
            </code>
          ))}
        </p>
      ) : null}
      {nested && depth < MAX_DEPTH ? (
        <details className="mt-2 overflow-hidden rounded-md border border-hairline">
          <summary className="cursor-pointer bg-panel px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            Show {nested.kind}
          </summary>
          <div className="border-t border-hairline">
            <SchemaView spec={spec} schema={nested.schema} depth={depth + 1} />
          </div>
        </details>
      ) : null}
    </li>
  );
}

/** Render the shape of an OpenAPI schema: property rows, arrays, or a primitive. */
export function SchemaView({
  spec,
  schema,
  depth = 0,
}: {
  spec: Spec;
  schema: JsonObject;
  depth?: number;
}) {
  const { schema: s, circular } = flatten(spec, schema, new Set());

  if (circular) {
    return <p className="px-4 py-2.5 text-xs text-subtle">Recursive reference.</p>;
  }

  const props = asObject(s.properties);
  if (props && Object.keys(props).length) {
    const required = new Set(
      asArray(s.required).filter((x): x is string => typeof x === "string"),
    );
    return (
      <ul className="divide-y divide-hairline">
        {Object.entries(props).map(([key, raw]) => (
          <PropertyRow
            key={key}
            spec={spec}
            name={key}
            schema={asObject(raw) ?? {}}
            required={required.has(key)}
            depth={depth}
          />
        ))}
      </ul>
    );
  }

  if (asString(s.type) === "array") {
    const items = asObject(s.items) ?? {};
    return (
      <div>
        <p className="px-4 py-2.5 font-mono text-xs text-subtle">array of {typeLabel(spec, items)}</p>
        {depth < MAX_DEPTH ? <SchemaView spec={spec} schema={items} depth={depth + 1} /> : null}
      </div>
    );
  }

  const values = enumValues(spec, s);
  return (
    <div className="px-4 py-2.5">
      <span className="font-mono text-[11px] text-brand">{typeLabel(spec, s)}</span>
      {values.length ? (
        <p className="mt-1.5 flex flex-wrap gap-1">
          {values.slice(0, 24).map((v) => (
            <code
              key={String(v)}
              className="rounded bg-panel px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
            >
              {String(v)}
            </code>
          ))}
        </p>
      ) : null}
    </div>
  );
}
