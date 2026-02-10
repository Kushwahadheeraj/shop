// Free-mode invoice scan: OCR.Space for text + optional HuggingFace LayoutLM for fields.
// No OpenAI/Gemini required. Optional env:
// - OCR_SPACE_API_KEY (optional, many times not needed)
// - HF_TOKEN (optional if model requires it)
// - HF_MODEL (defaults to impira/layoutlm-document-qa)
// - USE_MOCK (set to '1' to always return demo data)

export async function POST(req) {
  try {
    const { filename = 'receipt.jpg', mimeType, base64 } = await req.json();
    const useMock = process.env.USE_MOCK === '1';

    if (useMock) {
      return success(mockResult(filename), 'Mock mode enabled', { mock: true });
    }

    if (!base64 || !mimeType) {
      return error('Missing image data', 400, 'MISSING_IMAGE');
    }

    // OCR.Space requires a key; their public demo key "helloworld" works with limits.
    const ocrApiKey = process.env.OCR_SPACE_API_KEY || 'helloworld';
    const hfToken = process.env.HF_TOKEN || '';
    const hfModel = process.env.HF_MODEL || 'impira/layoutlm-document-qa';

    // 1) OCR.Space for raw text
    const ocr = await runWithTimeout(() => callOcrSpace({ base64, mimeType, apiKey: ocrApiKey }), 25000);
    if (!ocr.success) {
      // If OCR fails hard, bail early
      return error(ocr.message || 'OCR failed', ocr.statusCode || 500, 'OCR_ERROR', ocr.details);
    }

    // 2) Optional HF LayoutLM for structured hints
    let hf = null;
    try {
      hf = await runWithTimeout(() => callHuggingFace({ base64, mimeType, token: hfToken, model: hfModel }), 25000);
    } catch (e) {
      hf = { success: false, message: e?.message || 'HF error' };
    }

    // 3) Lightweight parsing/heuristics on OCR text
    const parsed = parseFromText(ocr.text || '');

    // 4) Merge HF hints if any
    if (hf?.success && hf.data) {
      mergeFromHf(parsed, hf.data);
    }

    // Basic success flag
    const hasItems = Array.isArray(parsed.items) && parsed.items.length > 0;
    const hasTotals = parsed.pricing?.totalAmount || parsed.pricing?.subtotal;
    const hasShop = parsed.shopName || parsed.shopAddress;
    const finalSuccess = hasItems || hasTotals || hasShop || !!ocr.text;

    return success(parsed, 'Free OCR/HF scan complete', {
      ocrProvider: 'ocr.space',
      hfProvider: hf?.success ? hfModel : null,
      hfUsed: !!hf?.success,
      rawTextLength: (ocr.text || '').length,
      warnings: hf?.success ? undefined : hf?.message
    }, finalSuccess ? 200 : 206);
  } catch (e) {
        return error(e?.message || 'Scan error occurred', 500, 'SCAN_ERROR', process.env.NODE_ENV === 'development' ? { stack: e?.stack } : undefined);
  }
}

// --- Helpers ---------------------------------------------------------------

function success(data, message = 'ok', meta = {}, status = 200) {
  return new Response(JSON.stringify({ success: true, message, data, meta }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function error(message, status = 500, code = 'ERROR', details) {
  return new Response(JSON.stringify({ success: false, message, error: code, details }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function runWithTimeout(fn, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fn(controller.signal);
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    if (e?.name === 'AbortError') throw new Error('Request timeout');
    throw e;
  }
}

async function callOcrSpace({ base64, mimeType, apiKey }, signal) {
  try {
    const formData = new FormData();
    formData.append('base64Image', `data:${mimeType};base64,${base64}`);
    formData.append('OCREngine', '2'); // better accuracy
    formData.append('scale', 'true');
    formData.append('isTable', 'true');
    if (apiKey) formData.append('apikey', apiKey);

    const resp = await fetch('https://api.ocr.space/parse/image', { method: 'POST', body: formData, signal });
    const data = await resp.json();
    if (!resp.ok) {
      return { success: false, statusCode: resp.status, message: `OCR HTTP ${resp.status}`, details: data };
    }
    const parsedText = data?.ParsedResults?.[0]?.ParsedText || '';
    return { success: true, text: parsedText, raw: data };
  } catch (e) {
    return { success: false, message: e?.message || 'OCR error' };
  }
}

async function callHuggingFace({ base64, mimeType, token, model }, signal) {
  try {
    const headers = { 'Content-Type': 'application/octet-stream' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const resp = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers,
      body: Buffer.from(base64, 'base64'),
      signal
    });

    if (resp.status === 503) {
      // model cold-start
      return { success: false, message: 'Model loading, retry after a minute' };
    }

    const data = await resp.json();
    if (!resp.ok) {
      return { success: false, message: data?.error || `HF HTTP ${resp.status}`, details: data };
    }
    return { success: true, data };
  } catch (e) {
    return { success: false, message: e?.message || 'HF error' };
  }
}

function parseFromText(text) {
  const allLines = (text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // Focus only on probable table region: from first line that has qty/rate/amount hints to a line that mentions total/sub total.
  let start = 0;
  let end = allLines.length;
  for (let i = 0; i < allLines.length; i++) {
    const ln = allLines[i].toLowerCase();
    if (/qty|rate|amount|item\s*&?\s*description/i.test(ln) || /\d+\s+[x*]\s*\d+/.test(ln)) {
      start = i;
      break;
    }
  }
  for (let i = allLines.length - 1; i >= start; i--) {
    const ln = allLines[i].toLowerCase();
    if (/total/.test(ln) || /sub\s*total/.test(ln)) {
      end = i + 1;
      break;
    }
  }

  const lines = allLines.slice(start, end);
  const joined = lines.join(' ');

  const dateMatch = joined.match(/\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/);
  const totalMatch = joined.match(/total\s*[:\-]?\s*([₹Rs\. ]?\d+[\d,\.]*)/i);
  const gstMatch = joined.match(/gst\s*\(?\d+%?\)?\s*[:\-]?\s*([₹Rs\. ]?\d+[\d,\.]*)/i);
  const invoiceMatch = joined.match(/(invoice|inv)\s*(no\.?|number)?\s*[:\-]?\s*([A-Za-z0-9\-]+)/i);

  // Start with empty items; we'll prefer table extraction
  const items = [];

  // Table-style items: name ... qty rate amount
  const tableItems = parseItemsFromTable(lines);
  if (tableItems.length) {
    items.push(...tableItems);
  } else {
    // Fallback items: lines with an amount but not total/gst words -> qty 1
    const moneyLine = /₹\s*\d[\d,\.]*/i;
    for (const ln of lines) {
      if (/total|gst|cgst|sgst|tax/i.test(ln)) continue;
      if (moneyLine.test(ln)) {
        const amt = parseNumber(ln.match(moneyLine)?.[0]);
        const name = ln.replace(moneyLine, '').trim();
        if (amt && name) {
          items.push({ name: name.slice(0, 80), quantity: 1, unitPrice: amt, category: '', description: '' });
        }
      }
    }
  }

  const pricing = {};
  if (totalMatch) pricing.totalAmount = parseNumber(totalMatch[1]);
  if (gstMatch) {
    pricing.gstAmount = parseNumber(gstMatch[1]);
    pricing.gstRate = pricing.gstAmount ? 18 : undefined;
  }

  const sumItems = items.reduce((acc, it) => acc + (Number(it.amount) || (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0)), 0);

  // If total not found, use highest amount seen but cap relative to items
  if (!pricing.totalAmount) {
    const amounts = (joined.match(/₹\s*\d[\d,\.]*/g) || []).map(a => parseNumber(a));
    const nums = (joined.match(/\b\d[\d,\.]{2,}\b/g) || []).map(a => parseNumber(a));
    let all = [...amounts, ...nums].filter(n => Number.isFinite(n) && n > 0);
    if (sumItems > 0) {
      const cap = sumItems * 5;
      all = all.filter(n => n <= cap);
    }
    if (all.length) {
      pricing.totalAmount = Math.max(...all);
    }
  }

  // Prefer sumItems as subtotal when we have table/fallback items
  if (sumItems > 0) {
    pricing.subtotal = pricing.subtotal || sumItems;
    if (!pricing.totalAmount) pricing.totalAmount = sumItems;
  }

  // If subtotal missing but GST present and total present, back-calc subtotal
  if (!pricing.subtotal && pricing.totalAmount && pricing.gstAmount) {
    pricing.subtotal = Math.max(0, pricing.totalAmount - pricing.gstAmount);
  }

  return {
    shopName: null,
    shopAddress: null,
    billDate: normalizeDate(dateMatch?.[1]),
    items,
    pricing,
    payment: {},
    description: lines.slice(0, 6).join(' ')
  };
}

function parseItemsFromTable(lines) {
  const out = [];
  for (const raw of lines) {
    const cleaned = raw.replace(/\t+/g, ' ').replace(/\s{2,}/g, ' ').trim();
    if (!cleaned) continue;
    const tokens = cleaned.split(/\s+/).filter(Boolean);
    if (tokens.length < 4) continue;

    // Walk from end to find amount, rate, qty (skip unit words)
    const nums = [];
    const unitWords = /^(bag|pc|pcs|kg|gm|gms|ltr|litre|box)$/i;
    for (let i = tokens.length - 1; i >= 0; i--) {
      const t = tokens[i];
      const num = parseNumber(t);
      if (Number.isFinite(num)) {
        nums.push({ idx: i, val: num });
        if (nums.length === 3) break;
      } else if (unitWords.test(t)) {
        continue; // skip unit label
      } else {
        // stop if we have already captured some numbers and hit text
        if (nums.length > 0) break;
      }
    }
    if (nums.length === 0) continue;
    const amountNum = nums[0]?.val; // last numeric
    const rateNum = nums[1]?.val;
    const qtyNum = nums[2]?.val;
    if (!Number.isFinite(amountNum) || amountNum <= 0) continue;

    // Build name excluding trailing numeric/unit/hsn tokens
    const cutIdx = Math.min(...nums.map(n => n.idx));
    const frontTokens = tokens.slice(0, cutIdx);

    // Extract HSN codes (4-6 digits) from tail of frontTokens
    const hsnTokens = [];
    while (frontTokens.length) {
      const last = frontTokens[frontTokens.length - 1];
      if (/^\d{4,6}$/.test(last)) {
        hsnTokens.unshift(last);
        frontTokens.pop();
        continue;
      }
      break;
    }

    // Drop serial number if present at start (e.g., "1", "2.")
    if (frontTokens.length && /^(\d+\.?)$/.test(frontTokens[0])) {
      frontTokens.shift();
    }

    const name = frontTokens.join(' ').trim();
    if (!name) continue;

    const hsn = hsnTokens.join(' ').trim() || null;
    const qty = Number.isFinite(qtyNum) ? qtyNum : 1;
    const unitPrice = Number.isFinite(rateNum) ? rateNum : (qty > 0 ? amountNum / qty : amountNum);

    out.push({
      name: name.slice(0, 120),
      quantity: qty,
      unitPrice,
      hsn,
      amount: amountNum,
      category: '',
      description: ''
    });
  }
  return out;
}

function mergeFromHf(parsed, hfData) {
  // HF responses vary; we just attach raw and keep parsed as-is.
  if (!parsed.meta) parsed.meta = {};
  parsed.meta.hfRaw = hfData;
}

function parseNumber(str = '') {
  const cleaned = str.replace(/[₹Rs,\s]/gi, '');
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : undefined;
}

function normalizeDate(raw) {
  if (!raw) return null;
  const parts = raw.split(/[\/\-]/);
  if (parts.length === 3) {
    let [d, m, y] = parts.map(p => p.padStart(2, '0'));
    if (y.length === 2) y = '20' + y;
    return `${y}-${m}-${d}`;
  }
  return raw;
}

function mockResult(filename = 'sample-receipt.jpg') {
  return {
    shopName: 'Mock Store',
    shopAddress: '123 Mock Street, Delhi',
    billDate: new Date().toISOString().split('T')[0],
    items: [
      { name: 'Hammer', quantity: 1, unitPrice: 250, category: 'Hardware', description: '' },
      { name: 'Nails (Box)', quantity: 2, unitPrice: 120, category: 'Hardware', description: '' }
    ],
    pricing: {
      subtotal: 490,
      gstRate: 18,
      gstAmount: 88.2,
      discount: 0,
      totalAmount: 578.2
    },
    payment: { method: 'UPI', status: 'paid', paidAmount: 578.2 },
    description: `Mock result for ${filename}`
  };
}
