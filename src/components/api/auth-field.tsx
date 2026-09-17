"use client";

import { useState } from "react";
import { useApiConfig } from "@/components/api/api-config";

/** Bearer token entry used by curl samples and the "Try it" console. */
export function AuthField() {
  const { token, setToken } = useApiConfig();
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px]">
      <span className="font-mono uppercase tracking-widest text-subtle">Token</span>
      <input
        type={show ? "text" : "password"}
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Bearer token"
        aria-label="Bearer token"
        autoComplete="off"
        spellCheck={false}
        className="w-52 rounded border border-hairline bg-panel px-2 py-0.5 font-mono text-[11px] text-foreground placeholder:text-subtle focus:border-mark focus:outline-none"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="font-mono uppercase tracking-widest text-subtle transition-colors hover:text-foreground"
      >
        {show ? "hide" : "show"}
      </button>
    </div>
  );
}
