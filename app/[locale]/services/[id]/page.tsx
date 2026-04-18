import Image from 'next/image';
import { ArrowLeft, ArrowUpRight, Mail, MessageCircle } from 'lucide-react';
import { notFound } from 'next/navigation';

import { Link } from '@/i18n/routing';
import { isArabicLocale, localizedValue } from '@/utils/locale-content';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 3600;

function splitLines(content?: string | null) {
  return (content || '').split('\n').map((s) => s.trim()).filter(Boolean);
}

function getVideoPresentation(url: string) {
  const value = url.trim()
  if (!value) return null

  try {
    const parsed = new URL(value)
    const host = parsed.hostname.toLowerCase()

    if (host.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v')
      if (videoId) {
        return { kind: 'embed' as const, src: `https://www.youtube.com/embed/${videoId}` }
      }
    }

    if (host.includes('youtu.be')) {
      const videoId = parsed.pathname.replace('/', '')
      if (videoId) {
        return { kind: 'embed' as const, src: `https://www.youtube.com/embed/${videoId}` }
      }
    }

    if (host.includes('vimeo.com')) {
      const videoId = parsed.pathname.split('/').filter(Boolean)[0]
      if (videoId) {
        return { kind: 'embed' as const, src: `https://player.vimeo.com/video/${videoId}` }
      }
    }
  } catch {
    return { kind: 'direct' as const, src: value }
  }

  return { kind: 'direct' as const, src: value }
}

export default async function ServiceDetailPage(props: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await props.params;
  const isArabic = isArabicLocale(locale);
  const supabase = await createClient();

  const [{ data: service }, { data: siteSettings }] = await Promise.all([
    supabase.from('services').select('*').eq('id', id).single(),
    supabase.from('site_settings').select('whatsapp_number, contact_email').single(),
  ]);

  if (!service) notFound();

  const title          = localizedValue(service as Record<string, unknown>, 'title', locale) || service.title_en;
  const description    = localizedValue(service as Record<string, unknown>, 'description', locale) || service.description_en;
  const detailedContent = localizedValue(service as Record<string, unknown>, 'detailed_content', locale);
  const deliverables   = splitLines(detailedContent);

  // Collect up to 3 images
  const images: string[] = [];
  if (service.image_1_url) images.push(service.image_1_url as string);
  if (service.image_2_url) images.push(service.image_2_url as string);
  if (service.image_3_url) images.push(service.image_3_url as string);
  const serviceLinkUrl = typeof service.service_link_url === 'string' ? service.service_link_url.trim() : '';
  const serviceVideoUrl = typeof service.video_url === 'string' ? service.video_url.trim() : '';
  const videoPresentation = serviceVideoUrl ? getVideoPresentation(serviceVideoUrl) : null;

  const whatsappNumber = (siteSettings as Record<string, unknown> | null)?.whatsapp_number as string | undefined;
  const contactEmail   = (siteSettings as Record<string, unknown> | null)?.contact_email as string | undefined;

  return (
    <main className="px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1100px] space-y-16">

        {/* Back */}
        <Link
          href="/services"
          className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-300 transition hover:border-white/20 hover:text-white ${isArabic ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`h-4 w-4 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
          {isArabic ? 'رجوع للخدمات' : 'Back to services'}
        </Link>

        {/* Header */}
        <section className={isArabic ? 'text-right' : ''}>
          <span className="mb-4 block text-sm font-semibold uppercase tracking-widest text-[#8df6c8]">
            {isArabic ? 'خدمة' : 'Service'}
          </span>
          <h1 className={`text-4xl font-semibold text-white sm:text-5xl ${isArabic ? 'leading-tight' : 'tracking-[-0.05em] leading-tight'}`}>
            {title}
          </h1>
          {description && (
            <p className={`mt-6 max-w-2xl text-lg text-slate-400 ${isArabic ? 'leading-9' : 'leading-8'}`}>
              {description}
            </p>
          )}

          {serviceLinkUrl ? (
            <div className={`mt-7 ${isArabic ? 'text-right' : ''}`}>
              <a
                href={serviceLinkUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-[#8df6c8]/45 bg-gradient-to-r from-[#8df6c8] to-[#6ad7ff] px-5 py-2.5 text-sm font-semibold text-[#02131b] shadow-[0_10px_30px_rgba(106,215,255,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(106,215,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8df6c8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
              >
                {isArabic ? 'مثال للخدمة' : 'Service Example'}
                <ArrowUpRight className={`h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
              </a>
            </div>
          ) : null}

          <p className={`mt-4 max-w-3xl text-sm text-slate-500 ${isArabic ? 'text-right leading-7' : 'leading-6'}`}>
            {isArabic
              ? 'ملاحظة: أي خدمة بتبدأ بفهم دقيق لاحتياجك، وبعدها بنحدد كل المتطلبات ونبني حل رقمي تنافسي. الخدمات المعروضة هنا أمثلة، والتنفيذ بيتفصل بالكامل حسب مشروعك.'
              : 'Note: Every service starts with a deep understanding of your needs. Then we define all requirements and shape a competitive digital solution. Listed services are examples, and execution is fully tailored to your project.'}
          </p>
        </section>

        {/* Main image */}
        {images[0] && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/10">
            <Image
              src={images[0]}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1100px"
              className="object-cover"
            />
          </div>
        )}

        {/* Deliverables + supporting images */}
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">

          {/* Deliverables */}
          {deliverables.length > 0 && (
            <section className={isArabic ? 'text-right' : ''}>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {isArabic ? 'ما ستحصل عليه' : 'What you get'}
              </p>
              <ul className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
                {deliverables.map((item, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-3 text-base text-slate-300 ${
                      isArabic ? 'w-full text-right leading-8' : 'leading-7'
                    }`}
                  >
                    <span className={isArabic ? 'flex-1' : ''}>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Supporting images */}
          {images.length > 1 && (
            <div className="grid gap-4">
              {images.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src={img}
                    alt={`${title} visual ${i + 2}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 480px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Service video */}
        {videoPresentation ? (
          <section>
            <p className={`mb-8 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 ${isArabic ? 'text-right' : ''}`}>
              {isArabic ? 'فيديو الخدمة' : 'Service Video'}
            </p>
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
              {videoPresentation.kind === 'embed' ? (
                <iframe
                  src={videoPresentation.src}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={isArabic ? 'فيديو الخدمة' : 'Service video'}
                />
              ) : (
                <video
                  src={videoPresentation.src}
                  controls
                  controlsList="nodownload"
                  className="h-full w-full object-cover"
                  poster={images[0] || undefined}
                />
              )}
            </div>
          </section>
        ) : null}

        {/* Request CTA */}
        <section className={`border-t border-white/10 pt-12 ${isArabic ? 'text-right' : ''}`}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
            {isArabic ? 'مهتم بهذه الخدمة؟' : 'Interested in this service?'}
          </p>
          <h2 className={`mb-8 text-2xl font-semibold text-white ${isArabic ? 'leading-tight' : 'tracking-[-0.04em]'}`}>
            {isArabic ? 'تواصل معي وابدأ مشروعك.' : "Let's talk and get started."}
          </h2>

          <div className={`flex flex-wrap gap-3 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                  isArabic
                    ? `مرحبا، أريد الاستفسار عن خدمة: ${title}`
                    : `Hi, I'd like to inquire about: ${title}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-2xl border border-[#8df6c8]/20 bg-[#8df6c8]/10 px-6 py-3.5 text-sm font-semibold text-[#8df6c8] transition hover:bg-[#8df6c8]/20 ${isArabic ? 'flex-row-reverse' : ''}`}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {isArabic ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
              </a>
            )}

            {contactEmail ? (
              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent(
                  isArabic ? `استفسار عن خدمة: ${title}` : `Inquiry about: ${title}`
                )}`}
                className={`inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white ${isArabic ? 'flex-row-reverse' : ''}`}
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {isArabic ? 'تواصل عبر الإيميل' : 'Send an email'}
              </a>
            ) : (
              <Link
                href="/contact"
                className={`inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white ${isArabic ? 'flex-row-reverse' : ''}`}
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {isArabic ? 'تواصل عبر الإيميل' : 'Contact via email'}
              </Link>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
