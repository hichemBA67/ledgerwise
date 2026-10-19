import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [{ source: "/rl1", destination: "/", permanent: true }];
  },
};

export default nextConfig;
