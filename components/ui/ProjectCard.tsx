'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

interface ProjectCardProps {
  title: string;
  category: string;
  year: string;
  description: string;
  href: string;
  imageUrl?: string;
  role: string;
  impact: string;
  labels: {
    role: string;
    outcome: string;
    year: string;
    cta: string;
  };
  index: number;
}

export default function ProjectCard({
  title,
  category,
  year,
  description,
  href,
  imageUrl,
  role,
  impact,
  labels,
  index,
}: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 36 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group h-full"
    >
      <Link
        href={href}
        className="block h-full rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050816]"
      >
        <div className="surface-panel relative flex h-full flex-col overflow-hidden rounded-[1.6rem] transition duration-500 group-hover:-translate-y-1 group-hover:border-white/18 sm:rounded-[2rem]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(141,246,200,0.16),_transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_55%)] opacity-0 transition duration-500 group-hover:opacity-100" />

          <div className="relative aspect-[1.02] overflow-hidden border-b border-white/8 sm:aspect-[1.12]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
                className="object-cover transition duration-700 will-change-transform group-hover:scale-[1.04]"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.24),_transparent_32%),linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(2,6,23,0.92))]">
                <div className="absolute inset-6 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px)] bg-[size:36px_36px]" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#04070f] via-[#04070f]/10 to-transparent" />

            <div className="absolute left-4 right-4 top-4 flex flex-wrap items-start justify-between gap-2.5 sm:left-5 sm:right-5 sm:top-5 sm:gap-3">
              <span className="rounded-full border border-white/12 bg-black/20 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-200 backdrop-blur-xl sm:px-4 sm:py-2 sm:text-[0.7rem] sm:tracking-[0.18em]">
                {category || role}
              </span>
              <span className="rounded-full border border-white/12 bg-black/20 px-3 py-1.5 text-[0.72rem] font-medium text-slate-300 backdrop-blur-xl sm:px-3 sm:py-2 sm:text-xs">
                {labels.year}: {year || '--'}
              </span>
            </div>

            <div
              className={`absolute bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-950 shadow-[0_16px_40px_rgba(255,255,255,0.18)] transition duration-500 group-hover:-translate-y-0.5 sm:bottom-5 sm:h-12 sm:w-12 ${
                isArabic
                  ? 'left-4 group-hover:-translate-x-0.5 sm:left-5'
                  : 'right-4 group-hover:translate-x-0.5 sm:right-5'
              }`}
            >
              <ArrowUpRight
                className={`h-4 w-4 transition duration-500 group-hover:rotate-45 sm:h-5 sm:w-5 ${isArabic ? 'rtl-flip' : ''}`}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5 sm:p-7">
            <div className="mb-4">
              <h3 className="text-[1.55rem] font-semibold tracking-[-0.05em] text-white sm:text-[1.95rem]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{description}</p>
            </div>

            <dl className="grid gap-4 border-t border-white/8 pt-5 text-sm text-slate-300 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/[0.03] p-4">
                <dt className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">{labels.role}</dt>
                <dd className="leading-6 text-slate-100">{role}</dd>
              </div>
              <div className="rounded-2xl bg-white/[0.03] p-4">
                <dt className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">{labels.outcome}</dt>
                <dd className="leading-6 text-slate-100">{impact}</dd>
              </div>
            </dl>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#8df6c8]">
              {labels.cta}
              <ArrowUpRight
                className={`h-4 w-4 transition duration-300 group-hover:-translate-y-0.5 ${
                  isArabic ? 'rtl-flip' : 'group-hover:translate-x-0.5'
                }`}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
