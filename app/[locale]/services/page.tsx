import SectionHeading from '@/components/ui/SectionHeading';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600;

export default async function ServicesPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Navigation' });
  const supabase = await createClient();

  const { data: servicesData } = await supabase
    .from('services')
    .select('*')
    .order('view_order', { ascending: true });

  const servicesList = (servicesData || []).map(s => {
    // Determine the active content
    const title = locale === 'ar' ? s.title_ar : s.title_en;
    const desc = locale === 'ar' ? s.description_ar : s.description_en;
    const detailedContent = locale === 'ar' ? s.detailed_content_ar : s.detailed_content_en;
    
    // Parse detailed content string "Line 1\nLine 2" into a deliverables array, or default to generic terms
    const deliverables = detailedContent 
      ? detailedContent.split('\n').map((item: string) => item.trim()).filter(Boolean)
      : ["Consulting", "Design", "Review"];

    return { title, desc, deliverables };
  });

  const finalServices = servicesList.length > 0 ? servicesList : [
    {
      title: "UX/UI Design",
      desc: "Creating intuitive interfaces and seamless user flows based on deep user research and clear business goals.",
      deliverables: ["Wireframes", "Interactive Prototypes", "High-fidelity UI", "User Testing Reports"]
    },
    {
      title: "Product Strategy & Consulting",
      desc: "Aligning user needs with product vision to map out minimum viable products (MVPs) and scalable product roadmaps.",
      deliverables: ["Product Roadmap", "Feature Prioritization", "Competitor Analysis", "User Personas"]
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title={t('services')} subtitle="How I partner with teams and founders to build world-class digital products." />
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-16 max-w-6xl">
          {finalServices.map((service, index) => (
            <div key={index} className="p-8 md:p-10 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-green-500/30 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-8 text-green-500 font-bold text-xl">
                0{index + 1}
              </div>
              <h3 className="text-2xl font-bold text-zinc-50 mb-4">{service.title}</h3>
              <p className="text-zinc-400 mb-8 leading-relaxed font-light" dir={locale === 'ar' ? 'rtl' : 'ltr'}>{service.desc}</p>
              
              <div>
                <h4 className="text-sm font-semibold text-zinc-300 mb-4 tracking-wide">{locale === 'ar' ? 'المخرجات' : 'DELIVERABLES'}</h4>
                <ul className="flex flex-wrap gap-2">
                  {service.deliverables.map((item: string, i: number) => (
                    <li key={i} className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-full text-xs text-zinc-400" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
