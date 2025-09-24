const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000';

export async function PUT(req, context) {
  try {
    const { params } = await context;
    const id = params?.id;
    const auth = req.headers.get('authorization') || '';
    const body = await req.text();
    const res = await fetch(`${BACKEND}/api/clients/${id}`, { method: 'PUT', headers: { 'Authorization': auth, 'Content-Type': 'application/json' }, body });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'proxy error' }), { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const { params } = await context;
    const id = params?.id;
    const auth = req.headers.get('authorization') || '';
    const res = await fetch(`${BACKEND}/api/clients/${id}`, { method: 'DELETE', headers: { 'Authorization': auth } });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'proxy error' }), { status: 500 });
  }
}


