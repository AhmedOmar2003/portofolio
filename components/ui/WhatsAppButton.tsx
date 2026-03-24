'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function WhatsAppButton() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href="https://wa.me/201050242285"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.94 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ delay: 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+0.9rem)] right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/16 bg-[linear-gradient(135deg,#8df6c8_0%,#6ad7ff_100%)] text-[#041019] shadow-[0_18px_40px_rgba(106,215,255,0.22)] backdrop-blur-xl sm:right-5 sm:h-14 sm:w-14 md:bottom-[calc(env(safe-area-inset-bottom)+2rem)] md:right-8"
    >
      <span className="absolute inset-0 rounded-full border border-white/14" />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" fill="currentColor" aria-hidden="true">
        <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.363.627 4.672 1.813 6.693L2.667 29.333l6.827-1.787A13.28 13.28 0 0016.003 29.333c7.36 0 13.33-5.973 13.33-13.333S23.363 2.667 16.003 2.667zm0 24c-2.133 0-4.213-.573-6.027-1.653l-.427-.253-4.053 1.067 1.08-3.947-.28-.44A10.587 10.587 0 015.333 16c0-5.893 4.773-10.667 10.667-10.667S26.667 10.107 26.667 16 21.893 26.667 16.003 26.667zm5.84-7.947c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.35-.497-2.573-1.587-.947-.84-1.587-1.88-1.773-2.2-.187-.32-.02-.493.14-.653.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.26-.627-.52-.54-.72-.547h-.613c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.253 3.44 5.467 4.827.763.333 1.36.533 1.827.68.767.24 1.467.207 2.02.127.613-.093 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z" />
      </svg>
    </motion.a>
  );
}
