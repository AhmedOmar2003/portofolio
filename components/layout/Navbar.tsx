'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import LanguageToggle from '../ui/LanguageToggle';

interface NavbarProps {
  logoUrl?: string | null;
}

export default function Navbar({ logoUrl }: NavbarProps) {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change according to React 18 "state update during render" pattern
  if (pathname !== prevPathname) {
    setIsMobileMenuOpen(false);
    setPrevPathname(pathname);
  }

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/projects', label: t('projects') },
    { href: '/services', label: t('services') },
    { href: '/articles', label: t('articles') },
  ];

  // Check if a link is active — exact match for home, prefix match for others
  const isActive = (href: string) => {
    // Strip locale prefix (e.g. /en, /ar) from pathname
    const strippedPath = pathname.replace(/^\/(en|ar)/, '') || '/';
    if (href === '/') return strippedPath === '/';
    return strippedPath.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/60 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-5 md:px-10 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {logoUrl ? (
            <div className="relative w-9 h-9 overflow-hidden rounded-lg">
              <Image src={logoUrl} alt="Logo" fill className="object-contain" priority />
            </div>
          ) : (
            <>
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="38" rx="10" fill="#052e16" />
                <path d="M19 8L28 17L19 30L10 17L19 8Z" stroke="#4ade80" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <path d="M19 13L24 18L19 26L14 18L19 13Z" fill="#4ade80" opacity="0.2" />
                <line x1="19" y1="18" x2="19" y2="30" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="19" cy="30" r="1.5" fill="#4ade80" />
              </svg>
              <span className="text-zinc-50 font-bold text-lg tracking-tight group-hover:text-green-400 transition-colors">
                AE<span className="text-green-500">.</span>
              </span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <ul className="flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 rounded-full transition-all duration-200 ${
                      active
                        ? 'text-green-400 bg-green-500/10'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-full border border-green-500/30 bg-green-500/5"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-4 border-s border-zinc-800 ps-4 ms-3">
            <LanguageToggle />
            <Link
              href="/contact"
              className={`btn text-sm px-5 py-2.5 ${
                isActive('/contact')
                  ? 'bg-green-400 text-zinc-950 shadow-[0_0_20px_rgba(74,222,128,0.4)]'
                  : 'bg-green-500 text-zinc-950 hover:bg-green-400 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]'
              }`}
            >
              {t('contact')}
            </Link>
          </div>
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageToggle />
          <button
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-800 text-zinc-300 hover:text-green-500 hover:border-green-500/40 transition-all active:scale-95"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden md:hidden border-t border-zinc-800/50 bg-zinc-950/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-5 py-6 flex flex-col gap-2">
              {navLinks.map((link, i) => {
                const active = isActive(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                        active
                          ? 'text-green-400 bg-green-500/10 border border-green-500/20'
                          : 'text-zinc-300 hover:text-zinc-50 hover:bg-zinc-800/60'
                      }`}
                    >
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />}
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="pt-2 mt-2 border-t border-zinc-800/50"
              >
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`btn w-full py-3.5 text-base ${
                    isActive('/contact')
                      ? 'bg-green-400 text-zinc-950'
                      : 'bg-green-500 text-zinc-950 hover:bg-green-400'
                  }`}
                >
                  {t('contact')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
