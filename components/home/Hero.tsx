'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Mail, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface HeroProps {
  title?: string;
  subtitle?: string;
  projectCount: number;
  serviceCount: number;
}

export default function Hero({ title, subtitle, projectCount, serviceCount }: HeroProps) {
  const t = useTranslations('Hero');
  const shouldReduceMotion = useReducedMotion();

  const displayTitle = title || t('title');
  const displaySubtitle = subtitle || t('positioning');
  const heroTitle = displayTitle.split('\n');

  const heroStats = [
    {
      value: `${projectCount.toString().padStart(2, '0')}+`,
      label: t('statProjects'),
    },
    {
      value: `${serviceCount.toString().padStart(2, '0')}+`,
      label: t('statServices'),
    },
    {
      value: 'AR / EN',
      label: t('statBilingual'),
    },
  ];

  const traits = [t('traitResearch'), t('traitSystems'), t('traitAccessibility')];

  return (
    <section
      id="top"
      className="ambient-grid relative overflow-hidden px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pb-32 lg:pt-40"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[8%] top-24 h-48 w-48 rounded-full bg-emerald-300/10 blur-[120px]" />
        <div className="absolute right-[8%] top-20 h-72 w-72 rounded-full bg-sky-400/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-[160px]" />
      </div>

      <div className="mx-auto grid max-w-[1380px] gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] lg:items-center">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <div className="eyebrow mb-6">{t('eyebrow')}</div>

          <div className="mb-8 max-w-4xl space-y-6">
            <h1
              id="hero-heading"
              className="text-balance text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-[5.6rem] lg:leading-[0.95]"
            >
              <span className="block text-white/92">{heroTitle[0]}</span>
              {heroTitle.length > 1 ? (
                <span className="mt-2 block bg-gradient-to-r from-[#f8fafc] via-[#c7f9e2] to-[#7dd3fc] bg-clip-text text-transparent">
                  {heroTitle.slice(1).join(' ')}
                </span>
              ) : (
                <span className="mt-2 block bg-gradient-to-r from-[#f8fafc] via-[#d8eafe] to-[#8df6c8] bg-clip-text text-transparent">
                  {t('headlineAccent')}
                </span>
              )}
            </h1>

            <p className="max-w-2xl text-balance text-lg leading-8 text-slate-300 sm:text-xl">
              {displaySubtitle}
            </p>
          </div>

          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <a href="#projects" className="btn btn-primary text-sm sm:text-base">
              {t('ctaPrimary')}
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="#contact" className="btn btn-secondary text-sm sm:text-base">
              <Mail className="h-4 w-4" aria-hidden="true" />
              {t('ctaSecondary')}
            </a>
          </div>

          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            {heroStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="surface-panel rounded-[1.5rem] px-5 py-5"
              >
                <p className="mb-1 text-3xl font-semibold tracking-[-0.04em] text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            {traits.map((trait) => (
              <span
                key={trait}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-xl"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#8df6c8]" aria-hidden="true" />
                {trait}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 24 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[560px] lg:mx-0"
        >
          <div className="relative aspect-[0.9]">
            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [-8, 8, -8] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-x-10 bottom-10 top-10 overflow-hidden rounded-[2.2rem] border border-white/10 bg-slate-950/60 shadow-[0_40px_120px_rgba(2,8,23,0.55)]"
            >
              <Image
                src="/profile.png"
                alt="Ahmed Essam Maher portrait"
                fill
                priority
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04070f] via-transparent to-transparent" />
            </motion.div>

            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-0 top-8 max-w-[270px] rounded-[1.75rem] border border-white/12 bg-[rgba(10,16,27,0.8)] px-5 py-5 backdrop-blur-xl"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{t('introLabel')}</p>
              <div className="mt-3 flex items-start justify-between gap-4">
                <p className="text-sm font-medium leading-7 text-white">{t('availability')}</p>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/10 text-[#8df6c8]">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </motion.div>

            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [0, 12, 0] }}
              transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-4 right-2 max-w-[260px] rounded-[1.6rem] border border-[#8df6c8]/20 bg-gradient-to-br from-[#8df6c8]/12 via-[rgba(10,16,27,0.8)] to-[#6ad7ff]/10 px-5 py-5 backdrop-blur-xl"
            >
              <p className="text-[0.7rem] uppercase tracking-[0.24em] text-slate-300">{t('impactLabel')}</p>
              <p className="mt-3 text-base font-semibold leading-7 text-white">{t('impactTitle')}</p>
            </motion.div>
          </div>

          <div className="mt-5 flex items-center gap-3 text-sm text-slate-400">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#8df6c8] shadow-[0_0_18px_rgba(141,246,200,0.9)]" />
            <span>{t('scrollLabel')}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
