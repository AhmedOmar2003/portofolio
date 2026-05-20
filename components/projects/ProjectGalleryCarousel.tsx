'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectGalleryCarouselProps {
  images: string[];
  title: string;
  isArabic: boolean;
}

export default function ProjectGalleryCarousel({ images, title, isArabic }: ProjectGalleryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  if (images.length === 0) return null;

  const canNavigate = images.length > 1;
  const prevLabel = isArabic ? 'الصورة السابقة' : 'Previous image';
  const nextLabel = isArabic ? 'الصورة التالية' : 'Next image';

  // Keyboard navigation on the region
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!canNavigate) return;
    if (e.key === 'ArrowLeft') { if (isArabic) goToNext(); else goToPrev(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { if (isArabic) goToPrev(); else goToNext(); e.preventDefault(); }
    if (e.key === 'Home') { setActiveIndex(0); e.preventDefault(); }
    if (e.key === 'End') { setActiveIndex(images.length - 1); e.preventDefault(); }
  }

  // Touch swipe support
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.targetTouches[0].clientX;
  }

  function handleTouchEnd() {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 48) {
      if (delta > 0) goToNext();
      else goToPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }

  return (
    <div className="space-y-4">
      <div
        ref={regionRef}
        role="group"
        aria-label={isArabic ? `معرض صور ${title}` : `${title} image gallery`}
        className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 bg-[#02050d] cursor-grab active:cursor-grabbing"
        tabIndex={canNavigate ? 0 : -1}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[activeIndex]}
          alt={`${title} — ${isArabic ? 'صورة' : 'Image'} ${activeIndex + 1} ${isArabic ? 'من' : 'of'} ${images.length}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1100px"
          className="object-cover transition-opacity duration-300"
          priority={activeIndex === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04070f]/35 via-transparent to-transparent" />

        {/* ARIA live region for screen readers */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {isArabic
            ? `الصورة ${activeIndex + 1} من ${images.length}`
            : `Image ${activeIndex + 1} of ${images.length}`}
        </div>

        {canNavigate ? (
          <>
            <button
              type="button"
              onClick={goToPrev}
              className={`absolute top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#050816]/70 text-white backdrop-blur transition hover:border-[#8df6c8]/50 hover:text-[#8df6c8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8df6c8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] sm:h-11 sm:w-11 ${isArabic ? 'right-3 sm:right-4' : 'left-3 sm:left-4'}`}
              aria-label={prevLabel}
            >
              <ChevronLeft className={`h-5 w-5 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={goToNext}
              className={`absolute top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#050816]/70 text-white backdrop-blur transition hover:border-[#8df6c8]/50 hover:text-[#8df6c8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8df6c8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] sm:h-11 sm:w-11 ${isArabic ? 'left-3 sm:left-4' : 'right-3 sm:right-4'}`}
              aria-label={nextLabel}
            >
              <ChevronRight className={`h-5 w-5 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
            </button>
          </>
        ) : null}

        <div
          className={`absolute bottom-3 rounded-full border border-white/15 bg-[#050816]/70 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur sm:bottom-4 ${isArabic ? 'left-3 sm:left-4' : 'right-3 sm:right-4'}`}
          aria-hidden="true"
        >
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {canNavigate ? (
        <div
          role="tablist"
          aria-label={isArabic ? 'اختر صورة' : 'Select image'}
          className={`flex gap-2 ${isArabic ? 'justify-end' : 'justify-start'}`}
        >
          {images.map((_, index) => (
            <button
              key={index}
              role="tab"
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-selected={index === activeIndex}
              aria-label={`${isArabic ? 'اذهب للصورة' : 'Go to image'} ${index + 1}`}
              className={`h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8df6c8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] ${
                index === activeIndex ? 'w-8 bg-[#8df6c8]' : 'w-2.5 bg-white/25 hover:bg-white/45'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
