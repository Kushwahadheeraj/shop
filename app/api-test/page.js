"use client";
import { useState } from 'react';

export default function APITestPage() {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testGeminiAPI = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const res = await fetch('/api/ai/test-gemini');
      const data = await res.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ success: false, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Gemini API Test</h2>
          
          <button
            onClick={testGeminiAPI}
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Gemini API'}
          </button>
          
          {testResult && (
            <div className={`mt-4 p-4 rounded-lg ${
              testResult.success 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              <h3 className="font-semibold mb-2">Test Result:</h3>
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <div className="space-y-2">
            <p><strong>Node Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>API Key Present:</strong> {process.env.GEMINI_API_KEY ? 'Yes' : 'No'}</p>
            <p><strong>API Key Length:</strong> {process.env.GEMINI_API_KEY?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}