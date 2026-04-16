import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/ui/SectionHeading';
import { getLocaleDateFormat, isArabicLocale, localizedValue } from '@/utils/locale-content';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600;

function formatPreview(text?: string | null, fallback = '', maxLength = 120) {
  const clean = (text || fallback).trim().split('\n')[0];
  return clean.length > maxLength ? `${clean.slice(0, maxLength).trimEnd()}…` : clean;
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = isArabicLocale(locale);
  const nav = await getTranslations({ locale, namespace: 'Navigation' });
  const home = await getTranslations({ locale, namespace: 'HomePage' });
  const supabase = await createClient();

  const { data: projectsData } = await supabase
    .from('projects')
    .select('id, name_en, name_ar, slug, category, description_en, description_ar, images, start_date, is_featured')
    .order('created_at', { ascending: false });

  const projects = (projectsData || []).map((p, i) => ({
    id: p.id,
    title: localizedValue(p as Record<string, unknown>, 'name', locale) || p.name_en,
    category: p.category || home('projectCategoryFallback'),
    year: p.start_date
      ? new Date(p.start_date).toLocaleDateString(getLocaleDateFormat(locale), { year: 'numeric' })
      : home('projectYearFallback'),
    description: formatPreview(
      localizedValue(p as Record<string, unknown>, 'description', locale),
      home('projectDescriptionFallbackEn')
    ),
    href: `/projects/${p.slug}`,
    imageUrl: p.images?.[0] ?? undefined,
    featured: p.is_featured,
    index: i,
  }));

  const finalProjects = projects.length > 0 ? projects : [
    { id: '1', title: home('sampleProjectTitle1'), category: home('sampleProjectCategory1'), year: '2025', description: home('sampleProjectDescription1'), href: '/projects', imageUrl: undefined, featured: true, index: 0 },
    { id: '2', title: home('sampleProjectTitle2'), category: home('sampleProjectCategory2'), year: '2024', description: home('sampleProjectDescription2'), href: '/projects', imageUrl: undefined, featured: false, index: 1 },
  ];

  return (
    <main className="px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1380px] space-y-20">

        {/* Header */}
        <SectionHeading
          overline={home('featuredProjects')}
          title={nav('projects')}
          subtitle={home('featuredProjectsSub')}
        />

        {/* Projects list — typographic, alternating layout */}
        <div className="space-y-6">
          {finalProjects.map((project, i) => (
            <Link
              key={project.id}
              href={project.href}
              className="group block"
              aria-label={project.title}
            >
              <article className="grid items-center gap-6 rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] md:grid-cols-[1fr_auto] md:gap-10 md:px-8 md:py-7">
                {/* Left: text */}
                <div className="min-w-0">
                  <div className={`mb-4 flex flex-wrap items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="rounded-full border border-[#8df6c8]/20 bg-[#8df6c8]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#8df6c8]">
                      {project.category}
                    </span>
                    <span className="text-sm text-slate-500">{project.year}</span>
                    {project.featured && (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-400">
                        {isArabic ? 'مميز' : 'Featured'}
                      </span>
                    )}
                  </div>

                  <h2 className={`text-2xl font-semibold text-white transition-colors group-hover:text-[#8df6c8] sm:text-3xl ${isArabic ? 'leading-tight' : 'tracking-[-0.04em]'}`}>
                    {project.title}
                  </h2>

                  <p className={`mt-3 max-w-2xl text-base text-slate-400 ${isArabic ? 'leading-8 text-right' : 'leading-7'}`}>
                    {project.description}
                  </p>

                  <div className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition-colors group-hover:text-[#8df6c8] ${isArabic ? 'flex-row-reverse' : ''}`}>
                    {home('viewCaseStudy')}
                    <ArrowUpRight className={`h-4 w-4 transition-transform duration-300 ${isArabic ? 'rtl-flip group-hover:-translate-x-1' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} aria-hidden="true" />
                  </div>
                </div>

                {/* Right: thumbnail */}
                {project.imageUrl ? (
                  <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] md:h-36 md:w-64">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 256px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="hidden h-36 w-64 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] md:flex">
                    <span className="text-xs uppercase tracking-widest text-slate-600">{i + 1}</span>
                  </div>
                )}
              </article>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
