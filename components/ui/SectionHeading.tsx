'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center';
  overline?: string;
}

export default function SectionHeading({ title, subtitle, alignment = 'left', overline }: SectionHeadingProps) {
  return (
    <div className={`mb-16 md:mb-24 flex flex-col ${alignment === 'center' ? 'items-center text-center' : 'items-start text-start'}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {overline && (
          <div className={`flex items-center gap-4 mb-4 ${alignment === 'center' ? 'justify-center' : 'justify-start'}`}>
            {alignment === 'left' && <div className="w-8 h-[2px] bg-green-500/80 rounded-full" />}
            <span className="text-sm font-semibold tracking-widest text-zinc-400 uppercase">
              {overline}
            </span>
            {alignment === 'center' && (
              <>
                <div className="w-8 h-[2px] bg-green-500/80 rounded-full absolute -left-12 top-1/2 -translate-y-1/2" />
                <div className="w-8 h-[2px] bg-green-500/80 rounded-full absolute -right-12 top-1/2 -translate-y-1/2" />
              </>
            )}
          </div>
        )}
        
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-50 mb-6 leading-tight">
          {title}
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 ml-2 animate-[pulse_3s_ease-in-out_infinite] shadow-[0_0_15px_rgba(5,242,108,0.5)]" />
        </h2>

        {subtitle && (
          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
        
      </motion.div>
    </div>
  );
}
