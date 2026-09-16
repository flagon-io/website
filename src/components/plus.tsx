/**
 * A thin crosshair "+" used to mark where hairline rules intersect,
 * in the manner of Vercel / Cloudflare layouts.
 */
export function Plus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M8 1v14M1 8h14"
        stroke="currentColor"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
