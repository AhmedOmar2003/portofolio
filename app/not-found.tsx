import Link from 'next/link';

export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: '#050816',
          color: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1.5rem',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <p style={{ fontSize: '4rem', fontWeight: 800, margin: 0, letterSpacing: '-0.04em', color: '#8df6c8' }}>
          404
        </p>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', margin: 0 }}>
          Page not found.
        </p>
        <Link
          href="/en"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.875rem 1.75rem',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #8df6c8 0%, #6ad7ff 100%)',
            color: '#041019',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.9rem',
          }}
        >
          Back to Home
        </Link>
      </body>
    </html>
  );
}
