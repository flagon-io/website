import "server-only";
import { readCollection, readDoc } from "@/lib/content";

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  role?: string;
  tags: string[];
  readingMinutes: number;
  content: string;
};

function toPost(d: {
  slug: string;
  content: string;
  data: Record<string, unknown>;
  readingMinutes: number;
}): Post {
  return {
    slug: d.slug,
    title: String(d.data.title ?? d.slug),
    description: String(d.data.description ?? ""),
    date: String(d.data.date ?? ""),
    author: String(d.data.author ?? "Flagon"),
    role: d.data.role ? String(d.data.role) : undefined,
    tags: Array.isArray(d.data.tags) ? (d.data.tags as string[]) : [],
    readingMinutes: d.readingMinutes,
    content: d.content,
  };
}

/** All posts, newest first. */
export function getAllPosts(): Post[] {
  return readCollection("blog")
    .map(toPost)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  const d = readDoc("blog", slug);
  return d ? toPost(d) : null;
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
