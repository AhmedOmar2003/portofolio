import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/ui/SectionHeading';
import { localizedValue } from '@/utils/locale-content';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600;

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'ServicesPage' });
  const supabase = await createClient();

  const { data: servicesData } = await supabase
    .from('services')
    .select('id, title_en, title_ar, description_en, description_ar, view_order')
    .order('view_order', { ascending: true });

  const services = (servicesData || []).map((s, i) => ({
    id: s.id,
    title: localizedValue(s as Record<string, unknown>, 'title', locale) || s.title_en || '',
    description: localizedValue(s as Record<string, unknown>, 'description', locale) || s.description_en || '',
    index: i,
  }));

  const fallback = [
    { id: 'ui-ux', title: t('serviceTitle1'), description: t('serviceDesc1'), index: 0 },
    { id: 'dev',   title: t('serviceTitle2'), description: t('serviceDesc2'), index: 1 },
    { id: 'sys',   title: t('serviceTitle3'), description: t('serviceDesc3'), index: 2 },
  ];

  const finalServices = services.length > 0 ? services : fallback;

  return (
    <main className="px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1380px] space-y-16">

        {/* Header */}
        <SectionHeading
          overline={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        {/* Service cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {finalServices.map((service) => (
            <article
              key={service.id}
              className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]"
            >
              {/* Index badge */}
              <span className="mb-6 block text-sm font-semibold uppercase tracking-widest text-[#8df6c8]">
                [{String(service.index + 1).padStart(2, '0')}]
              </span>

              {/* Title */}
              <h2 className={`text-2xl font-semibold text-white ${isArabic ? 'leading-tight' : 'tracking-[-0.04em]'}`}>
                {service.title}
              </h2>

              {/* Description */}
              <p className={`mt-4 flex-1 text-base text-slate-400 ${isArabic ? 'leading-8 text-right' : 'leading-7'}`}>
                {service.description}
              </p>

              {/* CTA Button */}
              <div className="mt-8 pt-4">
                <Link
                  href={`/services/${service.id}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8df6c8]/10 px-6 py-3.5 text-sm font-semibold text-[#8df6c8] transition-all hover:bg-[#8df6c8]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8df6c8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
                >
                  {isArabic ? 'اعرف أكثر' : 'Learn more'}
                  <ArrowUpRight
                    className={`h-4 w-4 transition-transform duration-300 ${isArabic ? 'rtl-flip group-hover:-translate-x-1' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </main>
  );
}
