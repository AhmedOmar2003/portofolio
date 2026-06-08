import type { Metadata, Viewport } from 'next';
import { Cairo, Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

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

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

function getSiteDescription(locale: string) {
  return locale === 'ar'
    ? 'مصمم منتجات رقمية وفايب كودر باستخدام AI — ببني منتجات رقمية تنافسية وذكية بتجربة مستخدم قوية وأداء سريع.'
    : 'Product Designer & AI Vibe Coder — I leverage AI to build competitive, smart digital products and systems with strong UX principles, elegant interfaces, and fast performance.';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title =
    locale === 'ar'
      ? 'أحمد عصام ماهر | مصمم منتجات وفايب كودر بالـ AI'
      : 'Ahmed Essam Maher | Product Designer & AI Vibe Coder';
  const description = getSiteDescription(locale);

  return {
    title: {
      template: locale === 'ar' ? '%s | أحمد عصام ماهر' : '%s | Ahmed Essam Maher',
      default: title,
    },
    description,
    metadataBase: new URL('https://ahmed-essam.com'),
    alternates: {
      canonical: './',
      languages: {
        'en': '/en',
        'ar': '/ar',
        'x-default': '/en',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: './',
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
  setRequestLocale(locale);
  const description = getSiteDescription(locale);
  const messages = await getMessages();
  const clientMessages = {
    Navigation: messages.Navigation,
    ContactForm: messages.ContactForm,
  };
  const { createStaticClient } = await import('@/utils/supabase/static');
  const supabase = createStaticClient();
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

  const whatsappContact = (contactsData || []).find(
    (m) => m.type.toLowerCase() === 'whatsapp'
  );
  const whatsappHref = whatsappContact?.value
    ? whatsappContact.value.startsWith('http')
      ? whatsappContact.value
      : `https://wa.me/${whatsappContact.value.replace(/\D/g, '')}`
    : 'https://wa.me/201050242285';

  return (
    <html lang={locale} dir={isArabicLocale(locale) ? 'rtl' : 'ltr'}>
      <body className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} ${isArabicLocale(locale) ? 'font-ar' : ''} antialiased bg-zinc-950 text-zinc-50 font-sans flex min-h-screen flex-col`}>
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <a
            href="#main-content"
            className="skip-link"
          >
            {locale === 'ar' ? 'انتقل للمحتوى الرئيسي' : 'Skip to main content'}
          </a>
          <AnalyticsTracker />
          <Navbar />
          <div id="main-content" className="flex-grow" tabIndex={-1}>{children}</div>
          <Footer socialLinks={socialLinks} />
          <WhatsAppButton href={whatsappHref} />
          
          {/* JSON-LD Structured Data for Person and WebSite */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([
                {
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  "name": locale === 'ar' ? "موقع أحمد عصام ماهر" : "Ahmed Essam Maher Portfolio",
                  "url": "https://ahmed-essam.com",
                  "inLanguage": locale === 'ar' ? "ar" : "en",
                  "description": description
                },
                {
                  "@context": "https://schema.org",
                  "@type": "Person",
                  "name": locale === 'ar' ? "أحمد عصام ماهر" : "Ahmed Essam Maher",
                  "url": "https://ahmed-essam.com",
                  "jobTitle": locale === 'ar' ? "مصمم منتجات وفايب كودر بالـ AI" : "Product Designer & AI Vibe Coder",
                  "sameAs": socialLinks.map(link => link.value).filter(val => val.startsWith('http'))
                }
              ])
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
