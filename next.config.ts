import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Brand lives in the handbook now (like PostHog's /brand). Keep the short
      // URL working and point it at the brand section's front door.
      {
        source: "/brand",
        destination: "/handbook/brand-overview",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
