// Server component - no client-side code to avoid useContext issues during build
// Force dynamic rendering to prevent build-time prerendering errors
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>404</h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>Page Not Found</h2>
            <p style={{ color: '#4b5563', marginBottom: '2rem' }}>The page you are looking for does not exist.</p>
            <Link
              href="/"
              style={{ display: 'inline-block', padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.5rem', textDecoration: 'none' }}
            >
              Go to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

