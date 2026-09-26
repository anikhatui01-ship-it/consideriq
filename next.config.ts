import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/waitlist",
        destination: "/signup",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
