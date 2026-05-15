'use client';

import { useMemo, useState } from 'react';
import ProjectCard from '@/components/ui/ProjectCard';

type FilterType = 'all' | 'design' | 'programming';
type DesignSubFilterType = 'all_design' | 'ui_design' | 'branding' | 'ux_research';

type ProjectItem = {
  title: string;
  type: 'design' | 'programming' | 'applications' | 'ui_design' | 'branding' | 'ux_research';
  filterType: 'design' | 'programming';
  typeLabel: string;
  category: string;
  year: string;
  description: string;
  href: string;
  imageUrl?: string;
  role: string;
  impact: string;
  index: number;
};

type ProjectsFilterGridProps = {
  projects: ProjectItem[];
  isArabic: boolean;
  labels: {
    role: string;
    outcome: string;
    year: string;
    cta: string;
    all: string;
    design: string;
    programming: string;
    empty: string;
    designAll?: string;
    designUI?: string;
    designBranding?: string;
    designUX?: string;
  };
};

export default function ProjectsFilterGrid({ projects, isArabic, labels }: ProjectsFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeDesignSubFilter, setActiveDesignSubFilter] = useState<DesignSubFilterType>('all_design');

  const filteredProjects = useMemo(() => {
    let result = projects;
    
    if (activeFilter !== 'all') {
      result = result.filter((project) => project.filterType === activeFilter);
    }

    if (activeFilter === 'design' && activeDesignSubFilter !== 'all_design') {
      // 'ui_design', 'branding', 'ux_research'
      result = result.filter((project) => project.type === activeDesignSubFilter);
    }

    return result;
  }, [activeFilter, activeDesignSubFilter, projects]);

  const filterButtons: Array<{ key: FilterType; label: string }> = [
    { key: 'all', label: labels.all },
    { key: 'programming', label: labels.programming },
    { key: 'design', label: labels.design },
  ];

  const designSubFilterButtons: Array<{ key: DesignSubFilterType; label: string }> = [
    { key: 'all_design', label: labels.designAll || 'All Design' },
    { key: 'ux_research', label: labels.designUX || 'UX Research' },
  ];

  return (
    <section className="space-y-7">
      <div className={`flex flex-col gap-4 ${isArabic ? 'items-start' : 'items-start'}`}>
        <div className={`flex flex-wrap gap-3 ${isArabic ? 'ml-auto w-fit justify-start' : 'justify-start'}`}>
          {filterButtons.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => {
                  setActiveFilter(filter.key);
                  if (filter.key === 'design') {
                    setActiveDesignSubFilter('all_design');
                  }
                }}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8df6c8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] ${
                  isActive
                    ? 'border-[#8df6c8]/40 bg-[#8df6c8]/15 text-[#d8fff1]'
                    : 'border-white/15 bg-white/[0.02] text-slate-300 hover:border-white/25 hover:text-white'
                }`}
                aria-pressed={isActive}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {activeFilter === 'design' && (
          <div className={`flex flex-wrap gap-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-300 ${isArabic ? 'ml-auto w-fit justify-start' : 'justify-start'}`}>
            {designSubFilterButtons.map((filter) => {
              const isActive = activeDesignSubFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveDesignSubFilter(filter.key)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8df6c8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] ${
                    isActive
                      ? 'border-[#8df6c8]/30 bg-[#8df6c8]/10 text-white'
                      : 'border-white/10 bg-transparent text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                  aria-pressed={isActive}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-2">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={`${project.href}-${project.type}-${index}`}
              index={index}
              title={project.title}
              category={project.category}
              year={project.year}
              description={project.description}
              href={project.href}
              imageUrl={project.imageUrl}
              role={project.role}
              impact={project.impact}
              projectType={project.type as 'design' | 'programming' | 'applications'}
              projectTypeBadge={project.typeLabel}
              labels={{
                role: labels.role,
                outcome: labels.outcome,
                year: labels.year,
                cta: labels.cta,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] px-6 py-10 text-sm text-slate-300">
          {labels.empty}
        </div>
      )}
    </section>
  );
}
