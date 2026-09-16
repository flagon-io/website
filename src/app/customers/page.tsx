import type { Metadata } from "next";
import { StubPage } from "@/components/stub-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Customers",
  description:
    "Stories from the teams building on Flagon, in their own words. As people put it to work, their write-ups land here.",
};

export default function CustomersPage() {
  return (
    <StubPage
      title="What teams build with Flagon"
      lead="Real stories from the people using it, in their own words. As teams put Flagon to work, their write-ups land here, unedited by us."
      actions={[
        { label: "Read the handbook", href: "/handbook", variant: "primary" },
        { label: "Join the Discord", href: site.links.discord, external: true },
      ]}
    />
  );
}
