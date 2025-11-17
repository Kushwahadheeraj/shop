import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request) {
  try {
    const auth = request.headers.get('authorization') || '';
    const url = new URL(request.url);
    const qs = url.search || '';
    const res = await fetch(`${BACKEND}/gst-bills/stats${qs}`, {
      headers: { 'Authorization': auth }
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e?.message || 'proxy error' },
      { status: 500 }
    );
  }
}

