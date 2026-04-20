import type { Metadata, Viewport } from 'next';
import { Cairo, Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import '../globals.css';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { isArabicLocale, localizedValue } from '@/utils/locale-content';

// ── Font loading – display:swap prevents invisible text during font load ─────
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false,   // Mono font is not critical for LCP; lazy-load it
});

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  display: 'swap',
  preload: false,   // Only needed for /ar routes; browser will fetch on demand
});

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title =
    locale === 'ar'
      ? 'أحمد عصام ماهر منصور | مطور برمجيات ومصمم منتجات رقمية'
      : 'Ahmed Essam Maher | Software Developer & Product Designer';
  const description =
    locale === 'ar'
      ? 'أصمم وأبني منتجات رقمية وتطبيقات حديثة تجمع بين تجربة المستخدم القوية، والواجهة الأنيقة، والأداء السريع لحل مشاكل حقيقية.'
      : 'I design and build modern digital products, web applications, and mobile experiences that combine strong UX, elegant interfaces, and fast performance to solve real problems.';

  return {
    title,
    description,
    metadataBase: new URL('https://ahmedessamuiux.vercel.app'),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      siteName: locale === 'ar' ? 'أحمد عصام ماهر منصور' : 'Ahmed Essam Maher',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
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

  const socialLinks = (contactsData || []).map((method) => ({
    type: method.type,
    value: method.value,
    label: localizedValue(method as Record<string, unknown>, 'label', locale) as string,
  }));

  return (
    <html lang={locale} dir={isArabicLocale(locale) ? 'rtl' : 'ltr'}>
      <body className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} ${isArabicLocale(locale) ? 'font-ar' : ''} antialiased bg-zinc-950 text-zinc-50 font-sans flex min-h-screen flex-col`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AnalyticsTracker />
          <Navbar />
          <div className="flex-grow">{children}</div>
          <Footer socialLinks={socialLinks} />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
