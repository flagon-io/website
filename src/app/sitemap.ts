import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { listHandbookSlugs } from "@/lib/handbook";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/handbook",
    "/blog",
    "/careers",
    "/roadmap",
    "/products",
    "/pricing",
    "/docs",
    "/changelog",
    "/not-for-everyone",
    "/customers",
    "/media",
    "/people",
    "/side-projects",
    "/partnerships",
    "/teams",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
  }));

  const handbook = listHandbookSlugs().map((slug) => ({
    url: `${base}/handbook/${slug}`,
    lastModified: now,
  }));

  const blog = getAllPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : now,
  }));

  return [...staticRoutes, ...handbook, ...blog];
}
