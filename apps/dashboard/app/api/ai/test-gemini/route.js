export async function GET() {
  try {
    const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
    
    if (!API_KEY) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'No Gemini API key found',
        error: 'MISSING_API_KEY'
      }), { status: 500 });
    }

    // Test with minimal request body
    const testBody = {
      contents: [{
        parts: [{ text: 'Hello, can you respond with "API is working"?' }]
      }]
    };

    // Try with basic model name (no version)
    const modelUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    
    try {
      const resp = await fetch(`${modelUrl}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testBody)
      });
      
      const data = await resp.json();
      
      if (!resp.ok) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: `Gemini API Error: ${data?.error?.message || 'Unknown error'}`,
          error: 'GEMINI_API_ERROR',
          details: data
        }), { status: 500 });
      }
      
      const text = data?.candidates?.[0]?.content?.parts?.map(p=>p.text).filter(Boolean).join('\n') || '';
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Gemini API is working',
        response: text,
        apiKeyLength: API_KEY.length
      }), { status: 200 });
      
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: `API Error: ${error.message}`,
        error: 'API_ERROR',
        details: { error: error.message, modelUrl }
      }), { status: 500 });
    }

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message,
      error: 'TEST_ERROR'
    }), { status: 500 });
  }
}
