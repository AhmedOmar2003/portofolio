'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Linkedin, Dribbble, Mail, Link as LinkIcon, Twitter, Github } from 'lucide-react';

interface FooterProps {
  socialLinks?: { type: string; value: string; label: string }[];
}

export default function Footer({ socialLinks = [] }: FooterProps) {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  // Helper to map string type to Lucide Icon
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'linkedin': return <Linkedin size={20} />;
      case 'dribbble': return <Dribbble size={20} />;
      case 'twitter': return <Twitter size={20} />;
      case 'github': return <Github size={20} />;
      case 'email': return <Mail size={20} />;
      default: return <LinkIcon size={20} />;
    }
  };

  const fallbacks = [
    { type: 'linkedin', value: '#', label: 'LinkedIn' },
    { type: 'dribbble', value: '#', label: 'Dribbble' },
    { type: 'email', value: 'mailto:contact@ahmed.design', label: 'Email' }
  ];

  const displayLinks = socialLinks.length > 0 ? socialLinks : fallbacks;

  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 pt-16 pb-8 mt-20">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-50">
              {t('title')}<span className="text-green-500">.</span>
            </h2>
            <p className="text-zinc-400 font-light max-w-md">
              {t('description')}
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex md:justify-end items-start"
          >
            <div className="flex flex-col gap-4">
              <span className="text-sm font-semibold text-zinc-50 uppercase tracking-widest">{t('social')}</span>
              <div className="flex gap-4">
                {displayLinks.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.type.toLowerCase() === 'email' && !link.value.startsWith('mailto:') ? `mailto:${link.value}` : link.value} 
                    target={link.type.toLowerCase() === 'email' ? '_self' : '_blank'}
                    rel="noreferrer"
                    aria-label={link.label}
                    className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-green-500 hover:border-green-500/50 hover:bg-green-500/10 transition-all duration-300"
                  >
                    {getIcon(link.type)}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Section */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <p>© {currentYear} {t('rights')}</p>
          <p>{t('designBy')}</p>
        </div>
        
      </div>
    </footer>
  );
}
