import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 
  process.env.NEXT_PUBLIC_BACKEND_URL || 
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:5000/api';

export async function GET(req) {
  try {
    const auth = req.headers.get('authorization') || '';
    const url = new URL(req.url);
    const qs = url.search || '';
    const res = await fetch(`${BACKEND}/balance-entries${qs}`, { 
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

export async function POST(req) {
  try {
    const auth = req.headers.get('authorization') || '';
    const body = await req.json();
    const res = await fetch(`${BACKEND}/balance-entries`, { 
      method: 'POST',
      headers: { 
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
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

