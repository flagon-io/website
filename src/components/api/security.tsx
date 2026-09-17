import { Lock } from "lucide-react";
import {
  type ApiOperation,
  type JsonObject,
  type Spec,
  asObject,
  asString,
  operationSecurityNames,
  securitySchemes,
} from "@/lib/openapi";
import { Markdown } from "@/components/api/markdown";

function schemeSummary(scheme: JsonObject): string {
  const type = asString(scheme.type);
  if (type === "http") {
    const s = (asString(scheme.scheme) ?? "").toLowerCase();
    if (s === "bearer") {
      const fmt = asString(scheme.bearerFormat);
      return `Send a bearer token in the \`Authorization\` header${fmt ? ` (${fmt})` : ""}.`;
    }
    if (s === "basic") return "Basic authentication in the `Authorization` header.";
    return `HTTP \`${s}\` authentication.`;
  }
  if (type === "apiKey") {
    return `Send your key as the \`${asString(scheme.name)}\` ${asString(scheme.in)}.`;
  }
  if (type === "oauth2") return "OAuth 2.0.";
  if (type === "openIdConnect") {
    const url = asString(scheme.openIdConnectUrl);
    return `OpenID Connect${url ? ` · ${url}` : ""}.`;
  }
  return type ?? "Custom scheme.";
}

function OauthScopes({ scheme }: { scheme: JsonObject }) {
  const flows = asObject(scheme.flows);
  if (!flows) return null;
  const scopeEntries: [string, string][] = [];
  for (const flow of Object.values(flows)) {
    const scopes = asObject(asObject(flow)?.scopes);
    if (scopes) {
      for (const [k, v] of Object.entries(scopes)) scopeEntries.push([k, asString(v) ?? ""]);
    }
  }
  if (!scopeEntries.length) return null;
  return (
    <div className="mt-3">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">
        Scopes
      </p>
      <ul className="mt-2 space-y-1">
        {scopeEntries.map(([k, v]) => (
          <li key={k} className="text-[13px]">
            <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-[11px] text-brand">{k}</code>
            {v ? <span className="ml-2 text-muted-foreground">{v}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The "Authentication" section: every declared security scheme and how to use it. */
export function SecuritySchemes({ spec }: { spec: Spec }) {
  const schemes = securitySchemes(spec);
  if (!schemes.length) return null;

  return (
    <section id="authentication" className="scroll-mt-20">
      <h2 className="text-lg font-semibold tracking-tight">Authentication</h2>
      <div className="mt-5 space-y-3">
        {schemes.map(({ name, scheme }) => (
          <div key={name} className="rounded-xl border border-hairline bg-card p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Lock className="h-4 w-4 text-brand" strokeWidth={2} />
              <code className="font-mono text-[13px] font-medium text-foreground">{name}</code>
              <span className="font-mono text-[11px] text-subtle">{asString(scheme.type)}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{schemeSummary(scheme)}</p>
            {asString(scheme.description) ? (
              <div className="mt-2 text-sm text-muted-foreground">
                <Markdown>{asString(scheme.description)}</Markdown>
              </div>
            ) : null}
            <OauthScopes scheme={scheme} />
          </div>
        ))}
      </div>
    </section>
  );
}

/** Compact lock badge naming the auth an operation requires. */
export function OperationSecurity({ spec, op }: { spec: Spec; op: ApiOperation }) {
  const names = operationSecurityNames(spec, op);
  if (!names.length) return null;
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-subtle">
      <Lock className="h-3 w-3" strokeWidth={2} />
      {names.join(", ")}
    </span>
  );
}
