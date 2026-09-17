"use client";

import { useState } from "react";
import { useApiConfig } from "@/components/api/api-config";
import { JsonBlock } from "@/components/api/json-block";

type TryParam = { name: string; in: string; required: boolean };

type ProxyResult = {
  status?: number;
  statusText?: string;
  body?: string;
  durationMs?: number;
  error?: string;
};

function ResponseView({ result }: { result: ProxyResult }) {
  if (result.error) {
    return (
      <div className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-[13px] text-red-600 dark:text-red-400">
        {result.error}
      </div>
    );
  }

  const ok = typeof result.status === "number" && result.status < 400;
  let parsed: unknown;
  let isJson = false;
  try {
    parsed = JSON.parse(result.body ?? "");
    isJson = true;
  } catch {
    // not JSON; show raw
  }

  return (
    <div className="overflow-hidden rounded-lg border border-hairline">
      <div className="flex items-center gap-2.5 bg-panel px-4 py-2">
        <span
          className={`font-mono text-xs font-bold ${
            ok ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
          }`}
        >
          {result.status} {result.statusText}
        </span>
        {result.durationMs != null ? (
          <span className="font-mono text-[11px] text-subtle">{result.durationMs} ms</span>
        ) : null}
      </div>
      {isJson ? (
        <div className="border-t border-hairline">
          <JsonBlock value={parsed} label="Response" />
        </div>
      ) : result.body ? (
        <pre className="overflow-x-auto border-t border-hairline px-4 py-3 font-mono text-[12.5px] text-foreground">
          <code>{result.body}</code>
        </pre>
      ) : null}
    </div>
  );
}

/** Fill in parameters and a body, then send a real request through the proxy. */
export function TryIt({
  method,
  path,
  params,
  hasBody,
  exampleBody,
}: {
  method: string;
  path: string;
  params: TryParam[];
  hasBody: boolean;
  exampleBody: string | null;
}) {
  const { server, token } = useApiConfig();
  const [values, setValues] = useState<Record<string, string>>({});
  const [body, setBody] = useState(exampleBody ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProxyResult | null>(null);

  const setVal = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const send = async () => {
    setLoading(true);
    setResult(null);
    try {
      let filledPath = path;
      for (const p of params.filter((x) => x.in === "path")) {
        filledPath = filledPath.replace(
          `{${p.name}}`,
          encodeURIComponent(values[`path:${p.name}`] ?? ""),
        );
      }
      const qs = params
        .filter((x) => x.in === "query")
        .map((x) => [x.name, values[`query:${x.name}`]] as const)
        .filter(([, v]) => v)
        .map(([n, v]) => `${encodeURIComponent(n)}=${encodeURIComponent(v ?? "")}`)
        .join("&");

      const url = `${server}${filledPath}${qs ? `?${qs}` : ""}`;
      const headers: Record<string, string> = {};
      for (const p of params.filter((x) => x.in === "header")) {
        const v = values[`header:${p.name}`];
        if (v) headers[p.name] = v;
      }
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const sendBody = hasBody && body.trim() ? body : undefined;
      if (sendBody) headers["Content-Type"] = "application/json";

      const res = await fetch("/docs/api/proxy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ method: method.toUpperCase(), url, headers, body: sendBody }),
      });
      const data = (await res.json()) as ProxyResult;
      setResult(data);
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : "Request failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <details className="overflow-hidden rounded-lg border border-hairline">
      <summary className="cursor-pointer bg-panel px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
        Try it
      </summary>
      <div className="space-y-4 border-t border-hairline p-4">
        {params.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {params.map((p) => (
              <label key={`${p.in}:${p.name}`} className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                  {p.name}
                  <span className="text-subtle">{p.in}</span>
                  {p.required ? <span className="text-red-600 dark:text-red-400">*</span> : null}
                </span>
                <input
                  value={values[`${p.in}:${p.name}`] ?? ""}
                  onChange={(e) => setVal(`${p.in}:${p.name}`, e.target.value)}
                  placeholder={p.name}
                  spellCheck={false}
                  className="rounded-md border border-hairline bg-panel px-2.5 py-1.5 font-mono text-[12px] text-foreground placeholder:text-subtle focus:border-mark focus:outline-none"
                />
              </label>
            ))}
          </div>
        ) : null}

        {hasBody ? (
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[11px] text-muted-foreground">Body</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              spellCheck={false}
              className="rounded-md border border-hairline bg-panel px-2.5 py-2 font-mono text-[12px] leading-relaxed text-foreground focus:border-mark focus:outline-none"
            />
          </label>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={send}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-1.5 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-brand-bright disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send"}
          </button>
          {!token ? (
            <span className="text-[11px] text-subtle">No token set (add one at the top).</span>
          ) : null}
        </div>

        {result ? <ResponseView result={result} /> : null}
      </div>
    </details>
  );
}
