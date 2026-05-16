import type { LocalProject } from './local-projects';

export const amazonFirstPurchase: LocalProject = {
  slug: 'amazon-first-purchase',
  projectType: 'ux_research',
  titleEn: 'Independent UX Research Case Study: First-Time Purchase Experience on Amazon',
  titleAr: 'دراسة مستقلة في أبحاث تجربة المستخدم: تجربة الشراء لأول مرة من أمازون',
  descriptionEn: 'An independent UX research case study exploring the friction points a first-time user encounters while trying to make a purchase on Amazon.',
  descriptionAr: 'دراسة حالة مستقلة في أبحاث تجربة المستخدم تستكشف نقاط الاحتكاك التي يواجهها المستخدم الجديد عند محاولة الشراء من أمازون.',
  impactEn: 'Identified key usability issues and provided actionable, accessible design recommendations.',
  impactAr: 'تحديد المشكلات الرئيسية في قابلية الاستخدام وتقديم توصيات تصميمية عملية.',
  year: '2026',
  thumbnailUrl: '/image-amazon.png',
  blocks: [
    {
      id: 'hero',
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
        link: {
          url: 'https://drive.google.com/file/d/1wflwwjmUNH0JOrvohOgZEAF-Ek0RChVY/view?usp=sharing',
          label: 'View Full Report (Drive)'
        },
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
        link: {
          url: 'https://drive.google.com/file/d/1wflwwjmUNH0JOrvohOgZEAF-Ek0RChVY/view?usp=sharing',
          label: 'عرض التقرير الكامل (Drive)'
        },
        disclaimer: 'هذه دراسة مستقلة في أبحاث تجربة المستخدم لأغراض تعليمية وعرض الأعمال، وليست تابعة أو مدعومة رسميًا من أمازون.'
      }
    },
    {
      id: 'cover-image',
      type: 'image',
      contentEn: {
        src: '/image-amazon.png',
        alt: 'Amazon UX Research Case Study Cover'
      },
      contentAr: {
        src: '/image-amazon.png',
        alt: 'غلاف دراسة تجربة المستخدم لأمازون'
      }
    },
    {
      id: 'background',
      type: 'text',
      contentEn: {
        heading: 'Project Background',
        paragraphs: [
          'First-time users may face confusion when searching, comparing products, understanding reviews, delivery details, return policy, and reaching checkout. This research was needed to uncover these initial barriers.'
        ]
      },
      contentAr: {
        heading: 'خلفية المشروع',
        paragraphs: [
          'قد يواجه المستخدمون الجدد ارتباكاً عند البحث، مقارنة المنتجات، فهم التقييمات، تفاصيل التوصيل، سياسة الإرجاع، والوصول إلى صفحة الدفع. كان هذا البحث ضرورياً لكشف هذه العوائق الأولية.'
        ]
      }
    },
    {
      id: 'problem',
      type: 'text',
      contentEn: {
        heading: 'Problem Statement',
        paragraphs: [
          'First-time users may struggle to complete their first purchase confidently because the buying journey includes too many decisions and trust-related information.'
        ]
      },
      contentAr: {
        heading: 'المشكلة',
        paragraphs: [
          'قد يواجه المستخدمون الجدد صعوبة في إتمام أول عملية شراء بثقة لأن مسار الشراء يتضمن الكثير من القرارات والمعلومات المتعلقة بالثقة.'
        ]
      }
    },
    {
      id: 'goal',
      type: 'text',
      contentEn: {
        heading: 'Research Goal',
        paragraphs: [
          'To understand how first-time users experience their first purchase journey and identify opportunities to improve clarity, trust, confidence, and accessibility.'
        ]
      },
      contentAr: {
        heading: 'الهدف من البحث',
        paragraphs: [
          'فهم كيفية تجربة المستخدمين الجدد لرحلة الشراء الأولى، وتحديد فرص تحسين الوضوح، الثقة، ومستوى إمكانية الوصول.'
        ]
      }
    },
    {
      id: 'objectives',
      type: 'list',
      contentEn: {
        heading: 'Research Objectives',
        items: [
          'Understand how users search for a product.',
          'Observe how users compare products.',
          'Identify hesitation and confusion points.',
          'Evaluate whether reviews, delivery, and return policy are clear.',
          'Check if users can reach checkout easily.',
          'Identify accessibility issues.',
          'Provide practical UX recommendations.'
        ]
      },
      contentAr: {
        heading: 'أهداف البحث التفصيلية',
        items: [
          'فهم كيف يبحث المستخدمون عن منتج.',
          'ملاحظة كيف يقارن المستخدمون بين المنتجات.',
          'تحديد نقاط التردد والارتباك.',
          'تقييم ما إذا كانت التقييمات والتوصيل وسياسة الإرجاع واضحة.',
          'التحقق مما إذا كان يمكن للمستخدمين الوصول إلى الدفع بسهولة.',
          'تحديد مشكلات إمكانية الوصول.',
          'تقديم توصيات عملية لتحسين تجربة المستخدم.'
        ]
      }
    },
    {
      id: 'questions',
      type: 'list',
      contentEn: {
        heading: 'Research Questions',
        items: [
          'Can first-time users find a suitable product without help?',
          'Where do users hesitate?',
          'What information helps users trust a product?',
          'Do users understand ratings and reviews?',
          'Is delivery and return information clear?',
          'Can users add a product to cart and reach checkout easily?',
          'Are there accessibility barriers?'
        ]
      },
      contentAr: {
        heading: 'أسئلة البحث',
        items: [
          'هل يمكن للمستخدمين الجدد العثور على منتج مناسب دون مساعدة؟',
          'أين يتردد المستخدمون؟',
          'ما هي المعلومات التي تساعد المستخدم على الوثوق بالمنتج؟',
          'هل يفهم المستخدمون التقييمات والمراجعات؟',
          'هل معلومات التوصيل والإرجاع واضحة؟',
          'هل يمكن للمستخدمين إضافة منتج للعربة والوصول للدفع بسهولة؟',
          'هل هناك عوائق تتعلق بإمكانية الوصول؟'
        ]
      }
    },
    {
      id: 'kpis',
      type: 'cards',
      contentEn: {
        heading: 'KPIs and Success Metrics',
        cards: [
          { title: 'Time on Task', description: 'Measuring how long it takes to find a product and reach checkout.' },
          { title: 'Task Completion Rate', description: 'The percentage of users who successfully add an item to their cart.' },
          { title: 'User Error Rate', description: 'Tracking misclicks or wrong navigation paths.' },
          { title: 'Hesitation Points', description: 'Moments where users pause or express confusion.' },
          { title: 'Ease-of-Use Rating', description: 'Subjective rating given by users post-task.' },
          { title: 'Accessibility Observations', description: 'Noting difficulties with labels, contrast, or structure.' }
        ]
      },
      contentAr: {
        heading: 'مؤشرات الأداء الرئيسية ومقاييس النجاح',
        cards: [
          { title: 'الوقت المستغرق', description: 'قياس المدة المستغرقة للعثور على المنتج والوصول للدفع.' },
          { title: 'معدل إنجاز المهمة', description: 'نسبة المستخدمين الذين تمكنوا من إضافة منتج للعربة بنجاح.' },
          { title: 'معدل أخطاء المستخدم', description: 'تتبع النقرات الخاطئة أو مسارات التصفح غير الصحيحة.' },
          { title: 'نقاط التردد', description: 'اللحظات التي يتوقف فيها المستخدمون أو يعبرون عن حيرتهم.' },
          { title: 'تقييم سهولة الاستخدام', description: 'تقييم شخصي يعطيه المستخدم بعد انتهاء المهمة.' },
          { title: 'ملاحظات إمكانية الوصول', description: 'تدوين أي صعوبات في قراءة النصوص أو التباين اللوني.' }
        ]
      }
    },
    {
      id: 'methodology',
      type: 'list',
      contentEn: {
        heading: 'Methodology',
        items: [
          'Moderated remote usability study',
          '5 participants',
          '30–45 minutes per session',
          'Think-aloud method',
          'Observation notes',
          'Post-task questions'
        ]
      },
      contentAr: {
        heading: 'المنهجية',
        items: [
          'دراسة قابلية استخدام موجهة عن بُعد',
          '5 مشاركين',
          '30-45 دقيقة لكل جلسة',
          'التفكير بصوت عالٍ',
          'ملاحظات المراقبة',
          'أسئلة بعد المهمة'
        ]
      }
    },
    {
      id: 'participants',
      type: 'participants',
      contentEn: {
        heading: 'Participants',
        profiles: [
          { name: 'Omar', age: '35', details: ['Rarely shops online', 'First time on Amazon', 'Slight visual difficulty (uses large text)'] },
          { name: 'Mohamed', age: '42', details: ['Prefers physical stores', 'No Amazon experience', 'Hesitant with online payments'] },
          { name: 'Ahmed', age: '28', details: ['Shops locally', 'Never used Amazon', 'Tech-savvy but overwhelmed by options'] },
          { name: 'Mona', age: '50', details: ['Needs assistance to shop online', 'First time on Amazon', 'Relies heavily on reviews'] },
          { name: 'Rana', age: '31', details: ['Shops occasionally on social media', 'Never used Amazon', 'Price-conscious'] }
        ]
      },
      contentAr: {
        heading: 'المشاركين',
        profiles: [
          { name: 'عمر', age: '35', details: ['نادراً ما يتسوق عبر الإنترنت', 'أول مرة على أمازون', 'صعوبة بصرية طفيفة (يستخدم نص كبير)'] },
          { name: 'محمد', age: '42', details: ['يفضل المتاجر الفعلية', 'لا توجد خبرة مع أمازون', 'متردد في الدفع الإلكتروني'] },
          { name: 'أحمد', age: '28', details: ['يتسوق محلياً', 'لم يستخدم أمازون أبداً', 'ذكي تقنياً لكن مرتبك من الخيارات'] },
          { name: 'منى', age: '50', details: ['تحتاج لمساعدة للتسوق', 'أول مرة على أمازون', 'تعتمد بشدة على التقييمات'] },
          { name: 'رنا', age: '31', details: ['تتسوق أحياناً عبر السوشيال ميديا', 'لم تستخدم أمازون أبداً', 'تهتم بالسعر'] }
        ]
      }
    },
    {
      id: 'accessibility',
      type: 'list',
      contentEn: {
        heading: 'Accessibility Considerations',
        items: [
          'Visual difficulty (contrast and text size)',
          'Screen reader support',
          'Keyboard navigation',
          'Clear labels on buttons',
          'Readable text paragraphs',
          'Strong color contrast',
          'Simple page structure'
        ]
      },
      contentAr: {
        heading: 'اعتبارات إمكانية الوصول',
        items: [
          'الصعوبات البصرية (التباين وحجم النص)',
          'دعم قارئات الشاشة',
          'التنقل باستخدام لوحة المفاتيح',
          'تسميات واضحة للأزرار',
          'نصوص قابلة للقراءة',
          'تباين لوني قوي',
          'هيكلية صفحة بسيطة'
        ]
      }
    },
    {
      id: 'scenario',
      type: 'text',
      contentEn: {
        heading: 'User Task / Scenario',
        paragraphs: [
          'The participant wants to buy a Bluetooth headset for daily use. They need to search, compare products, choose one product they trust, add it to the cart, and stop before payment.'
        ]
      },
      contentAr: {
        heading: 'مهمة المستخدم / السيناريو',
        paragraphs: [
          'يرغب المشارك في شراء سماعة بلوتوث للاستخدام اليومي. يحتاج للبحث، مقارنة المنتجات، اختيار منتج يثق به، إضافته إلى العربة، والتوقف قبل إتمام الدفع.'
        ]
      }
    },
    {
      id: 'usability-tasks',
      type: 'timeline',
      contentEn: {
        heading: 'Usability Tasks',
        steps: [
          { title: 'Open Amazon', description: 'Navigate to the Amazon website or app.' },
          { title: 'Search', description: 'Search for a Bluetooth headset.' },
          { title: 'Filter', description: 'Use filters or sorting if needed.' },
          { title: 'Explore', description: 'Open product pages.' },
          { title: 'Compare', description: 'Compare at least two products.' },
          { title: 'Decide', description: 'Choose a trusted product.' },
          { title: 'Add to Cart', description: 'Add the selected item to the cart.' },
          { title: 'Checkout', description: 'Continue to checkout.' },
          { title: 'Stop', description: 'Stop before payment.' },
          { title: 'Feedback', description: 'Share feedback about the experience.' }
        ]
      },
      contentAr: {
        heading: 'مهام قابلية الاستخدام',
        steps: [
          { title: 'فتح أمازون', description: 'الذهاب إلى موقع أو تطبيق أمازون.' },
          { title: 'البحث', description: 'البحث عن سماعة بلوتوث.' },
          { title: 'التصفية', description: 'استخدام الفلاتر أو الترتيب عند الحاجة.' },
          { title: 'الاستكشاف', description: 'فتح صفحات المنتجات.' },
          { title: 'المقارنة', description: 'مقارنة منتجين على الأقل.' },
          { title: 'القرار', description: 'اختيار منتج موثوق.' },
          { title: 'إضافة للعربة', description: 'إضافة المنتج المختار للعربة.' },
          { title: 'متابعة الدفع', description: 'المتابعة لصفحة الدفع.' },
          { title: 'التوقف', description: 'التوقف قبل خطوة الدفع.' },
          { title: 'الملاحظات', description: 'مشاركة الملاحظات حول التجربة.' }
        ]
      }
    },
    {
      id: 'script',
      type: 'quote',
      contentEn: {
        quote: "Today, we are testing the shopping experience, not testing you. There are no right or wrong answers. Please use the website naturally and share your thoughts honestly.",
        author: "Study Introduction Script"
      },
      contentAr: {
        quote: "اليوم إحنا بنختبر تجربة التسوق، مش بنختبرك أنت. مفيش إجابة صح أو غلط. ياريت تستخدم الموقع بشكل طبيعي وتشاركنا أفكارك بصراحة.",
        author: "نص مقدمة الدراسة"
      }
    },
    {
      id: 'post-task-questions',
      type: 'list',
      contentEn: {
        heading: 'Post-Task Questions',
        items: [
          'How did you feel during the shopping journey?',
          'Was it easy to find a suitable product?',
          'What helped you choose a product?',
          'Was anything confusing?',
          'Did you trust the reviews and ratings?',
          'Was delivery and return information clear?',
          'Did you feel confident before checkout?',
          'What would you improve?'
        ]
      },
      contentAr: {
        heading: 'أسئلة بعد الانتهاء من المهمة',
        items: [
          'بماذا شعرت خلال رحلة التسوق؟',
          'هل كان من السهل العثور على منتج مناسب؟',
          'ما الذي ساعدك في اختيار المنتج؟',
          'هل كان هناك أي شيء محير؟',
          'هل وثقت بالتقييمات والمراجعات؟',
          'هل كانت معلومات التوصيل والإرجاع واضحة؟',
          'هل شعرت بالثقة قبل إتمام الدفع؟',
          'ما الذي تقترح تحسينه؟'
        ]
      }
    },
    {
      id: 'privacy',
      type: 'list',
      contentEn: {
        heading: 'Data Privacy and Ethics',
        items: [
          'Participant data is anonymized.',
          'No sensitive personal data is collected.',
          'Participants can withdraw at any time.',
          'Feedback is used only for this case study.',
          'Data is stored securely and deleted after the study.'
        ]
      },
      contentAr: {
        heading: 'خصوصية البيانات والأخلاقيات',
        items: [
          'بيانات المشاركين مجهولة المصدر.',
          'لا يتم جمع بيانات شخصية حساسة.',
          'يمكن للمشاركين الانسحاب في أي وقت.',
          'التعليقات تُستخدم فقط لهذه الدراسة.',
          'البيانات محفوظة بأمان وسيتم حذفها بعد الدراسة.'
        ]
      }
    },
    {
      id: 'focus',
      type: 'list',
      contentEn: {
        heading: 'Research Focus Areas',
        items: [
          'Product search',
          'Filters and sorting',
          'Product comparison',
          'Reviews and ratings',
          'Trust signals',
          'Delivery clarity',
          'Return policy',
          'Cart and checkout',
          'Accessibility'
        ]
      },
      contentAr: {
        heading: 'مجالات تركيز البحث',
        items: [
          'البحث عن المنتجات',
          'الفلاتر والترتيب',
          'مقارنة المنتجات',
          'التقييمات والمراجعات',
          'علامات الثقة',
          'وضوح معلومات التوصيل',
          'سياسة الإرجاع',
          'عربة التسوق والدفع',
          'إمكانية الوصول'
        ]
      }
    },
    {
      id: 'findings',
      type: 'cards',
      contentEn: {
        heading: 'Key Findings',
        cards: [
          { title: 'Hesitation', description: 'Users hesitated when comparing similar products.' },
          { title: 'Reviews', description: 'Reviews were helpful but sometimes hard to judge.' },
          { title: 'Policies', description: 'Delivery and return details were not always noticed early.' },
          { title: 'Overwhelm', description: 'Too many options slowed decision-making.' },
          { title: 'Accessibility', description: 'Accessibility improvements could make the journey easier.' }
        ]
      },
      contentAr: {
        heading: 'أهم النتائج',
        cards: [
          { title: 'التردد', description: 'تردد المستخدمون عند مقارنة منتجات متشابهة.' },
          { title: 'المراجعات', description: 'التقييمات كانت مفيدة لكن يصعب الحكم عليها أحياناً.' },
          { title: 'السياسات', description: 'تفاصيل التوصيل والإرجاع لم تكن ملحوظة دائماً في وقت مبكر.' },
          { title: 'التشتت', description: 'الخيارات الكثيرة أبطأت عملية اتخاذ القرار.' },
          { title: 'إمكانية الوصول', description: 'تحسين إمكانية الوصول يمكن أن يجعل الرحلة أسهل.' }
        ]
      }
    },
    {
      id: 'insights',
      type: 'cards',
      contentEn: {
        heading: 'Key Insights',
        cards: [
          { title: 'Confidence Needed', description: 'First-time users need confidence, not just many options.' },
          { title: 'Trust is Key', description: 'Trust is a crucial part of the first purchase journey.' },
          { title: 'Organize Info', description: 'Too much information can slow decision-making if not organized well.' },
          { title: 'Universal Benefit', description: 'Accessibility improvements help all users, not only users with disabilities.' }
        ]
      },
      contentAr: {
        heading: 'أهم الرؤى',
        cards: [
          { title: 'الحاجة للثقة', description: 'المستخدمون الجدد يحتاجون للثقة، ليس فقط لخيارات كثيرة.' },
          { title: 'الثقة أساسية', description: 'الثقة جزء حاسم من رحلة الشراء الأولى.' },
          { title: 'تنظيم المعلومات', description: 'المعلومات الكثيرة قد تبطئ اتخاذ القرار إذا لم تكن منظمة.' },
          { title: 'فائدة للجميع', description: 'تحسين إمكانية الوصول يساعد جميع المستخدمين، وليس فقط ذوي الإعاقة.' }
        ]
      }
    },
    {
      id: 'recommendations',
      type: 'cards',
      contentEn: {
        heading: 'UX Recommendations',
        cards: [
          { title: 'Quick Summary', description: 'Add a Quick Product Summary section.' },
          { title: 'Better Comparison', description: 'Improve the product comparison experience.' },
          { title: 'Visible Policies', description: 'Make delivery and return information more visible.' },
          { title: 'Simple Filters', description: 'Simplify filters for first-time users.' },
          { title: 'Accessibility', description: 'Improve accessibility labels, contrast, and keyboard navigation.' },
          { title: 'Confidence Signals', description: 'Add confidence signals near the Add to Cart button.' }
        ]
      },
      contentAr: {
        heading: 'توصيات تجربة المستخدم',
        cards: [
          { title: 'ملخص سريع', description: 'إضافة قسم ملخص سريع للمنتج.' },
          { title: 'مقارنة أفضل', description: 'تحسين تجربة مقارنة المنتجات.' },
          { title: 'سياسات واضحة', description: 'جعل معلومات التوصيل والإرجاع أكثر وضوحاً.' },
          { title: 'فلاتر مبسطة', description: 'تبسيط الفلاتر للمستخدمين الجدد.' },
          { title: 'إمكانية الوصول', description: 'تحسين التسميات التوضيحية، التباين، والتنقل بلوحة المفاتيح.' },
          { title: 'إشارات الثقة', description: 'إضافة إشارات ثقة بالقرب من زر إضافة للعربة.' }
        ]
      }
    },
    {
      id: 'design-improvement',
      type: 'cards',
      contentEn: {
        heading: 'Suggested Design Improvement: First-Time Buyer Confidence Component',
        cards: [
          { title: 'Rating Summary', description: 'Clear aggregate of reviews.' },
          { title: 'Delivery Estimate', description: 'Upfront delivery dates.' },
          { title: 'Return Policy', description: 'Simple explanation of returns.' },
          { title: 'Seller Reliability', description: 'Badge or score for seller trust.' },
          { title: 'Pros/Cons', description: 'Common positive and negative feedback.' },
          { title: 'Secure Checkout', description: 'Message reassuring safe payment.' }
        ]
      },
      contentAr: {
        heading: 'التحسين التصميمي المقترح: وحدة تعزيز ثقة المشتري الجديد',
        cards: [
          { title: 'ملخص التقييمات', description: 'تجميع واضح للمراجعات.' },
          { title: 'توقع التوصيل', description: 'مواعيد التوصيل بشكل مبكر.' },
          { title: 'سياسة الإرجاع', description: 'شرح مبسط لكيفية الإرجاع.' },
          { title: 'موثوقية البائع', description: 'شارة أو نقاط تثبت ثقة البائع.' },
          { title: 'المميزات والعيوب', description: 'أبرز الآراء الإيجابية والسلبية.' },
          { title: 'دفع آمن', description: 'رسالة تطمئن المستخدم بسلامة الدفع.' }
        ]
      }
    },
    {
      id: 'impact',
      type: 'list',
      contentEn: {
        heading: 'Expected Impact',
        items: [
          'Reduce hesitation',
          'Improve trust',
          'Make comparison easier',
          'Support accessibility',
          'Improve checkout confidence',
          'Reduce drop-off'
        ]
      },
      contentAr: {
        heading: 'الأثر المتوقع',
        items: [
          'تقليل التردد',
          'تحسين الثقة',
          'تسهيل المقارنة',
          'دعم إمكانية الوصول',
          'تحسين الثقة في الدفع',
          'تقليل نسبة التخلي عن الشراء'
        ]
      }
    },

    {
      id: 'conclusion',
      type: 'text',
      contentEn: {
        heading: 'Final Conclusion',
        paragraphs: [
          'The first-time purchase experience is not only about completing a transaction. It is about helping users feel informed, confident, safe, and in control.'
        ]
      },
      contentAr: {
        heading: 'الخلاصة',
        paragraphs: [
          'تجربة الشراء لأول مرة لا تتعلق فقط بإتمام المعاملة. بل تتعلق بمساعدة المستخدمين على الشعور بالمعرفة، الثقة، الأمان، والتحكم.'
        ]
      }
    }
  ]
};
