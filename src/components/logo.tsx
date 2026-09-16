import { FlagonMark } from "@/brand/flagon-mark";

/**
 * The Flagon lockup mark: the full, filled flagon. The outline is currentColor,
 * so by default it inherits the ink/foreground of its context (near-black in
 * light, near-white in dark) for high contrast against the teal brew - set a
 * `text-*` colour on the parent to override the border.
 */
export function Logo({
  className,
  title = "Flagon",
}: {
  className?: string;
  title?: string;
}) {
  return <FlagonMark className={className} title={title} variant="full" />;
}
