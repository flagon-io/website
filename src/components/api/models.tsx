import { type Spec, asString, schemaEntries, slugify } from "@/lib/openapi";
import { SchemaView } from "@/components/api/schema";
import { Markdown } from "@/components/api/markdown";

export const modelId = (name: string) => slugify("model", name);

/** Browsable reference of every schema in components.schemas. */
export function Models({ spec }: { spec: Spec }) {
  const entries = schemaEntries(spec);
  if (!entries.length) return null;

  return (
    <section id="models" className="scroll-mt-20">
      <h2 className="text-lg font-semibold tracking-tight">Models</h2>
      <div className="mt-5 space-y-3">
        {entries.map(({ name, schema }) => {
          const description = asString(schema.description);
          const type = asString(schema.type);
          return (
            <details
              key={name}
              id={modelId(name)}
              className="scroll-mt-20 overflow-hidden rounded-xl border border-hairline bg-card"
            >
              <summary className="flex cursor-pointer items-center gap-3 px-4 py-3 sm:px-5">
                <code className="font-mono text-[13px] font-medium text-foreground">{name}</code>
                {type ? <span className="font-mono text-[11px] text-subtle">{type}</span> : null}
              </summary>
              <div className="border-t border-hairline">
                {description ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground sm:px-5">
                    <Markdown>{description}</Markdown>
                  </div>
                ) : null}
                <SchemaView spec={spec} schema={schema} />
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
