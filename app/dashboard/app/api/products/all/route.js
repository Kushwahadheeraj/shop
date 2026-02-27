import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.API_BASE_URL ||
  process.env.BACKEND_API_URL ||
  'https://shop-backend-qf50.onrender.com/api';

const API_BASE_URL = apiBase.replace(/\/+$/, '');

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const backendUrl = new URL(`${API_BASE_URL}/products/all`);

    // Pass through any query params (eg. filters, pagination)
    url.searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value);
    });

    
    const response = await fetch(backendUrl.toString(), {
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
            return NextResponse.json(
        { error: data?.message || 'Failed to fetch products' },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
        return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
