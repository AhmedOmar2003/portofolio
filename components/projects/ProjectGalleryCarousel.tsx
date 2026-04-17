'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectGalleryCarouselProps {
  images: string[];
  title: string;
  isArabic: boolean;
}

export default function ProjectGalleryCarousel({ images, title, isArabic }: ProjectGalleryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const canNavigate = images.length > 1;
  const prevLabel = isArabic ? 'الصورة السابقة' : 'Previous image';
  const nextLabel = isArabic ? 'الصورة التالية' : 'Next image';

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 bg-[#02050d]">
        <Image
          src={images[activeIndex]}
          alt={`${title} — ${isArabic ? 'صورة' : 'Image'} ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1100px"
          className="object-cover"
          priority={activeIndex === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04070f]/35 via-transparent to-transparent" />

        {canNavigate ? (
          <>
            <button
              type="button"
              onClick={goToPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#050816]/70 text-white backdrop-blur transition hover:border-[#8df6c8]/50 hover:text-[#8df6c8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8df6c8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] sm:left-4 sm:h-11 sm:w-11"
              aria-label={prevLabel}
            >
              <ChevronLeft className={`h-5 w-5 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#050816]/70 text-white backdrop-blur transition hover:border-[#8df6c8]/50 hover:text-[#8df6c8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8df6c8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] sm:right-4 sm:h-11 sm:w-11"
              aria-label={nextLabel}
            >
              <ChevronRight className={`h-5 w-5 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
            </button>
          </>
        ) : null}

        <div className="absolute bottom-3 right-3 rounded-full border border-white/15 bg-[#050816]/70 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur sm:bottom-4 sm:right-4">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {canNavigate ? (
        <div className={`flex gap-2 ${isArabic ? 'justify-end' : 'justify-start'}`}>
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8df6c8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] ${
                index === activeIndex ? 'w-8 bg-[#8df6c8]' : 'w-2.5 bg-white/25 hover:bg-white/45'
              }`}
              aria-label={`${isArabic ? 'اذهب للصورة' : 'Go to image'} ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
