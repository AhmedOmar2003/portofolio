'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

interface HeroProps {
  title?: string;
  subtitle?: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  const t = useTranslations('Hero');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Format title (split on first line break if exists, or use default)
  const displayTitle = title || t('title');
  const titleParts = displayTitle.split('\n');

  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-24 overflow-hidden bg-zinc-950">
      {/* Subtle Noise / Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }}
      />

      {/* Premium Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-zinc-800/20 rounded-full blur-[150px] pointer-events-none translate-y-1/2 -translate-x-1/3" />

      <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-16 lg:gap-8 items-center relative z-10">
        
        {/* Text Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col items-start"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-4 py-2 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/80 rounded-full shadow-lg shadow-black/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-zinc-300 tracking-wide uppercase">UX/UI &amp; Digital Product Designer</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl lg:text-[5rem] xl:text-[5.5rem] font-bold tracking-tight mb-5 sm:mb-8 leading-[1.05]">
            {titleParts.length > 1 ? (
              <>
                <span className="text-zinc-50 block mb-2">{titleParts[0]}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-600">{titleParts.slice(1).join('\n')}</span>
              </>
            ) : (
              <span className="text-zinc-50 block mb-2">{titleParts[0]}</span>
            )}
          </motion.h1>

          <motion.p variants={itemVariants} className="text-base sm:text-lg lg:text-xl text-zinc-400 font-light mb-8 sm:mb-12 max-w-2xl leading-relaxed whitespace-pre-wrap">
            {subtitle || t('positioning')}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {/* Primary CTA — View Projects */}
            <Link
              href="/projects"
              className="btn btn-primary text-sm sm:text-base w-full sm:w-auto"
            >
              {t('ctaPrimary')}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </Link>

            {/* Secondary CTA — Contact Me */}
            <Link
              href="/contact"
              className="btn btn-secondary text-sm sm:text-base w-full sm:w-auto"
            >
              <Mail className="w-4 h-4" />
              {t('ctaSecondary')}
            </Link>
          </motion.div>
        </motion.div>

        {/* Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative w-full flex items-center justify-center"
        >
          <div className="relative w-full max-w-[380px]">

            {/* Glow behind photo */}
            <div className="absolute inset-0 rounded-3xl bg-green-500/10 blur-3xl scale-110 pointer-events-none" />

            {/* Photo frame with floating animation */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-3xl overflow-hidden border border-zinc-700/60 shadow-2xl shadow-black/60"
              style={{ aspectRatio: '3/4' }}
            >
              {/* Green gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/40 via-transparent to-transparent z-10 pointer-events-none" />
              <Image
                src="/profile.png"
                alt="Ahmed Essam Maher"
                fill
                className="object-cover object-top"
                priority
              />
            </motion.div>

            {/* Floating availability badge */}
            <motion.div
              animate={{ y: [-8, 8, -8], x: [-4, 4, -4] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-8 bottom-16 px-5 py-3 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-xl flex items-center gap-3 z-20"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(5,242,108,0.6)] animate-pulse" />
              <span className="text-sm text-zinc-200 font-medium">Available for work</span>
            </motion.div>

            {/* Floating projects badge */}
            <motion.div
              animate={{ y: [10, -10, 10], rotate: [0, 3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-6 top-12 px-4 py-3 bg-zinc-900/90 backdrop-blur-xl border border-green-500/30 rounded-2xl shadow-xl flex flex-col gap-1 z-20"
            >
              <span className="text-2xl font-bold text-green-500 leading-none">20+</span>
              <span className="text-xs text-zinc-400">Projects Done</span>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
