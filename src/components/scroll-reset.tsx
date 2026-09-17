"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * The docs content sits in its own scroll container (#content) on desktop, so
 * Next's default "scroll to top on navigation" (which only touches the window)
 * leaves that pane wherever it was. This resets it to the true top on every
 * page change, so navigating between docs lands you at the top like a fresh
 * load. Anchor navigations (#hash) are left alone so in-page and cross-page
 * heading links still work.
 */
export function ScrollReset({ targetId }: { targetId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) return;
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(targetId);
      if (el) el.scrollTop = 0;
      window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, targetId]);

  return null;
}
