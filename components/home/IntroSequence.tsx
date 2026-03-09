'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function IntroSequence() {
  const [showIntro, setShowIntro] = useState(false);
  const t = useTranslations('Intro');

  useEffect(() => {
    // Only show intro once per session to avoid annoying the user
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (!hasSeenIntro) {
      setShowIntro(true);
      
      // Initialize lightweight, zero-dependency Web Audio chime
      const playIntroSound = () => {
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContext) return;
          
          const ctx = new AudioContext();
          const masterGain = ctx.createGain();
          
          // Very low volume overall
          masterGain.gain.value = 0.06;
          masterGain.connect(ctx.destination);

          const playNote = (freq: number, type: OscillatorType, delay: number, duration: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = type;
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0, ctx.currentTime + delay);
            gain.gain.linearRampToValueAtTime(1, ctx.currentTime + delay + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
            
            osc.connect(gain);
            gain.connect(masterGain);
            
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + duration + 0.1);
          };

          // Play a soft, ambient "glassy" tech UI chord
          playNote(523.25, 'sine', 0, 2.5);       // C5 Root
          playNote(523.25, 'triangle', 0, 2.5);   // C5 Root texture
          playNote(783.99, 'sine', 0.15, 2.0);    // G5 Perfect 5th
          playNote(987.77, 'sine', 0.3, 3.0);     // B5 Major 7th (Airy/Unresolved feel)

          // Handle strict browser autoplay policies natively
          if (ctx.state === 'suspended') {
            const resumeAudio = () => {
              // Only resume if the intro sequence is still actively rendering
              if (document.getElementById('intro-sequence-container')) {
                ctx.resume();
              } else {
                ctx.close().catch(() => {});
              }
              ['click', 'keydown', 'touchstart'].forEach(e => document.removeEventListener(e, resumeAudio));
            };
            ['click', 'keydown', 'touchstart'].forEach(e => document.addEventListener(e, resumeAudio));
          }
        } catch (e) {
          console.error("Audio playback failed", e);
        }
      };

      // Trigger the sound as soon as the component visually mounts
      playIntroSound();
    }
  }, []);

  const handleComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('hasSeenIntro', 'true');
  };

  // Skip immediately
  const handleSkip = () => {
    handleComplete();
  };

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          id="intro-sequence-container"
          key="intro-sequence"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 overflow-hidden"
        >
          {/* Subtle Background Elements */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 3, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" 
          />

          {/* Content Container */}
          <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center w-full max-w-4xl">
            
            {/* Step 1: Full Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)', scale: 0.95 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-zinc-50 mb-6"
            >
              Ahmed Essam Maher Mansour
            </motion.h1>

            {/* Step 2: Arabic Positioning */}
            <motion.p
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl sm:text-2xl text-green-400 font-medium mb-3"
              style={{ fontFamily: 'var(--font-cairo)' }}
            >
              تصميم منتجات رقمية تحل مشاكل حقيقية
            </motion.p>
            
            {/* Step 3: English Positioning */}
            <motion.p
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl text-zinc-400 font-light tracking-wide uppercase"
            >
              Designing thoughtful digital products
            </motion.p>

            {/* Step 4: Line separator animation */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100px', opacity: 1 }}
              transition={{ duration: 1, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent mt-12"
            />

            {/* Automatic Completion Trigger */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1, delay: 3.5 }}
              onAnimationComplete={handleComplete}
              className="hidden"
            />
          </div>

          {/* Skip Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            onClick={handleSkip}
            className="absolute bottom-8 right-8 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors z-50 tracking-widest uppercase"
          >
            Skip Intro
          </motion.button>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
