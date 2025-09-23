"use client";
import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';

const ApiTestPage = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gstin, setGstin] = useState('09DAWPK4197P1ZO');
  const [testType, setTestType] = useState('ewaybill');

  const runApiTest = async () => {
    setLoading(true);
    setTestResults(null);

    try {
      const response = await fetch('/api/test-ewaybill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gstin: gstin,
          testType: testType
        })
      });

      const result = await response.json();
      setTestResults(result);
    } catch (error) {
      setTestResults({
        success: false,
        error: {
          message: 'Failed to call API',
          details: error.message
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const runGetTest = async () => {
    setLoading(true);
    setTestResults(null);

    try {
      const response = await fetch('/api/test-ewaybill');
      const result = await response.json();
      setTestResults(result);
    } catch (error) {
      setTestResults({
        success: false,
        error: {
          message: 'Failed to call API',
          details: error.message
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">API Testing Dashboard</h1>
          
          {/* Test Configuration */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Type
                </label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="ewaybill">eWayBill Search GSTIN</option>
                  <option value="gstin-validation">GSTIN Validation</option>
                  <option value="hsn-search">HSN Code Search</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GSTIN (Optional)
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="Enter GSTIN for testing"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={runGetTest}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Play className="h-5 w-5" />
              )}
              <span>Test GET API</span>
            </button>
            
            <button
              onClick={runApiTest}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Play className="h-5 w-5" />
              )}
              <span>Test POST API</span>
            </button>
            
            <button
              onClick={() => setTestResults(null)}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Clear Results</span>
            </button>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                {testResults.success ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
                <h2 className="text-xl font-semibold text-gray-900">
                  {testResults.success ? 'API Test Successful' : 'API Test Failed'}
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Response Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Success:</strong> {testResults.success ? 'Yes' : 'No'}</p>
                    <p><strong>Message:</strong> {testResults.message}</p>
                    <p><strong>Timestamp:</strong> {testResults.timestamp}</p>
                  </div>
                </div>
                
                {testResults.result && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">API Response Data</h3>
                    <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                        {JSON.stringify(testResults.result, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
                
                {testResults.error && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error Details</h3>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p><strong>Code:</strong> {testResults.error.code}</p>
                      <p><strong>Message:</strong> {testResults.error.message}</p>
                      <p><strong>Details:</strong> {testResults.error.details}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Instructions</h3>
            <ul className="text-blue-800 space-y-2">
              <li>• Click "Test GET API" to test the basic eWayBill API with default data</li>
              <li>• Click "Test POST API" to test with custom GSTIN and test type</li>
              <li>• Check the browser console for detailed API response logs</li>
              <li>• The API will return mock data for testing purposes</li>
              <li>• All API responses are logged to the console for debugging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;
