import {
  type Spec,
  asObject,
  asString,
  groupByTag,
  serversList,
  slugify,
} from "@/lib/openapi";
import { ApiNav } from "@/components/api/api-nav";
import { Operation } from "@/components/api/operation";
import { Markdown } from "@/components/api/markdown";

/**
 * Bespoke, server-rendered API reference. Reads the OpenAPI document and renders
 * a sticky operation index alongside collapsible endpoint detail, in the site's
 * own design language. No client runtime beyond the copy buttons.
 */
export function ApiReference({ spec }: { spec: Spec }) {
  const groups = groupByTag(spec);
  const servers = serversList(spec);
  const server = servers[0] ?? "https://api.flagon.io";
  const info = asObject(spec.info) ?? {};
  const title = asString(info.title) ?? "Flagon API";
  const version = asString(info.version) ?? "0.0.0";
  const description = asString(info.description);

  const navGroups = groups.map((group) => ({
    name: group.name,
    operations: group.operations.map((op) => ({
      id: op.id,
      method: op.method,
      path: op.path,
      summary: op.summary,
    })),
  }));

  return (
    <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <ApiNav groups={navGroups} />

      {/* Endpoint detail. */}
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
          <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="uppercase tracking-widest text-subtle">Base URL</span>
            <code className="rounded bg-panel px-2 py-0.5 text-muted-foreground">{server}</code>
          </div>
        </header>

        <div className="space-y-14 pt-10">
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
                  <Operation key={op.id} spec={spec} op={op} server={server} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
