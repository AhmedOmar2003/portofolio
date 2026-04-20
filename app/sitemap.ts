import type { MetadataRoute } from 'next';
import { createStaticClient } from '@/utils/supabase/static';

const BASE_URL = 'https://ahmed-essam.com';
const LOCALES = ['en', 'ar'] as const;

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();

  // Fetch dynamic content slugs
  const [{ data: projects }, { data: articles }, { data: services }] = await Promise.all([
    supabase.from('projects').select('slug, updated_at'),
    supabase.from('articles').select('slug, updated_at').not('published_at', 'is', null),
    supabase.from('services').select('id, updated_at'),
  ]);

  const now = new Date().toISOString();

  // Static pages
  const staticRoutes = ['', '/about', '/projects', '/services', '/articles', '/contact'];
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
    }))
  );

  // Dynamic project pages
  const projectEntries: MetadataRoute.Sitemap = (projects ?? []).flatMap(({ slug, updated_at }) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/projects/${slug}`,
      lastModified: updated_at ?? now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  // Dynamic article pages
  const articleEntries: MetadataRoute.Sitemap = (articles ?? []).flatMap(({ slug, updated_at }) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/articles/${slug}`,
      lastModified: updated_at ?? now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  // Dynamic service pages
  const serviceEntries: MetadataRoute.Sitemap = (services ?? []).flatMap(({ id, updated_at }) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/services/${id}`,
      lastModified: updated_at ?? now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  return [...staticEntries, ...projectEntries, ...articleEntries, ...serviceEntries];
}
