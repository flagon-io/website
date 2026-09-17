import { getHandbookSections } from "@/lib/handbook";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/lib/site";

// https://llmstxt.org, a plain-text index of the site for LLMs, served at
// /llms.txt. Prerendered so it's just a static file.
export const dynamic = "force-static";

export function GET() {
  const base = site.url;
  const out: string[] = [];

  out.push(`# ${site.name}`, "");
  out.push(`> ${site.description}`, "");
  out.push(
    `${site.legalName} builds software in the open. This handbook is the company's operating manual: public, versioned in git, and the source of truth for how we work. The full handbook as one plain-text file is at ${base}/llms-full.txt.`,
    "",
  );

  out.push("## Handbook", "");
  for (const section of getHandbookSections()) {
    out.push(`### ${section.name}`);
    for (const p of section.pages) {
      const desc = p.description ? `: ${p.description}` : "";
      out.push(`- [${p.title}](${base}/handbook/${p.slug})${desc}`);
    }
    out.push("");
  }

  const posts = getAllPosts();
  if (posts.length > 0) {
    out.push("## Blog", "");
    for (const p of posts) {
      const desc = p.description ? `: ${p.description}` : "";
      out.push(`- [${p.title}](${base}/blog/${p.slug})${desc}`);
    }
    out.push("");
  }

  out.push("## Pages", "");
  const pages: [string, string][] = [
    ["About", "/about"],
    ["Products", "/products"],
    ["Pricing", "/pricing"],
    ["Docs", "/docs"],
    ["Roadmap", "/roadmap"],
    ["Careers", "/careers"],
    ["People", "/people"],
  ];
  for (const [title, url] of pages) out.push(`- [${title}](${base}${url})`);
  out.push("");

  return new Response(out.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
