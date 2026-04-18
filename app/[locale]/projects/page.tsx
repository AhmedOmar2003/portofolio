import { getTranslations } from 'next-intl/server';

import ProjectsFilterGrid from '@/components/projects/ProjectsFilterGrid';
import SectionHeading from '@/components/ui/SectionHeading';
import { getLocaleDateFormat, localizedValue } from '@/utils/locale-content';
import { getProjectTypeLabel, normalizeProjectType, type ProjectType } from '@/utils/project-type';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600;

function formatPreview(text?: string | null, fallback = '', maxLength = 136) {
  const clean = (text || fallback).trim().split('\n')[0];
  return clean.length > maxLength ? `${clean.slice(0, maxLength).trimEnd()}…` : clean;
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const nav  = await getTranslations({ locale, namespace: 'Navigation' });
  const home = await getTranslations({ locale, namespace: 'HomePage' });
  const supabase = await createClient();

  const orderedProjectsQuery = await supabase
    .from('projects')
    .select('id, name_en, name_ar, slug, category, description_en, description_ar, solution_en, solution_ar, images, start_date, is_featured, external_links')
    .order('view_order', { ascending: true })
    .order('created_at', { ascending: false });

  const fallbackProjectsQuery = orderedProjectsQuery.error
    ? await supabase
        .from('projects')
        .select('id, name_en, name_ar, slug, category, description_en, description_ar, solution_en, solution_ar, images, start_date, is_featured, external_links')
        .order('created_at', { ascending: false })
    : null;

  const projectsData = orderedProjectsQuery.error ? (fallbackProjectsQuery?.data || []) : (orderedProjectsQuery.data || []);

  const allProjects = (projectsData || []).map((p, index) => {
    const externalLinks = (p.external_links || {}) as Record<string, unknown>;
    const projectType = normalizeProjectType(externalLinks.project_type);
    return {
      title:       localizedValue(p as Record<string, unknown>, 'name', locale) || p.name_en,
      type:        projectType,
      typeLabel:   getProjectTypeLabel(projectType, locale),
      category:    p.category || home('projectCategoryFallback'),
      year:        p.start_date
                    ? new Date(p.start_date).toLocaleDateString(getLocaleDateFormat(locale), { year: 'numeric' })
                    : home('projectYearFallback'),
      description: formatPreview(
                    localizedValue(p as Record<string, unknown>, 'description', locale),
                    home('projectDescriptionFallbackEn')
                  ),
      href:        `/projects/${p.slug}`,
      imageUrl:    p.images?.[0] ?? undefined,
      role:        home('projectRoleValue'),
      impact:      formatPreview(
                    localizedValue(p as Record<string, unknown>, 'solution', locale),
                    home('projectImpactFallback')
                  ),
      index,
    };
  });

  const finalProjects = allProjects.length > 0 ? allProjects : [
    {
      title: home('sampleProjectTitle1'), type: 'design' as ProjectType, typeLabel: getProjectTypeLabel('design', locale), category: home('sampleProjectCategory1'),
      year: '2025', description: home('sampleProjectDescription1'),
      href: '/projects', imageUrl: undefined,
      role: home('projectRoleValue'), impact: home('sampleProjectImpact1'), index: 0,
    },
    {
      title: home('sampleProjectTitle2'), type: 'programming' as ProjectType, typeLabel: getProjectTypeLabel('programming', locale), category: home('sampleProjectCategory2'),
      year: '2024', description: home('sampleProjectDescription2'),
      href: '/projects', imageUrl: undefined,
      role: home('projectRoleValue'), impact: home('sampleProjectImpact2'), index: 1,
    },
  ];

  return (
    <main className="px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1380px] space-y-14">

        <SectionHeading
          overline={home('featuredProjects')}
          title={nav('projects')}
          subtitle={home('featuredProjectsSub')}
        />

        <ProjectsFilterGrid
          projects={finalProjects}
          isArabic={locale === 'ar'}
          labels={{
            role: home('projectRoleLabel'),
            outcome: home('projectOutcomeLabel'),
            year: home('projectYearLabel'),
            cta: home('viewCaseStudy'),
            all: locale === 'ar' ? 'الكل' : 'All',
            design: getProjectTypeLabel('design', locale),
            programming: getProjectTypeLabel('programming', locale),
            empty: locale === 'ar' ? 'لا توجد مشاريع في هذا التصنيف حاليًا.' : 'No projects found in this type yet.',
          }}
        />

      </div>
    </main>
  );
}
