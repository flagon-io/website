import type { Metadata } from "next";
import { StubPage } from "@/components/stub-page";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Every change to Flagon, with a date and a plain-English note about what moved and why.",
};

export default function ChangelogPage() {
  return (
    <StubPage
      title="What changes, as it changes."
      lead="Every change to Flagon lands here with a date and a plain note about what moved and why. For where things are headed next, the roadmap is the place, and the blog is where we think out loud."
      actions={[
        { label: "See the roadmap", href: "/roadmap", variant: "primary" },
        { label: "Read the blog", href: "/blog" },
      ]}
    />
  );
}
