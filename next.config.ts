import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://telcos.opik.net/api/v1/:path*", // Matches http protocol
      },
    ];
  },
};

export default nextConfig;
