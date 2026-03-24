import { getTranslations } from 'next-intl/server';

import ProjectCard from '@/components/ui/ProjectCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600;

function splitLines(content?: string | null) {
  return (content || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatPreview(content?: string | null, fallback?: string, maxLength = 136) {
  const preview = splitLines(content)[0] || fallback || '';

  if (preview.length <= maxLength) {
    return preview;
  }

  return `${preview.slice(0, maxLength).trimEnd()}...`;
}

export default async function ProjectsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const nav = await getTranslations({ locale, namespace: 'Navigation' });
  const home = await getTranslations({ locale, namespace: 'HomePage' });
  const supabase = await createClient();

  const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });

  const allProjects = (projectsData || []).map((project, index) => ({
    title: locale === 'ar' ? project.name_ar : project.name_en,
    category: project.category || home('projectCategoryFallback'),
    year: project.start_date ? new Date(project.start_date).getFullYear().toString() : home('projectYearFallback'),
    description: formatPreview(
      locale === 'ar' ? project.description_ar : project.description_en,
      locale === 'ar' ? home('projectDescriptionFallbackAr') : home('projectDescriptionFallbackEn')
    ),
    href: `/projects/${project.slug}`,
    imageUrl: project.images && project.images.length > 0 ? project.images[0] : undefined,
    role: home('projectRoleValue'),
    impact: formatPreview(locale === 'ar' ? project.solution_ar : project.solution_en, home('projectImpactFallback')),
    index,
  }));

  const finalProjects =
    allProjects.length > 0
      ? allProjects
      : [
          {
            title: home('sampleProjectTitle1'),
            category: home('sampleProjectCategory1'),
            year: '2025',
            description: home('sampleProjectDescription1'),
            href: '/projects',
            imageUrl: undefined,
            role: home('projectRoleValue'),
            impact: home('sampleProjectImpact1'),
            index: 0,
          },
          {
            title: home('sampleProjectTitle2'),
            category: home('sampleProjectCategory2'),
            year: '2024',
            description: home('sampleProjectDescription2'),
            href: '/projects',
            imageUrl: undefined,
            role: home('projectRoleValue'),
            impact: home('sampleProjectImpact2'),
            index: 1,
          },
        ];

  return (
    <main className="px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1380px]">
        <SectionHeading
          overline={home('featuredProjects')}
          title={nav('projects')}
          subtitle={home('featuredProjectsSub')}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {finalProjects.map((project, index) => (
            <ProjectCard
              key={`${project.title}-${index}`}
              index={project.index}
              title={project.title}
              category={project.category}
              year={project.year}
              description={project.description}
              href={project.href}
              imageUrl={project.imageUrl}
              role={project.role}
              impact={project.impact}
              labels={{
                role: home('projectRoleLabel'),
                outcome: home('projectOutcomeLabel'),
                year: home('projectYearLabel'),
                cta: home('viewCaseStudy'),
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
