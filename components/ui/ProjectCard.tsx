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
  projectType?: 'design' | 'programming';
  projectTypeBadge?: string;
}

export default function ProjectCard({
  title,
  category,
  year,
  description,
  href,
  imageUrl,
  labels,
  index,
  projectType,
  projectTypeBadge,
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
      className="group flex h-full"
    >
      <Link
        href={href}
        className="flex w-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] outline-none transition-colors hover:border-white/20 hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-[#8df6c8] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050816]"
        aria-label={`${title} - ${category}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/10 sm:aspect-[1.3]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${title} project thumbnail`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
              <span className="text-sm text-slate-500" aria-hidden="true">{title}</span>
            </div>
          )}
          {projectTypeBadge ? (
            <span
              className={`absolute top-3 inline-flex items-center rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] backdrop-blur ${
                projectType === 'programming'
                  ? 'border-sky-300/40 bg-sky-300/15 text-sky-100'
                  : 'border-emerald-300/40 bg-emerald-300/15 text-emerald-100'
              } ${isArabic ? 'left-3' : 'right-3'}`}
            >
              {projectTypeBadge}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-400">
            <span className="font-semibold text-[#8df6c8]">{category}</span>
            <span>{year}</span>
          </div>

          <h3 className={`mb-3 text-2xl font-bold text-white ${isArabic ? 'leading-tight' : 'tracking-[-0.03em]'}`}>
            {title}
          </h3>
          
          <p className={`flex-1 text-base text-slate-300 ${isArabic ? 'leading-8' : 'leading-7'}`}>
            {description}
          </p>

          <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-100 transition-colors group-hover:text-[#8df6c8]">
            {labels.cta}
            <ArrowUpRight
              className={`h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 ${isArabic ? 'rtl-flip group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
              aria-hidden="true"
            />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
