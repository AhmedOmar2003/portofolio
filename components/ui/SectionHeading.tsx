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
      className={`mb-14 flex flex-col gap-5 ${isCentered ? 'items-center text-center' : 'items-start text-left'}`}
    >
      {overline ? <span className="eyebrow">{overline}</span> : null}

      <div className={`max-w-3xl ${isCentered ? 'text-center' : 'text-left'}`}>
        <h2 className="text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-[3.6rem] lg:leading-[1.02]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            {subtitle}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
