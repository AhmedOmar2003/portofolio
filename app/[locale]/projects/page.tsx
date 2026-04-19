import { getTranslations } from 'next-intl/server';

import ProjectsFilterGrid from '@/components/projects/ProjectsFilterGrid';
import SectionHeading from '@/components/ui/SectionHeading';
import { getLocaleDateFormat, localizedValue } from '@/utils/locale-content';
import { getProjectFilterType, getProjectRoleLabel, getProjectTypeLabel, normalizeProjectType, type ProjectType } from '@/utils/project-type';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600;

type ProjectsFilterItem = {
  title: string;
  type: ProjectType;
  filterType: 'design' | 'programming';
  typeLabel: string;
  category: string;
  year: string;
  description: string;
  href: string;
  imageUrl?: string;
  role: string;
  impact: string;
  index: number;
};

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

  const allProjects: ProjectsFilterItem[] = (projectsData || []).map((p, index) => {
    const externalLinks = (p.external_links || {}) as Record<string, unknown>;
    const projectType = normalizeProjectType(externalLinks.project_type);
    const localizedTitle = localizedValue(p as Record<string, unknown>, 'name', locale);
    const localizedDescription = localizedValue(p as Record<string, unknown>, 'description', locale);
    const localizedImpact = localizedValue(p as Record<string, unknown>, 'solution', locale);
    const category = typeof p.category === 'string' && p.category.trim().length > 0
      ? p.category
      : getProjectTypeLabel(projectType, locale);
    const firstImage = Array.isArray(p.images) && typeof p.images[0] === 'string'
      ? p.images[0]
      : undefined;

    return {
      title:       typeof localizedTitle === 'string' && localizedTitle.trim().length > 0 ? localizedTitle : (p.name_en || ''),
      type:        projectType,
      filterType:  getProjectFilterType(projectType),
      typeLabel:   getProjectTypeLabel(projectType, locale),
      category,
      year:        p.start_date
                    ? new Date(p.start_date).toLocaleDateString(getLocaleDateFormat(locale), { year: 'numeric' })
                    : home('projectYearFallback'),
      description: formatPreview(
                    typeof localizedDescription === 'string' ? localizedDescription : null,
                    home('projectDescriptionFallbackEn')
                  ),
      href:        `/projects/${p.slug}`,
      imageUrl:    firstImage,
      role:        getProjectRoleLabel(projectType, locale),
      impact:      formatPreview(
                    typeof localizedImpact === 'string' ? localizedImpact : null,
                    home('projectImpactFallback')
                  ),
      index,
    };
  });

  const fallbackProjects: ProjectsFilterItem[] = [
    {
      title: home('sampleProjectTitle1'), type: 'design', filterType: 'design', typeLabel: getProjectTypeLabel('design', locale), category: home('sampleProjectCategory1'),
      year: '2025', description: home('sampleProjectDescription1'),
      href: '/projects', imageUrl: undefined,
      role: getProjectRoleLabel('design', locale), impact: home('sampleProjectImpact1'), index: 0,
    },
    {
      title: home('sampleProjectTitle2'), type: 'programming', filterType: 'programming', typeLabel: getProjectTypeLabel('programming', locale), category: home('sampleProjectCategory2'),
      year: '2024', description: home('sampleProjectDescription2'),
      href: '/projects', imageUrl: undefined,
      role: getProjectRoleLabel('programming', locale), impact: home('sampleProjectImpact2'), index: 1,
    },
  ];

  const finalProjects: ProjectsFilterItem[] = allProjects.length > 0 ? allProjects : fallbackProjects;

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
