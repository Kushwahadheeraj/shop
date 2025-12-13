import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 
  process.env.NEXT_PUBLIC_BACKEND_URL || 
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://shop-backend-qf50.onrender.com/api';

export async function DELETE(req, { params }) {
  try {
    const auth = req.headers.get('authorization') || '';
    const { phone } = params;
    const res = await fetch(`${BACKEND}/balance-entries/person/${encodeURIComponent(phone)}`, { 
      method: 'DELETE',
      headers: { 'Authorization': auth }
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { 
      status: res.status, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'proxy error' }), { status: 500 });
  }
}

