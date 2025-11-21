import React, { useMemo, useState } from 'react';
import { Check, Eye, Palette, X } from 'lucide-react';

const templates = [
  {
    id: 'default',
    name: 'Default (QR + Bill To)',
    description: 'QR code scanner and Bill To details in split layout - perfect for quick payments.',
    category: 'Default',
    preview: '/templates/non-gst-default.png',
    features: ['QR code scanner', 'Split Bill To section', 'Quick payment', 'Professional layout']
  },
  {
    id: 'modern',
    name: 'Modern Retail',
    description: 'Clean gradient header with strong totals for retail shops.',
    category: 'Modern',
    preview: '/templates/non-gst-modern.png',
    features: ['QR payment block', 'Shop branding', 'Amount in words', 'Signature space']
  },
  {
    id: 'classic',
    name: 'Classic Ledger',
    description: 'Traditional bordered layout inspired by manual ledgers.',
    category: 'Classic',
    preview: '/templates/non-gst-classic.png',
    features: ['Compact table', 'Customer details', 'Discount line item', 'Two signature areas']
  },
  {
    id: 'minimal',
    name: 'Minimal A5',
    description: 'Minimal typography focused on fast thermal printing.',
    category: 'Minimal',
    preview: '/templates/non-gst-minimal.png',
    features: ['Two-column layout', 'Highlights outstanding', 'Auto QR pay', 'Notes section']
  }
];

const categories = ['All', 'Default', 'Modern', 'Classic', 'Minimal'];

const InvoiceTemplates = ({ onClose, onSelectTemplate, selectedTemplate }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'All') return templates;
    return templates.filter((template) => template.category === activeCategory);
  }, [activeCategory]);

  const handleSelect = (template) => {
    onSelectTemplate?.(template);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-gray-100/95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Invoice Templates</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select a design for your printable invoice. You can switch templates anytime.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close templates"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-gray-200 hover:bg-gray-100 text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => {
              const isSelected = selectedTemplate?.id === template.id;
              return (
                <div
                  key={template.id}
                  className={`relative border rounded-xl overflow-hidden bg-white transition-shadow duration-150 ${
                    isSelected ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
                    <div className="w-[85%] h-[85%] bg-white border border-gray-200 rounded-xl shadow-inner relative">
                      <div className="absolute inset-x-0 top-0 h-12 rounded-t-xl bg-gradient-to-r from-blue-500 via-sky-500 to-blue-600 text-white flex items-center justify-center text-xs font-semibold tracking-widest">
                        INVOICE
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-16 border-t border-gray-200 px-4 py-3">
                        <div className="h-2 bg-gradient-to-r from-emerald-300 to-blue-400 rounded-full" />
                        <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500">
                          <span>Shop • Customer • Summary</span>
                          <span>QR • Amount • Signature</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-4 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full">
                        <Palette className="w-3 h-3" />
                        {template.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {template.features.map((feature) => (
                        <span key={feature} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSelect(template)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Use Template
                      </button>
                      <button
                        onClick={() => onSelectTemplate?.(template)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${
                          isSelected
                            ? 'border-blue-200 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-2 shadow-lg">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplates;

