import {
  ArrowUpRight,
  Code2,
  FileText,
  Layers3,
  Linkedin,
  PenTool,
  Smartphone,
} from 'lucide-react';

import { Link } from '@/i18n/routing';

export const revalidate = 3600;

const skills = [
  'Flutter',
  'Dart',
  'Next.js',
  'React',
  'TypeScript',
  'UI/UX Design',
  'Product Design',
  'Web Development',
];

const content = {
  ar: {
    eyebrow: 'نبذة عني',
    title: 'أحمد عصام ماهر منصور',
    subtitle:
      'مطور برمجيات ومصمم منتجات رقمية أدمج بين التفكير الإبداعي والخبرة التقنية لبناء منتجات حديثة، واضحة، ومفيدة.',
    roleLabel: 'الدور',
    roleValue: 'مطور برمجيات ومصمم منتجات رقمية',
    educationLabel: 'التعليم',
    educationValue: 'كلية الحاسبات والمعلومات — قسم علوم الحاسب',
    introductionTitle: 'من أنا',
    introductionBody: [
      'أنا أحمد عصام، مطور برمجيات ومصمم منتجات رقمية أدمج التفكير الإبداعي مع المنطق البرمجي لبناء حلول رقمية قوية وسهلة الاستخدام.',
      'تخرجت من كلية الحاسبات والمعلومات، وأكملت رحلتي بتعلم مستمر في تطوير البرمجيات وتصميم منتجات رقمية احترافية.',
      'أهتم ببناء تطبيقات ومواقع بأداء عالٍ، تصميم أنيق، وتجربة مستخدم سلسة تضيف قيمة حقيقية للناس.',
    ],
    workTitle: 'ما الذي أقدمه',
    workAreas: [
      {
        icon: Code2,
        title: 'تطبيقات الويب',
        body: 'تطبيقات ويب سريعة، واضحة، وقابلة للتوسع.',
      },
      {
        icon: Smartphone,
        title: 'تطبيقات الموبايل',
        body: 'تطبيقات موبايل عملية وسهلة الاستخدام.',
      },
      {
        icon: PenTool,
        title: 'تصميم UX / UI',
        body: 'واجهات وتجارب استخدام تجمع الجمال بالوضوح.',
      },
      {
        icon: Layers3,
        title: 'المنتجات الرقمية',
        body: 'منتجات رقمية متكاملة تساعد الشركات على النمو.',
      },
    ],
    philosophyTitle: 'فلسفتي',
    philosophyPoints: [
      {
        number: '01',
        title: 'التكنولوجيا يجب أن تكون مفيدة قبل أن تكون مبهرة',
        body: 'قيمة المنتج الحقيقية تظهر عندما يحل مشكلة واضحة ويوفر وقت المستخدم.',
      },
      {
        number: '02',
        title: 'التصميم والكود يعملان معًا',
        body: 'أفضل النتائج تأتي عندما تكون الواجهة والأداء جزءاً من نفس الفكرة من البداية.',
      },
      {
        number: '03',
        title: 'المسؤولية جزء أساسي من بناء المنتجات',
        body: 'التكنولوجيا يجب أن تساعد الناس، لا أن تسبب تعقيداً غير ضروري.',
      },
    ],
    skillsTitle: 'المهارات',
    connectTitle: 'تواصل معي',
    connectSubtitle: 'يسعدني التواصل إذا كنت تبحث عن بناء منتج رقمي احترافي.',
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
    educationValue: 'Faculty of Computers and Information — Computer Science',
    introductionTitle: 'Who I Am',
    introductionBody: [
      'I am Ahmed Essam, a software developer and product designer who blends creative thinking with programming logic to build strong and user-friendly digital products.',
      'I graduated from the Faculty of Computers and Information and continued learning through focused courses in software development and digital product design.',
      'I focus on building applications and websites with high performance, elegant design, and a smooth user experience that creates real value for people.',
    ],
    workTitle: 'What I Do',
    workAreas: [
      {
        icon: Code2,
        title: 'Web Applications',
        body: 'Fast, clear, and scalable web applications.',
      },
      {
        icon: Smartphone,
        title: 'Mobile Applications',
        body: 'Practical, user-friendly mobile apps.',
      },
      {
        icon: PenTool,
        title: 'UX / UI Design',
        body: 'Interfaces that balance beauty, clarity, and usability.',
      },
      {
        icon: Layers3,
        title: 'Digital Products',
        body: 'Complete digital products that help businesses grow.',
      },
    ],
    philosophyTitle: 'My Philosophy',
    philosophyPoints: [
      {
        number: '01',
        title: 'Technology should be useful before it is impressive',
        body: "A product's real value shows when it solves a clear problem and saves user time.",
      },
      {
        number: '02',
        title: 'Design and code work together',
        body: 'The best results come when interface and performance are part of one unified idea.',
      },
      {
        number: '03',
        title: 'Responsibility is part of product building',
        body: 'Technology should help people and improve lives, not create unnecessary complexity.',
      },
    ],
    skillsTitle: 'Skills',
    connectTitle: 'Connect With Me',
    connectSubtitle: 'Always open to meaningful conversations about product, design, and development.',
    linkedinLabel: 'LinkedIn',
    cvLabel: 'CV',
    contactLabel: 'Contact Me',
  },
} as const;

export default function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  return <AboutPageContent params={params} />;
}

async function AboutPageContent({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  const page = isArabic ? content.ar : content.en;
  const dir = isArabic ? 'rtl' : 'ltr';
  const alignClass = isArabic ? 'text-right items-end' : 'text-left';

  return (
    <main dir={dir} className="relative overflow-hidden px-6 pb-32 pt-32 md:px-10 lg:px-12 lg:pt-40">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(ellipse_at_top,_rgba(141,246,200,0.10),_transparent_60%)]" />

      <div className="mx-auto max-w-[900px] space-y-24">

        {/* ─── Hero ─── */}
        <section className={`w-full space-y-6 ${alignClass}`}>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1 className={`text-4xl font-semibold text-white sm:text-5xl lg:text-6xl ${isArabic ? 'leading-tight' : 'tracking-[-0.05em] leading-tight'}`}>
            {page.title}
          </h1>
          <p className={`max-w-2xl text-lg leading-8 text-slate-400 ${isArabic ? 'ml-auto' : ''}`}>{page.subtitle}</p>

          {/* Quick stats */}
          <div className={`flex flex-wrap gap-4 pt-2 ${isArabic ? 'justify-end' : ''}`}>
            <div className={`rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 ${isArabic ? 'text-right' : ''}`}>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{page.roleLabel}</p>
              <p className="mt-1 text-sm font-medium text-white">{page.roleValue}</p>
            </div>
            <div className={`rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 ${isArabic ? 'text-right' : ''}`}>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{page.educationLabel}</p>
              <p className="mt-1 text-sm font-medium text-white">{page.educationValue}</p>
            </div>
          </div>
        </section>

        {/* ─── Introduction ─── */}
        <section className={`w-full space-y-5 ${alignClass}`}>
          <p className="eyebrow">{page.introductionTitle}</p>
          <div className="space-y-4">
            {page.introductionBody.map((paragraph, i) => (
              <p key={i} className="text-base leading-8 text-slate-300 sm:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* ─── What I Do ─── */}
        <section className={`w-full space-y-6 ${alignClass}`}>
          <p className="eyebrow">{page.workTitle}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {page.workAreas.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#8df6c8]/30 hover:bg-white/[0.05] ${isArabic ? 'text-right' : ''}`}
                >
                  <div className={`flex items-start gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="shrink-0 rounded-xl border border-white/10 bg-white/[0.05] p-3 text-[#8df6c8] transition group-hover:bg-[#8df6c8]/10">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{item.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── Philosophy ─── */}
        <section className={`w-full space-y-6 ${alignClass}`}>
          <p className="eyebrow">{page.philosophyTitle}</p>
          <div className={`space-y-4 ${isArabic ? 'text-right' : ''}`}>
            {page.philosophyPoints.map((point) => (
              <div key={point.number} className={`flex gap-5 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="mt-1 shrink-0 text-2xl font-bold tabular-nums text-white/10 select-none">
                  {point.number}
                </span>
                <div className="flex-1 border-t border-white/10 pt-4">
                  <p className="font-semibold text-white">{point.title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{point.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Skills ─── */}
        <section className={`w-full space-y-5 ${alignClass}`}>
          <p className="eyebrow">{page.skillsTitle}</p>
          <div className={`flex flex-wrap gap-2.5 ${isArabic ? 'justify-end' : ''}`}>
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-[#8df6c8]/30 hover:text-white"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* ─── Connect ─── */}
        <section className={`w-full space-y-5 ${alignClass}`}>
          <p className="eyebrow">{page.connectTitle}</p>
          <p className={`text-base leading-8 text-slate-400 ${isArabic ? 'ml-auto max-w-2xl' : ''}`}>{page.connectSubtitle}</p>
          <div className={`flex flex-wrap gap-3 ${isArabic ? 'justify-end' : ''}`}>
            <a
              href="https://www.linkedin.com/in/ahmed-essam-a72274254/"
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-[#8df6c8]/35 hover:bg-white/[0.08] ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              {page.linkedinLabel}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="https://drive.google.com/file/d/15m3y3vuWupnndu69JFW6MhayG-AojV0Q/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border border-[#8df6c6]/25 bg-[#8df6c8]/10 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#8df6c8]/15 ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              {page.cvLabel}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link
              href="/contact"
              className={`inline-flex items-center gap-2 rounded-full border border-transparent px-5 py-3 text-sm font-medium text-[#8df6c8] transition hover:text-white ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              {page.contactLabel}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
