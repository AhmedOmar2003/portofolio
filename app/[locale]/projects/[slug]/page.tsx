import Image from 'next/image';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { notFound } from 'next/navigation';

import { Link } from '@/i18n/routing';
import { getLocaleDateFormat, isArabicLocale, localizedValue } from '@/utils/locale-content';
import { createClient } from '@/utils/supabase/server';

function splitParagraphs(content?: string | null) {
  return (content || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDateLabel(value: string | null | undefined, locale: string) {
  if (!value) {
    return isArabicLocale(locale) ? 'غير محدد' : 'Not specified';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(getLocaleDateFormat(locale), {
    year: 'numeric',
    month: 'short',
  }).format(date);
}

function formatExternalLink(key: string, locale: string) {
  const labels: Record<string, { en: string; ar: string }> = {
    live_demo: { en: 'Live Demo', ar: 'النسخة الحية' },
    github: { en: 'Repository', ar: 'المصدر البرمجي' },
    behance: { en: 'Behance', ar: 'Behance' },
    dribbble: { en: 'Dribbble', ar: 'Dribbble' },
    figma: { en: 'Figma Prototype', ar: 'نموذج Figma' },
  };

  const label = labels[key];
  if (!label) {
    return key.replace(/_/g, ' ');
  }

  return isArabicLocale(locale) ? label.ar : label.en;
}

export default async function ProjectCaseStudyPage(props: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await props.params;
  const isArabic = isArabicLocale(locale);
  const supabase = await createClient();

  const { data: project } = await supabase.from('projects').select('*').eq('slug', slug).single();

  if (!project) {
    notFound();
  }

  const title = localizedValue(project as Record<string, unknown>, 'name', locale);
  const description = localizedValue(project as Record<string, unknown>, 'description', locale);
  const problem = localizedValue(project as Record<string, unknown>, 'problem', locale);
  const process = localizedValue(project as Record<string, unknown>, 'process', locale);
  const solution = localizedValue(project as Record<string, unknown>, 'solution', locale);
  const heroImage = project.images && project.images.length > 0 ? project.images[0] : null;
  const galleryImages = project.images?.slice(1) || [];
  const externalLinks = project.external_links || {};

  const sections = [
    {
      id: 'problem',
      title: isArabic ? 'المشكلة' : 'Problem',
      content: splitParagraphs(problem),
    },
    {
      id: 'process',
      title: isArabic ? 'عملية التصميم' : 'Design Process',
      content: splitParagraphs(process),
    },
    {
      id: 'solution',
      title: isArabic ? 'النتائج والأثر' : 'Results & Impact',
      content: splitParagraphs(solution),
    },
  ].filter((section) => section.content.length > 0);

  const metaItems = [
    {
      label: isArabic ? 'التصنيف' : 'Category',
      value: project.category || (isArabic ? 'تصميم منتجات رقمية' : 'Digital Product Design'),
    },
    {
      label: isArabic ? 'بداية المشروع' : 'Started',
      value: formatDateLabel(project.start_date, locale),
    },
    {
      label: isArabic ? 'نهاية المشروع' : 'Completed',
      value: formatDateLabel(project.end_date, locale),
    },
    {
      label: isArabic ? 'الدور' : 'Role',
      value: isArabic ? 'مصمم منتجات رئيسي' : 'Lead Product Designer',
    },
  ];

  return (
    <main className="px-6 pb-20 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1380px]">
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          <ArrowLeft className={`h-4 w-4 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
          {isArabic ? 'رجوع للمشاريع' : 'Back to projects'}
        </Link>

        <section className="section-shell overflow-hidden px-6 py-8 md:px-10 md:py-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.55fr)] lg:gap-12">
            <div>
              <span className="eyebrow mb-6">{isArabic ? 'دراسة حالة' : 'Case Study'}</span>
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
                <Image src={heroImage} alt={title} fill priority sizes="(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 1200px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04070f] via-transparent to-transparent" />
              </div>
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(141,246,200,0.12),rgba(106,215,255,0.08))]">
                <span className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    {isArabic ? 'صورة المشروع قريبًا' : 'Project visual coming soon'}
                </span>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-8 py-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-12">
          <div className="section-shell px-6 py-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {isArabic ? 'نظرة سريعة' : 'Quick Overview'}
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-300">
              {isArabic
                ? 'الدراسة متقسمة بشكل واضح لتوضيح التحدي وطريقة التصميم والنتيجة النهائية.'
                : 'This case study is organized to surface the challenge, design approach, and final outcome with clarity.'}
              </p>

            {Object.keys(externalLinks).length > 0 ? (
              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {isArabic ? 'روابط المشروع' : 'Project Links'}
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
                      <span>{formatExternalLink(key, locale)}</span>
                      <ArrowUpRight className={`h-4 w-4 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
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
              <span className="eyebrow">{isArabic ? 'المعرض' : 'Gallery'}</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {galleryImages.map((image: string, index: number) => (
                <div
                  key={`${image}-${index}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/10"
                >
                  <Image src={image} alt={`${title} gallery image ${index + 1}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
