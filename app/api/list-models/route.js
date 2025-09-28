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

    // Call ListModels API to get available models
    const listModelsUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    
    console.log('Calling ListModels API...');
    const response = await fetch(`${listModelsUrl}?key=${API_KEY}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('ListModels response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('ListModels error:', errorText);
      return new Response(JSON.stringify({ 
        success: false, 
        message: `ListModels API Error: ${response.status}`,
        error: 'LIST_MODELS_ERROR',
        details: errorText
      }), { status: 500 });
    }
    
    const data = await response.json();
    console.log('Available models:', data);
    
    // Filter models that support generateContent
    const generateContentModels = data.models?.filter(model => 
      model.supportedGenerationMethods?.includes('generateContent')
    ) || [];
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Available models retrieved',
      totalModels: data.models?.length || 0,
      generateContentModels: generateContentModels.length,
      models: data.models,
      generateContentSupported: generateContentModels
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('ListModels error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message,
      error: 'LIST_MODELS_ERROR'
    }), { status: 500 });
  }
}
