export async function POST(req) {
  try {
    const { gstin } = await req.json();
    if (!gstin) {
      return new Response(JSON.stringify({ success: false, error: 'gstin required' }), { status: 400 });
    }
    const token = process.env.SUREPASS_API_TOKEN || process.env.NEXT_PUBLIC_SUREPASS_API_TOKEN;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'Missing SUREPASS_API_TOKEN' }), { status: 500 });
    }

    const res = await fetch('https://api.surepass.io/api/v1/gstin/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id_number: String(gstin).trim() })
    });
    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ success: false, status: res.status, error: data?.message || data?.error || 'Lookup failed' }), { status: 500 });
    }

    // Normalize a few common fields
    const root = data?.data || data || {};
    const name = root.trade_name || root.legal_name || root.name || '';
    const pan = root.pan || root.pan_no || '';
    const addrObj = root.pradr || root.addr || {};
    const addressString = addrObj?.addr || addrObj?.address || '';
    const city = addrObj?.city || addrObj?.loc || '';
    const stateName = addrObj?.state || addrObj?.st || '';
    const pincode = addrObj?.pincode || addrObj?.pncd || '';
    const stateCode = root?.state_code || root?.stcd || '';

    return new Response(JSON.stringify({
      success: true,
      raw: data,
      normalized: { name, pan, addressString, city, stateName, pincode, stateCode }
    }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'Lookup failed' }), { status: 500 });
  }
}


