import {
  type Spec,
  asObject,
  asString,
  groupByTag,
  schemaEntries,
  securitySchemes,
  serversList,
  slugify,
} from "@/lib/openapi";
import { ApiNav } from "@/components/api/api-nav";
import { Operation } from "@/components/api/operation";
import { Markdown } from "@/components/api/markdown";
import { SecuritySchemes } from "@/components/api/security";
import { Models, modelId } from "@/components/api/models";
import { ApiConfigProvider } from "@/components/api/api-config";
import { ServerSwitcher } from "@/components/api/server-switcher";
import { AuthField } from "@/components/api/auth-field";

/**
 * Bespoke, server-rendered API reference with a client layer for the server
 * picker, auth token, and live "Try it" console. Reads the OpenAPI document and
 * renders a sticky index alongside endpoint, auth, and model detail.
 */
export function ApiReference({ spec }: { spec: Spec }) {
  const groups = groupByTag(spec);
  const servers = serversList(spec);
  const info = asObject(spec.info) ?? {};
  const title = asString(info.title) ?? "Flagon API";
  const version = asString(info.version) ?? "0.0.0";
  const description = asString(info.description);

  const models = schemaEntries(spec);
  const hasAuth = securitySchemes(spec).length > 0;

  const navGroups = [
    ...(hasAuth
      ? [{ name: "Overview", items: [{ id: "authentication", label: "Authentication" }] }]
      : []),
    ...groups.map((group) => ({
      name: group.name,
      items: group.operations.map((op) => ({
        id: op.id,
        label: op.path,
        method: op.method,
        summary: op.summary,
      })),
    })),
    ...(models.length
      ? [{ name: "Models", items: models.map((m) => ({ id: modelId(m.name), label: m.name })) }]
      : []),
  ];

  return (
    <ApiConfigProvider servers={servers}>
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <ApiNav groups={navGroups} />

        {/* Detail. */}
        <div className="min-w-0 px-5 py-8 sm:px-8">
          <header className="border-b border-hairline pb-8">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <span className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[11px] text-subtle">
                v{version}
              </span>
            </div>
            {description ? (
              <div className="mt-3 max-w-2xl text-sm text-muted-foreground">
                <Markdown>{description}</Markdown>
              </div>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ServerSwitcher />
              <AuthField />
            </div>
          </header>

          <div className="space-y-14 pt-10">
            <SecuritySchemes spec={spec} />

            {groups.map((group) => (
              <section key={group.name} id={slugify(group.name)} className="scroll-mt-20">
                <h2 className="text-lg font-semibold tracking-tight">{group.name}</h2>
                {group.description ? (
                  <div className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
                    <Markdown>{group.description}</Markdown>
                  </div>
                ) : null}
                <div className="mt-5 space-y-3">
                  {group.operations.map((op) => (
                    <Operation key={op.id} spec={spec} op={op} />
                  ))}
                </div>
              </section>
            ))}

            <Models spec={spec} />
          </div>
        </div>
      </div>
    </ApiConfigProvider>
  );
}
