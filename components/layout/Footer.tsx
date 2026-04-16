'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Dribbble, Github, Link as LinkIcon, Linkedin, Mail, Twitter } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface FooterProps {
  socialLinks?: { type: string; value: string; label: string }[];
}

export default function Footer({ socialLinks = [] }: FooterProps) {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('Footer');
  const shouldReduceMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'linkedin':
        return <Linkedin size={18} />;
      case 'dribbble':
        return <Dribbble size={18} />;
      case 'twitter':
        return <Twitter size={18} />;
      case 'github':
        return <Github size={18} />;
      case 'email':
        return <Mail size={18} />;
      default:
        return <LinkIcon size={18} />;
    }
  };

  const fallbacks = [
    { type: 'linkedin', value: '#', label: 'LinkedIn' },
    { type: 'dribbble', value: '#', label: 'Dribbble' },
    { type: 'email', value: 'mailto:contact@ahmed.design', label: 'Email' },
  ];

  const displayLinks = socialLinks.length > 0 ? socialLinks : fallbacks;

  return (
    <footer className="px-6 pb-8 pt-12 md:px-10 lg:px-12">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="section-shell mx-auto max-w-[1380px] px-6 py-10 md:px-10"
      >
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] md:items-end">
          <div>
            <span className="eyebrow mb-5">{t('eyebrow')}</span>
            <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl lg:text-[3.2rem]">
              {t('title')}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">{t('description')}</p>
          </div>

          <div className={`flex flex-col gap-4 ${isArabic ? 'md:items-start' : 'md:items-end'}`}>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t('social')}</span>
            <div className={`flex flex-wrap gap-3 ${isArabic ? 'md:justify-start' : 'md:justify-end'}`}>
              {displayLinks.map((link) => {
                const href =
                  link.type.toLowerCase() === 'email' && !link.value.startsWith('mailto:')
                    ? `mailto:${link.value}`
                    : link.value;

                return (
                  <a
                    key={`${link.type}-${link.label}`}
                    href={href}
                    target={link.type.toLowerCase() === 'email' ? '_self' : '_blank'}
                    rel="noreferrer"
                    aria-label={link.label}
                    className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200 transition hover:border-[#8df6c8]/30 hover:bg-white/[0.07] hover:text-white ${isArabic ? 'flex-row-reverse' : ''}`}
                  >
                    {getIcon(link.type)}
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/8 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            {currentYear} © {t('rights')}
          </p>
          <p>{t('designBy')}</p>
        </div>
      </motion.div>
    </footer>
  );
}
