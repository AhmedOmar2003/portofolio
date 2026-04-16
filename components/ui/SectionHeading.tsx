'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useLocale } from 'next-intl';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center';
  overline?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  alignment = 'left',
  overline,
}: SectionHeadingProps) {
  const shouldReduceMotion = useReducedMotion();
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const isCentered = alignment === 'center';
  const alignmentClass = isCentered
    ? 'items-center text-center'
    : isArabic
      ? 'items-end text-right'
      : 'items-start text-left';
  const textBlockClass = isCentered ? 'text-center' : isArabic ? 'text-right' : 'text-left';

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={`mb-9 flex flex-col gap-4 sm:mb-10 sm:gap-5 ${alignmentClass}`}
    >
      {overline ? <span className="eyebrow">{overline}</span> : null}

      <div className={`max-w-3xl ${textBlockClass}`}>
        <h2 className={`text-balance text-[2.15rem] font-semibold text-white sm:text-4xl lg:text-[3rem] ${isArabic ? 'tracking-normal leading-[1.2] lg:leading-[1.2]' : 'tracking-[-0.05em] lg:leading-[1.04]'}`}>
          {title}
        </h2>
        {subtitle ? (
          <p className={`mt-4 max-w-2xl text-base text-slate-300 sm:text-lg ${isArabic ? 'leading-8 sm:leading-9' : 'leading-7 sm:leading-8'}`}>
            {subtitle}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
