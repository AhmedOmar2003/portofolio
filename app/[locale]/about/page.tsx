import SectionHeading from '@/components/ui/SectionHeading';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;

  const t = await getTranslations({ locale, namespace: 'Navigation' });
  const supabase = await createClient();

  const { data: aboutData } = await supabase
    .from('about')
    .select('*')
    .single();

  const title = locale === 'ar' ? aboutData?.title_ar : aboutData?.title_en;
  const intro = locale === 'ar' ? aboutData?.intro_ar : aboutData?.intro_en;
  const longBiogaphy = locale === 'ar' ? aboutData?.long_biography_ar : aboutData?.long_biography_en;
  const philosophy = locale === 'ar' ? aboutData?.philosophy_ar : aboutData?.philosophy_en;
  
  // Format biography string "Para 1\nPara 2" into an array of paragraphs
  const biographyParagraphs = longBiogaphy 
    ? longBiogaphy.split('\n').map((item: string) => item.trim()).filter(Boolean)
    : [
        "I am Ahmed Essam Maher, a UX/UI & Digital Product Designer focused on solving real human problems through empathy and thoughtful strategies.",
        "My design approach isn't just about making things look beautiful—it's about understanding the underlying workflows, studying pain points, and creating scalable systems that make a lasting impact."
      ];

  const philosophyPoints = philosophy
    ? philosophy.split('\n').map((item: string) => item.trim()).filter(Boolean)
    : [
        "Empathy-driven problem solving",
        "Scalable component architectures",
        "Aesthetic excellence aligned with business metrics"
      ];

  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title={t('about')} subtitle={title || "My story, design philosophy, and the tools I use."} />
        
        {aboutData?.profile_image_url && (
          <div className="w-full max-w-5xl mx-auto h-[400px] mt-12 mb-16 rounded-3xl overflow-hidden relative border border-zinc-800">
            <Image src={aboutData.profile_image_url} alt="Profile Picture" fill className="object-cover" />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-12 mt-16 max-w-5xl">
          <div className="space-y-6 text-zinc-400 leading-relaxed font-light text-lg">
            {intro && <p className="text-zinc-50 font-medium text-xl mb-6">{intro}</p>}
            
            {biographyParagraphs.map((para: string, idx: number) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 h-fit">
            <h3 className="text-xl font-bold text-zinc-50 mb-6">{locale === 'ar' ? 'القيم الأساسية' : 'Core Values'}</h3>
            <ul className="space-y-4 text-zinc-400">
              {philosophyPoints.map((point: string, idx: number) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">{idx + 1}</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
