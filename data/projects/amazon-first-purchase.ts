import type { LocalProject } from './local-projects';

export const amazonFirstPurchase: LocalProject = {
  slug: 'amazon-first-purchase',
  projectType: 'ux_research',
  titleEn: 'Independent UX Research Case Study: First-Time Purchase Experience on Amazon',
  titleAr: 'دراسة مستقلة في أبحاث تجربة المستخدم: تجربة الشراء لأول مرة من أمازون',
  descriptionEn: 'An independent UX research case study analyzing the first-time purchase flow on Amazon and identifying opportunities for a smoother checkout experience.',
  descriptionAr: 'دراسة حالة مستقلة في أبحاث تجربة المستخدم لتحليل مسار الشراء لأول مرة على أمازون وتحديد فرص تحسين تجربة الدفع.',
  impactEn: 'Identified 5 key usability issues and provided actionable, accessible design recommendations.',
  impactAr: 'تحديد 5 مشكلات رئيسية في قابلية الاستخدام وتقديم توصيات تصميمية قابلة للتنفيذ.',
  year: '2024',
  thumbnailUrl: undefined, // Add a placeholder or leave undefined
  blocks: [
    {
      id: 'hero-1',
      type: 'hero',
      contentEn: {
        title: 'Independent UX Research Case Study: First-Time Purchase Experience on Amazon',
        subtitle: 'Analyzing the onboarding and checkout flow for new users.',
        tags: ['UX Research', 'Usability Study', 'Accessibility', 'E-commerce'],
        overview: 'This case study explores the friction points a first-time user encounters while trying to make a purchase on Amazon, focusing on usability, clarity, and trust signals.',
        metadata: [
          { label: 'Research Type', value: 'Usability Study' },
          { label: 'Participants', value: '5 First-time users' },
          { label: 'Platform', value: 'Amazon Web / Mobile' },
          { label: 'Focus', value: 'First-time checkout' }
        ],
        disclaimer: 'This is an independent UX research case study created for learning and portfolio purposes. It is not affiliated with, sponsored by, or officially connected to Amazon.'
      },
      contentAr: {
        title: 'دراسة مستقلة في أبحاث تجربة المستخدم: تجربة الشراء لأول مرة من أمازون',
        subtitle: 'تحليل مسار التسجيل والدفع للمستخدمين الجدد.',
        tags: ['أبحاث تجربة المستخدم', 'دراسة قابلية الاستخدام', 'إمكانية الوصول', 'التجارة الإلكترونية'],
        overview: 'تستكشف هذه الدراسة نقاط الاحتكاك التي يواجهها المستخدم عند محاولة الشراء لأول مرة من أمازون، مع التركيز على سهولة الاستخدام، الوضوح، وعلامات الثقة.',
        metadata: [
          { label: 'نوع البحث', value: 'دراسة قابلية الاستخدام' },
          { label: 'المشاركين', value: '5 مستخدمين جدد' },
          { label: 'المنصة', value: 'أمازون (ويب وموبايل)' },
          { label: 'التركيز', value: 'أول عملية شراء' }
        ],
        disclaimer: 'هذه دراسة مستقلة في أبحاث تجربة المستخدم لأغراض تعليمية وعرض الأعمال، وليست تابعة أو مدعومة رسميًا من أمازون.'
      }
    },
    {
      id: 'text-problem',
      type: 'text',
      contentEn: {
        heading: 'Problem Statement',
        paragraphs: [
          'While Amazon is a giant in e-commerce, the first-time user experience can be overwhelming due to the sheer volume of information, upsells, and navigational choices.',
          'The goal of this research was to observe real users attempting to find a specific item, add it to their cart, and complete the checkout process without prior experience on the platform.'
        ]
      },
      contentAr: {
        heading: 'المشكلة',
        paragraphs: [
          'رغم أن أمازون عملاق في التجارة الإلكترونية، إلا أن تجربة المستخدم لأول مرة قد تكون مربكة بسبب كثرة المعلومات، عروض البيع الإضافية، وخيارات التصفح المتعددة.',
          'كان الهدف من هذا البحث هو مراقبة مستخدمين حقيقيين أثناء محاولتهم البحث عن منتج معين، إضافته لعربة التسوق، وإتمام عملية الدفع بدون خبرة سابقة على المنصة.'
        ]
      }
    },
    {
      id: 'timeline-methodology',
      type: 'timeline',
      contentEn: {
        heading: 'Methodology & Process',
        steps: [
          { title: 'Define Objectives', description: 'Established clear research goals and KPIs (Time on task, Error rate).' },
          { title: 'Recruitment', description: 'Selected 5 participants who rarely or never shop online.' },
          { title: 'Moderated Testing', description: 'Conducted 1-on-1 remote usability sessions using think-aloud protocol.' },
          { title: 'Synthesis', description: 'Affinity mapping and identifying recurring pain points.' }
        ]
      },
      contentAr: {
        heading: 'المنهجية وخطوات البحث',
        steps: [
          { title: 'تحديد الأهداف', description: 'وضع أهداف بحث واضحة ومؤشرات أداء رئيسية (الوقت المستغرق، معدل الخطأ).' },
          { title: 'اختيار المشاركين', description: 'اختيار 5 مشاركين نادراً ما يتسوقون عبر الإنترنت أو لم يتسوقوا من قبل.' },
          { title: 'الاختبار الموجه', description: 'إجراء جلسات اختبار عن بعد باستخدام بروتوكول التفكير بصوت عالٍ.' },
          { title: 'التحليل', description: 'رسم خرائط التقارب وتحديد نقاط الألم المتكررة.' }
        ]
      }
    },
    {
      id: 'cards-findings',
      type: 'cards',
      contentEn: {
        heading: 'Key Findings & Insights',
        cards: [
          { title: 'Information Overload', description: 'Users felt overwhelmed by the amount of text and banners on the product page.' },
          { title: 'Hidden Shipping Costs', description: '3 out of 5 users were surprised by shipping fees added late in the checkout.' },
          { title: 'Account Creation Friction', description: 'Forced account creation interrupted the buying momentum.' }
        ]
      },
      contentAr: {
        heading: 'أهم النتائج والرؤى',
        cards: [
          { title: 'العبء المعرفي', description: 'شعر المستخدمون بالإرهاق بسبب كثرة النصوص واللافتات في صفحة المنتج.' },
          { title: 'تكاليف الشحن المخفية', description: '3 من أصل 5 مستخدمين تفاجأوا برسوم الشحن التي تمت إضافتها متأخراً في الدفع.' },
          { title: 'عقبة إنشاء الحساب', description: 'إنشاء الحساب الإجباري قاطع حماس الشراء لدى المستخدمين.' }
        ]
      }
    },
    {
      id: 'quote-1',
      type: 'quote',
      contentEn: {
        quote: "I just wanted to buy the book, but I had to skip through three screens asking me to join Prime.",
        author: "Participant 2"
      },
      contentAr: {
        quote: "كنت عايز أشتري الكتاب بس، لكن اضطريت أتخطى 3 شاشات بتطلب مني أشترك في برايم.",
        author: "المشارك رقم 2"
      }
    },
    {
      id: 'cards-recommendations',
      type: 'cards',
      contentEn: {
        heading: 'UX Recommendations',
        cards: [
          { title: 'Guest Checkout', description: 'Allow users to complete their first purchase as a guest to reduce friction.' },
          { title: 'Clear Cost Breakdown', description: 'Display estimated shipping costs upfront on the product page.' },
          { title: 'Simplify the Buy Box', description: 'Declutter the right sidebar to focus purely on the primary CTA.' }
        ]
      },
      contentAr: {
        heading: 'توصيات تجربة المستخدم',
        cards: [
          { title: 'الشراء كزائر', description: 'السماح للمستخدمين بإتمام عملية الشراء الأولى كزائر لتقليل الاحتكاك.' },
          { title: 'توضيح التكاليف', description: 'عرض التكلفة التقديرية للشحن بوضوح في صفحة المنتج.' },
          { title: 'تبسيط صندوق الشراء', description: 'تقليل الفوضى البصرية في الشريط الجانبي للتركيز على زر الشراء الرئيسي.' }
        ]
      }
    }
  ]
};
