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

  // Autoriser l'admin Strapi à intégrer le site en iframe pour la Preview
  async headers() {
    const strapiOrigin = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' ${strapiOrigin};`,
          },
        ],
      },
    ]
  },
};

export default nextConfig;
