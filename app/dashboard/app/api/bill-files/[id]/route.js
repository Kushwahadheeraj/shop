const BACKEND = process.env.BACKEND_URL || 'https://shop-backend-qf50.onrender.com/api';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const auth = request.headers.get('authorization') || '';
    
    const res = await fetch(`${BACKEND}/bill-files/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': auth }
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'proxy error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

