import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import ContactForm from '@/components/contact/ContactForm';
import SectionHeading from '@/components/ui/SectionHeading';
import { createClient } from '@/utils/supabase/server';

type ContactMethod = {
  id: string;
  type: string;
  label: string;
  value: string;
};

function formatHref(type: string, value: string) {
  if (type.toLowerCase() === 'email' && !value.startsWith('mailto:')) {
    return `mailto:${value}`;
  }

  if (type.toLowerCase() === 'phone' && !value.startsWith('tel:')) {
    return `tel:${value}`;
  }

  return value;
}

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'ContactPage' });
  const supabase = await createClient();

  const { data: contactsData } = await supabase
    .from('contact_methods')
    .select('*')
    .eq('is_visible', true)
    .order('view_order', { ascending: true });

  const contactMethods = (contactsData || []).map((method) => ({
    id: method.id,
    type: method.type,
    label: locale === 'ar' ? method.label_ar : method.label_en,
    value: method.value,
  })) as ContactMethod[];

  const emailMethod = contactMethods.find((item) => item.type.toLowerCase() === 'email');
  const phoneMethod = contactMethods.find((item) => item.type.toLowerCase() === 'phone');
  const socialMethods = contactMethods.filter((item) => !['email', 'phone'].includes(item.type.toLowerCase()));

  return (
    <main className="px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1380px]">
        <section className="section-shell px-6 py-8 md:px-10 md:py-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div className="space-y-6">
              <SectionHeading overline={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

              <div className="grid gap-4">
                {emailMethod ? (
                  <a
                    href={formatHref(emailMethod.type, emailMethod.value)}
                    className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5 transition hover:border-[#8df6c8]/30 hover:bg-white/[0.05]"
                  >
                    <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/15 text-[#8df6c8]">
                      <Mail className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t('email')}</p>
                    <p className="mt-2 break-all text-lg font-medium text-white">{emailMethod.value.replace(/^mailto:/, '')}</p>
                  </a>
                ) : null}

                {phoneMethod ? (
                  <a
                    href={formatHref(phoneMethod.type, phoneMethod.value)}
                    className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5 transition hover:border-[#8df6c8]/30 hover:bg-white/[0.05]"
                  >
                    <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/15 text-[#8df6c8]">
                      <Phone className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t('phone')}</p>
                    <p className="mt-2 text-lg font-medium text-white">{phoneMethod.value.replace(/^tel:/, '')}</p>
                  </a>
                ) : null}
              </div>

              {socialMethods.length > 0 ? (
                <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t('social')}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {socialMethods.map((method) => (
                      <a
                        key={method.id}
                        href={formatHref(method.type, method.value)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200 transition hover:border-[#8df6c8]/30 hover:text-white"
                      >
                        <span>{method.label}</span>
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <ContactForm />
          </div>
        </section>
      </div>
    </main>
  );
}
