"use client";
import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, CheckCircle } from 'lucide-react';

const AIReceiptScanner = ({ onScanComplete, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
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
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock AI scanning result - in real implementation, this would call an AI service
      const mockResult = {
        shopName: 'Sample Shop',
        shopAddress: '123 Main Street, City, State',
        items: [
          {
            name: 'Electrical Wire 2.5mm',
            quantity: 2,
            unitPrice: 150.00,
            category: 'Electrical',
            description: 'Copper wire 2.5mm'
          },
          {
            name: 'Switch Socket',
            quantity: 4,
            unitPrice: 75.00,
            category: 'Electrical',
            description: 'Single pole switch'
          },
          {
            name: 'MCB 16A',
            quantity: 1,
            unitPrice: 450.00,
            category: 'Electrical',
            description: 'Miniature Circuit Breaker'
          }
        ],
        pricing: {
          subtotal: 1050.00,
          gstRate: 18,
          gstAmount: 189.00,
          totalAmount: 1239.00,
          discount: 0
        },
        payment: {
          method: 'cash',
          status: 'pending',
          paidAmount: 0
        },
        billDate: new Date().toISOString().split('T')[0],
        description: 'Electrical items purchase'
      };

      setScanResult(mockResult);
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Failed to process the image. Please try again.');
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Camera className="w-6 h-6" />
              AI Receipt Scanner
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {!scanResult && !isScanning && (
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-12 h-12 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Scan Receipt with AI
              </h3>
              <p className="text-gray-600 mb-6">
                Upload a clear photo of your receipt and our AI will automatically extract the bill details.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-pink-600 hover:to-orange-600 transition-all"
                >
                  <Upload className="w-5 h-5" />
                  Choose Image
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <p className="text-sm text-gray-500">
                  Supported formats: JPG, PNG, PDF
                </p>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          )}

          {isScanning && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Processing Receipt...
              </h3>
              <p className="text-gray-600">
                Our AI is analyzing your receipt. This may take a few moments.
              </p>
            </div>
          )}

          {scanResult && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Receipt Scanned Successfully!
                </h3>
                <p className="text-gray-600">
                  Review the extracted information below and click "Use This Data" to proceed.
                </p>
              </div>

              {/* Scanned Data Preview */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Shop Information</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Name:</strong> {scanResult.shopName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Address:</strong> {scanResult.shopAddress}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Items Found</h4>
                  <div className="space-y-2">
                    {scanResult.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>₹{(item.quantity * item.unitPrice).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{scanResult.pricing.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST ({scanResult.pricing.gstRate}%):</span>
                    <span>₹{scanResult.pricing.gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>₹{scanResult.pricing.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleRetry}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Scan Another
                </button>
                <button
                  onClick={handleUseResult}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
