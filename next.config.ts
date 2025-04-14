import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://136.59.129.136:33457/api/:path*',
      },
    ];
  },
};

export default nextConfig;