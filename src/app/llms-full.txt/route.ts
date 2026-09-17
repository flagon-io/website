import { getHandbookOrder } from "@/lib/handbook";
import { site } from "@/lib/site";

// The entire handbook as one plain-text/markdown file, for LLMs that would
// rather read everything in a single fetch. Linked from /llms.txt.
export const dynamic = "force-static";

export function GET() {
  const out: string[] = [];
  out.push(`# ${site.name} handbook`, "");
  out.push(`> ${site.description}`, "");
  out.push(
    `The complete ${site.legalName} handbook, in reading order. Canonical HTML lives under ${site.url}/handbook.`,
    "",
    "---",
    "",
  );

  for (const page of getHandbookOrder()) {
    out.push(`# ${page.title}`);
    if (page.description) out.push("", `> ${page.description}`);
    out.push("", page.content.trim(), "", "---", "");
  }

  return new Response(out.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
