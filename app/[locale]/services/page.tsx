import { getTranslations } from 'next-intl/server';

import ServicesFilterGrid from '@/components/services/ServicesFilterGrid';
import SectionHeading from '@/components/ui/SectionHeading';
import { localizedValue } from '@/utils/locale-content';
import { getServiceTypeLabel, normalizeServiceType, type ServiceType } from '@/utils/service-type';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600;

type ServiceCardItem = {
  id: string;
  title: string;
  description: string;
  index: number;
  type: ServiceType;
  typeLabel: string;
};

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'ServicesPage' });
  const supabase = await createClient();

  const servicesWithTypeQuery = await supabase
    .from('services')
    .select('id, title_en, title_ar, description_en, description_ar, view_order, service_type')
    .order('view_order', { ascending: true });

  const servicesFallbackQuery = servicesWithTypeQuery.error
    ? await supabase
        .from('services')
        .select('id, title_en, title_ar, description_en, description_ar, view_order')
        .order('view_order', { ascending: true })
    : null;

  const servicesData = servicesWithTypeQuery.error ? servicesFallbackQuery?.data || [] : servicesWithTypeQuery.data || [];

  const services: ServiceCardItem[] = (servicesData || []).map((s, i) => {
    const normalizedType = normalizeServiceType((s as { service_type?: unknown }).service_type);
    return {
      id: s.id,
      title: localizedValue(s as Record<string, unknown>, 'title', locale) || s.title_en || '',
      description: localizedValue(s as Record<string, unknown>, 'description', locale) || s.description_en || '',
      index: i,
      type: normalizedType,
      typeLabel: getServiceTypeLabel(normalizedType, locale),
    };
  });

  const fallback: ServiceCardItem[] = [
    { id: 'ui-ux', title: t('serviceTitle1'), description: t('serviceDesc1'), index: 0, type: 'ux_ui_design', typeLabel: getServiceTypeLabel('ux_ui_design', locale) },
    { id: 'dev',   title: t('serviceTitle2'), description: t('serviceDesc2'), index: 1, type: 'full_design_development', typeLabel: getServiceTypeLabel('full_design_development', locale) },
    { id: 'sys',   title: t('serviceTitle3'), description: t('serviceDesc3'), index: 2, type: 'full_design_development', typeLabel: getServiceTypeLabel('full_design_development', locale) },
  ];

  const finalServices = services.length > 0 ? services : fallback;

  return (
    <main className="px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1380px] space-y-16">

        <div className={`rounded-2xl border border-sky-300/20 bg-sky-500/10 px-5 py-3 text-sm text-sky-100/90 ${isArabic ? 'text-right leading-7' : 'leading-6'}`}>
          {isArabic
            ? 'ملاحظة: أي خدمة بتبدأ بفهم دقيق لاحتياجك، وبعدها بنحدد كل المتطلبات ونبني حل رقمي تنافسي. الخدمات المعروضة هنا أمثلة، والتنفيذ بيتفصل بالكامل حسب مشروعك.'
            : 'Note: Every service starts with a deep understanding of your needs. Then we define all requirements and shape a competitive digital solution. Listed services are examples, and execution is fully tailored to your project.'}
        </div>

        {/* Header */}
        <SectionHeading
          overline={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <ServicesFilterGrid
          services={finalServices}
          isArabic={isArabic}
          labels={{
            all: isArabic ? 'الكل' : 'All',
            fullDesignDevelopment: getServiceTypeLabel('full_design_development', locale),
            uxUiDesign: getServiceTypeLabel('ux_ui_design', locale),
            cta: isArabic ? 'اعرف أكثر' : 'Learn more',
            empty: isArabic ? 'لا توجد خدمات في هذا التصنيف الآن.' : 'No services found in this type yet.',
          }}
        />

      </div>
    </main>
  );
}
