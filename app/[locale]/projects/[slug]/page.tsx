import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function ProjectCaseStudyPage(props: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await props.params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!project) {
    notFound();
  }

  const title = locale === 'ar' ? project.name_ar : project.name_en;
  const description = locale === 'ar' ? project.description_ar : project.description_en;
  const problem = locale === 'ar' ? project.problem_ar : project.problem_en;
  const process = locale === 'ar' ? project.process_ar : project.process_en;
  const solution = locale === 'ar' ? project.solution_ar : project.solution_en;
  
  const heroImage = project.images && project.images.length > 0 ? project.images[0] : null;

  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <Link href="/projects" className="inline-flex items-center gap-2 text-zinc-400 hover:text-green-500 mb-12 transition-colors">
          <ArrowLeft size={16} className={locale === 'ar' ? 'rotate-180' : ''} />
          <span>{locale === 'ar' ? 'العودة للمشاريع' : 'Back to Projects'}</span>
        </Link>
        
        <div className="space-y-6 mb-16">
          <div className="inline-flex items-center px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">
            {project.category}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-50 tracking-tight">
            {title}
          </h1>
          <p className="text-xl text-zinc-400 font-light leading-relaxed">
            {description}
          </p>
        </div>
        
        {heroImage ? (
          <div className="aspect-video w-full relative bg-zinc-900 border border-zinc-800 rounded-3xl mb-16 overflow-hidden">
             <Image src={heroImage} alt={title} fill className="object-cover" />
          </div>
        ) : (
          <div className="aspect-video w-full bg-zinc-900 border border-zinc-800 rounded-3xl mb-16 flex items-center justify-center">
             <span className="text-zinc-600 font-mono">No Image Uploaded</span>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-8 mb-16 border-y border-zinc-900 py-8">
          <div>
            <span className="block text-sm text-zinc-500 mb-2">{locale === 'ar' ? 'تاريخ البدء' : 'Started'}</span>
            <span className="text-zinc-50 font-medium">{project.start_date || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-sm text-zinc-500 mb-2">{locale === 'ar' ? 'تاريخ الانتهاء' : 'Completed'}</span>
            <span className="text-zinc-50 font-medium">{project.end_date || 'N/A'}</span>
          </div>
        </div>
        
        <div className="prose prose-invert prose-green max-w-none">
          {problem && (
            <>
              <h2 className="text-2xl font-bold text-zinc-50 mb-4">{locale === 'ar' ? 'المشكلة' : 'The Challenge'}</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed whitespace-pre-wrap">{problem}</p>
            </>
          )}

          {process && (
            <>
              <h2 className="text-2xl font-bold text-zinc-50 mb-4">{locale === 'ar' ? 'العملية' : 'The Process'}</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed whitespace-pre-wrap">{process}</p>
            </>
          )}
          
          {solution && (
            <>
              <h2 className="text-2xl font-bold text-zinc-50 mb-4">{locale === 'ar' ? 'الحل' : 'The Solution'}</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed whitespace-pre-wrap">{solution}</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
