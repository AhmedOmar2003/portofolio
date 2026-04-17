import Image from 'next/image';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/ui/SectionHeading';
import { localizedValue } from '@/utils/locale-content';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600;

function splitLines(content?: string | null) {
  return (content || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'AboutPage' });
  const supabase = await createClient();

  const { data: aboutData } = await supabase.from('about').select('*').single();

  const title = localizedValue(aboutData as Record<string, unknown>, 'title', locale);
  const intro = localizedValue(aboutData as Record<string, unknown>, 'intro', locale);
  const longBiography = localizedValue(aboutData as Record<string, unknown>, 'long_biography', locale);
  const philosophy = localizedValue(aboutData as Record<string, unknown>, 'philosophy', locale);

  const biographyParagraphs = splitLines(longBiography).length
    ? splitLines(longBiography)
    : [t('bio1'), t('bio2')];
  const philosophyPoints = splitLines(philosophy).length
    ? splitLines(philosophy)
    : [t('principle1'), t('principle2'), t('principle3')];

  // Read strengths from DB (saved by admin), fallback to translation keys
  const dbStrengths = (() => {
    const raw = isArabic
      ? (aboutData as Record<string, unknown>)?.strengths_ar
      : (aboutData as Record<string, unknown>)?.strengths_en;
    if (Array.isArray(raw) && raw.length > 0) return raw.map(String);
    return null;
  })();
  const strengths = dbStrengths ?? [t('strength1'), t('strength2'), t('strength3'), t('strength4')];

  return (
    <main className="px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1380px]">
        <section className="section-shell overflow-hidden px-6 py-8 md:px-10 md:py-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.85fr)] lg:items-center">
            <div>
              <SectionHeading overline={t('eyebrow')} title={title || t('title')} subtitle={intro || t('subtitle')} />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t('statLabel1')}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{t('statValue1')}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t('statLabel2')}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{t('statValue2')}</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-square md:aspect-[4/5] p-2">
               {/* Behind Image (App) */}
               <div className="absolute right-0 top-0 h-[75%] w-[75%] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(141,246,200,0.1)]">
                 <Image src="/modern_ui_design.webp" alt="Premium Mobile App UI dashboard" fill className="object-cover opacity-80 mix-blend-luminosity transition-all duration-500 hover:mix-blend-normal" />
               </div>

               {/* Forefront Image (Website) */}
               <div className="absolute bottom-0 left-0 z-10 h-[65%] w-[85%] overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl bg-[#09090b] transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(141,246,200,0.1)]">
                 <Image src="/modern_code_editor.webp" alt="Modern Code Editor glassmorphism dashboard" fill className="object-cover opacity-80 mix-blend-luminosity transition-all duration-500 hover:mix-blend-normal" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#04070f] via-transparent to-transparent opacity-60" />
               </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="section-shell px-6 py-8 md:px-8">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white">{t('storyTitle')}</h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-slate-300">
              {biographyParagraphs.map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="section-shell px-6 py-8 md:px-8">
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white">{t('valuesTitle')}</h2>
              <div className="mt-6 grid gap-4">
                {philosophyPoints.map((point, index) => (
                  <div key={`${point}-${index}`} className="flex gap-5 border-t border-white/10 pt-5">
                    <span className="text-sm font-semibold tracking-widest text-[#8df6c8] opacity-80 pt-1 uppercase">
                      0{index + 1}
                    </span>
                    <p className={`text-base text-slate-300 ${isArabic ? 'leading-8' : 'leading-7'}`}>{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-shell px-6 py-8 md:px-8">
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white">{t('strengthsTitle')}</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {strengths.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-200">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/projects" className="btn btn-secondary text-sm">
                  {t('cta')}
                  <ArrowUpRight className={`h-4 w-4 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
