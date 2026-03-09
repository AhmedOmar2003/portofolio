'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import LanguageToggle from '../ui/LanguageToggle';

interface NavbarProps {
  logoUrl?: string | null;
}

export default function Navbar({ logoUrl }: NavbarProps) {
  const t = useTranslations('Navigation');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/projects', label: t('projects') },
    { href: '/services', label: t('services') },
    { href: '/articles', label: t('articles') },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-50 flex items-center gap-2">
          {logoUrl ? (
            <div className="relative w-10 h-10 object-contain overflow-hidden rounded">
              <Image src={logoUrl} alt="Logo" fill className="object-contain" priority />
            </div>
          ) : (
            <>
              {/* Premium Pen Nib / Design Icon */}
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="38" rx="10" fill="#052e16" />
                {/* Pen nib shape */}
                <path d="M19 8L28 17L19 30L10 17L19 8Z" stroke="#4ade80" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                {/* Inner nib detail */}
                <path d="M19 13L24 18L19 26L14 18L19 13Z" fill="#4ade80" opacity="0.2" />
                {/* Nib center line */}
                <line x1="19" y1="18" x2="19" y2="30" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
                {/* Nib tip dot */}
                <circle cx="19" cy="30" r="1.5" fill="#4ade80" />
              </svg>
              <span className="text-zinc-50 font-bold text-lg tracking-tight">AE<span className="text-green-500">.</span></span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8 text-sm font-medium text-zinc-300">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-green-500 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-6 border-s border-zinc-800 ps-6">
            <LanguageToggle />
            <Link 
              href="/contact"
              className="px-5 py-2.5 bg-green-500 text-zinc-950 font-semibold rounded-full hover:bg-green-400 transition-colors"
            >
              {t('contact')}
            </Link>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <LanguageToggle />
          <button 
            className="text-zinc-300 hover:text-green-500 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-zinc-950 border-b border-zinc-800/50 py-6 md:hidden shadow-2xl"
          >
            <div className="container mx-auto px-6 flex flex-col gap-6">
              <ul className="flex flex-col gap-4 text-lg font-medium text-zinc-300">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="block hover:text-green-500 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    href="/contact" 
                    className="block text-green-500 hover:text-green-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('contact')}
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
