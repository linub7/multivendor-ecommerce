import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Or your specific Cloudinary subdomain
        port: '',
        pathname: '/**', // Important: Include the wildcard for all paths
      },
    ],
  },
};

export default nextConfig;
