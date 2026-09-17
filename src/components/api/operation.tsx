import {
  type ApiOperation,
  type JsonObject,
  type Spec,
  asObject,
  asString,
  exampleForSchema,
} from "@/lib/openapi";
import { MethodBadge } from "@/components/api/method-badge";
import { SchemaView, typeLabel } from "@/components/api/schema";
import { JsonBlock } from "@/components/api/json-block";
import { Markdown } from "@/components/api/markdown";
import { OperationSecurity } from "@/components/api/security";
import { CurlSample } from "@/components/api/curl-sample";
import { TryIt } from "@/components/api/try-it";

/** Pick a schema to show from an OpenAPI content map (prefers JSON). */
function pickContentSchema(
  content: JsonObject | undefined,
): { mediaType: string; schema: JsonObject } | undefined {
  if (!content) return undefined;
  const keys = Object.keys(content);
  const key = keys.find((k) => k.includes("json")) ?? keys[0];
  if (!key) return undefined;
  const schema = asObject(asObject(content[key])?.schema);
  return schema ? { mediaType: key, schema } : undefined;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">
      {children}
    </h4>
  );
}

function SchemaDetails({ spec, schema }: { spec: Spec; schema: JsonObject }) {
  return (
    <details className="border-t border-hairline">
      <summary className="cursor-pointer bg-panel px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
        Schema
      </summary>
      <div className="border-t border-hairline">
        <SchemaView spec={spec} schema={schema} />
      </div>
    </details>
  );
}

function Parameters({ spec, params }: { spec: Spec; params: JsonObject[] }) {
  if (!params.length) return null;
  return (
    <div>
      <SectionLabel>Parameters</SectionLabel>
      <ul className="mt-3 divide-y divide-hairline rounded-lg border border-hairline">
        {params.map((p, i) => {
          const schema = asObject(p.schema) ?? {};
          const required = p.required === true || asString(p.in) === "path";
          return (
            <li key={`${asString(p.name)}-${i}`} className="px-4 py-2.5">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <code className="font-mono text-[13px] font-medium text-foreground">
                  {asString(p.name)}
                </code>
                <span className="font-mono text-[11px] text-brand">{typeLabel(spec, schema)}</span>
                <span className="font-mono text-[10px] uppercase tracking-wide text-subtle">
                  {asString(p.in)}
                </span>
                {required ? (
                  <span className="font-mono text-[10px] uppercase tracking-wide text-red-600 dark:text-red-400">
                    required
                  </span>
                ) : null}
              </div>
              {asString(p.description) ? (
                <Markdown
                  inline
                  className="mt-1 block text-[13px] leading-relaxed text-muted-foreground"
                >
                  {asString(p.description)}
                </Markdown>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RequestBody({ spec, requestBody }: { spec: Spec; requestBody: JsonObject }) {
  const content = pickContentSchema(asObject(requestBody.content));
  if (!content) return null;
  return (
    <div>
      <SectionLabel>Request body</SectionLabel>
      <p className="mt-2 font-mono text-[11px] text-subtle">
        {content.mediaType}
        {requestBody.required === true ? " · required" : ""}
      </p>
      <div className="mt-2 overflow-hidden rounded-lg border border-hairline">
        <JsonBlock value={exampleForSchema(spec, content.schema)} />
        <SchemaDetails spec={spec} schema={content.schema} />
      </div>
    </div>
  );
}

function Responses({ spec, responses }: { spec: Spec; responses: JsonObject }) {
  const entries = Object.entries(responses);
  if (!entries.length) return null;
  return (
    <div>
      <SectionLabel>Responses</SectionLabel>
      <div className="mt-3 space-y-3">
        {entries.map(([status, raw]) => {
          const res = asObject(raw) ?? {};
          const content = pickContentSchema(asObject(res.content));
          const ok = /^2/.test(status);
          return (
            <div key={status} className="overflow-hidden rounded-lg border border-hairline">
              <div className="flex flex-wrap items-center gap-2.5 bg-panel px-4 py-2">
                <span
                  className={`font-mono text-xs font-bold ${
                    ok ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {status}
                </span>
                {asString(res.description) ? (
                  <Markdown inline className="text-[13px] text-muted-foreground">
                    {asString(res.description)}
                  </Markdown>
                ) : null}
              </div>
              {content ? (
                <div className="border-t border-hairline">
                  <JsonBlock value={exampleForSchema(spec, content.schema)} />
                  <SchemaDetails spec={spec} schema={content.schema} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** A single endpoint: collapsible, with parameters, bodies, responses, a live console, and a sample. */
export function Operation({ spec, op }: { spec: Spec; op: ApiOperation }) {
  const bodyContent = pickContentSchema(asObject(op.requestBody?.content));
  const hasBody = Boolean(bodyContent);
  const exampleValue = bodyContent ? exampleForSchema(spec, bodyContent.schema) : null;
  const exampleBodyPretty = exampleValue != null ? JSON.stringify(exampleValue, null, 2) : null;
  const exampleBodyCompact = exampleValue != null ? JSON.stringify(exampleValue) : null;

  const clientParams = op.parameters
    .map((p) => ({
      name: asString(p.name) ?? "",
      in: asString(p.in) ?? "query",
      required: p.required === true || asString(p.in) === "path",
    }))
    .filter((p) => p.name);

  return (
    <details
      id={op.id}
      className="group scroll-mt-20 overflow-hidden rounded-xl border border-hairline bg-card"
    >
      <summary className="flex cursor-pointer items-center gap-3 px-4 py-3 sm:px-5">
        <MethodBadge method={op.method} />
        <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-foreground">
          {op.path}
        </code>
        {op.summary ? (
          <span className="hidden truncate text-sm text-muted-foreground sm:block sm:max-w-[40%]">
            {op.summary}
          </span>
        ) : null}
        <OperationSecurity spec={spec} op={op} />
        {op.deprecated ? (
          <span className="font-mono text-[10px] uppercase tracking-wide text-amber-600 dark:text-amber-400">
            deprecated
          </span>
        ) : null}
      </summary>

      <div className="space-y-6 border-t border-hairline px-4 py-5 sm:px-5">
        {op.summary ? (
          <p className="text-[15px] font-medium text-foreground sm:hidden">{op.summary}</p>
        ) : null}
        {op.description ? (
          <Markdown className="text-sm text-muted-foreground">{op.description}</Markdown>
        ) : null}

        <TryIt
          method={op.method}
          path={op.path}
          params={clientParams}
          hasBody={hasBody}
          exampleBody={exampleBodyPretty}
        />

        <Parameters spec={spec} params={op.parameters} />
        {op.requestBody ? <RequestBody spec={spec} requestBody={op.requestBody} /> : null}
        <Responses spec={spec} responses={op.responses} />

        <CurlSample
          method={op.method}
          path={op.path}
          params={clientParams}
          hasBody={hasBody}
          exampleBody={exampleBodyCompact}
        />
      </div>
    </details>
  );
}
