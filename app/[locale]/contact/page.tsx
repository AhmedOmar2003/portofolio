import SectionHeading from '@/components/ui/SectionHeading';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;

  const t = await getTranslations({ locale, namespace: 'Navigation' });
  const supabase = await createClient();

  const { data: contactsData } = await supabase
    .from('contact_methods')
    .select('*')
    .eq('is_visible', true)
    .order('view_order', { ascending: true });

  const contactMethods = (contactsData || []).map(method => ({
    id: method.id,
    type: method.type,
    label: locale === 'ar' ? method.label_ar : method.label_en,
    value: method.value,
    icon: method.icon || '🔗',
  }));

  const mainEmail = contactMethods.find(m => m.type.toLowerCase() === 'email')?.value || 'contact@ahmed.design';
  const socialLinks = contactMethods.filter(m => m.type.toLowerCase() !== 'email' && m.type.toLowerCase() !== 'phone');

  // Fallback defaults if DB is empty to maintain layout
  const fallbacks = [
    { label: "LinkedIn", value: "#", icon: "in" },
    { label: "Behance", value: "#", icon: "Be" },
    { label: "Dribbble", value: "#", icon: "Dr" }
  ];

  const finalSocials = socialLinks.length > 0 ? socialLinks : fallbacks;

  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <SectionHeading title={t('contact')} subtitle="Have a project in mind? Let's build something meaningful together." />
        
        <div className="grid md:grid-cols-2 gap-16 mt-16">
          
          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-bold text-zinc-50 mb-4">{locale === 'ar' ? 'استفسارات مباشرة' : 'Direct Inquiries'}</h3>
              <p className="text-zinc-400 mb-6 font-light leading-relaxed">
                {locale === 'ar' 
                  ? "سواء كنت تتطلع لبدء مشروع جديد، أو تحتاج إلى تدقيق لتجربة المستخدم، أو ترغب فقط في إلقاء التحية، فلا تتردد في إرسال رسالة إلي." 
                  : "Whether you're looking to start a new project, need a UX audit, or just want to say hi, feel free to drop me a message."}
              </p>
              <a href={`mailto:${mainEmail}`} className="text-2xl font-bold text-green-500 hover:text-green-400 transition-colors break-all">
                {mainEmail}
              </a>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-zinc-50 mb-4">{locale === 'ar' ? 'الشبكات الاجتماعية' : 'Social Profiles'}</h3>
              <ul className="space-y-4">
                {finalSocials.map((social, idx) => (
                  <li key={idx}>
                    <a href={social.value} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-green-500 transition-colors text-lg flex items-center gap-4">
                      {/* Substring 2 characters for text fallback, or icon fallback string */}
                      <span className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-sm capitalize">
                        {social.icon.length <= 2 ? social.icon : social.label.substring(0, 2)}
                      </span>
                      <span>{social.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-zinc-50 mb-6">Send a Message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Name</label>
                  <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-zinc-50" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Email</label>
                  <input type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-zinc-50" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Subject</label>
                <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-zinc-50" placeholder="Project Inquiry" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Message</label>
                <textarea rows={5} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-zinc-50 resize-none" placeholder="How can I help you?"></textarea>
              </div>
              <button type="button" className="w-full py-4 bg-green-500 text-zinc-950 font-bold rounded-xl hover:bg-green-400 transition-colors">
                Send Message
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </main>
  );
}
