/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  ...(isGithubActions
    ? {
        output: 'export',
        basePath: '/Peers_Charity',
        assetPrefix: '/Peers_Charity/',
      }
    : {}),
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    if (isGithubActions) return [];
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // Only proxy to external API if explicitly configured and not localhost in production
    if (apiUrl && !apiUrl.includes('localhost')) {
      return [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;

