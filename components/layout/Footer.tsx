'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Dribbble, Github, Link as LinkIcon, Mail, MessageCircle, Twitter } from 'lucide-react';
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
      case 'dribbble':
        return <Dribbble size={18} />;
      case 'twitter':
        return <Twitter size={18} />;
      case 'github':
        return <Github size={18} />;
      case 'email':
        return <Mail size={18} />;
      case 'whatsapp':
        return <MessageCircle size={18} />;
      default:
        return <LinkIcon size={18} />;
    }
  };

  const normalizeWhatsAppUrl = (value: string) => {
    if (!value) return '#';
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    const digits = value.replace(/\D/g, '');
    return digits ? `https://wa.me/${digits}` : '#';
  };

  const resolveHref = (type: string, value: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType === 'email') {
      return value.startsWith('mailto:') ? value : `mailto:${value}`;
    }
    if (lowerType === 'whatsapp') {
      return normalizeWhatsAppUrl(value);
    }
    return value;
  };

  const fallbacks = [
    { type: 'whatsapp', value: 'https://wa.me/201036529582', label: 'WhatsApp' },
    { type: 'dribbble', value: '#', label: 'Dribbble' },
    { type: 'email', value: 'mailto:contact@ahmed.design', label: 'Email' },
  ];

  const filteredLinks = socialLinks.filter((link) => link.type.toLowerCase() !== 'linkedin');
  const hasWhatsApp = filteredLinks.some((link) => link.type.toLowerCase() === 'whatsapp');
  const displayLinks =
    filteredLinks.length > 0
      ? hasWhatsApp
        ? filteredLinks
        : [{ type: 'whatsapp', value: 'https://wa.me/201036529582', label: 'WhatsApp' }, ...filteredLinks]
      : fallbacks;

  return (
    <footer className="site-footer px-6 pb-8 pt-12 md:px-10 lg:px-12">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="section-shell mx-auto max-w-[1380px] px-6 py-10 md:px-10"
      >
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <span className="eyebrow mb-5">{t('eyebrow')}</span>
          <h2 className={`text-balance font-semibold text-white ${isArabic ? 'text-4xl leading-tight sm:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl lg:text-[3.2rem] tracking-[-0.05em] leading-tight'}`}>
            {t('title')}
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            {t('description')}
          </p>

          <div className="mt-12 flex flex-col items-center gap-5">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8df6c8]/60">
              {t('social')}
            </span>
            <div className={`flex flex-wrap justify-center gap-3 ${isArabic ? 'rtl-flip-children' : ''}`}>
              {displayLinks.map((link) => {
                const href = resolveHref(link.type, link.value);
                const isEmail = link.type.toLowerCase() === 'email';

                return (
                  <a
                    key={`${link.type}-${link.label}`}
                    href={href}
                    target={isEmail ? '_self' : '_blank'}
                    rel="noreferrer"
                    aria-label={link.label}
                    className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-medium text-slate-200 transition-all hover:-translate-y-1 hover:border-[#8df6c8]/40 hover:bg-white/[0.08] hover:text-white hover:shadow-[0_10px_20px_rgba(141,246,200,0.05)] ${isArabic ? 'flex-row-reverse' : ''}`}
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
