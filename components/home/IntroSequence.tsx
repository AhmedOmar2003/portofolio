'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroSequence() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
      if (!hasSeenIntro) {
        setShowIntro(true);
      }
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('hasSeenIntro', 'true');
  };

  const handleSkip = () => {
    handleComplete();
  };

  // Generate subtle random particles for the premium background
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 1.5
  }));

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          id="intro-sequence-container"
          key="intro-sequence"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            backdropFilter: 'blur(0px)',
            transition: { duration: 1.8, ease: [0.25, 1, 0.5, 1] } 
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020202] overflow-hidden"
        >
          {/* --- Layer 1: Ambient Emerald Neon Background Globs --- */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, scale: 0.7, y: 50 }}
              animate={{ opacity: 0.15, scale: 1.1, y: -20 }}
              transition={{ duration: 4, ease: 'easeOut' }}
              className="absolute w-[90vw] h-[90vw] max-w-[1000px] max-h-[1000px] rounded-full bg-brand-primary blur-[140px] mix-blend-screen" 
            />
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 0.1, x: 50 }}
              transition={{ duration: 5, ease: 'easeInOut', delay: 0.5 }}
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-green-400 blur-[100px] mix-blend-screen" 
            />
          </div>

          {/* --- Layer 2: Abstract Flowing Light Particles --- */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: `${p.y}vh`, x: `${p.x}vw`, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.5, 0],
                  y: [`${p.y}vh`, `${p.y - 15}vh`],
                  scale: [0, 1, 0.5]
                }}
                transition={{ 
                  duration: p.duration, 
                  delay: p.delay, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute w-1 h-1 bg-brand-primary rounded-full shadow-[0_0_12px_rgba(5,242,108,0.9)]"
                style={{ width: p.size, height: p.size }}
              />
            ))}
          </div>

          {/* --- Layer 3: Noise Texture for cinematic film feel --- */}
          <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

          {/* --- Layer 4: Deep Frosted Glass Container --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center justify-center px-12 py-20 text-center w-full max-w-6xl rounded-[3rem] bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_80px_-10px_rgba(5,242,108,0.15)] overflow-hidden"
          >
            {/* Cinematic Glass Edge Highlights & Inner Glows */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/[0.02] to-transparent pointer-events-none" />
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
            
            {/* Step 1: Full Name - Dramatic Blur Reveal */}
            <div className="overflow-hidden mb-10 p-4">
              <motion.h1
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(24px)', y: 30 }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tight text-white drop-shadow-2xl"
                style={{ textShadow: '0 12px 60px rgba(5, 242, 108, 0.2)' }}
              >
                Ahmed Essam Maher Mansour
              </motion.h1>
            </div>

            <div className="space-y-8 flex flex-col items-center">
              {/* Step 2: English Positioning - Soft Cinematic Fade Up */}
              <div className="overflow-hidden">
                <motion.p
                  initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="text-sm sm:text-base md:text-lg text-zinc-300 font-light tracking-[0.4em] uppercase drop-shadow-lg"
                >
                  Designing thoughtful digital products
                </motion.p>
              </div>

              {/* Step 3: Arabic Positioning - Elegant Soft Glow Reveal */}
              <div className="overflow-hidden">
                <motion.p
                  initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg sm:text-xl md:text-2xl text-brand-primary font-medium leading-relaxed drop-shadow-[0_0_15px_rgba(5,242,108,0.4)]"
                  style={{ fontFamily: 'var(--font-cairo)' }}
                >
                  تصميم منتجات رقمية تحل مشاكل حقيقية
                </motion.p>
              </div>
            </div>

            {/* Step 4: Premium Light-Beam Separator */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0, filter: 'blur(8px)' }}
              animate={{ scaleX: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.8, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-[1px] w-48 bg-gradient-to-r from-transparent via-brand-primary to-transparent mt-20 origin-center shadow-[0_0_20px_rgba(5,242,108,0.6)]"
            />

            {/* Automatic Completion Trigger */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1, delay: 4.2 }}
              onAnimationComplete={handleComplete}
              className="hidden"
            />
          </motion.div>

          {/* Skip Button - Ultra Minimalist Cinematic */}
          <motion.button
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 0.3, filter: 'blur(0px)' }}
            whileHover={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.8, duration: 1 }}
            onClick={handleSkip}
            className="absolute bottom-12 right-12 text-[10px] font-semibold text-white transition-all z-50 tracking-[0.4em] uppercase mix-blend-overlay hover:mix-blend-normal"
          >
            Skip Intro
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
