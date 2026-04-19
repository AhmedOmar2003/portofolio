import { ArrowUpRight, Code2, FileText, GraduationCap, Layers3, Linkedin, PenTool, Rocket, Smartphone } from 'lucide-react';

import { Link } from '@/i18n/routing';

export const revalidate = 3600;

const skills = ['Flutter', 'Dart', 'Next.js', 'React', 'TypeScript', 'UI/UX Design', 'Product Design', 'Web Development'];

const principles = [
  {
    arTitle: 'التكنولوجيا لازم تكون مفيدة قبل ما تكون مبهرة',
    arBody: 'أنا بؤمن إن قيمة المنتج الحقيقي بتظهر لما يحل مشكلة واضحة ويوفر وقت ومجهود على المستخدم.',
    enTitle: 'Technology should be useful before it is impressive',
    enBody: 'A real product should solve a clear problem and save time and effort for the people using it.',
  },
  {
    arTitle: 'التصميم والكود لازم يشتغلوا مع بعض',
    arBody: 'أفضل النتائج بتطلع لما الواجهة، التجربة، والأداء يكونوا جزء من نفس الفكرة من البداية.',
    enTitle: 'Design and code should work together',
    enBody: 'The best outcomes happen when interface, experience, and performance are shaped as one idea from the start.',
  },
  {
    arTitle: 'المسؤولية جزء أساسي من بناء المنتجات',
    arBody: 'التكنولوجيا المفروض تساعد الناس وتطور حياتهم، مش تسبب فوضى أو ضرر أو تعقيد غير لازم.',
    enTitle: 'Responsibility is part of product building',
    enBody: 'Technology should help people and improve life, not create unnecessary noise, harm, or complexity.',
  },
];

const workAreas = [
  {
    icon: Code2,
    arTitle: 'تطبيقات ويب',
    arBody: 'ببني تطبيقات ويب سريعة، واضحة، وقابلة للتوسع.',
    enTitle: 'Web Applications',
    enBody: 'I build fast, clear, and scalable web applications.',
  },
  {
    icon: Smartphone,
    arTitle: 'تطبيقات موبايل',
    arBody: 'بصمم وأطور تطبيقات موبايل عملية وسهلة الاستخدام.',
    enTitle: 'Mobile Applications',
    enBody: 'I design and develop practical, user-friendly mobile apps.',
  },
  {
    icon: PenTool,
    arTitle: 'UI/UX Design',
    arBody: 'بصمم تجارب وواجهات تجمع بين الجمال والوضوح وسهولة الاستخدام.',
    enTitle: 'UI/UX Design',
    enBody: 'I design experiences and interfaces that balance clarity, beauty, and usability.',
  },
  {
    icon: Layers3,
    arTitle: 'منتجات رقمية',
    arBody: 'ببني منتجات رقمية متكاملة تساعد الشركات والأفراد على النمو.',
    enTitle: 'Digital Products',
    enBody: 'I create complete digital products that help businesses and individuals grow.',
  },
];

const missionPoints = [
  {
    ar: 'بناء حلول رقمية قوية وسهلة الاستخدام.',
    en: 'Build digital solutions that are strong, simple, and easy to use.',
  },
  {
    ar: 'تحويل الأفكار إلى منتجات حقيقية قابلة للقياس والتطور.',
    en: 'Turn ideas into real products that can be measured and improved.',
  },
  {
    ar: 'تقديم تجربة احترافية من أول شاشة لحد آخر تفاعل.',
    en: 'Deliver a professional experience from the first screen to the last interaction.',
  },
];

function SectionTitle({
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
  return (
    <main className="relative overflow-hidden px-6 pb-24 pt-32 md:px-10 lg:px-12 lg:pt-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_top_left,_rgba(141,246,200,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(95,180,255,0.12),_transparent_30%)]" />
      <div className="mx-auto max-w-[1380px]">
        <section className="section-shell relative overflow-hidden px-6 py-8 md:px-10 md:py-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start">
            <div className="space-y-8">
              <SectionTitle
                eyebrow="About Me / نبذة عني"
                title="Ahmed Essam Maher Mansour / أحمد عصام ماهر منصور"
                subtitle="Software Developer & Product Designer building modern digital products that feel clear, elegant, and genuinely useful."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Role / الدور</p>
                  <p className="mt-3 text-lg font-semibold text-white">Software Developer & Product Designer</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">مطور برمجيات ومصمم منتجات رقمية</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Education / التعليم</p>
                  <p className="mt-3 text-lg font-semibold text-white">Faculty of Computers and Information</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">قسم علوم الحاسب</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Introduction / المقدمة</p>
                  <div className="mt-5 space-y-4 text-sm leading-8 text-slate-300">
                    <p dir="ltr">
                      Ahmed Essam Maher Mansour is a software developer and digital product designer who blends creative thinking with technical expertise.
                    </p>
                    <p dir="rtl">
                      أنا أحمد عصام ماهر منصور، مطور برمجيات ومصمم منتجات رقمية، وأجمع بين التفكير الإبداعي والمنطق البرمجي لبناء حلول واضحة وقوية وسهلة الاستخدام.
                    </p>
                    <p dir="ltr">
                      He graduated from the Faculty of Computers and Information, Computer Science Department, and continued learning through focused courses in software development and product design.
                    </p>
                    <p dir="rtl">
                      تخرجت من كلية الحاسبات والمعلومات قسم علوم الحاسب، ومع التعلم المستمر والدورات المتخصصة طورت مهارات عملية قوية وشغف حقيقي بالتكنولوجيا.
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">My Mission / رسالتي</p>
                  <div className="mt-5 space-y-4 text-sm leading-8 text-slate-300">
                    <p dir="rtl">
                      هدفي هو بناء حلول رقمية مميزة تساعد الشركات والأفراد على النمو والنجاح في العالم الرقمي، مع الحفاظ على الأداء العالي والوضوح وسهولة الاستخدام.
                    </p>
                    <p dir="ltr">
                      My goal is to build impactful digital solutions that help businesses and individuals grow while keeping performance, clarity, and usability at the center.
                    </p>
                    <p dir="rtl">
                      أؤمن أن التكنولوجيا يجب أن تستخدم بشكل مسؤول لخدمة الناس وحل مشاكلهم الحقيقية، وليس للإضرار بهم.
                    </p>
                    <p dir="ltr">
                      I believe technology should be used responsibly to improve lives and solve real problems, not to create harm.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-[#09090b]/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8df6c8]/70">Quick Profile</p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">Professional identity</h2>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-[#8df6c8]">
                    <GraduationCap className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">What I believe</p>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      Technology should solve real problems, feel humane, and make life easier for the people who use it.
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">How I work</p>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      I combine product thinking, clean UI, and reliable engineering to build complete digital experiences.
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Focus</p>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      Fast, elegant web applications, mobile apps, and digital products that feel polished from end to end.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">What I Do / ما الذي أقدمه</p>
                <div className="mt-5 grid gap-4">
                  {workAreas.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.enTitle} className="rounded-[1.25rem] border border-white/10 bg-black/10 p-4 transition hover:border-[#8df6c8]/30 hover:bg-white/[0.05]">
                        <div className="flex items-start gap-4">
                          <div className="mt-1 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-[#8df6c8]">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-semibold text-white">{item.enTitle}</p>
                            <p className="mt-1 text-sm text-slate-300">{item.enBody}</p>
                            <p className="mt-2 text-sm text-slate-400" dir="rtl">
                              {item.arTitle} — {item.arBody}
                            </p>
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
            <p className="eyebrow">My Philosophy / فلسفتي</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">Meaningful products need clarity, responsibility, and care.</h2>
            <div className="mt-6 grid gap-4">
              {principles.map((principle, index) => (
                <div key={principle.enTitle} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#8df6c8]/25 bg-[#8df6c8]/10 text-sm font-semibold text-[#8df6c8]">
                      0{index + 1}
                    </span>
                    <div className="space-y-3">
                      <p className="text-lg font-semibold text-white">{principle.enTitle}</p>
                      <p className="text-sm leading-7 text-slate-300">{principle.enBody}</p>
                      <p className="text-sm leading-7 text-slate-300" dir="rtl">
                        {principle.arTitle}
                        <span className="block text-slate-400">{principle.arBody}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="section-shell px-6 py-8 md:px-8">
              <p className="eyebrow">My Skills / مهاراتي</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">Tools and skills I use to build polished digital experiences.</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="section-shell px-6 py-8 md:px-8">
              <p className="eyebrow">My Mission / مهمتي</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">Build products that make people feel the value instantly.</h2>
              <div className="mt-6 space-y-4 text-sm leading-8 text-slate-300">
                {missionPoints.map((item) => (
                  <div key={item.en} className="flex gap-4 border-t border-white/10 pt-4">
                    <Rocket className="mt-1 h-5 w-5 shrink-0 text-[#8df6c8]" aria-hidden="true" />
                    <div className="space-y-2">
                      <p>{item.en}</p>
                      <p dir="rtl">{item.ar}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-shell px-6 py-8 md:px-8">
              <p className="eyebrow">Connect With Me / تواصل معي</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">Let's connect and build something valuable.</h2>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <a
                  href="https://www.linkedin.com/in/ahmed-essam-a72274254/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-[#8df6c8]/35 hover:bg-white/[0.08]"
                >
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                  LinkedIn
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="https://drive.google.com/file/d/15m3y3vuWupnndu69JFW6MhayG-AojV0Q/view?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#8df6c8]/25 bg-[#8df6c8]/10 px-5 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#8df6c8]/15"
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  CV
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              <div className="mt-4">
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-medium text-[#8df6c8] transition hover:text-white">
                  Contact Me
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
