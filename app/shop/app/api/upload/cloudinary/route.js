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

    const res = await fetch(`${BACKEND}/api/upload/cloudinary`, {
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
    console.error('Upload error:', e);
    return new Response(JSON.stringify({ 
      success: false, 
      error: e?.message || 'proxy error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

