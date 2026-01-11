"use client";

// Client component for error handling - doesn't use the layout to prevent build-time errors
// This file is placed in app/ directory to override the default error page
// Force dynamic rendering to prevent build-time prerendering errors
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Error({ error, reset }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>500</h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>Something went wrong</h2>
        <p style={{ color: '#4b5563', marginBottom: '2rem' }}>
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6b7280',
              color: 'white',
              borderRadius: '0.5rem',
              textDecoration: 'none'
            }}
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

