/**
 * Sets the theme class on <html> before first paint, so there is no flash of
 * the wrong theme. Reads the stored preference ("light" | "dark" | "system");
 * "system" (the default) resolves via prefers-color-scheme. Runs inline in
 * <head>; the matching runtime toggle lives in ThemeToggle.
 */
const script = `
(function () {
  try {
    var stored = localStorage.getItem("flagon-theme");
    var mql = window.matchMedia("(prefers-color-scheme: dark)");
    var dark = stored === "dark" || ((!stored || stored === "system") && mql.matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

export function ThemeScript() {
  // Render as executable JS on the server (it runs during HTML parsing, before
  // first paint) but as inert text/plain on the client. On a client render, such
  // as the not-found boundary, a real <script> never executes anyway, and React
  // warns when it sees one; the type switch is Next's recommended way to silence
  // that while keeping the no-flash behavior. suppressHydrationWarning covers the
  // resulting type mismatch. See node_modules/next/dist/docs/01-app/02-guides/
  // preventing-flash-before-hydration.md.
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
