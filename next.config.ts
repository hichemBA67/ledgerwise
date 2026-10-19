import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [
      { source: "/rl1", destination: "/ecosystem", permanent: true },
      { source: "/fundamentals", destination: "/#learn", permanent: false },
    ];
  },
};

export default nextConfig;
