import Image from 'next/image';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { notFound } from 'next/navigation';

import { Link } from '@/i18n/routing';
import { getLocaleDateFormat, isArabicLocale, localizedValue } from '@/utils/locale-content';
import { createClient } from '@/utils/supabase/server';

function splitParagraphs(content?: string | null) {
  return (content || '').split('\n').map((s) => s.trim()).filter(Boolean);
}

function formatDateLabel(value: string | null | undefined, locale: string) {
  if (!value) return isArabicLocale(locale) ? 'غير محدد' : 'Not specified';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(getLocaleDateFormat(locale), { year: 'numeric', month: 'short' }).format(date);
}

function formatExternalLink(key: string, locale: string) {
  const labels: Record<string, { en: string; ar: string }> = {
    live_demo: { en: 'Live Demo', ar: 'النسخة الحية' },
    github: { en: 'Repository', ar: 'المصدر البرمجي' },
    behance: { en: 'Behance', ar: 'Behance' },
    dribbble: { en: 'Dribbble', ar: 'Dribbble' },
    figma: { en: 'Figma Prototype', ar: 'نموذج Figma' },
  };
  return isArabicLocale(locale) ? (labels[key]?.ar ?? key) : (labels[key]?.en ?? key.replace(/_/g, ' '));
}

export default async function ProjectCaseStudyPage(props: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await props.params;
  const isArabic = isArabicLocale(locale);
  const supabase = await createClient();

  const { data: project } = await supabase.from('projects').select('*').eq('slug', slug).single();
  if (!project) notFound();

  const title       = localizedValue(project as Record<string, unknown>, 'name', locale);
  const description = localizedValue(project as Record<string, unknown>, 'description', locale);
  const idea        = localizedValue(project as Record<string, unknown>, 'idea', locale);
  const problem     = localizedValue(project as Record<string, unknown>, 'problem', locale);
  const ui_ux       = localizedValue(project as Record<string, unknown>, 'ui_ux', locale);

  const heroImage    = project.images?.[0] ?? null;
  const galleryImages: string[] = Array.isArray(project.images) ? project.images.slice(1, 4) : [];
  const videoUrl     = Array.isArray(project.videos) && project.videos.length > 0 ? project.videos[0] : null;
  const externalLinks: Record<string, string> = project.external_links ?? {};
  const technologies = Array.isArray(project.technologies) ? project.technologies : [];

  const sections = [
    { id: 'idea',     label: isArabic ? 'الفكرة'               : 'The Idea',      content: splitParagraphs(idea) },
    { id: 'problem',  label: isArabic ? 'المشكلة'             : 'The Problem',   content: splitParagraphs(problem) },
    { id: 'ui_ux',    label: isArabic ? 'تصميم واجهة المستخدم'  : 'UI/UX Design',  content: splitParagraphs(ui_ux) },
  ].filter((s) => s.content.length > 0);

  const metaItems = [
    { label: isArabic ? 'التصنيف'       : 'Category',  value: project.category ?? (isArabic ? 'تصميم رقمي' : 'Digital Design') },
    { label: isArabic ? 'بداية المشروع' : 'Started',   value: formatDateLabel(project.start_date, locale) },
    { label: isArabic ? 'نهاية المشروع' : 'Completed', value: formatDateLabel(project.end_date, locale) },
    { label: isArabic ? 'الدور'         : 'Role',      value: isArabic ? 'مصمم ومطور' : 'Designer & Developer' },
  ];

  return (
    <main className="px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1280px] space-y-16">

        {/* Back link */}
        <Link
          href="/projects"
          className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-300 transition hover:border-white/20 hover:text-white ${isArabic ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`h-4 w-4 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
          {isArabic ? 'رجوع للمشاريع' : 'Back to projects'}
        </Link>

        {/* Hero */}
        <section>
          <span className="eyebrow mb-5 block">{isArabic ? 'دراسة حالة' : 'Case Study'}</span>
          <h1 className={`max-w-4xl text-balance text-4xl font-semibold text-white sm:text-5xl lg:text-6xl ${isArabic ? 'leading-tight' : 'tracking-[-0.05em] leading-tight'}`}>
            {title}
          </h1>
          {description && (
            <p className={`mt-6 max-w-3xl text-lg text-slate-400 ${isArabic ? 'leading-9' : 'leading-8'}`}>
              {description}
            </p>
          )}

          {/* Meta strip */}
          <div className={`mt-10 flex flex-wrap gap-4 border-t border-white/10 pt-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
            {metaItems.map((item) => (
              <div key={item.label} className={`${isArabic ? 'text-right' : ''}`}>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">{item.label}</p>
                <p className="mt-1.5 text-sm font-medium text-white">{item.value}</p>
              </div>
            )).reduce<React.ReactNode[]>((acc, el, i, arr) => {
              acc.push(el);
              if (i < arr.length - 1) acc.push(<div key={`div-${i}`} className="hidden h-10 w-px self-center bg-white/10 sm:block" />);
              return acc;
            }, [])}

            {/* External links inline */}
            {Object.entries(externalLinks).filter(([, v]) => v).map(([key, value]) => (
              <a
                key={key}
                href={String(value)}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-200 transition hover:border-[#8df6c8]/30 hover:text-white self-center ${isArabic ? 'flex-row-reverse' : ''}`}
              >
                {formatExternalLink(key, locale)}
                <ArrowUpRight className={`h-3.5 w-3.5 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        {/* Hero image */}
        {heroImage ? (
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/10">
            <Image
              src={heroImage}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04070f]/40 to-transparent" />
          </div>
        ) : null}

        {/* Content sections */}
        {sections.length > 0 && (
          <section className="grid gap-16 lg:grid-cols-[280px_1fr]">
            {/* Navigation sidebar */}
            <aside className={`hidden lg:block ${isArabic ? 'text-right' : ''}`}>
              <div className="sticky top-32 space-y-3">
                {sections.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-3 text-sm text-slate-500 transition-colors hover:text-white"
                  >
                    <span className="text-xs text-[#8df6c8]">0{i + 1}</span>
                    {s.label}
                  </a>
                ))}
                {technologies.length > 0 && (
                  <a
                    href="#technologies"
                    className="flex items-center gap-3 text-sm text-slate-500 transition-colors hover:text-white"
                  >
                    <span className="text-xs text-[#8df6c8]">0{sections.length + 1}</span>
                    {isArabic ? 'التقنيات المستخدمة' : 'Technologies'}
                  </a>
                )}
              </div>
            </aside>

            {/* Sections */}
            <div className="space-y-16">
              {sections.map((section) => (
                <article key={section.id} id={section.id} className={`scroll-mt-28 ${isArabic ? 'text-right' : ''}`}>
                  <h2 className={`mb-6 text-2xl font-semibold text-white ${isArabic ? 'leading-tight' : 'tracking-[-0.04em]'}`}>
                    {section.label}
                  </h2>
                  <div className={`space-y-5 text-base text-slate-400 ${isArabic ? 'leading-9' : 'leading-8'}`}>
                    {section.content.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </article>
              ))}

              {technologies.length > 0 && (
                <article id="technologies" className={`scroll-mt-28 ${isArabic ? 'text-right' : ''}`}>
                  <h2 className={`mb-6 text-2xl font-semibold text-white ${isArabic ? 'leading-tight' : 'tracking-[-0.04em]'}`}>
                    {isArabic ? 'التقنيات المستخدمة' : 'Technologies Used'}
                  </h2>
                  <div className={`flex flex-wrap gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    {technologies.map((tech: string, i: number) => (
                      <span key={i} className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              )}
            </div>
          </section>
        )}

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <section>
            <p className="eyebrow mb-8 block">{isArabic ? 'معرض الصور' : 'Gallery'}</p>
            <div className={`grid gap-5 ${galleryImages.length === 1 ? 'grid-cols-1' : galleryImages.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2'}`}>
              {galleryImages.map((img: string, i: number) => (
                <div key={i} className={`relative overflow-hidden rounded-3xl border border-white/10 ${galleryImages.length === 3 && i === 2 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-[4/3]'}`}>
                  <Image
                    src={img}
                    alt={`${title} — image ${i + 2}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Video Player */}
        {videoUrl && (
          <section>
            <p className="eyebrow mb-8 block">{isArabic ? 'فيديو عرض المشروع' : 'Project Showcase'}</p>
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
              <video 
                src={videoUrl} 
                controls 
                controlsList="nodownload"
                className="h-full w-full object-cover" 
                poster={heroImage || undefined}
              />
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
