import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media-cldnry.s-nbcnews.com",
      },
      {
        protocol: "https",
        hostname: "**", // This allows all HTTPS domains (less secure but convenient for news APIs)
      },
    ],
  },
};

export default nextConfig;
