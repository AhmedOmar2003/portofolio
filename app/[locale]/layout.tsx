import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import '../globals.css';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

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

export async function generateMetadata(): Promise<Metadata> {
  const { createClient } = await import('@/utils/supabase/server');
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('hero_title_en, hero_subtitle_en').single();

  return {
    title: settings?.hero_title_en || 'Ahmed Essam Maher | UI/UX & Digital Product Designer',
    description:
      settings?.hero_subtitle_en ||
      'I design digital products that solve real problems through product thinking, elegant interfaces, and accessible systems.',
  };
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const { createClient } = await import('@/utils/supabase/server');
  const supabase = await createClient();
  const { data: contactsData } = await supabase
    .from('contact_methods')
    .select('type, value, label_en')
    .eq('is_visible', true)
    .order('view_order', { ascending: true });

  const socialLinksParams = (contactsData || []).map((method) => ({
    type: method.type,
    value: method.value,
    label: method.label_en,
  }));

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-50 font-sans flex min-h-screen flex-col`}>
        <NextIntlClientProvider messages={messages}>
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
