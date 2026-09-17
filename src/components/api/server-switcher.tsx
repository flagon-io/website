"use client";

import { useApiConfig } from "@/components/api/api-config";

/** Base URL display, upgraded to a picker when the spec lists multiple servers. */
export function ServerSwitcher() {
  const { servers, server, setServer } = useApiConfig();

  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
      <span className="uppercase tracking-widest text-subtle">Base URL</span>
      {servers.length > 1 ? (
        <select
          value={server}
          onChange={(e) => setServer(e.target.value)}
          aria-label="Base URL"
          className="rounded border border-hairline bg-panel px-2 py-0.5 text-muted-foreground focus:border-mark focus:outline-none"
        >
          {servers.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ) : (
        <code className="rounded bg-panel px-2 py-0.5 text-muted-foreground">{server}</code>
      )}
    </div>
  );
}
