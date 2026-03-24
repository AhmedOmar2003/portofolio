import { ArrowUpRight, Check } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import SectionHeading from '@/components/ui/SectionHeading';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600;

function splitLines(content?: string | null) {
  return (content || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function ServicesPage() {
  const t = await getTranslations({ locale: 'en', namespace: 'ServicesPage' });
  const supabase = await createClient();

  const { data: servicesData } = await supabase.from('services').select('*').order('view_order', { ascending: true });

  const servicesList = (servicesData || []).map((service, index) => {
    const title = service.title_en;
    const description = service.description_en;
    const detailedContent = service.detailed_content_en;
    const deliverables = splitLines(detailedContent);

    return {
      id: service.id || `${title}-${index}`,
      title,
      desc: description,
      deliverables: deliverables.length ? deliverables : [t('deliverableFallback1'), t('deliverableFallback2'), t('deliverableFallback3')],
    };
  });

  const finalServices =
    servicesList.length > 0
      ? servicesList
      : [
          { id: 'strategy', title: t('serviceTitle1'), desc: t('serviceDesc1'), deliverables: [t('deliverable1'), t('deliverable2'), t('deliverable3')] },
          { id: 'ux', title: t('serviceTitle2'), desc: t('serviceDesc2'), deliverables: [t('deliverable4'), t('deliverable5'), t('deliverable6')] },
          { id: 'systems', title: t('serviceTitle3'), desc: t('serviceDesc3'), deliverables: [t('deliverable7'), t('deliverable8'), t('deliverable9')] },
        ];

  const engagementSteps = [t('step1'), t('step2'), t('step3')];

  return (
    <main className="px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1380px]">
        <section className="section-shell px-6 py-8 md:px-10 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)] lg:items-end">
            <SectionHeading overline={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
            <div className="rounded-[1.8rem] border border-white/8 bg-white/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t('sideLabel')}</p>
              <p className="mt-4 text-lg leading-8 text-slate-200">{t('sideCopy')}</p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="grid gap-6 lg:grid-cols-3">
            {finalServices.map((service, index) => (
              <article
                key={service.id}
                className={`section-shell px-6 py-8 ${
                  index === 0 ? 'bg-[linear-gradient(160deg,rgba(141,246,200,0.14),rgba(255,255,255,0.03))]' : ''
                }`}
              >
                <span className="inline-flex rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  0{index + 1}
                </span>
                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">{service.title}</h2>
                <p className="mt-4 text-base leading-8 text-slate-300">{service.desc}</p>

                <div className="mt-6 border-t border-white/8 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t('deliverables')}</p>
                  <ul className="mt-4 space-y-3">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-7 text-slate-200">
                        <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#8df6c8]/20 bg-[#8df6c8]/10 text-[#8df6c8]">
                          <Check className="h-3 w-3" aria-hidden="true" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell px-6 py-8 md:px-10 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <SectionHeading overline={t('processEyebrow')} title={t('processTitle')} subtitle={t('processSubtitle')} />
              <div className="grid gap-4 md:grid-cols-3">
                {engagementSteps.map((step, index) => (
                  <div key={step} className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8df6c8]">0{index + 1}</p>
                    <p className="mt-4 text-base leading-7 text-slate-200">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/contact" className="btn btn-primary w-fit text-sm">
              {t('cta')}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
