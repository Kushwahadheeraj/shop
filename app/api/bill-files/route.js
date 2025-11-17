const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request) {
  try {
    const auth = request.headers.get('authorization') || '';
    const url = new URL(request.url);
    const qs = url.search || '';
    const res = await fetch(`${BACKEND}/bill-files${qs}`, {
      headers: { 'Authorization': auth }
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'proxy error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request) {
  try {
    const auth = request.headers.get('authorization') || '';
    const body = await request.text();
    const res = await fetch(`${BACKEND}/bill-files`, {
      method: 'POST',
      headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
      body
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'proxy error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

