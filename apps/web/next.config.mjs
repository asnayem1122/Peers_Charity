/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Peers_Charity',
  assetPrefix: '/Peers_Charity/',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
