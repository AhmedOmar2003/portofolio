import { ArrowUpRight, CheckCircle2, MoveRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import Hero from '@/components/home/Hero';
import SectionHeading from '@/components/ui/SectionHeading';
import ProjectCard from '@/components/ui/ProjectCard';
import { Link } from '@/i18n/routing';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600;

type ContactMethod = {
  type: string;
  value: string;
  label_en: string;
};

type TimelineItem =
  | string
  | {
      role?: string;
      company?: string;
      period?: string;
      summary?: string;
      title?: string;
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

function normalizeTimeline(items: TimelineItem[] | null | undefined) {
  if (!items || items.length === 0) {
    return [];
  }

  return items
    .map((item) => {
      if (typeof item === 'string') {
        return { title: item, meta: '', summary: '' };
      }

      const title = item.role || item.title || item.company || 'Experience';
      const meta = [item.company, item.period].filter(Boolean).join(' • ');
      const summary = item.summary || '';

      return { title, meta, summary };
    })
    .filter((item) => item.title);
}

export default async function HomePage() {
  const t = await getTranslations({ locale: 'en', namespace: 'HomePage' });
  const supabase = await createClient();

  const [
    { data: projectsData },
    { data: servicesData },
    { data: settingsData },
    { data: aboutData },
    { data: contactsData },
  ] = await Promise.all([
    supabase.from('projects').select('*').eq('is_featured', true).order('created_at', { ascending: false }).limit(4),
    supabase.from('services').select('*').eq('is_featured', true).order('view_order', { ascending: true }).limit(3),
    supabase.from('site_settings').select('hero_title_en, hero_subtitle_en').single(),
    supabase
      .from('about')
      .select('title_en, intro_en, philosophy_en, skills, tools, experience_timeline')
      .single(),
    supabase.from('contact_methods').select('type, value, label_en').eq('is_visible', true).order('view_order', { ascending: true }).limit(3),
  ]);

  const principleCards = splitLines(aboutData?.philosophy_en).slice(0, 3);
  const principles = principleCards.length ? principleCards : [t('principle1'), t('principle2'), t('principle3')];

  const featuredProjects = (projectsData || []).map((project) => ({
    title: project.name_en,
    category: project.category || t('projectCategoryFallback'),
    year: project.start_date ? new Date(project.start_date).getFullYear().toString() : t('projectYearFallback'),
    description: formatPreview(project.description_en, t('projectDescriptionFallbackEn'), 138),
    href: `/projects/${project.slug}`,
    imageUrl: project.images && project.images.length > 0 ? project.images[0] : undefined,
    role: t('projectRoleValue'),
    impact: formatPreview(project.solution_en, t('projectImpactFallback')),
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
            role: t('projectRoleValue'),
            impact: t('sampleProjectImpact1'),
          },
          {
            title: t('sampleProjectTitle2'),
            category: t('sampleProjectCategory2'),
            year: '2024',
            description: t('sampleProjectDescription2'),
            href: '/projects',
            imageUrl: undefined,
            role: t('projectRoleValue'),
            impact: t('sampleProjectImpact2'),
          },
        ];

  const services = (servicesData || []).map((service, index) => ({
    id: service.id || `${service.title_en}-${index}`,
    title: service.title_en,
    desc: service.description_en || service.detailed_content_en,
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
  const skillClusters = [...dynamicSkills, ...dynamicTools].slice(0, 8);
  const finalSkillClusters = skillClusters.length ? skillClusters : [t('skill1'), t('skill2'), t('skill3'), t('skill4'), t('skill5'), t('skill6')];

  const timeline = normalizeTimeline((aboutData?.experience_timeline as TimelineItem[] | undefined) || []);
  const processItems =
    timeline.length >= 3
      ? timeline.slice(0, 3).map((item, index) => ({
          number: `0${index + 1}`,
          title: item.title,
          description: item.summary || item.meta || t(`processDesc${index + 1}`),
        }))
      : [
          { number: '01', title: t('processTitle1'), description: t('processDesc1') },
          { number: '02', title: t('processTitle2'), description: t('processDesc2') },
          { number: '03', title: t('processTitle3'), description: t('processDesc3') },
        ];

  const primaryContact = (contactsData || [])[0] as ContactMethod | undefined;

  return (
    <main className="relative overflow-hidden text-zinc-50 selection:bg-[#8df6c8] selection:text-slate-950">
      <a href="#main-content" className="sr-only-focusable fixed left-4 top-4 z-[60] rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
        {t('skipToContent')}
      </a>

      <Hero
        title={settingsData?.hero_title_en}
        subtitle={settingsData?.hero_subtitle_en}
        projectCount={finalFeaturedProjects.length}
        serviceCount={finalServices.length}
      />

      <div id="main-content" className="px-6 pb-12 md:px-10 lg:px-12">
        <section id="about" className="mx-auto max-w-[1380px] py-10 md:py-16">
          <div className="section-shell grid gap-10 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
            <div>
              <SectionHeading overline={t('aboutEyebrow')} title={aboutData?.title_en || t('aboutTitle')} subtitle={aboutData?.intro_en || t('aboutSubtitle')} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t('aboutStatLabel1')}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{t('aboutStatValue1')}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t('aboutStatLabel2')}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{t('aboutStatValue2')}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {principles.map((point, index) => (
                <div key={`${point}-${index}`} className="rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#8df6c8]/20 bg-[#8df6c8]/10 text-[#8df6c8]">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="text-lg leading-8 text-slate-100">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-[1380px] py-14 md:py-20">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading overline={t('featuredProjects')} title={t('featuredProjectsTitle')} subtitle={t('featuredProjectsSub')} />
            <Link href="/projects" className="btn btn-secondary w-fit px-5 py-3 text-sm">
              {t('viewAllProjects')}
              <MoveRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
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
                labels={{ role: t('projectRoleLabel'), outcome: t('projectOutcomeLabel'), year: t('projectYearLabel'), cta: t('viewCaseStudy') }}
              />
            ))}
          </div>
        </section>

        <section id="case-study" className="mx-auto max-w-[1380px] py-14 md:py-20">
          <div className="section-shell px-6 py-8 md:px-10 md:py-10">
            <SectionHeading overline={t('processEyebrow')} title={t('processTitle')} subtitle={t('processSubtitle')} />

            <div className="grid gap-5 lg:grid-cols-3">
              {processItems.map((item) => (
                <article key={item.number} className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-6 transition duration-300 hover:border-[#8df6c8]/20 hover:bg-white/[0.05]">
                  <span className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8df6c8]">{item.number}</span>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">{item.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-300">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="mx-auto max-w-[1380px] py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <div>
              <SectionHeading overline={t('skillsEyebrow')} title={t('skillsTitle')} subtitle={t('skillsSubtitle')} />

              <div className="flex flex-wrap gap-3">
                {finalSkillClusters.map((skill) => (
                  <span key={skill} className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {finalServices.map((service, index) => (
                <article key={service.id} className={`rounded-[1.6rem] border border-white/8 p-6 ${index === 0 ? 'bg-[linear-gradient(160deg,rgba(141,246,200,0.16),rgba(255,255,255,0.03))]' : 'bg-white/[0.03]'}`}>
                  <span className="inline-flex rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    0{index + 1}
                  </span>
                  <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">{service.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-300">{service.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-[1380px] py-14 md:py-20">
          <div className="section-shell overflow-hidden px-6 py-10 md:px-10 md:py-12">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#8df6c8]/10 blur-[120px]" />
            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <SectionHeading overline={t('contactEyebrow')} title={t('contactTitle')} subtitle={t('contactSubtitle')} />

                {contactsData && contactsData.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {contactsData.map((method) => (
                      <a
                        key={`${method.type}-${method.value}`}
                        href={formatContactHref(method as ContactMethod)}
                        target={method.type.toLowerCase() === 'email' ? '_self' : '_blank'}
                        rel="noreferrer"
                        className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200 transition hover:border-[#8df6c8]/30 hover:text-white"
                      >
                        {method.label_en}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 lg:items-end">
                {primaryContact ? (
                  <a href={formatContactHref(primaryContact)} className="btn btn-primary justify-center text-sm sm:text-base">
                    {t('contactPrimary')}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
                <Link href="/contact" className="btn btn-secondary justify-center text-sm sm:text-base">
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
