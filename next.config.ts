import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lmn516.com" },
      { protocol: "http", hostname: "lmn516.com" }
    ]
  }
};

export default nextConfig;
