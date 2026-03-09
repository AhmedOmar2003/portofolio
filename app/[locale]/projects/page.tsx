import SectionHeading from '@/components/ui/SectionHeading';
import ProjectCard from '@/components/ui/ProjectCard';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600;

export default async function ProjectsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Navigation' });
  const supabase = await createClient();

  const { data: projectsData } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  const allProjects = (projectsData || []).map((p, index) => ({
    title: locale === 'ar' ? p.name_ar : p.name_en,
    category: p.category || '',
    year: p.start_date ? new Date(p.start_date).getFullYear().toString() : '',
    description: locale === 'ar' ? p.description_ar : p.description_en,
    slug: p.slug,
    imageUrl: p.images && p.images.length > 0 ? p.images[0] : undefined,
    index
  }));

  const finalProjects = allProjects.length > 0 ? allProjects : [
    { title: "Fintech Mobile Application", category: "Product Design", year: "2025", description: "Design & UX architecture.", slug: "fintech-app", index: 0 },
    { title: "Healthcare SaaS Dashboard", category: "UX/UI Design", year: "2024", description: "Admin dashboard for clinics.", slug: "health-dashboard", index: 1 },
    { title: "E-Commerce Experience", category: "Web Design", year: "2023", description: "A high-conversion e-commerce platform.", slug: "ecommerce-web", index: 2 },
    { title: "Real Estate Portal", category: "Product Design", year: "2023", description: "Property management and listing platform.", slug: "real-estate", index: 3 },
  ];
  
  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title={t('projects')} subtitle="A comprehensive collection of my design case studies and digital product solutions." />
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-16 max-w-6xl">
          {finalProjects.map((project) => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>
      </div>
    </main>
  );
}
