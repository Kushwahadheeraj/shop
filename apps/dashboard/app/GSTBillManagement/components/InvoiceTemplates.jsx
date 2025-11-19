import React, { useState } from 'react';
import { X, Eye, Download, Check, Palette, FileText, Layout, Settings } from 'lucide-react';

const InvoiceTemplates = ({ onClose, onSelectTemplate, selectedTemplate }) => {
  const [templates] = useState([
    {
      id: 1,
      name: 'Modern Professional',
      description: 'Clean and modern design with purple accent',
      category: 'Professional',
      preview: '/templates/modern-professional.png',
      features: ['GST Compliant', 'Responsive Design', 'Brand Colors', 'Auto Calculations'],
      isDefault: false
    },
    {
      id: 2,
      name: 'Classic Business',
      description: 'Traditional business invoice layout',
      category: 'Business',
      preview: '/templates/classic-business.png',
      features: ['GST Compliant', 'Print Optimized', 'HSN Summary', 'Terms & Conditions'],
      isDefault: false
    },
    {
      id: 3,
      name: 'Minimalist',
      description: 'Simple and clean design',
      category: 'Minimal',
      preview: '/templates/minimalist.png',
      features: ['GST Compliant', 'Mobile Friendly', 'Fast Loading', 'Easy Customization'],
      isDefault: false
    },
    {
      id: 4,
      name: 'Creative',
      description: 'Colorful and creative design',
      category: 'Creative',
      preview: '/templates/creative.png',
      features: ['GST Compliant', 'Custom Colors', 'Logo Integration', 'Social Links'],
      isDefault: false
    },
    {
      id: 5,
      name: 'Corporate',
      description: 'Formal corporate invoice template',
      category: 'Corporate',
      preview: '/templates/corporate.png',
      features: ['GST Compliant', 'Multi Language', 'Advanced Layout', 'Brand Guidelines'],
      isDefault: false
    },
    {
      id: 6,
      name: 'E-commerce',
      description: 'Optimized for online businesses',
      category: 'E-commerce',
      preview: '/templates/ecommerce.png',
      features: ['GST Compliant', 'Product Images', 'SKU Display', 'Order Tracking'],
      isDefault: false
    },
    {
      id: 7,
      name: 'Elegant',
      description: 'Sophisticated and elegant design',
      category: 'Professional',
      preview: '/templates/elegant.png',
      features: ['GST Compliant', 'Premium Look', 'Detailed Layout', 'Professional Style'],
      isDefault: false
    },
    {
      id: 8,
      name: 'Compact',
      description: 'Space-efficient compact layout',
      category: 'Business',
      preview: '/templates/compact.png',
      features: ['GST Compliant', 'Space Saving', 'All Details', 'Print Friendly'],
      isDefault: false
    },
    {
      id: 9,
      name: 'Colorful',
      description: 'Vibrant and eye-catching design',
      category: 'Creative',
      preview: '/templates/colorful.png',
      features: ['GST Compliant', 'Vibrant Colors', 'Modern Style', 'Visual Appeal'],
      isDefault: false
    },
    {
      id: 10,
      name: 'Detailed',
      description: 'Comprehensive detailed invoice template (Original)',
      category: 'Corporate',
      preview: '/templates/detailed.png',
      features: ['GST Compliant', 'Full Details', 'HSN Summary', 'Complete Information'],
      isDefault: true
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCustomization, setShowCustomization] = useState(false);
  const [customizingTemplate, setCustomizingTemplate] = useState(null);

  const categories = ['All', 'Professional', 'Business', 'Minimal', 'Creative', 'Corporate', 'E-commerce'];

  const filteredTemplates = templates.filter(template => 
    selectedCategory === 'All' || template.category === selectedCategory
  );

  const handleSelectTemplate = (template) => {
    onSelectTemplate(template);
    onClose();
  };

  const handleCustomizeTemplate = (template) => {
    setCustomizingTemplate(template);
    setShowCustomization(true);
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Invoice Templates</h2>
              <p className="text-gray-600 mt-1">Choose a template that matches your business style</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <div className="flex space-x-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                  selectedTemplate?.id === template.id ? 'ring-2 ring-purple-500 border-purple-500' : 'border-gray-200'
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                {/* Template Preview */}
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  {/* Visual Preview based on template ID */}
                  <div className="absolute inset-0 p-2">
                    {template.id === 1 && (
                      <div className="h-full bg-gradient-to-br from-purple-600 to-purple-700 rounded">
                        <div className="text-white text-xs p-2 text-center font-bold">TAX INVOICE</div>
                        <div className="bg-white rounded-b p-2 text-xs">
                          <div className="border-l-4 border-purple-600 pl-2 mb-1">Bill To</div>
                          <div className="border-l-4 border-purple-600 pl-2 mb-1">Invoice Details</div>
                          <div className="bg-purple-100 rounded p-1 text-center text-xs">Items Table</div>
                        </div>
                      </div>
                    )}
                    {template.id === 2 && (
                      <div className="h-full border-2 border-gray-800 rounded">
                        <div className="bg-gray-800 text-white text-xs p-1 text-center font-bold">TAX INVOICE</div>
                        <div className="p-1 text-xs">
                          <div className="border-b border-gray-400 pb-1 mb-1">Bill To</div>
                          <div className="border-b border-gray-400 pb-1 mb-1">Invoice Details</div>
                          <div className="bg-gray-100 rounded p-1 text-center text-xs">Items</div>
                        </div>
                      </div>
                    )}
                    {template.id === 3 && (
                      <div className="h-full border-b-2 border-gray-300 rounded">
                        <div className="text-center p-2">
                          <div className="text-xs font-light mb-1">INVOICE</div>
                          <div className="text-xs text-gray-600 mb-2">Shop Name</div>
                          <div className="border-t border-gray-200 pt-1 text-xs text-left">Bill To</div>
                          <div className="border-t border-gray-200 pt-1 text-xs text-right">Invoice #</div>
                        </div>
                      </div>
                    )}
                    {template.id === 4 && (
                      <div className="h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded border-4 border-blue-500">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs p-1 text-center font-black">TAX INVOICE</div>
                        <div className="p-1">
                          <div className="bg-blue-100 rounded p-1 mb-1 text-xs">Bill To</div>
                          <div className="bg-purple-100 rounded p-1 mb-1 text-xs">Invoice Info</div>
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded p-1 text-xs text-center">Total</div>
                        </div>
                      </div>
                    )}
                    {template.id === 5 && (
                      <div className="h-full border border-gray-300 rounded">
                        <div className="border-b-4 border-gray-800 p-1">
                          <div className="text-xs font-bold">Shop Name</div>
                          <div className="text-xs text-right">TAX INVOICE</div>
                        </div>
                        <div className="p-1 text-xs">
                          <div className="uppercase text-gray-500 mb-1">Bill To</div>
                          <div className="border-t-2 border-gray-800 pt-1 text-xs">Items Table</div>
                        </div>
                      </div>
                    )}
                    {template.id === 6 && (
                      <div className="h-full border-2 border-orange-300 rounded-lg">
                        <div className="bg-orange-500 text-white text-xs p-1 text-center font-bold">TAX INVOICE</div>
                        <div className="p-1">
                          <div className="grid grid-cols-3 gap-1 mb-1">
                            <div className="bg-gray-50 rounded p-1 text-xs">Bill To</div>
                            <div className="bg-gray-50 rounded p-1 text-xs">Invoice</div>
                            <div className="bg-gray-50 rounded p-1 text-xs">Total</div>
                          </div>
                          <div className="bg-orange-100 rounded p-1 text-xs">Items</div>
                        </div>
                      </div>
                    )}
                    {template.id === 7 && (
                      <div className="h-full bg-gradient-to-b from-gray-50 to-white border border-gray-300 rounded">
                        <div className="text-center p-2 border-b border-gray-400">
                          <div className="text-xs font-thin tracking-widest mb-1">INVOICE</div>
                          <div className="text-xs font-light">Shop Name</div>
                        </div>
                        <div className="p-1 text-xs">
                          <div className="border-l-2 border-gray-400 pl-2 mb-1">Bill To</div>
                          <div className="border-r-2 border-gray-400 pr-2 text-right mb-1">Invoice #</div>
                          <div className="border-t-2 border-gray-400 pt-1 text-right">Total</div>
                        </div>
                      </div>
                    )}
                    {template.id === 8 && (
                      <div className="h-full border border-gray-400 rounded text-xs">
                        <div className="grid grid-cols-3 gap-1 border-b-2 border-gray-800 p-1">
                          <div className="text-xs font-bold">Shop</div>
                          <div className="text-center text-xs font-bold">INVOICE</div>
                          <div className="text-right text-xs">Bill To</div>
                        </div>
                        <div className="p-1">
                          <div className="bg-gray-100 rounded p-1 text-xs mb-1">Items Table</div>
                          <div className="border-t-2 border-gray-800 pt-1 text-right text-xs">Total</div>
                        </div>
                      </div>
                    )}
                    {template.id === 9 && (
                      <div className="h-full bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 rounded-2xl border-4 border-pink-400">
                        <div className="bg-white rounded-xl p-1">
                          <div className="text-center p-1">
                            <div className="text-xs font-black bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">INVOICE</div>
                            <div className="text-xs font-bold">Shop Name</div>
                          </div>
                          <div className="grid grid-cols-2 gap-1 p-1">
                            <div className="bg-gradient-to-br from-pink-200 to-pink-300 rounded p-1 text-xs">Bill To</div>
                            <div className="bg-gradient-to-br from-blue-200 to-blue-300 rounded p-1 text-xs">Invoice</div>
                          </div>
                          <div className="bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 text-white rounded p-1 text-xs text-center">Total</div>
                        </div>
                      </div>
                    )}
                    {template.id === 10 && (
                      <div className="h-full border border-black rounded">
                        <div className="border-b border-black p-1">
                          <div className="text-xs font-bold text-center">TAX INVOICE</div>
                          <div className="text-xs text-center font-extrabold uppercase">Shop Name</div>
                        </div>
                        <div className="p-1 text-xs">
                          <div className="grid grid-cols-5 border-t border-black p-1">
                            <div className="col-span-2 border-r border-black">Bill To</div>
                            <div className="col-span-2 border-r border-black">Invoice Details</div>
                            <div>Scan</div>
                          </div>
                          <div className="border-t border-black p-1">Items Table</div>
                          <div className="border-t border-black p-1">Terms & Conditions</div>
                          <div className="border-t border-black grid grid-cols-3 p-1">
                            <div className="border-r border-black">Signature</div>
                            <div className="border-r border-black">Bank Details</div>
                            <div>Signatory</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {template.isDefault && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    </div>
                  )}
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-purple-600 text-white rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {template.category}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(template);
                      }}
                      className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Check className="h-4 w-4" />
                      <span>Select</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCustomizeTemplate(template);
                      }}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Preview functionality
                      }}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customization Modal */}
        {showCustomization && customizingTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Customize {customizingTemplate.name}
                  </h3>
                  <button
                    onClick={() => setShowCustomization(false)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Preview */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Preview</h4>
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="text-center">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Template preview will appear here</p>
                      </div>
                    </div>
                  </div>

                  {/* Customization Options */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Customization Options</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            defaultValue="#7C3AED"
                            className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            defaultValue="#7C3AED"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Font Family
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                          <option>Inter</option>
                          <option>Roboto</option>
                          <option>Open Sans</option>
                          <option>Lato</option>
                          <option>Poppins</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Logo Position
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                          <option>Top Left</option>
                          <option>Top Right</option>
                          <option>Top Center</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Show Company Details
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="mr-2" />
                            <span className="text-sm text-gray-700">Business Name</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="mr-2" />
                            <span className="text-sm text-gray-700">Address</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="mr-2" />
                            <span className="text-sm text-gray-700">GSTIN</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm text-gray-700">Phone & Email</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Elements
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm text-gray-700">Terms & Conditions</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm text-gray-700">Payment Instructions</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm text-gray-700">QR Code</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                  <button
                    onClick={() => setShowCustomization(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleSelectTemplate(customizingTemplate);
                      setShowCustomization(false);
                    }}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Check className="h-4 w-4" />
                    <span>Apply Template</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceTemplates;
