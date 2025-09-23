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
      isDefault: true
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
                <div className="aspect-[4/3] bg-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{template.name}</p>
                    </div>
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
