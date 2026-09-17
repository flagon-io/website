"use client";

import { useApiConfig } from "@/components/api/api-config";
import { CopyButton } from "@/components/api/copy-button";

type Param = { name: string; in: string };

/** curl example that reflects the selected server and token. */
export function CurlSample({
  method,
  path,
  params,
  hasBody,
  exampleBody,
}: {
  method: string;
  path: string;
  params: Param[];
  hasBody: boolean;
  exampleBody: string | null;
}) {
  const { server, token } = useApiConfig();

  const query = params
    .filter((p) => p.in === "query")
    .map((p) => `${p.name}=`)
    .join("&");
  const url = `${server}${path}${query ? `?${query}` : ""}`;

  const lines = [`curl -X ${method.toUpperCase()} "${url}"`];
  if (hasBody) lines.push(`  -H "Content-Type: application/json"`);
  lines.push(`  -H "Authorization: Bearer ${token || "$FLAGON_TOKEN"}"`);
  for (const p of params.filter((p) => p.in === "header")) {
    lines.push(`  -H "${p.name}: "`);
  }
  if (hasBody) lines.push(`  -d '${exampleBody ?? "{ }"}'`);
  const curl = lines.join(" \\\n");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">
          Example request
        </h4>
        <CopyButton text={curl} />
      </div>
      <pre className="mt-3 overflow-x-auto rounded-lg border border-hairline bg-panel px-4 py-3 font-mono text-[12.5px] leading-relaxed text-foreground">
        <code>{curl}</code>
      </pre>
    </div>
  );
}
