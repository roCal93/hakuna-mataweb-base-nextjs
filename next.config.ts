import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // Pour la production, ajoutez votre domaine Strapi ici :
      // {
      //   protocol: 'https',
      //   hostname: 'votre-strapi.com',
      //   pathname: '/uploads/**',
      // },
    ],
    unoptimized: true, // ⚠️ OK pour le dev local, à retirer en production
  },
};

export default nextConfig;
