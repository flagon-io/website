import { getHandbookOrder, getHandbookPage } from "@/lib/handbook";
import { site } from "@/lib/site";

// The entire handbook as one plain-text/markdown file, for LLMs that would
// rather read everything in a single fetch. Linked from /llms.txt. Read live
// from the API: the reading order comes from one call, then each page's body is
// fetched in parallel.
export async function GET() {
  const out: string[] = [];
  out.push(`# ${site.name} handbook`, "");
  out.push(`> ${site.description}`, "");
  out.push(
    `The complete ${site.legalName} handbook, in reading order. Canonical HTML lives under ${site.url}/handbook.`,
    "",
    "---",
    "",
  );

  const order = await getHandbookOrder();
  const pages = await Promise.all(order.map((m) => getHandbookPage(m.slug)));
  for (const page of pages) {
    if (!page) continue;
    out.push(`# ${page.title}`);
    if (page.description) out.push("", `> ${page.description}`);
    out.push("", page.content.trim(), "", "---", "");
  }

  return new Response(out.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
