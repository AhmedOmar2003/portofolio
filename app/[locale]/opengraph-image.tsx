import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Ahmed Essam Maher | Product Designer & AI Vibe Coder';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  const title = isArabic
    ? 'أحمد عصام ماهر'
    : 'Ahmed Essam Maher';
  const subtitle = isArabic
    ? 'مصمم منتجات رقمية وفايب كودينج بالـ AI'
    : 'Product Designer & AI Vibe Coder';
  const tagline = isArabic
    ? 'أبني منتجات رقمية ذكية بتجربة مستخدم قوية وأداء سريع'
    : 'Building smart digital products with strong UX and fast performance';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #050816 0%, #060912 50%, #04070f 100%)',
          padding: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(141,246,200,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(106,215,255,0.1) 0%, transparent 70%)',
          }}
        />

        {/* Eyebrow pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '9999px',
            padding: '10px 20px',
            marginBottom: '32px',
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8df6c8, #6ad7ff)',
            }}
          />
          <span
            style={{
              color: '#cbd5e1',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            ahmed-essam.com
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            marginBottom: '16px',
            maxWidth: '800px',
          }}
        >
          {title}
        </div>

        {/* Subtitle with gradient */}
        <div
          style={{
            fontSize: '32px',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #8df6c8 0%, #6ad7ff 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '20px',
            letterSpacing: '-0.02em',
          }}
        >
          {subtitle}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '20px',
            color: '#64748b',
            maxWidth: '640px',
            lineHeight: 1.6,
          }}
        >
          {tagline}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '80px',
            right: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '24px' }}>
            {['UX Design', 'AI Tools', 'Full-Stack'].map((tag) => (
              <span
                key={tag}
                style={{
                  color: '#475569',
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #8df6c8 0%, #6ad7ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#041019' }}>A</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
