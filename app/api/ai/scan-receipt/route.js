export async function POST(req) {
  try {
    const { filename, mimeType, base64 } = await req.json();
    if (!base64 || !mimeType) {
      return new Response(JSON.stringify({ success: false, message: 'Missing image data' }), { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
    if (!API_KEY) {
      return new Response(JSON.stringify({ success: false, message: 'Missing Gemini API key in env' }), { status: 500 });
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

    // Call Gemini via HTTP to avoid requiring SDK dependency
    const body = {
      systemInstruction: { role: 'system', parts: [{ text: 'You return only valid JSON. No prose.' }] },
      contents: [
        {
          role: 'user',
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

    const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=' + API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const dataHttp = await resp.json();
    const text = dataHttp?.candidates?.[0]?.content?.parts?.map(p=>p.text).filter(Boolean).join('\n') || '';

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
        systemInstruction: { role: 'system', parts: [{ text: 'Return only valid JSON. No prose.' }] },
        contents: [ { role: 'user', parts: [ { text: secondPrompt } ] } ],
        generationConfig: { temperature: 0.1, maxOutputTokens: 4096, responseMimeType: 'application/json' },
      };
      const resp2 = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=' + API_KEY, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(secondBody)
      });
      const data2 = await resp2.json();
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


