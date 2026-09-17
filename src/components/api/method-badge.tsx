const STYLES: Record<string, string> = {
  get: "text-sky-700 bg-sky-500/10 dark:text-sky-300 dark:bg-sky-400/10",
  post: "text-emerald-700 bg-emerald-500/10 dark:text-emerald-300 dark:bg-emerald-400/10",
  put: "text-amber-700 bg-amber-500/10 dark:text-amber-300 dark:bg-amber-400/10",
  patch: "text-violet-700 bg-violet-500/10 dark:text-violet-300 dark:bg-violet-400/10",
  delete: "text-red-700 bg-red-500/10 dark:text-red-300 dark:bg-red-400/10",
  options: "text-teal-700 bg-teal-500/10 dark:text-teal-300 dark:bg-teal-400/10",
  head: "text-zinc-600 bg-zinc-500/10 dark:text-zinc-300 dark:bg-zinc-400/10",
  trace: "text-zinc-600 bg-zinc-500/10 dark:text-zinc-300 dark:bg-zinc-400/10",
};

/** Small, color-coded HTTP method pill. */
export function MethodBadge({
  method,
  className = "",
}: {
  method: string;
  className?: string;
}) {
  const style = STYLES[method] ?? "text-foreground bg-foreground/10";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded px-1.5 py-1 font-mono text-[10px] font-bold uppercase leading-none tracking-wider ${style} ${className}`}
    >
      {method}
    </span>
  );
}
