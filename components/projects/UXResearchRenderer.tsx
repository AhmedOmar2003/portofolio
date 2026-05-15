import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { LocalProject } from '@/data/projects/local-projects';
import React from 'react';

type UXResearchRendererProps = {
  project: LocalProject;
  locale: string;
};

export default function UXResearchRenderer({ project, locale }: UXResearchRendererProps) {
  const isArabic = locale === 'ar';

  return (
    <main className="px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="mx-auto max-w-[1080px] space-y-24">
        
        {/* Back link */}
        <Link
          href="/projects"
          className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-300 transition hover:border-white/20 hover:text-white`}
        >
          <ArrowLeft className={`h-4 w-4 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
          {isArabic ? 'رجوع للمشاريع' : 'Back to projects'}
        </Link>

        {/* Blocks Renderer */}
        <div className="space-y-24">
          {project.blocks.map((block) => {
            const content = isArabic ? block.contentAr : block.contentEn;

            switch (block.type) {
              case 'hero':
                return (
                  <section key={block.id} className="space-y-10">
                    <div>
                      <h1 className={`max-w-4xl text-balance text-4xl font-semibold text-white sm:text-5xl lg:text-6xl ${isArabic ? 'leading-tight' : 'tracking-[-0.05em] leading-tight'}`}>
                        {content.title}
                      </h1>
                      {content.subtitle && (
                        <p className={`mt-6 text-xl text-[#8df6c8] ${isArabic ? 'leading-9' : 'leading-8'}`}>
                          {content.subtitle}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {content.tags?.map((tag: string, i: number) => (
                        <span key={i} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-8 md:p-10">
                      <p className={`text-lg text-slate-300 ${isArabic ? 'leading-9' : 'leading-8'}`}>
                        {content.overview}
                      </p>
                    </div>

                    <div className={`flex flex-wrap items-center gap-x-12 gap-y-6 border-t border-white/10 pt-8 ${isArabic ? 'text-right' : ''}`}>
                      {content.metadata?.map((meta: any, i: number) => (
                        <div key={i}>
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">{meta.label}</p>
                          <p className="mt-1.5 text-sm font-medium text-white">{meta.value}</p>
                        </div>
                      ))}
                      
                      {content.link && (
                        <div className={`mt-2 w-full md:w-auto md:mt-0 ${isArabic ? 'md:me-auto' : 'md:ml-auto'}`}>
                          <a
                            href={content.link.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`group inline-flex items-center gap-2 rounded-full border border-[#8df6c8]/45 bg-gradient-to-r from-[#8df6c8] to-[#6ad7ff] px-6 py-3 text-sm font-semibold text-[#02131b] shadow-[0_10px_30px_rgba(106,215,255,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(106,215,255,0.4)]`}
                          >
                            <svg className={`w-4 h-4 ${isArabic ? 'rtl-flip' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M15 3h6v6M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M10 14L21 3" />
                            </svg>
                            {content.link.label}
                          </a>
                        </div>
                      )}
                    </div>

                    {content.disclaimer && (
                      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                        <p className={`text-sm text-yellow-200/80 ${isArabic ? 'leading-7' : 'leading-6'}`}>
                          {content.disclaimer}
                        </p>
                      </div>
                    )}
                  </section>
                );

              case 'text':
                return (
                  <section key={block.id} className={`max-w-3xl ${isArabic ? 'text-right' : ''}`}>
                    {content.heading && (
                      <h2 className={`mb-6 text-2xl font-semibold text-white ${isArabic ? 'leading-tight' : 'tracking-[-0.04em]'}`}>
                        {content.heading}
                      </h2>
                    )}
                    <div className={`space-y-5 text-base text-slate-400 ${isArabic ? 'leading-9' : 'leading-8'}`}>
                      {content.paragraphs?.map((p: string, i: number) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </section>
                );

              case 'timeline':
                return (
                  <section key={block.id} className={`max-w-4xl ${isArabic ? 'text-right' : ''}`}>
                    {content.heading && (
                      <h2 className={`mb-10 text-2xl font-semibold text-white ${isArabic ? 'leading-tight' : 'tracking-[-0.04em]'}`}>
                        {content.heading}
                      </h2>
                    )}
                    <div className="space-y-8 relative before:absolute before:inset-0 before:ms-5 md:before:mx-auto before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                      {content.steps?.map((step: any, i: number) => (
                        <div key={i} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#050816] text-[#8df6c8] shadow shrink-0 md:order-1 ${isArabic ? 'md:group-odd:translate-x-1/2 md:group-even:-translate-x-1/2' : 'md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2'} me-4 md:me-0 z-10`}>
                            {i + 1}
                          </div>
                          <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-xl`}>
                            <h3 className="mb-2 font-semibold text-white text-lg">{step.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case 'cards':
                return (
                  <section key={block.id} className={`max-w-5xl ${isArabic ? 'text-right' : ''}`}>
                    {content.heading && (
                      <h2 className={`mb-8 text-2xl font-semibold text-white ${isArabic ? 'leading-tight' : 'tracking-[-0.04em]'}`}>
                        {content.heading}
                      </h2>
                    )}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {content.cards?.map((card: any, i: number) => (
                        <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04]">
                          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8df6c8]/10 text-[#8df6c8]">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <h3 className="mb-3 text-lg font-semibold text-white">{card.title}</h3>
                          <p className="text-sm text-slate-400 leading-relaxed">{card.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case 'quote':
                return (
                  <section key={block.id} className="mx-auto max-w-3xl">
                    <blockquote className="rounded-[2.5rem] bg-gradient-to-br from-[#8df6c8]/10 to-transparent border border-[#8df6c8]/20 p-10 md:p-14 text-center">
                      <p className={`text-2xl md:text-3xl font-medium text-white ${isArabic ? 'leading-relaxed' : 'leading-tight'}`}>
                        "{content.quote}"
                      </p>
                      {content.author && (
                        <footer className="mt-8 text-sm font-semibold tracking-wider text-[#8df6c8] uppercase">
                          — {content.author}
                        </footer>
                      )}
                    </blockquote>
                  </section>
                );

              case 'list':
                return (
                  <section key={block.id} className={`max-w-4xl ${isArabic ? 'text-right' : ''}`}>
                    {content.heading && (
                      <h2 className={`mb-6 text-2xl font-semibold text-white ${isArabic ? 'leading-tight' : 'tracking-[-0.04em]'}`}>
                        {content.heading}
                      </h2>
                    )}
                    <ul className={`grid gap-4 ${content.items?.length > 4 ? 'sm:grid-cols-2' : ''}`}>
                      {content.items?.map((item: string, i: number) => (
                        <li key={i} className={`flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.01] p-4 text-slate-300`}>
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8df6c8]" />
                          <span className={`text-base leading-relaxed`}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                );

              case 'participants':
                return (
                  <section key={block.id} className={`max-w-5xl ${isArabic ? 'text-right' : ''}`}>
                    {content.heading && (
                      <h2 className={`mb-8 text-2xl font-semibold text-white ${isArabic ? 'leading-tight' : 'tracking-[-0.04em]'}`}>
                        {content.heading}
                      </h2>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {content.profiles?.map((profile: any, i: number) => (
                        <div key={i} className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.04]">
                          <div className={`mb-4 flex items-center gap-4`}>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8df6c8]/10 text-xl font-bold text-[#8df6c8]">
                              {profile.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
                              <p className="text-sm text-slate-400">{profile.age}</p>
                            </div>
                          </div>
                          <div className={`space-y-3 text-sm text-slate-300 flex-1`}>
                            {profile.details?.map((detail: string, j: number) => (
                              <div key={j} className={`flex items-start gap-2`}>
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/20" />
                                <span>{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case 'image':
                return (
                  <section key={block.id} className="mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] shadow-2xl">
                    <img 
                      src={content.src} 
                      alt={content.alt || ''} 
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    {content.caption && (
                      <p className={`p-4 text-center text-sm text-slate-400 ${isArabic ? 'text-right' : ''}`}>
                        {content.caption}
                      </p>
                    )}
                  </section>
                );

              default:
                return null;
            }
          })}
        </div>

      </div>
    </main>
  );
}
