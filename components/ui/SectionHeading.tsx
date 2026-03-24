'use client';

import { motion, useReducedMotion } from 'framer-motion';

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
  const isCentered = alignment === 'center';

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={`mb-9 flex flex-col gap-4 sm:mb-10 sm:gap-5 ${isCentered ? 'items-center text-center' : 'items-start text-left'}`}
    >
      {overline ? <span className="eyebrow">{overline}</span> : null}

      <div className={`max-w-3xl ${isCentered ? 'text-center' : 'text-left'}`}>
        <h2 className="text-balance text-[2.15rem] font-semibold tracking-[-0.05em] text-white sm:text-4xl lg:text-[3rem] lg:leading-[1.04]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            {subtitle}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
