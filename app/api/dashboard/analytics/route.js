const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(req) {
  try {
    const auth = req.headers.get('authorization') || '';
    const { searchParams } = new URL(req.url);
    const view = searchParams.get('view') || 'user';
    const period = searchParams.get('period') || '30';
    
    // Forward request to backend dashboard API
    const response = await fetch(`${BACKEND}/api/dashboard/analytics?view=${view}&period=${period}`, {
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
