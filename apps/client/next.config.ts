import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/shared"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/auth?mode=signin",
        permanent: false,
      },
      {
        source: "/signup",
        destination: "/auth?mode=signup",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;