'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import { Link } from '@/i18n/routing';

interface NavbarProps {
  logoUrl?: string | null;
}

export default function Navbar({ logoUrl }: NavbarProps) {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/projects', label: t('projects') },
    { href: '/services', label: t('services') },
    { href: '/articles', label: t('articles') },
  ];

  const isActive = (href: string) => {
    const strippedPath = pathname.replace(/^\/(en|ar)/, '') || '/';
    if (href === '/') {
      return strippedPath === '/';
    }

    return strippedPath.startsWith(href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <div
        className={`mx-auto max-w-[1360px] rounded-[1.7rem] border transition duration-500 ${
          isScrolled || isMobileMenuOpen
            ? 'border-white/12 bg-[rgba(6,10,18,0.82)] shadow-[0_24px_70px_rgba(2,8,23,0.35)] backdrop-blur-2xl'
            : 'border-white/8 bg-[rgba(6,10,18,0.45)] backdrop-blur-xl'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-3 rounded-full px-2 py-1.5 text-white">
            {logoUrl ? (
              <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                <Image src={logoUrl} alt="Ahmed Essam Maher logo" fill className="object-contain p-1.5" priority />
              </div>
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(141,246,200,0.18),rgba(106,215,255,0.12))] text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
                AE
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-semibold tracking-[0.16em] text-white/90 uppercase">Ahmed Essam</p>
              <p className="text-xs text-slate-400">{t('eyebrow')}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded-full px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? 'text-white'
                      : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full border border-[#8df6c8]/20 bg-[linear-gradient(135deg,rgba(141,246,200,0.14),rgba(106,215,255,0.1))]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/contact" className="btn btn-primary px-5 py-3 text-sm">
              {t('contact')}
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isMobileMenuOpen ? (
            <motion.div
              id="mobile-navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-white/8 lg:hidden"
            >
              <div className="flex flex-col gap-2 px-4 py-4">
                {navLinks.map((link) => {
                  const active = isActive(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`rounded-2xl px-4 py-3.5 text-base transition ${
                        active
                          ? 'border border-[#8df6c8]/20 bg-[linear-gradient(135deg,rgba(141,246,200,0.14),rgba(106,215,255,0.08))] text-white'
                          : 'text-slate-200 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <Link href="/contact" className="btn btn-primary mt-2 w-full justify-center py-3 text-sm">
                  {t('contact')}
                </Link>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
