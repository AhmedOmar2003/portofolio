'use client';

import { useMemo, useState } from 'react';
import ProjectCard from '@/components/ui/ProjectCard';

type FilterType = 'all' | 'design' | 'programming';

type ProjectItem = {
  title: string;
  type: 'design' | 'programming';
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
  };
};

export default function ProjectsFilterGrid({ projects, isArabic, labels }: ProjectsFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    return projects.filter((project) => project.type === activeFilter);
  }, [activeFilter, projects]);

  const filterButtons: Array<{ key: FilterType; label: string }> = [
    { key: 'all', label: labels.all },
    { key: 'design', label: labels.design },
    { key: 'programming', label: labels.programming },
  ];

  return (
    <section className="space-y-7">
      <div className="flex flex-wrap justify-start gap-3">
        {filterButtons.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
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
              projectType={project.type}
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
