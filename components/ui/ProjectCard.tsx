'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

interface ProjectCardProps {
  title: string;
  category: string;
  year: string;
  description: string;
  slug: string;
  imageUrl?: string;
  index: number;
}

export default function ProjectCard({ title, category, year, description, slug, imageUrl, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="group block"
    >
      <Link href={`/projects/${slug}`} className="block relative h-full outline-none">
        
        {/* Card Container */}
        <div className="relative bg-zinc-900 border border-zinc-800/60 rounded-[2rem] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:border-zinc-700 hover:bg-zinc-800/40 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 group-focus-visible:ring-2 block ring-green-500 ring-offset-4 ring-offset-zinc-950">
          
          {/* Inner Glow on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Image Area */}
          <div className="aspect-[4/3] w-full bg-zinc-950 relative overflow-hidden p-2">
            <div className="w-full h-full relative rounded-[1.5rem] overflow-hidden bg-zinc-900 border border-zinc-800/50">
              {imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Image 
                    src={imageUrl} 
                    alt={title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110 will-change-transform" 
                  />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-800/50 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPHBhdGggZD0iTTAgMEw4IDhaTTEgMEwyIDBMMCAyWiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-20 Mix-blend-overlay"></div>
                  <div className="w-16 h-16 rounded-full bg-zinc-900/40 backdrop-blur-md flex items-center justify-center border border-zinc-700/50 shadow-xl">
                    <span className="text-zinc-500 text-xs font-mono">{year}</span>
                  </div>
                </div>
              )}
              
              {/* Overlay Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
              
              {/* Category Tag */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-4 py-1.5 bg-zinc-950/50 backdrop-blur-xl rounded-full border border-zinc-700/50 shadow-lg">
                <span className="text-[11px] font-semibold text-zinc-300 tracking-wider uppercase">{category}</span>
              </div>
              
              {/* Hover Arrow Indicator */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-950 opacity-0 translate-y-6 -translate-x-6 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-xl shadow-white/10 z-10">
                <ArrowUpRight size={22} strokeWidth={2.5} className="group-hover:rotate-45 transition-transform duration-500 ease-out delay-100" />
              </div>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="p-6 sm:p-8 sm:pt-6 relative z-10">
             <div className="flex justify-between items-end gap-4 mb-3">
              <h3 className="text-2xl sm:text-[1.75rem] font-bold tracking-tight text-zinc-50 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-zinc-100 group-hover:to-zinc-500 transition-all duration-500">
                {title}
              </h3>
            </div>
            
            <p className="text-zinc-400 text-sm sm:text-base line-clamp-2 leading-relaxed font-light">
              {description}
            </p>
          </div>
          
        </div>
      </Link>
    </motion.div>
  );
}
