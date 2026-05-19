import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ahmed Essam Maher | Product Designer & AI Vibe Coder',
    short_name: 'Ahmed Essam',
    description:
      'Product Designer & AI Vibe Coder — building competitive digital products with strong UX and fast performance.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#050816',
    theme_color: '#09090b',
    orientation: 'portrait-primary',
    categories: ['portfolio', 'design', 'development'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/apple-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
