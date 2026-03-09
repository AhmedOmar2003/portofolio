import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono, Cairo } from 'next/font/google';
import '../globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  display: 'swap',
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const { createClient } = await import('@/utils/supabase/server');
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('*').single();

  return {
    title: locale === 'ar' ? settings?.hero_title_ar || 'أحمد عصام ماهر | مصمم' : settings?.hero_title_en || 'Ahmed Essam Maher | UX/UI & Digital Product Designer',
    description: locale === 'ar' ? settings?.hero_subtitle_ar || 'أصمم منتجات رقمية تحل مشاكل حقيقية' : settings?.hero_subtitle_en || 'I design digital products that solve real problems through empathy, strategy, and thoughtful design.',
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const { createClient } = await import('@/utils/supabase/server');
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('logo_url').single();

  const { data: contactsData } = await supabase
    .from('contact_methods')
    .select('*')
    .eq('is_visible', true)
    .order('view_order', { ascending: true });

  const logoUrl = settings?.logo_url || null;

  const socialLinksParams = (contactsData || []).map(method => ({
    type: method.type,
    value: method.value,
    label: locale === 'ar' ? method.label_ar : method.label_en,
  }));

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`${geistSans.variable} ${cairo.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-50 font-sans flex flex-col min-h-screen`}
      >
        <NextIntlClientProvider messages={messages}>
          <Navbar logoUrl={logoUrl} />
          <div className="flex-grow">
            {children}
          </div>
          <Footer socialLinks={socialLinksParams} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
