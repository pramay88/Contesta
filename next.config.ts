import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/contests',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
