const BACKEND = process.env.BACKEND_URL || 'https://shop-backend-qf50.onrender.com/api';

export async function GET(req) {
  try {
    const auth = req.headers.get('authorization') || '';
    const res = await fetch(`${BACKEND}/bank-accounts`, { headers: { 'Authorization': auth } });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'proxy error' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = req.headers.get('authorization') || '';
    const body = await req.text();
    const res = await fetch(`${BACKEND}/bank-accounts`, { method: 'POST', headers: { 'Authorization': auth, 'Content-Type': 'application/json' }, body });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'proxy error' }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const auth = req.headers.get('authorization') || '';
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const body = await req.text();
    const res = await fetch(`${BACKEND}/bank-accounts/${id}`, { method: 'PUT', headers: { 'Authorization': auth, 'Content-Type': 'application/json' }, body });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'proxy error' }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const auth = req.headers.get('authorization') || '';
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const res = await fetch(`${BACKEND}/bank-accounts/${id}`, { method: 'DELETE', headers: { 'Authorization': auth } });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'proxy error' }), { status: 500 });
  }
}


