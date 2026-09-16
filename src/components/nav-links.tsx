"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export type NavLinkItem = {
  label: string;
  href: string;
  /** Extra path prefixes that also mark this item active (its section). */
  prefixes?: string[];
};

function isActive(pathname: string, item: NavLinkItem) {
  if (pathname === item.href) return true;
  return (
    item.prefixes?.some((p) => pathname === p || pathname.startsWith(p + "/")) ??
    false
  );
}

export function NavLinks({
  items,
  className,
  underline = false,
}: {
  items: NavLinkItem[];
  className?: string;
  underline?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-6", className)}>
      {items.map((item) => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative text-sm outline-none transition-colors focus-visible:text-foreground",
              active
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
              underline &&
                active &&
                "after:absolute after:inset-x-0 after:-bottom-[23px] after:h-0.5 after:rounded-full after:bg-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
