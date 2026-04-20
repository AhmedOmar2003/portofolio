import path from 'node:path';
import { fileURLToPath } from 'node:url';

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  // ── Security & hygiene ──────────────────────────────────────────────────
  poweredByHeader: false,
  compress: true,

  // ── Image optimization ──────────────────────────────────────────────────
  images: {
    // avif is ~30-50 % smaller than webp; next/image serves best-supported format per browser
    formats: ['image/avif', 'image/webp'],
    // Serve images at 2× density when device-pixel-ratio warrants it
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year – images are content-addressed so this is safe
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ghdwrskspfzewnqefwbe.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // ── HTTP caching & security headers ─────────────────────────────────────
  async headers() {
    return [
      {
        // Static assets (JS, CSS, fonts, images served by Next) get long TTL
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Favicons / apple-icon
        source: '/(favicon.ico|icon.svg|apple-icon.svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // All pages: sensible security defaults
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection',          value: '1; mode=block' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  turbopack: {
    root: projectRoot,
  },
};

export default withNextIntl(nextConfig);
