"use client";
import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, XCircle, Loader, RefreshCw, Eye, Database, BarChart3 } from 'lucide-react';

const ApiDebugPage = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken || '');
  }, []);

  const testApi = async (apiName, url, method = 'GET') => {
    setLoading(true);
    console.log(`🚀 Testing ${apiName} API...`);
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      const result = {
        apiName,
        url,
        status: response.status,
        ok: response.ok,
        data: data,
        timestamp: new Date().toISOString()
      };

      setTestResults(prev => ({
        ...prev,
        [apiName]: result
      }));

      console.log(`📊 ${apiName} API Result:`, result);
      
    } catch (error) {
      const result = {
        apiName,
        url,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      
      setTestResults(prev => ({
        ...prev,
        [apiName]: result
      }));
      
      console.error(`❌ ${apiName} API Error:`, error);
    } finally {
      setLoading(false);
    }
  };

  const testAllApis = async () => {
    console.log('🚀 Testing all APIs...');
    
    await testApi('Shops', 'http://localhost:5000/api/shops');
    await testApi('GST Bills', 'http://localhost:5000/api/gst-bills');
    await testApi('GST Stats', 'http://localhost:5000/api/gst-bills/stats');
    await testApi('Seller Profile', 'http://localhost:5000/api/seller/profile/me');
  };

  const clearResults = () => {
    setTestResults({});
    console.clear();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">API Debug Dashboard</h1>
          
          {/* Token Status */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Status</h2>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg ${token ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {token ? '✅ Token Present' : '❌ No Token'}
              </div>
              <div className="text-sm text-gray-600">
                {token ? `Token: ${token.substring(0, 20)}...` : 'Please login first'}
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => testApi('Shops', 'http://localhost:5000/api/shops')}
              disabled={loading || !token}
              className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Database className="h-5 w-5" />
              <span>Test Shops</span>
            </button>
            
            <button
              onClick={() => testApi('GST Bills', 'http://localhost:5000/api/gst-bills')}
              disabled={loading || !token}
              className="flex items-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Test GST Bills</span>
            </button>
            
            <button
              onClick={() => testApi('GST Stats', 'http://localhost:5000/api/gst-bills/stats')}
              disabled={loading || !token}
              className="flex items-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Test Stats</span>
            </button>
            
            <button
              onClick={() => testApi('Seller Profile', 'http://localhost:5000/api/seller/profile/me')}
              disabled={loading || !token}
              className="flex items-center space-x-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Eye className="h-5 w-5" />
              <span>Test Profile</span>
            </button>
          </div>

          <div className="flex space-x-4 mb-8">
            <button
              onClick={testAllApis}
              disabled={loading || !token}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <Loader className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
              <span>Test All APIs</span>
            </button>
            
            <button
              onClick={clearResults}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Clear Results</span>
            </button>
          </div>

          {/* Results */}
          {Object.keys(testResults).length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">API Test Results</h2>
              
              {Object.entries(testResults).map(([apiName, result]) => (
                <div key={apiName} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{apiName} API</h3>
                    <div className="flex items-center space-x-2">
                      {result.error ? (
                        <XCircle className="h-6 w-6 text-red-600" />
                      ) : result.ok ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-yellow-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        result.error ? 'text-red-600' : 
                        result.ok ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {result.error ? 'Error' : result.ok ? 'Success' : 'Failed'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">URL:</span>
                        <span className="ml-2 text-gray-600">{result.url}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className={`ml-2 ${
                          result.status >= 200 && result.status < 300 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {result.status}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Timestamp:</span>
                        <span className="ml-2 text-gray-600">{new Date(result.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Response Data:</h4>
                      <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                          {result.error ? result.error : JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Debug Instructions</h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• <strong>Browser Console:</strong> Open F12 → Console tab to see detailed logs</li>
              <li>• <strong>Network Tab:</strong> Check F12 → Network tab to see API requests</li>
              <li>• <strong>Token Check:</strong> Make sure you&apos;re logged in and token is present</li>
              <li>• <strong>Backend Status:</strong> Ensure backend server is running on port 5000</li>
              <li>• <strong>API Response:</strong> Check if data.success is true and data.data exists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDebugPage;

