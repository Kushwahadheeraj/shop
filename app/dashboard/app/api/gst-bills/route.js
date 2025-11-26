const BACKEND = process.env.BACKEND_URL || 'https://shop-backend-qf50.onrender.com/api';

export async function POST(req) {
  try {
    const auth = req.headers.get('authorization') || '';
    const body = await req.text();
    const res = await fetch(`${BACKEND}/gst-bills`, {
      method: 'POST',
      headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
      body
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'proxy error' }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    const auth = req.headers.get('authorization') || '';
    const url = new URL(req.url);
    const qs = url.search || '';
    const res = await fetch(`${BACKEND}/gst-bills${qs}`, { headers: { 'Authorization': auth } });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'proxy error' }), { status: 500 });
  }
}


