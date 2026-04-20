import { ArrowUpRight, CheckCircle2, MoveRight, Figma, Code2, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import Hero from '@/components/home/Hero';
import SectionHeading from '@/components/ui/SectionHeading';
import ProjectCard from '@/components/ui/ProjectCard';
import { Link } from '@/i18n/routing';
import { getLocaleDateFormat, localizedValue } from '@/utils/locale-content';
import { getProjectRoleLabel, getProjectTypeLabel, normalizeProjectType } from '@/utils/project-type';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600;

type ContactMethod = {
  type: string;
  value: string;
  label_en: string;
  label_ar?: string;
};

function splitLines(content?: string | null) {
  return (content || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatPreview(content?: string | null, fallback?: string, maxLength = 124) {
  const preview = splitLines(content)[0] || fallback || '';
  return preview.length <= maxLength ? preview : `${preview.slice(0, maxLength).trimEnd()}...`;
}

function formatContactHref(method: ContactMethod) {
  if (method.type.toLowerCase() === 'email' && !method.value.startsWith('mailto:')) {
    return `mailto:${method.value}`;
  }

  return method.value;
}

function normalizeName(entry: unknown, fallback = '') {
  if (typeof entry === 'string') {
    return entry;
  }

  if (entry && typeof entry === 'object') {
    const candidate = entry as Record<string, unknown>;
    return String(candidate.name_en || candidate.name || candidate.title || fallback);
  }

  return fallback;
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const supabase = await createClient();

  const [
    projectsQuery,
    { data: servicesData },
    { data: settingsData },
    { data: aboutData },
    { data: contactsData },
  ] = await Promise.all([
    supabase.from('projects').select('id, name_en, name_ar, slug, category, description_en, description_ar, solution_en, solution_ar, images, start_date, external_links').order('view_order', { ascending: true }).order('created_at', { ascending: false }).limit(2),
    supabase.from('services').select('id, title_en, title_ar, description_en, description_ar, detailed_content_en, detailed_content_ar').eq('is_featured', true).order('view_order', { ascending: true }).limit(2),
    supabase
      .from('site_settings')
      .select('hero_title_en, hero_title_ar, hero_subtitle_en, hero_subtitle_ar')
      .single(),
    supabase
      .from('about')
      .select('title_en, title_ar, intro_en, intro_ar, philosophy_en, philosophy_ar, skills, tools')
      .single(),
    supabase
      .from('contact_methods')
      .select('type, value, label_en, label_ar')
      .eq('is_visible', true)
      .order('view_order', { ascending: true })
      .limit(2),
  ]);

  const projectsData = projectsQuery.error
    ? (await supabase.from('projects').select('id, name_en, name_ar, slug, category, description_en, description_ar, solution_en, solution_ar, images, start_date, external_links').order('created_at', { ascending: false }).limit(2)).data
    : projectsQuery.data;

  const principleCards = splitLines(localizedValue(aboutData as Record<string, unknown>, 'philosophy', locale)).slice(0, 3);
  const principles = principleCards.length ? principleCards : [t('principle1'), t('principle2'), t('principle3')];
  const condensedPrinciples = principles.slice(0, 2);
  const projectDescriptionFallback = isArabic
    ? t('projectDescriptionFallbackAr')
    : t('projectDescriptionFallbackEn');

  const featuredProjects = (projectsData || []).map((project) => ({
    projectType: normalizeProjectType((project.external_links as Record<string, unknown> | null)?.project_type),
    title: localizedValue(project as Record<string, unknown>, 'name', locale),
    category:
      typeof project.category === 'string' && project.category.trim().length > 0
        ? project.category
        : getProjectTypeLabel(
            normalizeProjectType((project.external_links as Record<string, unknown> | null)?.project_type),
            locale
          ),
    year: project.start_date
      ? new Date(project.start_date).toLocaleDateString(getLocaleDateFormat(locale), { year: 'numeric' })
      : t('projectYearFallback'),
    description: formatPreview(
      localizedValue(project as Record<string, unknown>, 'description', locale),
      projectDescriptionFallback,
      138
    ),
    href: `/projects/${project.slug}`,
    imageUrl: project.images && project.images.length > 0 ? project.images[0] : undefined,
    role: getProjectRoleLabel(
      normalizeProjectType((project.external_links as Record<string, unknown> | null)?.project_type),
      locale
    ),
    impact: formatPreview(localizedValue(project as Record<string, unknown>, 'solution', locale), t('projectImpactFallback')),
  }));

  const finalFeaturedProjects =
    featuredProjects.length > 0
      ? featuredProjects
      : [
          {
            title: t('sampleProjectTitle1'),
            category: t('sampleProjectCategory1'),
            year: '2025',
            description: t('sampleProjectDescription1'),
            href: '/projects',
            imageUrl: undefined,
            role: getProjectRoleLabel('design', locale),
            impact: t('sampleProjectImpact1'),
          },
          {
            title: t('sampleProjectTitle2'),
            category: t('sampleProjectCategory2'),
            year: '2024',
            description: t('sampleProjectDescription2'),
            href: '/projects',
            imageUrl: undefined,
            role: getProjectRoleLabel('programming', locale),
            impact: t('sampleProjectImpact2'),
          },
        ];

  const services = (servicesData || []).map((service, index) => ({
    id: service.id || `${localizedValue(service as Record<string, unknown>, 'title', locale)}-${index}`,
    title: localizedValue(service as Record<string, unknown>, 'title', locale),
    desc:
      localizedValue(service as Record<string, unknown>, 'description', locale) ||
      localizedValue(service as Record<string, unknown>, 'detailed_content', locale),
  }));

  const finalServices =
    services.length > 0
      ? services
      : [
          { id: 'strategy', title: t('serviceTitle1'), desc: t('serviceDesc1') },
          { id: 'ux', title: t('serviceTitle2'), desc: t('serviceDesc2') },
          { id: 'systems', title: t('serviceTitle3'), desc: t('serviceDesc3') },
        ];

  const dynamicSkills = Array.isArray(aboutData?.skills) ? aboutData.skills.map((item) => normalizeName(item)).filter(Boolean) : [];
  const dynamicTools = Array.isArray(aboutData?.tools) ? aboutData.tools.map((item) => normalizeName(item)).filter(Boolean) : [];
  const skillClusters = [...dynamicSkills, ...dynamicTools].slice(0, 6);
  const finalSkillClusters = skillClusters.length ? skillClusters : [t('skill1'), t('skill2'), t('skill3'), t('skill4'), t('skill5'), t('skill6')];

  const primaryContact = (contactsData || [])[0] as ContactMethod | undefined;

  return (
    <main className="relative overflow-hidden text-zinc-50 selection:bg-[#8df6c8] selection:text-slate-950">
      <a
        href="#main-content"
        className="sr-only-focusable skip-link-anchor fixed z-[60] rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
      >
        {t('skipToContent')}
      </a>

      <Hero
        title={localizedValue(settingsData as Record<string, unknown>, 'hero_title', locale)}
        subtitle={localizedValue(settingsData as Record<string, unknown>, 'hero_subtitle', locale)}
        projectCount={finalFeaturedProjects.length}
        serviceCount={finalServices.length}
      />

      <div id="main-content" className="px-6 pb-10 md:px-10 lg:px-12">
        <section id="about" aria-labelledby="about-heading" className="mx-auto max-w-[1380px] py-16 md:py-24">
          <div className="section-shell grid gap-10 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                id="about-heading"
                overline={t('aboutEyebrow')}
                title={localizedValue(aboutData as Record<string, unknown>, 'title', locale, t('aboutTitle'))}
                subtitle={localizedValue(aboutData as Record<string, unknown>, 'intro', locale, t('aboutSubtitle'))}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t('aboutStatLabel1')}</p>
                  <p className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">{t('aboutStatValue1')}</p>
                </div>
                <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t('aboutStatLabel2')}</p>
                  <p className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">{t('aboutStatValue2')}</p>
                </div>
              </div>
              <div className="mt-5">
                <Link href="/about" className="btn btn-secondary w-fit px-5 py-3 text-sm">
                  {t('aboutLink')}
                </Link>
              </div>
            </div>

            {/* Design to Code Visual Illustration */}
            <div className="relative flex h-full min-h-[320px] w-full flex-col items-center justify-center rounded-3xl border border-white/10 bg-[linear-gradient(160deg,rgba(141,246,200,0.03),rgba(255,255,255,0.01))] p-6 sm:p-10 lg:min-h-full">
              
              <div className="relative flex w-full max-w-[340px] items-center justify-between">
                {/* Figma Design Abstract Layer */}
                <div className="group z-10 flex h-40 w-[45%] shrink-0 flex-col overflow-hidden rounded-xl border border-white/15 bg-[#0a0a0a] p-3 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:rotate-0 sm:h-48 sm:p-4 -rotate-3">
                  <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                    <Figma className="h-4 w-4 text-[#F24E1E]" />
                    <span className="text-[10px] font-medium tracking-wider text-slate-300">Design</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2.5 opacity-80 transition-opacity group-hover:opacity-100">
                    <div className="h-2 w-full rounded-full bg-white/10" />
                    <div className="h-full w-full rounded-lg border border-white/5 bg-[linear-gradient(160deg,rgba(141,246,200,0.2),rgba(255,255,255,0.02))]" />
                    <div className="flex gap-2">
                      <div className="h-2 w-1/2 rounded-full bg-white/10" />
                      <div className="h-2 w-1/2 rounded-full bg-white/10" />
                    </div>
                  </div>
                </div>

                {/* Connection Line & Sparkle */}
                <div className="absolute left-1/2 top-1/2 z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#050816] shadow-xl transition-transform duration-500 hover:scale-110">
                  <Sparkles className="h-4 w-4 text-[#8df6c8]" />
                </div>
                <div className="absolute top-1/2 -z-0 w-full border-t border-dashed border-white/20" />

                {/* Code Abstract Layer */}
                <div className="group z-10 flex h-40 w-[45%] shrink-0 flex-col overflow-hidden rounded-xl border border-white/15 bg-[#0c1222] p-3 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:rotate-0 sm:h-48 sm:p-4 rotate-3">
                  <div className="mb-2 flex items-center gap-2 border-b border-white/10 pb-2">
                    <Code2 className="h-4 w-4 text-[#38bdf8]" />
                    <span className="text-[10px] font-medium tracking-wider text-slate-300">Code</span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1.5 font-mono text-[9px] opacity-80 transition-opacity group-hover:opacity-100 sm:text-[10px]">
                    <p><span className="text-[#f472b6]">export</span> <span className="text-[#38bdf8]">function</span> <span className="text-[#fde047]">App</span>() {'{'}</p>
                    <p className="pl-2"><span className="text-[#f472b6]">return</span> (</p>
                    <p className="pl-4 text-[#8df6c8]">&lt;Layout&gt;</p>
                    <p className="pl-6 text-slate-300">{"{UI}"}</p>
                    <p className="pl-4 text-[#8df6c8]">&lt;/Layout&gt;</p>
                    <p className="pl-2">)</p>
                    <p>{'}'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" aria-labelledby="projects-heading" className="mx-auto max-w-[1380px] py-16 md:py-24">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading id="projects-heading" overline={t('featuredProjects')} title={t('featuredProjectsTitle')} subtitle={t('featuredProjectsSub')} />
            <Link href="/projects" className="btn btn-secondary w-fit px-5 py-3 text-sm">
              {t('viewAllProjects')}
              <MoveRight className={`h-4 w-4 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {finalFeaturedProjects.map((project, index) => (
              <ProjectCard
                key={`${project.title}-${index}`}
                index={index}
                title={project.title}
                category={project.category}
                year={project.year}
                description={project.description}
                href={project.href}
                imageUrl={project.imageUrl}
                role={project.role}
                impact={project.impact}
                priority={index === 0}
                labels={{ role: t('projectRoleLabel'), outcome: t('projectOutcomeLabel'), year: t('projectYearLabel'), cta: t('viewCaseStudy') }}
              />
            ))}
          </div>
        </section>

        <section id="skills" aria-labelledby="skills-heading" className="mx-auto max-w-[1380px] py-16 md:py-24">
          <div className="section-shell px-6 py-12 md:px-12 md:py-16">
            <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
              <div className="lg:w-[35%] shrink-0">
                <div className="sticky top-32">
                  <SectionHeading id="skills-heading" overline={t('skillsEyebrow')} title={t('skillsTitle')} subtitle={t('skillsSubtitle')} />
                </div>
              </div>

              <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:w-[65%]">
                {finalServices.map((service, index) => (
                  <article key={service.id} className="relative flex flex-col pt-2 border-t border-white/10 sm:border-none sm:pt-0">
                    <span className="mb-4 block text-sm font-semibold tracking-widest text-[#8df6c8] uppercase">
                      [{index + 1}]
                    </span>
                    <h3 className={`mb-3 text-xl font-bold text-white ${isArabic ? 'leading-tight' : 'tracking-[-0.03em]'}`}>
                      {service.title}
                    </h3>
                    <p className={`text-base text-slate-400 ${isArabic ? 'leading-8' : 'leading-7'}`}>
                      {service.desc}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-heading" className="mx-auto max-w-[1000px] py-16 md:py-24">
          <div className="section-shell relative overflow-hidden px-6 py-12 text-center md:px-12 md:py-16 flex flex-col items-center rounded-3xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-[#8df6c8]/10 blur-[120px] transform-gpu will-change-transform" style={{ transform: 'translate3d(-50%, -50%, 0)', willChange: 'filter, transform' }} />
            <div className="relative z-10 flex flex-col items-center w-full">
              <SectionHeading id="contact-heading" alignment="center" overline={t('contactEyebrow')} title={t('contactTitle')} subtitle={t('contactSubtitle')} />

              <div className="mt-8 flex flex-col w-full sm:w-auto sm:flex-row gap-4 justify-center items-center">
                {primaryContact ? (
                  <a href={formatContactHref(primaryContact)} className="btn btn-primary w-full justify-center sm:w-auto px-8">
                    {t('contactPrimary')}
                  </a>
                ) : null}
                <Link href="/contact" className="btn btn-secondary w-full justify-center sm:w-auto px-8">
                  {t('contactSecondary')}
                </Link>
              </div>


            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
