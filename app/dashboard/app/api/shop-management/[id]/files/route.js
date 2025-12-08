import { NextResponse } from 'next/server';
import API_BASE_URL from '@/lib/apiConfig';

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  try {
    const token = request.headers.get('authorization');
    if (!token) return NextResponse.json({ success: false, message: 'Authentication token required' }, { status: 401 });
    const { id } = params;

    const formData = await request.formData();
    const resp = await fetch(`${API_BASE_URL}/shop-management/${id}/files`, {
      method: 'POST',
      headers: { Authorization: token },
      body: formData,
    });
    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (err) {
    console.error('Error uploading files:', err);
    return NextResponse.json({ success: false, message: 'Error uploading files', error: err.message }, { status: 500 });
  }
}

