"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type ApiConfig = {
  servers: string[];
  server: string;
  setServer: (s: string) => void;
  token: string;
  setToken: (t: string) => void;
};

const Ctx = createContext<ApiConfig | null>(null);

const TOKEN_KEY = "flagon-api-token";
const SERVER_KEY = "flagon-api-server";

/**
 * Holds the base URL and bearer token the "Try it" console and curl samples use.
 * Persisted to localStorage so it survives navigation. The token stays in the
 * browser and is only ever sent to the API the viewer targets.
 */
export function ApiConfigProvider({
  servers,
  children,
}: {
  servers: string[];
  children: ReactNode;
}) {
  const [server, setServerState] = useState(servers[0] ?? "");
  const [token, setTokenState] = useState("");

  useEffect(() => {
    // Rehydrate persisted config after mount. This one-time read from
    // localStorage must run post-mount, not during render, or SSR and the client
    // would disagree and hydration would mismatch - so the set-state-in-effect
    // rule's cascading-render concern doesn't apply here.
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) setTokenState(storedToken);
      const storedServer = localStorage.getItem(SERVER_KEY);
      if (storedServer && servers.includes(storedServer)) setServerState(storedServer);
    } catch {
      // localStorage unavailable; defaults are fine.
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [servers]);

  const setServer = (s: string) => {
    setServerState(s);
    try {
      localStorage.setItem(SERVER_KEY, s);
    } catch {
      // ignore
    }
  };

  const setToken = (t: string) => {
    setTokenState(t);
    try {
      localStorage.setItem(TOKEN_KEY, t);
    } catch {
      // ignore
    }
  };

  return (
    <Ctx.Provider value={{ servers, server, setServer, token, setToken }}>{children}</Ctx.Provider>
  );
}

export function useApiConfig(): ApiConfig {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApiConfig must be used within ApiConfigProvider");
  return ctx;
}
