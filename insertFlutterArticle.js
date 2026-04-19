const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ghdwrskspfzewnqefwbe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZHdyc2tzcGZ6ZXducWVmd2JlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk3OTcwOCwiZXhwIjoyMDg4NTU1NzA4fQ.F4FaDRK2Yjxot4ms7jN5Ux5Dt9RyNOTYTtySJYDaZBk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const article = {
    title_en: 'Mobile App Development with Flutter and Dart: How to Build a Fast and Scalable App?',
    title_ar: 'تطوير تطبيقات الموبايل باستخدام Flutter و Dart: كيف نبني تطبيقًا سريعًا وقابلًا للتوسع؟',
    excerpt_en: 'Explore how Flutter and Dart revolutionize cross-platform mobile development. Learn how a single codebase can deliver high-performance, customizable, and scalable applications.',
    excerpt_ar: 'اكتشف كيف يُحدث Flutter و Dart ثورة في تطوير تطبيقات الموبايل. تعرف على كيفية بناء تطبيقات سريعة، قابلة للتوسع، وتعمل بكفاءة عالية باستخدام قاعدة كود واحدة.',
    content_en: `Introduction
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In the modern technical landscape, providing a consistent user experience across multiple platforms is a major challenge for developers. Flutter, powered by the Dart programming language, has emerged as a revolutionary solution to this problem. It allows developers to build high-performance, natively compiled applications for mobile, web, and desktop from a single codebase.

1. The Power of Single Codebase
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Traditionally, building apps for iOS and Android required two separate teams and two distinct codebases. Flutter changes this entirely by using a single codebase. This not only significantly reduces development time and costs but also ensures absolute consistency in design and functionality across all platforms. Updates and bug fixes become much easier to manage.

2. Unmatched Performance with Dart
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the core reasons behind Flutter's speed is its reliance on Dart. Dart compiles to native ARM machine code, completely eliminating the need for a JavaScript bridge which slows down other cross-platform frameworks. The result is smooth animations, rapid rendering, and an application that feels incredibly responsive, rivaling native iOS and Android apps.

3. Rich and Customizable Widgets
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Flutter is built entirely on the concept of widgets. Everything you see on the screen—from structural elements like buttons and text to layout components like padding—is a widget. This modular approach provides developers with almost unlimited freedom to customize the UI. You can create intricate, expressive designs that perfectly align with your brand identity without any restrictions.

4. Building for Scalability
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

As your application grows, maintaining its structure becomes critical. Using state management solutions like Provider, Riverpod, or BLoC ensures that your Flutter app remains scalable and clean. By decoupling the business logic from the UI components, developers can maintain order, simplify testing, and add new features seamlessly even as the complexity of the app increases.

Conclusion
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Choosing Flutter and Dart for your next mobile project is a strategic investment in speed, efficiency, and quality. It empowers you to deliver stunning, high-performance applications that meet the fast-paced demands of today's market. Whether you are building a startup MVP or scaling an enterprise platform, Flutter provides all the tools needed to succeed.`,
    content_ar: `مقدمة
ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

في المشهد التقني الحديث، يُعد تقديم تجربة مستخدم متسقة عبر المنصات المختلفة تحدياً كبيراً للمطورين. هنا يبرز إطار العمل Flutter - المدعوم بلغة البرمجة Dart - كحل ثوري لهذه المشكلة، حيث يتيح للمطورين بناء تطبيقات عالية الأداء تعمل على مختلف الأنظمة (Mobile, Web, Desktop) باستخدام قاعدة كود واحدة.

١. قوة الاعتماد على كود برمجي واحد
ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

في الماضي، كان بناء تطبيقات تدعم نظامي iOS و Android يتطلب فريقين منفصلين ولغتي برمجة مختلفتين. يغير Flutter هذه القاعدة تماماً؛ فالاعتماد على كود برمجي واحد يقلل بشكل كبير من وقت وتكلفة التطوير، ويضمن تطابقاً تاماً في التصميم والأداء عبر كل المنصات، مما يجعل إطلاق التحديثات وإصلاح الأخطاء مهمة سهلة ومباشرة.

٢. أداء فائق بفضل لغة Dart
ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

أحد الأسباب الجوهرية لسرعة وسلاسة تطبيقات Flutter هو استخدام لغة Dart. تتميز Dart بقدرتها على الترجمة المباشرة إلى كود الآلة (Native ARM)، مما يلغي الحاجة إلى الوسيط البرمجي (Bridge) الذي يُبطئ إطارات العمل الأخرى. النتيجة هي تطبيقات تعمل بسرعة وانسيابية عالية تنافس التطبيقات المبنية باللغات الأصلية لكل نظام.

٣. واجهات غنية وقابلة للتخصيص
ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

يُبنى Flutter بالكامل على مبدأ الـ Widgets؛ فكل ما تراه على الشاشة من أزرار ونصوص وتنسيقات هو في الأساس Widget. هذا الهيكل المعياري يمنح المطورين حرية لا حدود لها في تخصيص واجهات المستخدم وتصميم شاشات معقدة وجذابة تتوافق تماماً مع هوية المشروع دون أي قيود بصرية.

٤. بناء تطبيقات قابلة للتوسع
ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

مع ازدياد حجم التطبيق، تصبح إدارة هيكلته أمراً حاسماً. باستخدام حلول إدارة الحالة (State Management) مثل Provider أو BLoC، يمكن الحفاظ على بيئة التطبيق منظمة ونظيفة. فصل المنطق البرمجي عن واجهة المستخدم يسهّل عملية اختبار أجزاء التطبيق المختلفة ويسمح بإضافة ميزات جديدة ومتقدمة بكل سلاسة مع تقدم المشروع.

الخلاصة
ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ

اختيار Flutter و Dart لمشروعك القادم هو استثمار استراتيجي في السرعة والجودة والكفاءة. إنه يضع بين يديك الأدوات اللازمة لبناء تطبيقات مذهلة وعالية الأداء تلبي تطلعات ومتطلبات السوق السريع اليوم، سواء كنت تطلق نسخة أولية لمشروع ناشئ أو تبني منصة ضخمة.`,
    slug: 'mobile-app-development-with-flutter-and-dart',
    published_at: new Date().toISOString(),
    cover_image_url: null,
  };

  const { data, error } = await supabase
    .from('articles')
    .insert([article])
    .select();

  if (error) {
    console.error('Error inserting article:', error);
  } else {
    console.log('Article inserted successfully!');
  }
}

main();
