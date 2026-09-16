import Image from "next/image";
import { cn } from "@/lib/cn";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

/** A round avatar: the person's photo if we have one, else their initials. */
export function Avatar({
  name,
  photo,
  size = 44,
  className,
}: {
  name: string;
  photo?: string;
  size?: number;
  className?: string;
}) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={name}
        width={size}
        height={size}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-brand/10 font-semibold text-brand",
        className,
      )}
    >
      {initials(name)}
    </div>
  );
}

/** A small "who wrote this" card: avatar + name + role. Used on founder notes. */
export function AuthorCard({
  name,
  role,
  photo,
  size = 44,
  className,
}: {
  name: string;
  role: string;
  photo?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar name={name} photo={photo} size={size} />
      <div className="min-w-0">
        <p className="font-semibold leading-tight tracking-tight">{name}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}
