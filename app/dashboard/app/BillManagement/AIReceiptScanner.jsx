"use client";
import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, CheckCircle } from 'lucide-react';

const AIReceiptScanner = ({ onScanComplete, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [isTestingAPI, setIsTestingAPI] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    await processImage(file);
  };

  const processImage = async (file) => {
    setIsScanning(true);
    setError('');
    setScanResult(null);

    try {
      // Convert file to base64 safely using FileReader to avoid call stack overflow
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const result = reader.result || '';
            const b64 = typeof result === 'string' && result.includes(',') ? result.split(',')[1] : '';
            resolve(b64);
          } catch (e) { reject(e); }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch('/api/ai/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, mimeType: file.type, base64 })
      });
      
            let data;
      try { 
        data = await res.json(); 
              } catch (e) { 
        // Fallback: try text so we at least see the body in console
        try {
          const txt = await res.text();
                    data = txt ? { message: txt } : null;
        } catch (e2) {
                    data = null; 
        }
      }
      if (!res.ok && (!data || !data.raw)) {
        const msg = data?.message || data?.error || `Scan API error (${res.status})`;
        
        // New free-mode error hints
        if (data?.error === 'MISSING_IMAGE') {
          setError('Image data missing. कृपया दोबारा इमेज चुनें।');
        } else if (data?.error === 'OCR_ERROR') {
          setError('OCR service error. दोबारा ट्राई करें या साफ़ फोटो अपलोड करें।');
        } else if (data?.error === 'HF_ERROR') {
          setError('AI parsing में दिक्कत आई, टेक्स्ट से बेसिक रिज़ल्ट दिखाया जाएगा।');
        } else if (data?.error === 'MISSING_API_KEY') {
          setError('AI service configured नहीं है. पहले कॉन्फ़िग करें।');
        } else if (data?.error === 'OPENAI_API_ERROR') {
          setError(`AI service error: ${msg}. अक्सर key invalid या quota खत्म होने पर होता है.`);
        } else {
          setError(msg);
        }

        setScanResult({
          shopName: '', shopAddress: '', billDate: new Date().toISOString().split('T')[0],
          items: [], pricing: { subtotal: 0, gstAmount: 0, totalAmount: 0 },
          payment: { method: '', status: '', paidAmount: 0 }, description: msg
        });
        return;
      }
      if (!data?.success) {
        if (data?.raw) {
          setError('Fields पूरी तरह नहीं निकले। नीचे AI का टेक्स्ट दिख रहा है।');
          setScanResult({
            shopName: '',
            shopAddress: '',
            billDate: new Date().toISOString().split('T')[0],
            items: [],
            pricing: { subtotal: 0, gstAmount: 0, totalAmount: 0 },
            payment: { method: '', status: '', paidAmount: 0 },
            description: data.raw
          });
          return;
        }
        const msg = data?.message || 'कोई structured डेटा नहीं मिला। इमेज और साफ़ करके ट्राई करें।';
        setError(msg);
        setScanResult({
          shopName: '', shopAddress: '', billDate: new Date().toISOString().split('T')[0],
          items: [], pricing: { subtotal: 0, gstAmount: 0, totalAmount: 0 },
          payment: { method: '', status: '', paidAmount: 0 }, description: msg
        });
        return;
      }
      const result = data.data || {};
      const rawText = data.raw || '';
      // Normalize output minimal shape expected by form
      const normalized = {
        shopName: result.shopName || '',
        shopAddress: result.shopAddress || '',
        billDate: result.billDate || new Date().toISOString().split('T')[0],
        items: Array.isArray(result.items) ? result.items.map(it => ({
          name: it.name || '',
          quantity: Number(it.quantity) || 1,
          unitPrice: Number(it.unitPrice) || 0,
          category: it.category || '',
          description: it.description || ''
        })) : [],
        pricing: {
          subtotal: Number(result?.pricing?.subtotal) || 0,
          gstRate: Number(result?.pricing?.gstRate) || undefined,
          gstAmount: Number(result?.pricing?.gstAmount) || 0,
          discount: Number(result?.pricing?.discount) || 0,
          totalAmount: Number(result?.pricing?.totalAmount) || 0
        },
        payment: result.payment || { method: '', status: '', paidAmount: 0 },
        description: result.description || ''
      };

      // Heuristic fallback: derive minimal fields from raw text if structured data is empty
      if ((normalized.items.length === 0) && typeof rawText === 'string' && rawText.trim().length > 0) {
        const lines = rawText.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
        // Shop name guess: first non-empty line (avoid words like 'TAX INVOICE')
        const skipWords = /invoice|bill|receipt|tax|gst/i;
        const firstName = (lines.find(l=>!skipWords.test(l) && l.length>2) || '').slice(0, 64);
        // Total amount guess (pick last matching number after keywords)
        let total = 0;
        const totalRegex = /(grand\s*total|total\s*amount|amount\s*payable|net\s*amount)[^\d]*(\d+[\,\d]*\.?\d*)/ig;
        let m; let lastNum = null;
        while ((m = totalRegex.exec(rawText)) !== null) {
          const n = parseFloat(String(m[2]).replace(/,/g,''));
          if (!isNaN(n)) lastNum = n;
        }
        if (lastNum != null) total = lastNum;
        // Subtotal guess
        let subtotal = 0;
        const subRegex = /(subtotal|amount\s*before\s*tax)[^\d]*(\d+[\,\d]*\.?\d*)/ig;
        const sm = subRegex.exec(rawText);
        if (sm && sm[2]) subtotal = parseFloat(sm[2].replace(/,/g,'')) || 0;
        // GST amount guess
        let gstAmount = 0;
        const gstRegex = /(gst|igst|cgst|sgst)[^\d]*(\d+[\,\d]*\.?\d*)/ig;
        let g;
        while ((g = gstRegex.exec(rawText)) !== null) {
          const n = parseFloat(String(g[2]).replace(/,/g,''));
          if (!isNaN(n)) gstAmount = Math.max(gstAmount, n);
        }
        // Try to infer items from lines patterns like:
        //  "Item Name x2 150", "Item Name 2 x 150", "Item Name 2 150", "Item Name qty:2 rate:150"
        const parsedItems = [];
        const itemRegexes = [
          /^(.*?)[\s\-\–\|\:]+x\s*(\d+(?:\.\d+)?)\s+(\d+(?:[\,]\d+)?(?:\.\d+)?)$/i,
          /^(.*?)[\s\-\–\|\:]+(\d+(?:\.\d+)?)\s*x\s*(\d+(?:[\,]\d+)?(?:\.\d+)?)$/i,
          /^(.*?)[\s\-\–\|\:]+qty\s*[:\-]?\s*(\d+(?:\.\d+)?)\s+rate\s*[:\-]?\s*(\d+(?:[\,]\d+)?(?:\.\d+)?)$/i,
          /^(.*?)[\s\-\–\|\:]+(\d+(?:\.\d+)?)\s+(\d+(?:[\,]\d+)?(?:\.\d+)?)$/i,
        ];
        for (const ln of lines) {
          let matched = false;
          for (const rx of itemRegexes) {
            const m = rx.exec(ln);
            if (m) {
              const name = (m[1] || '').trim().replace(/\s{2,}/g,' ');
              const qty = parseFloat(String(m[2]).replace(/,/g,'')) || 1;
              const rate = parseFloat(String(m[3]).replace(/,/g,'')) || 0;
              if (name && qty>0) {
                parsedItems.push({ name, quantity: qty, unitPrice: rate, category: '', description: '' });
                matched = true;
                break;
              }
            }
          }
          if (parsedItems.length >= 20) break;
        }

        if (normalized.items.length === 0 && parsedItems.length > 0) {
          normalized.items = parsedItems;
        }

        normalized.shopName = normalized.shopName || firstName;
        normalized.pricing.totalAmount = normalized.pricing.totalAmount || total;
        normalized.pricing.subtotal = normalized.pricing.subtotal || subtotal;
        normalized.pricing.gstAmount = normalized.pricing.gstAmount || gstAmount;
        normalized.description = normalized.description || rawText;
      }
      setScanResult(normalized);
    } catch (error) {
            setError(error?.message || 'Failed to process the image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleUseResult = () => {
    if (scanResult) {
      onScanComplete(scanResult);
      onClose();
    }
  };

  const handleRetry = () => {
    setScanResult(null);
    setError('');
    fileInputRef.current?.click();
  };

  const testAPI = async () => {
    setIsTestingAPI(true);
    setError('');
    
    try {
      const res = await fetch('/api/ai/test-gemini');
      const data = await res.json();
      
      if (data.success) {
        setError(`✅ API Test Successful: ${data.message}`);
      } else {
        setError(`❌ API Test Failed: ${data.message}`);
      }
    } catch (error) {
      setError(`❌ API Test Error: ${error.message}`);
    } finally {
      setIsTestingAPI(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
              AI Receipt Scanner
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {!scanResult && !isScanning && (
            <div className="text-center py-6 sm:py-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Camera className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Scan Receipt with AI
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
                Upload a clear photo of your receipt and our AI will automatically extract the bill details.
              </p>

              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 hover:from-pink-600 hover:to-orange-600 transition-all"
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  Choose Image
                </button>
                
                <button
                  onClick={testAPI}
                  disabled={isTestingAPI}
                  className="w-full bg-blue-500 text-white py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  {isTestingAPI ? (
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                  {isTestingAPI ? 'Testing API...' : 'Test API Connection'}
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <p className="text-xs sm:text-sm text-gray-500">
                  Supported formats: JPG, PNG, PDF
                </p>
              </div>

              {error && (
                <div className={`mt-4 p-3 rounded-lg border text-xs sm:text-sm ${
                  error.includes('✅') 
                    ? 'bg-green-100 border-green-400 text-green-700' 
                    : 'bg-red-100 border-red-400 text-red-700'
                }`}>
                  <div className="break-words">{error}</div>
                  {error.includes('AI service is not configured') && (
                    <div className="mt-2 text-xs sm:text-sm">
                      <p className="font-medium">Setup Instructions:</p>
                      <ol className="list-decimal list-inside mt-1 space-y-1">
                        <li>Get an OpenAI API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">OpenAI</a></li>
                        <li>Create a <code className="bg-gray-200 px-1 rounded">.env.local</code> file in your project root</li>
                        <li>Add: <code className="bg-gray-200 px-1 rounded">OPENAI_API_KEY=your_api_key_here</code></li>
                        <li>Restart your development server</li>
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {isScanning && (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Processing Receipt...
              </h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">
                Our AI is analyzing your receipt. This may take a few moments.
              </p>
            </div>
          )}

          {scanResult && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Receipt Scanned Successfully!
                </h3>
                <p className="text-sm sm:text-base text-gray-600 px-2">
                  Review the extracted information below and click "Use This Data" to proceed.
                </p>
              </div>

              {/* Scanned Data Preview */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
                <div>
                  <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-1 sm:mb-2">Shop Information</h4>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">
                    <strong>Name:</strong> {scanResult.shopName || 'N/A'}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">
                    <strong>Address:</strong> {scanResult.shopAddress || 'N/A'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-1 sm:mb-2">Items Found</h4>
                  <div className="space-y-2">
                    {scanResult.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-xs sm:text-sm">
                        <span className="truncate flex-1 mr-2">{item.name} x{item.quantity}</span>
                        <span className="flex-shrink-0">₹{(item.quantity * item.unitPrice).toFixed(2)}</span>
                      </div>
                    ))}
                    {scanResult.items.length === 0 && scanResult.description ? (
                      <div className="text-xs text-gray-600 whitespace-pre-wrap p-2 border rounded bg-white/50 break-words">
                        {scanResult.description}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Subtotal:</span>
                    <span>₹{scanResult.pricing.subtotal.toFixed(2)}</span>
                  </div>
                  {scanResult.pricing.gstRate && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>GST ({scanResult.pricing.gstRate}%):</span>
                      <span>₹{scanResult.pricing.gstAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm sm:text-base font-medium">
                    <span>Total:</span>
                    <span>₹{scanResult.pricing.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <button
                  onClick={handleRetry}
                  className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Scan Another
                </button>
                <button
                  onClick={handleUseResult}
                  className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Use This Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIReceiptScanner;
