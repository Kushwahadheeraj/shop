const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000/api';

export async function GET(req, { params }) {
  try {
    const auth = req.headers.get('authorization') || '';
    const { id } = await params;
    const res = await fetch(`${BACKEND}/gst-bills/${id}`, { headers: { 'Authorization': auth } });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'proxy error' }), { status: 500 });
  }
}


