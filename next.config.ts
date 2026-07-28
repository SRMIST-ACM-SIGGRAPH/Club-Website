import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'srjntvpfbiniqmokucmg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  allowedDevOrigins: ['192.168.56.1', '10.67.155.227'],
};

export default nextConfig;
