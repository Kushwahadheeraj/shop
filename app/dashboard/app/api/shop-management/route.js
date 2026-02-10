import { NextResponse } from 'next/server';
import API_BASE_URL from '@/lib/apiConfig';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization');
    if (!token) return NextResponse.json({ success: false, message: 'Authentication token required' }, { status: 401 });

    const resp = await fetch(`${API_BASE_URL}/shop-management`, {
      headers: { Authorization: token },
      cache: 'no-store',
    });
    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (err) {
        return NextResponse.json({ success: false, message: 'Error fetching shops', error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization');
    if (!token) return NextResponse.json({ success: false, message: 'Authentication token required' }, { status: 401 });
    const body = await request.json();

    const resp = await fetch(`${API_BASE_URL}/shop-management`, {
      method: 'POST',
      headers: { Authorization: token, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (err) {
        return NextResponse.json({ success: false, message: 'Error creating shop', error: err.message }, { status: 500 });
  }
}

