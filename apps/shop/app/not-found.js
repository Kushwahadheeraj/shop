export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'edge';

export default function NotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404</h1>
      <p>Page Not Found</p>
    </div>
  );
}

