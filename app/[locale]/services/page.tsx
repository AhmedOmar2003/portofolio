import Image from 'next/image';
import { ArrowUpRight, Check } from 'lucide-react';
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

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'ServicesPage' });
  const supabase = await createClient();

  const { data: servicesData } = await supabase.from('services').select('*').order('view_order', { ascending: true });

  const servicesList = (servicesData || []).map((service, index) => {
    const title = localizedValue(service as Record<string, unknown>, 'title', locale);
    const description = localizedValue(service as Record<string, unknown>, 'description', locale);
    const detailedContent = localizedValue(service as Record<string, unknown>, 'detailed_content', locale);
    const deliverables = splitLines(detailedContent);
    // Support up to 3 images: image_1_url, image_2_url, image_3_url OR images array
    const images: string[] = [];
    if (service.image_1_url) images.push(service.image_1_url as string);
    if (service.image_2_url) images.push(service.image_2_url as string);
    if (service.image_3_url) images.push(service.image_3_url as string);

    return {
      id: service.id || `${title}-${index}`,
      title,
      desc: description,
      deliverables: deliverables.length ? deliverables : [t('deliverableFallback1'), t('deliverableFallback2'), t('deliverableFallback3')],
      images,
    };
  });

  const finalServices =
    servicesList.length > 0
      ? servicesList
      : [
          { id: 'strategy', title: t('serviceTitle1'), desc: t('serviceDesc1'), deliverables: [t('deliverable1'), t('deliverable2'), t('deliverable3')], images: [] },
          { id: 'ux', title: t('serviceTitle2'), desc: t('serviceDesc2'), deliverables: [t('deliverable4'), t('deliverable5'), t('deliverable6')], images: [] },
          { id: 'systems', title: t('serviceTitle3'), desc: t('serviceDesc3'), deliverables: [t('deliverable7'), t('deliverable8'), t('deliverable9')], images: [] },
        ];

  return (
    <main className="px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1380px] space-y-24">

        {/* Hero Section */}
        <section className="section-shell px-8 py-12 md:px-12 md:py-16">
          <SectionHeading
            overline={t('eyebrow')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </section>

        {/* Services List */}
        <section className="space-y-24">
          {finalServices.map((service, index) => (
            <article key={service.id} className={`grid gap-12 lg:gap-20 ${isArabic ? 'lg:grid-cols-[1fr_0.9fr]' : 'lg:grid-cols-[0.9fr_1fr]'} lg:items-start`}>

              {/* Text side */}
              <div className={`${index % 2 !== 0 && !isArabic ? 'lg:order-2' : index % 2 !== 0 && isArabic ? 'lg:order-1' : ''}`}>
                <div className="section-shell px-8 py-10">
                  <span className="mb-6 block text-sm font-semibold tracking-widest text-[#8df6c8] uppercase">
                    [{String(index + 1).padStart(2, '0')}]
                  </span>
                  <h2 className={`text-3xl font-semibold text-white lg:text-4xl ${isArabic ? 'leading-tight' : 'tracking-[-0.04em] leading-tight'}`}>
                    {service.title}
                  </h2>
                  <p className={`mt-5 text-lg text-slate-400 ${isArabic ? 'leading-9' : 'leading-8'}`}>
                    {service.desc}
                  </p>

                  {/* Deliverables */}
                  <div className="mt-10 border-t border-white/10 pt-8">
                    <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      {t('deliverables')}
                    </p>
                    <ul className="space-y-4">
                      {service.deliverables.map((item) => (
                        <li key={item} className={`flex items-start gap-3 text-base text-slate-300 ${isArabic ? 'leading-8 flex-row-reverse text-right' : 'leading-7'}`}>
                          <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#8df6c8]/20 bg-[#8df6c8]/10 text-[#8df6c8]">
                            <Check className="h-3 w-3" aria-hidden="true" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Images side */}
              <div className={`${index % 2 !== 0 && !isArabic ? 'lg:order-1' : index % 2 !== 0 && isArabic ? 'lg:order-2' : ''}`}>
                {service.images.length > 0 ? (
                  <div className="grid gap-4">
                    {/* Main image (large) */}
                    <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
                      <Image
                        src={service.images[0]}
                        alt={service.title || 'Service image'}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                      />
                    </div>
                    {/* Supporting images */}
                    {service.images.length > 1 && (
                      <div className="grid grid-cols-2 gap-4">
                        {service.images.slice(1).map((img, imgIndex) => (
                          <div key={imgIndex} className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                            <Image
                              src={img}
                              alt={`${service.title} visual ${imgIndex + 2}`}
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Placeholder when no images */
                  <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-white/10 bg-[linear-gradient(160deg,rgba(141,246,200,0.04),rgba(255,255,255,0.01))]">
                    <span className="text-sm uppercase tracking-[0.22em] text-slate-600">
                      {isArabic ? 'لا توجد صور' : 'No images yet'}
                    </span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>

        {/* CTA Section */}
        <section className="section-shell px-8 py-12 text-center md:px-16 md:py-16">
          <p className="eyebrow mx-auto mb-5">{t('processEyebrow')}</p>
          <h2 className={`mx-auto max-w-2xl text-balance text-3xl font-semibold text-white md:text-4xl ${isArabic ? 'leading-tight' : 'tracking-[-0.04em]'}`}>
            {t('processTitle')}
          </h2>
          <p className={`mx-auto mt-5 max-w-xl text-lg text-slate-400 ${isArabic ? 'leading-9' : 'leading-8'}`}>
            {t('processSubtitle')}
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/contact" className="btn btn-primary px-8 py-4 text-base">
              {t('cta')}
              <ArrowUpRight className={`h-4 w-4 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
