/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'myloginapp-jade.vercel.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;