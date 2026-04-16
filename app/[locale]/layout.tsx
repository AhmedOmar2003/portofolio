import type { Metadata } from 'next';
import { Cairo, Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import '../globals.css';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { isArabicLocale, localizedValue } from '@/utils/locale-content';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  display: 'swap',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { createClient } = await import('@/utils/supabase/server');
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from('site_settings')
    .select('hero_title_en, hero_title_ar, hero_subtitle_en, hero_subtitle_ar')
      .single();

  return {
    title:
      localizedValue(settings as Record<string, unknown>, 'hero_title', locale) ||
      'Ahmed Essam Maher | UI/UX & Digital Product Designer',
    description:
      localizedValue(settings as Record<string, unknown>, 'hero_subtitle', locale) ||
      'I design digital products that solve real problems through product thinking, elegant interfaces, and accessible systems.',
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      shortcut: '/icon.svg',
      apple: '/apple-icon.svg',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const { createClient } = await import('@/utils/supabase/server');
  const supabase = await createClient();
  const { data: contactsData } = await supabase
    .from('contact_methods')
    .select('type, value, label_en, label_ar')
    .eq('is_visible', true)
    .order('view_order', { ascending: true });

  const socialLinksParams = (contactsData || []).map((method) => ({
    type: method.type,
    value: method.value,
    label:
      localizedValue(method as Record<string, unknown>, 'label', locale) ||
      method.label_en ||
      method.label_ar ||
      '',
  }));

  return (
    <html lang={locale} dir={isArabicLocale(locale) ? 'rtl' : 'ltr'}>
      <body className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} ${isArabicLocale(locale) ? 'font-ar' : ''} antialiased bg-zinc-950 text-zinc-50 font-sans flex min-h-screen flex-col`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AnalyticsTracker />
          <Navbar />
          <div className="flex-grow">{children}</div>
          <Footer socialLinks={socialLinksParams} />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
