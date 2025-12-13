import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 
  process.env.NEXT_PUBLIC_BACKEND_URL || 
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://shop-backend-qf50.onrender.com/api';

export async function PUT(req, { params }) {
  try {
    const auth = req.headers.get('authorization') || '';
    const { id } = params;
    const body = await req.json();
    const res = await fetch(`${BACKEND}/balance-entries/${id}`, { 
      method: 'PUT',
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

export async function DELETE(req, { params }) {
  try {
    const auth = req.headers.get('authorization') || '';
    const { id } = params;
    const res = await fetch(`${BACKEND}/balance-entries/${id}`, { 
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

