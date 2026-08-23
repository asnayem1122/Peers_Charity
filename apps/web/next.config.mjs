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
};

export default nextConfig;

