export async function POST(req) {
  try {
    console.log('Receipt scan request received');
    const { filename, mimeType, base64 } = await req.json();
    
    if (!base64 || !mimeType) {
      console.error('Missing image data in request');
      return new Response(JSON.stringify({ success: false, message: 'Missing image data' }), { status: 400 });
    }
    
    console.log('Processing image:', { filename, mimeType, base64Length: base64.length });

    const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
    if (!API_KEY) {
      console.error('Missing Gemini API key. Please set GEMINI_API_KEY in your environment variables.');
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'AI service not configured. Please set up Gemini API key in .env.local file.',
        error: 'MISSING_API_KEY',
        setupInstructions: {
          step1: 'Get API key from https://makersuite.google.com/app/apikey',
          step2: 'Create .env.local file in project root',
          step3: 'Add: GEMINI_API_KEY=your_api_key_here',
          step4: 'Restart development server'
        }
      }), { status: 500 });
    }

    const prompt = `Extract structured JSON from this Indian retail/GST invoice image. Output ONLY JSON.
Return this JSON shape (numbers as numbers):
{
  shopName: string,
  shopAddress: string,
  billDate: string (YYYY-MM-DD if possible),
  items: [{ name: string, quantity: number, unitPrice: number, category?: string, description?: string }],
  pricing: { subtotal: number, gstRate?: number, gstAmount?: number, discount?: number, totalAmount: number },
  payment?: { method?: string, status?: string, paidAmount?: number }
}
Guidelines:
- If quantity or unit price not shown, estimate from line totals; keep total consistent.
- Prefer GST totals from the bill if present (SGST+CGST or IGST).
- Normalize date into YYYY-MM-DD when possible.
- If value missing, omit the field rather than guess wildly.`;

    // Call Gemini via HTTP with proper format
    const body = {
      contents: [
        {
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: base64 } },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json'
      },
    };

    console.log('Calling Gemini API...');
    
    // Try different model endpoints (working models from ListModels API)
    const models = [
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent'
    ];
    
    let resp, dataHttp;
    let lastError = null;
    
    for (const modelUrl of models) {
      try {
        resp = await fetch(`${modelUrl}?key=${API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        
        dataHttp = await resp.json();
        
        if (resp.ok) {
          console.log(`Success with model: ${modelUrl}`);
          break; // Success, exit loop
        } else {
          lastError = dataHttp?.error?.message || 'Unknown error';
          console.log(`Model ${modelUrl} failed:`, lastError);
        }
      } catch (error) {
        lastError = error.message;
        console.log(`Model ${modelUrl} error:`, error.message);
      }
    }
    
    if (!resp || !resp.ok) {
      console.error('All Gemini models failed:', lastError);
      return new Response(JSON.stringify({ 
        success: false, 
        message: `Gemini API Error: ${lastError}`,
        error: 'GEMINI_API_ERROR',
        details: { lastError, modelsTried: models.length }
      }), { status: 500 });
    }
    
    console.log('Gemini API response status:', resp.status);
    console.log('Gemini API response:', { 
      hasCandidates: !!dataHttp?.candidates, 
      candidateCount: dataHttp?.candidates?.length,
      hasContent: !!dataHttp?.candidates?.[0]?.content,
      hasParts: !!dataHttp?.candidates?.[0]?.content?.parts,
      fullResponse: dataHttp
    });
    
    const text = dataHttp?.candidates?.[0]?.content?.parts?.map(p=>p.text).filter(Boolean).join('\n') || '';
    console.log('Extracted text length:', text.length);
    console.log('Raw extracted text:', text.substring(0, 500) + '...');

    let parsed;
    try {
      // Try code fence first
      let jsonStr = '';
      const codeFence = text.match(/```json[\s\S]*?```/i) || text.match(/```[\s\S]*?```/);
      if (codeFence) {
        jsonStr = codeFence[0].replace(/```json|```/g, '').trim();
      } else {
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonStr = text.slice(firstBrace, lastBrace + 1);
        }
      }
      parsed = jsonStr ? JSON.parse(jsonStr) : JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }

    // Basic validation: ensure at least totals or items present
    const items = Array.isArray(parsed?.items) ? parsed.items : [];
    const hasTotals = parsed?.pricing && (parsed.pricing.totalAmount || parsed.pricing.subtotal);
    let success = items.length > 0 || !!hasTotals || !!parsed?.shopName || !!parsed?.shopAddress;

    // Second pass: if not successful but we have some text, ask the model to convert that text to JSON
    if (!success && text && text.trim().length > 0) {
      const secondPrompt = `Convert the following receipt text to STRICT JSON with this shape (numbers as numbers). Output ONLY JSON.\n\nTEXT:\n${text}\n\nSHAPE:\n{\n  shopName: string,\n  shopAddress: string,\n  billDate: string (YYYY-MM-DD),\n  items: [{ name: string, quantity: number, unitPrice: number, category?: string, description?: string }],\n  pricing: { subtotal: number, gstRate?: number, gstAmount?: number, discount?: number, totalAmount: number },\n  payment?: { method?: string, status?: string, paidAmount?: number }\n}`;

      const secondBody = {
        contents: [ 
          { 
            parts: [ { text: secondPrompt } ] 
          } 
        ],
        generationConfig: { 
          temperature: 0.1, 
          maxOutputTokens: 4096, 
          responseMimeType: 'application/json' 
        },
      };
      // Try second call with same fallback mechanism
      let resp2, data2;
      for (const modelUrl of models) {
        try {
          resp2 = await fetch(`${modelUrl}?key=${API_KEY}`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(secondBody)
          });
          
          data2 = await resp2.json();
          
          if (resp2.ok) {
            break; // Success, exit loop
          }
        } catch (error) {
          console.log(`Second call model ${modelUrl} error:`, error.message);
        }
      }
      const text2 = data2?.candidates?.[0]?.content?.parts?.map(p=>p.text).filter(Boolean).join('\n') || '';
      try {
        const cf = text2.match(/```json[\s\S]*?```/i) || text2.match(/```[\s\S]*?```/);
        const j = cf ? cf[0].replace(/```json|```/g,'').trim() : text2;
        const parsed2 = JSON.parse(j);
        const items2 = Array.isArray(parsed2?.items) ? parsed2.items : [];
        const hasTotals2 = parsed2?.pricing && (parsed2.pricing.totalAmount || parsed2.pricing.subtotal);
        if (items2.length > 0 || hasTotals2 || parsed2?.shopName || parsed2?.shopAddress) {
          parsed = parsed2;
          success = true;
        }
      } catch {}
    }
    // If we at least got some text back, return that to avoid hard failure
    if (!success && text && text.trim().length > 0) {
      success = true;
      if (!parsed || typeof parsed !== 'object') parsed = {};
      if (!parsed.description) parsed.description = text.trim();
    }
    return new Response(JSON.stringify({ success, data: parsed || {}, raw: text }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, message: e?.message || 'scan error' }), { status: 500 });
  }
}


