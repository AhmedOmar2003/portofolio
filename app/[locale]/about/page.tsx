import { ArrowUpRight, Code2, FileText, GraduationCap, Layers3, Linkedin, PenTool, Rocket, Smartphone } from 'lucide-react';

import { Link } from '@/i18n/routing';

export const revalidate = 3600;

const skills = ['Flutter', 'Dart', 'Next.js', 'React', 'TypeScript', 'UI/UX Design', 'Product Design', 'Web Development'];

const content = {
  ar: {
    eyebrow: 'نبذة عني',
    title: 'أحمد عصام ماهر منصور',
    subtitle:
      'مطور برمجيات ومصمم منتجات رقمية أدمج بين التفكير الإبداعي والخبرة التقنية لبناء منتجات حديثة، واضحة، ومفيدة.',
    roleLabel: 'الدور',
    roleValue: 'مطور برمجيات ومصمم منتجات رقمية',
    educationLabel: 'التعليم',
    educationValue: 'خريج كلية الحاسبات والمعلومات - قسم علوم الحاسب',
    introductionTitle: 'مقدمة',
    introductionBody: [
      'أنا أحمد عصام ماهر منصور، مطور برمجيات ومصمم منتجات رقمية أدمج بين التفكير الإبداعي والمنطق البرمجي لبناء حلول رقمية قوية وسهلة الاستخدام.',
      'تخرجت من كلية الحاسبات والمعلومات - قسم علوم الحاسب، واستكملت رحلتي بتعلم مستمر ودورات متخصصة في تطوير البرمجيات وتصميم المنتجات الرقمية.',
      'أهتم ببناء تطبيقات ومواقع تتميز بالأداء العالي، التصميم الأنيق، وتجربة المستخدم السلسة التي تضيف قيمة حقيقية للناس.',
    ],
    philosophyTitle: 'فلسفتي',
    philosophySubtitle: 'أؤمن أن التكنولوجيا الجيدة هي التي تخدم الإنسان وتحل مشاكله بوضوح ومسؤولية.',
    philosophyPoints: [
      {
        title: 'التكنولوجيا لازم تكون مفيدة قبل ما تكون مبهرة',
        body: 'قيمة المنتج الحقيقي تظهر عندما يحل مشكلة واضحة ويوفر وقت ومجهود على المستخدم.',
      },
      {
        title: 'التصميم والكود لازم يشتغلوا مع بعض',
        body: 'أفضل النتائج بتظهر لما الواجهة، التجربة، والأداء يكونوا جزءًا من نفس الفكرة من البداية.',
      },
      {
        title: 'المسؤولية جزء أساسي من بناء المنتجات',
        body: 'التكنولوجيا المفروض تساعد الناس وتطور حياتهم، وليس أن تسبب ضررًا أو تعقيدًا غير لازم.',
      },
    ],
    workTitle: 'ما الذي أقدمه',
    workSubtitle: 'أبني منتجات رقمية متكاملة تجمع بين الفكرة، الشكل، والأداء.',
    workAreas: [
      {
        icon: Code2,
        title: 'تطبيقات الويب',
        body: 'أبني تطبيقات ويب سريعة، واضحة، وقابلة للتوسع.',
      },
      {
        icon: Smartphone,
        title: 'تطبيقات الموبايل',
        body: 'أصمم وأطور تطبيقات موبايل عملية وسهلة الاستخدام.',
      },
      {
        icon: PenTool,
        title: 'تصميم UX / UI',
        body: 'أصمم واجهات وتجارب استخدام تجمع بين الجمال والوضوح وسهولة الاستخدام.',
      },
      {
        icon: Layers3,
        title: 'المنتجات الرقمية',
        body: 'أبني منتجات رقمية متكاملة تساعد الشركات والأفراد على النمو.',
      },
    ],
    missionTitle: 'رسالتي',
    missionSubtitle: 'هدفي أن أبني حلولًا رقمية قوية تترك أثرًا حقيقيًا وتبقى سهلة الفهم والاستخدام.',
    missionPoints: [
      'بناء حلول رقمية قوية وسهلة الاستخدام.',
      'تحويل الأفكار إلى منتجات حقيقية قابلة للتطور والقياس.',
      'تقديم تجربة احترافية من أول شاشة لآخر تفاعل.',
    ],
    skillsTitle: 'مهاراتي',
    skillsSubtitle: 'مجموعة الأدوات والمهارات التي أستخدمها لبناء تجارب رقمية مصقولة.',
    connectTitle: 'تواصل معي',
    connectSubtitle: 'يسعدني التواصل إذا كنت تبحث عن بناء منتج رقمي واضح واحترافي.',
    linkedinLabel: 'لينكدإن',
    cvLabel: 'السيرة الذاتية',
    contactLabel: 'تواصل الآن',
  },
  en: {
    eyebrow: 'About Me',
    title: 'Ahmed Essam Maher Mansour',
    subtitle:
      'Software Developer and Product Designer blending creative thinking with technical expertise to build modern, clear, and useful products.',
    roleLabel: 'Role',
    roleValue: 'Software Developer & Product Designer',
    educationLabel: 'Education',
    educationValue: 'Faculty of Computers and Information, Computer Science Department',
    introductionTitle: 'Introduction',
    introductionBody: [
      'Ahmed Essam Maher Mansour is a software developer and product designer who blends creative thinking with programming logic to build strong and user-friendly digital products.',
      'He graduated from the Faculty of Computers and Information, Computer Science Department, and continued learning through focused courses in software development and digital product design.',
      'He focuses on building applications and websites with high performance, elegant design, and a smooth user experience that creates real value for people.',
    ],
    philosophyTitle: 'My Philosophy',
    philosophySubtitle: 'Good technology should serve people and solve real problems with clarity and responsibility.',
    philosophyPoints: [
      {
        title: 'Technology should be useful before it is impressive',
        body: 'A real product matters when it solves a clear problem and saves time and effort for users.',
      },
      {
        title: 'Design and code should work together',
        body: 'The best results happen when interface, experience, and performance are part of the same idea from the start.',
      },
      {
        title: 'Responsibility is part of product building',
        body: 'Technology should help people and improve lives, not create harm or unnecessary complexity.',
      },
    ],
    workTitle: 'What I Do',
    workSubtitle: 'I build complete digital products that combine idea, design, and performance.',
    workAreas: [
      {
        icon: Code2,
        title: 'Web Applications',
        body: 'I build fast, clear, and scalable web applications.',
      },
      {
        icon: Smartphone,
        title: 'Mobile Applications',
        body: 'I design and develop practical, user-friendly mobile apps.',
      },
      {
        icon: PenTool,
        title: 'UX / UI Design',
        body: 'I design interfaces and experiences that balance beauty, clarity, and usability.',
      },
      {
        icon: Layers3,
        title: 'Digital Products',
        body: 'I create complete digital products that help businesses and individuals grow.',
      },
    ],
    missionTitle: 'My Mission',
    missionSubtitle: 'My goal is to build impactful digital solutions that remain clear, useful, and easy to use.',
    missionPoints: [
      'Build digital solutions that are strong and easy to use.',
      'Turn ideas into real products that can be improved and measured.',
      'Deliver a professional experience from the first screen to the last interaction.',
    ],
    skillsTitle: 'My Skills',
    skillsSubtitle: 'The tools and skills I use to build polished digital experiences.',
    connectTitle: 'Connect With Me',
    connectSubtitle: 'I am always open to meaningful conversations about product, design, and development.',
    linkedinLabel: 'LinkedIn',
    cvLabel: 'CV',
    contactLabel: 'Contact Me',
  },
} as const;

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{subtitle}</p>
    </div>
  );
}

export default function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  return <AboutPageContent params={params} />;
}

async function AboutPageContent({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  const page = isArabic ? content.ar : content.en;

  return (
    <main className="relative overflow-hidden px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_top_left,_rgba(141,246,200,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(95,180,255,0.12),_transparent_30%)]" />
      <div className="mx-auto max-w-[1380px]">
        <section className="section-shell relative overflow-hidden px-6 py-8 md:px-10 md:py-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start">
            <div className="space-y-8">
              <SectionHeading eyebrow={page.eyebrow} title={page.title} subtitle={page.subtitle} />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{page.roleLabel}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{page.roleValue}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{page.educationLabel}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{page.educationValue}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{page.introductionTitle}</p>
                  <div className="mt-5 space-y-4 text-sm leading-8 text-slate-300">
                    {page.introductionBody.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{page.missionTitle}</p>
                  <p className="mt-4 text-lg font-semibold text-white">{page.missionSubtitle}</p>
                  <div className="mt-6 space-y-4 text-sm leading-8 text-slate-300">
                    {page.missionPoints.map((point) => (
                      <div key={point} className="flex gap-3 border-t border-white/10 pt-4">
                        <Rocket className="mt-1 h-5 w-5 shrink-0 text-[#8df6c8]" aria-hidden="true" />
                        <p>{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-[#09090b]/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8df6c8]/70">
                      {page.philosophyTitle}
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{page.philosophySubtitle}</h2>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-[#8df6c8]">
                    <GraduationCap className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {page.philosophyPoints.map((point, index) => (
                    <div key={point.title} className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">0{index + 1}</p>
                      <p className="mt-3 text-base font-semibold text-white">{point.title}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{point.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{page.workTitle}</p>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">{page.workSubtitle}</h2>
                <div className="mt-5 grid gap-4">
                  {page.workAreas.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.title} className="rounded-[1.25rem] border border-white/10 bg-black/10 p-4 transition hover:border-[#8df6c8]/30 hover:bg-white/[0.05]">
                        <div className="flex items-start gap-4">
                          <div className="mt-1 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-[#8df6c8]">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-white">{item.title}</p>
                            <p className="mt-1 text-sm text-slate-300">{item.body}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="section-shell px-6 py-8 md:px-8">
            <p className="eyebrow">{page.philosophyTitle}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">{page.philosophySubtitle}</h2>
            <div className="mt-6 grid gap-4">
              {page.philosophyPoints.map((point, index) => (
                <div key={`${point.title}-${index}`} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#8df6c8]/25 bg-[#8df6c8]/10 text-sm font-semibold text-[#8df6c8]">
                      0{index + 1}
                    </span>
                    <div className="space-y-3">
                      <p className="text-lg font-semibold text-white">{point.title}</p>
                      <p className="text-sm leading-7 text-slate-300">{point.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="section-shell px-6 py-8 md:px-8">
              <p className="eyebrow">{page.skillsTitle}</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">{page.skillsSubtitle}</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="section-shell px-6 py-8 md:px-8">
              <p className="eyebrow">{page.connectTitle}</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">{page.connectSubtitle}</h2>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <a
                  href="https://www.linkedin.com/in/ahmed-essam-a72274254/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-[#8df6c8]/35 hover:bg-white/[0.08]"
                >
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                  {page.linkedinLabel}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="https://drive.google.com/file/d/15m3y3vuWupnndu69JFW6MhayG-AojV0Q/view?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#8df6c6]/25 bg-[#8df6c8]/10 px-5 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#8df6c8]/15"
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  {page.cvLabel}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              <div className="mt-4">
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-medium text-[#8df6c8] transition hover:text-white">
                  {page.contactLabel}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
