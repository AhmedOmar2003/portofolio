import Image from 'next/image';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { notFound } from 'next/navigation';

import { Link } from '@/i18n/routing';
import { createClient } from '@/utils/supabase/server';

function splitParagraphs(content?: string | null) {
  return (content || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDateLabel(value?: string | null, locale = 'en') {
  if (!value) {
    return locale === 'ar' ? 'غير محدد' : 'Not specified';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
  }).format(date);
}

function formatExternalLink(key: string, value: string, locale: string) {
  const labels: Record<string, { en: string; ar: string }> = {
    live_demo: { en: 'Live Demo', ar: 'عرض مباشر' },
    github: { en: 'Repository', ar: 'المستودع' },
    behance: { en: 'Behance', ar: 'بيهانس' },
    dribbble: { en: 'Dribbble', ar: 'دريبل' },
    figma: { en: 'Figma Prototype', ar: 'نموذج Figma' },
  };

  return labels[key]?.[locale === 'ar' ? 'ar' : 'en'] || key.replace(/_/g, ' ');
}

export default async function ProjectCaseStudyPage(props: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await props.params;
  const supabase = await createClient();

  const { data: project } = await supabase.from('projects').select('*').eq('slug', slug).single();

  if (!project) {
    notFound();
  }

  const title = locale === 'ar' ? project.name_ar : project.name_en;
  const description = locale === 'ar' ? project.description_ar : project.description_en;
  const problem = locale === 'ar' ? project.problem_ar : project.problem_en;
  const process = locale === 'ar' ? project.process_ar : project.process_en;
  const solution = locale === 'ar' ? project.solution_ar : project.solution_en;
  const heroImage = project.images && project.images.length > 0 ? project.images[0] : null;
  const galleryImages = project.images?.slice(1) || [];
  const externalLinks = project.external_links || {};

  const sections = [
    {
      id: 'problem',
      title: locale === 'ar' ? 'المشكلة' : 'Problem',
      content: splitParagraphs(problem),
    },
    {
      id: 'process',
      title: locale === 'ar' ? 'عملية التصميم' : 'Design Process',
      content: splitParagraphs(process),
    },
    {
      id: 'solution',
      title: locale === 'ar' ? 'النتيجة والأثر' : 'Results & Impact',
      content: splitParagraphs(solution),
    },
  ].filter((section) => section.content.length > 0);

  const metaItems = [
    {
      label: locale === 'ar' ? 'الفئة' : 'Category',
      value: project.category || (locale === 'ar' ? 'تصميم منتج رقمي' : 'Digital Product Design'),
    },
    {
      label: locale === 'ar' ? 'البداية' : 'Started',
      value: formatDateLabel(project.start_date, locale),
    },
    {
      label: locale === 'ar' ? 'الانتهاء' : 'Completed',
      value: formatDateLabel(project.end_date, locale),
    },
    {
      label: locale === 'ar' ? 'الدور' : 'Role',
      value: locale === 'ar' ? 'مصمم منتج رئيسي' : 'Lead Product Designer',
    },
  ];

  return (
    <main className="px-6 pb-20 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1380px]">
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          <ArrowLeft className={`h-4 w-4 ${locale === 'ar' ? 'rotate-180' : ''}`} aria-hidden="true" />
          {locale === 'ar' ? 'العودة إلى المشاريع' : 'Back to projects'}
        </Link>

        <section className="section-shell overflow-hidden px-6 py-8 md:px-10 md:py-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.55fr)] lg:gap-12">
            <div>
              <span className="eyebrow mb-6">{locale === 'ar' ? 'دراسة حالة' : 'Case Study'}</span>
              <h1 className="text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-[4.5rem] lg:leading-[0.98]">
                {title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">{description}</p>
            </div>

            <aside className="grid gap-4 self-start rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5">
              {metaItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/8 bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-base font-medium text-white">{item.value}</p>
                </div>
              ))}
            </aside>
          </div>

          <div className="mt-10">
            {heroImage ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-white/10 bg-black/20">
                <Image src={heroImage} alt={title} fill priority className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04070f] via-transparent to-transparent" />
              </div>
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(141,246,200,0.12),rgba(106,215,255,0.08))]">
                <span className="text-sm uppercase tracking-[0.2em] text-slate-400">
                  {locale === 'ar' ? 'صورة المشروع غير متوفرة' : 'Project visual coming soon'}
                </span>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-8 py-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-12">
          <div className="section-shell px-6 py-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {locale === 'ar' ? 'ملخص سريع' : 'Quick Overview'}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              {locale === 'ar'
                ? 'هذه الصفحة تعرض المشكلة، منهجية التصميم، والأثر النهائي للمشروع بشكل منظم وواضح.'
                : 'This case study is organized to surface the challenge, design approach, and final outcome with clarity.'}
            </p>

            {Object.keys(externalLinks).length > 0 ? (
              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {locale === 'ar' ? 'روابط المشروع' : 'Project Links'}
                </h3>
                <div className="mt-4 flex flex-col gap-3">
                  {Object.entries(externalLinks).map(([key, value]) => (
                    <a
                      key={key}
                      href={String(value)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition hover:border-[#8df6c8]/30 hover:text-white"
                    >
                      <span>{formatExternalLink(key, String(value), locale)}</span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <article key={section.id} className="section-shell px-6 py-6 md:px-8 md:py-8">
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white md:text-3xl">{section.title}</h2>
                <div className="mt-5 space-y-4 text-base leading-8 text-slate-300">
                  {section.content.map((paragraph, index) => (
                    <p key={`${section.id}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {galleryImages.length > 0 ? (
          <section className="py-6">
            <div className="mb-6">
              <span className="eyebrow">{locale === 'ar' ? 'المعرض' : 'Gallery'}</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {galleryImages.map((image: string, index: number) => (
                <div
                  key={`${image}-${index}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/10"
                >
                  <Image src={image} alt={`${title} gallery image ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
