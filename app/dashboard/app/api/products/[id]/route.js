import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.API_BASE_URL ||
  process.env.BACKEND_API_URL ||
  'https://shop-backend-qf50.onrender.com/api';

const API_BASE_URL = apiBase.replace(/\/+$/, '');

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    console.log('Searching for product with ID:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Try to narrow search by category if provided as query param (passed through to backend)
    const url = new URL(request.url);
    const hintCategory = url.searchParams.get('cat');
    const backendUrl = new URL(`${API_BASE_URL}/products/${encodeURIComponent(id)}`);
    if (hintCategory) {
      backendUrl.searchParams.set('category', hintCategory);
    }

    console.log('Proxying product lookup to backend:', backendUrl.toString());

    const response = await fetch(backendUrl.toString(), {
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 404) {
      return NextResponse.json(
        { error: data?.message || 'Product not found' },
        { status: 404 }
      );
    }

    if (!response.ok) {
      console.error('Backend responded with error:', data);
      return NextResponse.json(
        { error: data?.message || 'Failed to fetch product' },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
