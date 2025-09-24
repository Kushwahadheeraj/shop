const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(req, context) {
  try {
    const auth = req.headers.get('authorization') || '';
    const { params } = await context;
    const id = params?.id;
    const res = await fetch(`${BACKEND}/api/gst-bills/${id}`, { headers: { 'Authorization': auth } });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'proxy error' }), { status: 500 });
  }
}


