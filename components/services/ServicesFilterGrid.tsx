'use client';

import { ArrowUpRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Link } from '@/i18n/routing';

type ServiceTypeFilter = 'all' | 'full_design_development' | 'ux_ui_design';

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  index: number;
  type: 'full_design_development' | 'ux_ui_design';
  typeLabel: string;
};

type ServicesFilterGridProps = {
  services: ServiceItem[];
  isArabic: boolean;
  labels: {
    all: string;
    fullDesignDevelopment: string;
    uxUiDesign: string;
    cta: string;
    empty: string;
  };
};

export default function ServicesFilterGrid({ services, isArabic, labels }: ServicesFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<ServiceTypeFilter>('all');

  const filteredServices = useMemo(() => {
    if (activeFilter === 'all') return services;
    return services.filter((service) => service.type === activeFilter);
  }, [activeFilter, services]);

  const filterButtons: Array<{ key: ServiceTypeFilter; label: string }> = [
    { key: 'all', label: labels.all },
    { key: 'full_design_development', label: labels.fullDesignDevelopment },
    { key: 'ux_ui_design', label: labels.uxUiDesign },
  ];

  return (
    <section className="space-y-7">
      <div className={`flex w-full flex-wrap gap-3 ${isArabic ? 'ml-auto max-w-3xl justify-end' : 'justify-start'}`}>
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

      {filteredServices.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <article
              key={service.id}
              className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className={`mb-6 flex items-center justify-between gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm font-semibold uppercase tracking-widest text-[#8df6c8]">
                  [{String(service.index + 1).padStart(2, '0')}]
                </span>
                <span className="inline-flex items-center rounded-full border border-sky-300/60 bg-[rgba(2,10,20,0.86)] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_10px_28px_rgba(0,0,0,0.5)]">
                  {service.typeLabel}
                </span>
              </div>

              <h2 className={`text-2xl font-semibold text-white ${isArabic ? 'leading-tight text-right' : 'tracking-[-0.04em]'}`}>
                {service.title}
              </h2>

              <p className={`mt-4 flex-1 text-base text-slate-400 ${isArabic ? 'text-right leading-8' : 'leading-7'}`}>
                {service.description}
              </p>

              <div className="mt-8 pt-4">
                <Link
                  href={`/services/${service.id}`}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8df6c8]/10 px-6 py-3.5 text-sm font-semibold text-[#8df6c8] transition-all hover:bg-[#8df6c8]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8df6c8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] ${
                    isArabic ? 'flex-row-reverse' : ''
                  }`}
                >
                  {labels.cta}
                  <ArrowUpRight
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isArabic ? 'rtl-flip group-hover:-translate-x-1' : 'group-hover:translate-x-1 group-hover:-translate-y-1'
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </article>
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
