import Hero from '@/components/home/Hero';
import SectionHeading from '@/components/ui/SectionHeading';
import ProjectCard from '@/components/ui/ProjectCard';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600; // Cache page and Supabase requests for 1 hour for performance

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;

  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const supabase = await createClient();

  // Fetch Featured Projects
  const { data: projectsData } = await supabase
    .from('projects')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(4);

  // Fetch Featured Services
  const { data: servicesData } = await supabase
    .from('services')
    .select('*')
    .eq('is_featured', true)
    .order('view_order', { ascending: true })
    .limit(3);

  // Map database results to frontend format
  const featuredProjects = (projectsData || []).map(p => ({
    title: locale === 'ar' ? p.name_ar : p.name_en,
    category: p.category || '',
    year: p.start_date ? new Date(p.start_date).getFullYear().toString() : '',
    description: locale === 'ar' ? p.description_ar : p.description_en,
    slug: p.slug,
    imageUrl: p.images && p.images.length > 0 ? p.images[0] : undefined
  }));

  const services = (servicesData || []).map(s => ({
    title: locale === 'ar' ? s.title_ar : s.title_en,
    desc: locale === 'ar' ? s.description_ar : s.description_en
  }));

  // Fallback structural mock if DB is empty to maintain design aesthetic during initial setup
  const finalFeaturedProjects = featuredProjects.length > 0 ? featuredProjects : [
    { title: "Sample Project 1", category: "UX/UI Design", year: "2025", description: "This is a placeholder project from the DB.", slug: "sample-1", imageUrl: "" },
    { title: "Sample Project 2", category: "Web Design", year: "2024", description: "This is a placeholder project from the DB.", slug: "sample-2", imageUrl: "" }
  ];

  const finalServices = services.length > 0 ? services : [
    { title: "Premium Strategy", desc: "Crafting digital experiences." },
    { title: "UX/UI Mastery", desc: "Pixel perfect user interfaces." },
    { title: "Design Systems", desc: "Building scalable and reusable component banks." }
  ];

  const { data: settingsData } = await supabase.from('site_settings').select('hero_title_en, hero_title_ar, hero_subtitle_en, hero_subtitle_ar').single();

  const heroSettings = {
    title: locale === 'ar' ? settingsData?.hero_title_ar : settingsData?.hero_title_en,
    subtitle: locale === 'ar' ? settingsData?.hero_subtitle_ar : settingsData?.hero_subtitle_en
  };

  return (
    <main className="min-h-screen font-sans bg-zinc-950 text-zinc-50 selection:bg-green-500 selection:text-zinc-950">
      <Hero 
        title={heroSettings.title} 
        subtitle={heroSettings.subtitle} 
      />
      
      {/* Featured Projects Section */}
      <section className="py-32 container mx-auto px-6 md:px-12 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
          <SectionHeading 
            overline={t('featuredProjects')} 
            title={t('featuredProjectsSub')} 
          />
          <Link href="/projects" className="shrink-0 mb-16 md:mb-24 px-8 py-3.5 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-full hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-300 text-sm font-semibold text-zinc-300 hover:text-green-400 flex items-center gap-2 group">
            {t('viewAllProjects')}
            <span className={locale === 'ar' ? "group-hover:-translate-x-1 transition-transform rotate-180" : "group-hover:translate-x-1 transition-transform"}>-&gt;</span>
          </Link>
        </div>
        
        <div className="grid max-w-[1400px] mx-auto md:grid-cols-2 gap-10 md:gap-14 lg:gap-16">
          {finalFeaturedProjects.map((project, index) => (
            <ProjectCard key={project.slug} index={index} {...project} />
          ))}
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-32 bg-zinc-950 relative border-t border-zinc-900/50 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <SectionHeading 
            overline={t('services')} 
            title={t('servicesSub')} 
            alignment="center" 
          />
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
            {finalServices.map((service, idx) => (
              <div 
                key={idx} 
                className="group relative p-1 pb-1 rounded-[2rem] bg-gradient-to-b from-zinc-800/40 to-transparent hover:from-green-500/30 transition-colors duration-500 ease-out"
              >
                <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/5 rounded-[2rem] transition-colors duration-500" />
                <div className="relative h-full p-8 rounded-[1.85rem] bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/60 overflow-hidden flex flex-col items-start gap-6 transition-transform duration-500">
                  {/* Subtle inner grid glow */}
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-zinc-700/20 rounded-full blur-[50px] group-hover:bg-green-500/20 transition-colors duration-700" />
                  
                  <div className="w-14 h-14 rounded-2xl bg-zinc-950/50 border border-zinc-800 text-zinc-400 group-hover:text-green-400 group-hover:border-green-500/30 flex items-center justify-center font-mono text-base transition-all duration-500 shadow-inner shadow-black/50">
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-50 mb-4 group-hover:text-green-500 transition-colors duration-500 tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-zinc-400 leading-relaxed font-light text-[15px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                      {service.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </main>
  );
}
