import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=true builds a static export for GitHub Pages, served from /ledgerwise.
 * Static exports can't use config redirects, so /rl1 and /fundamentals also exist as
 * redirect pages (src/app/rl1, src/app/fundamentals).
 */
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? "/ledgerwise" : "";

const nextConfig: NextConfig = pages
  ? {
      output: "export",
      basePath,
      trailingSlash: true,
      images: { unoptimized: true },
      env: { NEXT_PUBLIC_BASE_PATH: basePath },
    }
  : {
      env: { NEXT_PUBLIC_BASE_PATH: "" },
      redirects() {
        return [
          { source: "/rl1", destination: "/ecosystem", permanent: true },
          { source: "/fundamentals", destination: "/#learn", permanent: false },
        ];
      },
    };

export default nextConfig;
