'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Mail, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface HeroProps {
  title?: string;
  subtitle?: string;
  projectCount: number;
  serviceCount: number;
}

export default function Hero({ title, subtitle, projectCount, serviceCount }: HeroProps) {
  const t = useTranslations('Hero');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const shouldReduceMotion = useReducedMotion();

  const displayTitle = title || t('title');
  const displaySubtitle = subtitle || t('positioning');
  const heroTitle = displayTitle.split('\n');



  return (
    <section
      id="top"
      className="ambient-grid relative overflow-hidden px-5 pb-20 pt-28 md:px-10 lg:px-12 lg:pb-32 lg:pt-40"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[8%] top-20 h-32 w-32 rounded-full bg-emerald-300/10 blur-[90px] sm:h-48 sm:w-48 sm:blur-[120px]" />
        <div className="absolute right-[8%] top-16 h-48 w-48 rounded-full bg-sky-400/10 blur-[100px] sm:top-20 sm:h-72 sm:w-72 sm:blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-44 w-[20rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-[110px] sm:h-64 sm:w-[40rem] sm:blur-[160px]" />
      </div>

      <div className="mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] lg:items-center">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`relative z-10 ${isArabic ? 'text-right' : ''}`}
        >
          <div className="eyebrow mb-5">{t('eyebrow')}</div>

          <div className="mb-9 max-w-4xl space-y-6">
            <h1
              id="hero-heading"
              className={`text-balance text-5xl font-semibold text-white sm:text-6xl lg:text-[4.5rem] ${isArabic ? 'tracking-normal leading-[1.2] lg:leading-[1.25]' : 'tracking-[-0.04em] leading-[1.1] lg:leading-[1.18]'}`}
            >
              <span className="block pb-1 text-white/92">{heroTitle[0]}</span>
              {heroTitle.length > 1 ? (
                <span className="mt-2 block bg-gradient-to-r from-[#f8fafc] via-[#c7f9e2] to-[#7dd3fc] bg-clip-text pb-2 text-transparent">
                  {heroTitle.slice(1).join(' ')}
                </span>
              ) : (
                <span className="mt-2 block bg-gradient-to-r from-[#f8fafc] via-[#d8eafe] to-[#8df6c8] bg-clip-text pb-2 text-transparent">
                  {t('headlineAccent')}
                </span>
              )}
            </h1>

            <p className={`max-w-2xl text-balance text-lg text-slate-300 sm:text-xl lg:text-2xl ${isArabic ? 'leading-8 sm:leading-[2.2rem]' : 'leading-8 sm:leading-9'}`}>
              {displaySubtitle}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href="#projects" className="btn btn-primary w-full px-8 py-3.5 text-base sm:w-auto">
              {t('ctaPrimary')}
              <ArrowDownRight className={`h-4 w-4 ${isArabic ? 'mr-2 ml-0 rtl-flip' : 'ml-2 mr-0'}`} aria-hidden="true" />
            </a>
            <Link href="/contact" className="btn btn-secondary w-full px-8 py-3.5 text-base transition-colors hover:bg-white/[0.05] sm:w-auto">
              <Mail className={`h-4 w-4 ${isArabic ? 'ml-2 mr-0' : 'mr-2 ml-0'}`} aria-hidden="true" />
              {t('ctaSecondary')}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 24 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[560px] lg:mx-0"
        >
          <div className="relative aspect-[0.84] sm:aspect-[0.9]">
            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [-8, 8, -8] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-x-4 bottom-4 top-12 overflow-hidden rounded-[1.8rem] border border-white/10 bg-slate-950/60 shadow-[0_28px_80px_rgba(2,8,23,0.48)] sm:inset-x-8 sm:bottom-8 sm:top-10 sm:rounded-[2.2rem] sm:shadow-[0_40px_120px_rgba(2,8,23,0.55)] lg:inset-x-10 lg:bottom-10 lg:top-10"
            >
              <Image
                src="/profile.webp"
                alt="Ahmed Essam Maher portrait"
                fill
                priority
                sizes="(max-width: 640px) 82vw, (max-width: 1024px) 56vw, 34vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04070f] via-transparent to-transparent" />
            </motion.div>

            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute top-2 max-w-[210px] rounded-[1.35rem] border border-white/12 bg-[rgba(10,16,27,0.78)] px-4 py-4 backdrop-blur-xl sm:top-8 sm:max-w-[250px] sm:rounded-[1.6rem] sm:px-5 sm:py-5 lg:max-w-[270px] lg:rounded-[1.75rem] ${isArabic ? 'right-1 sm:right-0 text-right' : 'left-1 sm:left-0'}`}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{t('introLabel')}</p>
              <div className="mt-3 flex items-start justify-between gap-4">
                <p className="text-xs font-medium leading-6 text-white sm:text-sm sm:leading-7">{t('availability')}</p>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/10 text-[#8df6c8] sm:h-10 sm:w-10">
                  <ArrowUpRight className={`h-4 w-4 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
                </span>
              </div>
            </motion.div>

            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [0, 12, 0] }}
              transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute bottom-0 max-w-[205px] rounded-[1.35rem] border border-[#8df6c8]/20 bg-gradient-to-br from-[#8df6c8]/12 via-[rgba(10,16,27,0.8)] to-[#6ad7ff]/10 px-4 py-4 backdrop-blur-xl sm:bottom-4 sm:max-w-[240px] sm:rounded-[1.6rem] sm:px-5 sm:py-5 lg:max-w-[260px] ${isArabic ? 'left-0 sm:left-2 text-right' : 'right-0 sm:right-2'}`}
            >
              <p className="text-[0.7rem] uppercase tracking-[0.24em] text-slate-300">{t('impactLabel')}</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-white sm:text-base sm:leading-7">{t('impactTitle')}</p>
            </motion.div>
          </div>

          <div className="mt-5 hidden items-center gap-3 text-sm text-slate-400 sm:flex">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#8df6c8] shadow-[0_0_18px_rgba(141,246,200,0.9)]" />
            <span>{t('scrollLabel')}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
