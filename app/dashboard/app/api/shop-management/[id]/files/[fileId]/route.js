import { NextResponse } from 'next/server';
import API_BASE_URL from '@/lib/apiConfig';

export const dynamic = 'force-dynamic';

export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get('authorization');
    if (!token) return NextResponse.json({ success: false, message: 'Authentication token required' }, { status: 401 });
    const { id, fileId } = params;

    const resp = await fetch(`${API_BASE_URL}/shop-management/${id}/files/${fileId}`, {
      method: 'DELETE',
      headers: { Authorization: token },
    });
    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (err) {
    console.error('Error deleting shop file:', err);
    return NextResponse.json({ success: false, message: 'Error deleting file', error: err.message }, { status: 500 });
  }
}


