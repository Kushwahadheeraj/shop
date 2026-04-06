const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000/api';

export async function POST(req) {
  try {
    const auth = req.headers.get('authorization') || '';
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ success: false, message: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // Remove /api from path if BACKEND_URL already includes it to avoid double /api/api
    const baseUrl = BACKEND.endsWith('/api') ? BACKEND : `${BACKEND}/api`;
    const uploadUrl = BACKEND.endsWith('/api') ? `${BACKEND}/upload/cloudinary` : `${BACKEND}/api/upload/cloudinary`;

    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 
        'Authorization': auth
        // Don't set Content-Type - FormData sets it automatically with boundary
      },
      body: backendFormData
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Upload failed' }));
      return new Response(JSON.stringify({ 
        success: false, 
        message: errorData.message || 'Upload failed' 
      }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
        return new Response(JSON.stringify({ 
      success: false, 
      error: e?.message || 'proxy error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

