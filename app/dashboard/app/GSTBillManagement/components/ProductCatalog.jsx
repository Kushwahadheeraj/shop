"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package, Tag, Calculator, X, Save, Upload, Image as ImageIcon, FileSearch } from 'lucide-react';
import HSNLookup from './HSNLookup';

const ProductCatalog = ({ onClose, onSelectProduct, selectedProductId }) => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Steel Rod 12mm',
      sku: 'SR-12-001',
      description: 'High quality steel rod 12mm diameter',
      hsnSac: '7214',
      unit: 'Kg',
      unitPrice: 65.00,
      gstRate: 18,
      category: 'Steel Products',
      stock: 500,
      minStock: 50,
      maxStock: 1000,
      image: null,
      status: 'Active',
      totalSold: 1200,
      lastSoldDate: '2025-01-15',
      supplier: 'Steel Corp Ltd',
      notes: 'High demand item'
    },
    {
      id: 2,
      name: 'Cement Bag 50kg',
      sku: 'CB-50-001',
      description: 'Portland cement 50kg bag',
      hsnSac: '2523',
      unit: 'Bag',
      unitPrice: 350.00,
      gstRate: 28,
      category: 'Construction',
      stock: 200,
      minStock: 25,
      maxStock: 500,
      image: null,
      status: 'Active',
      totalSold: 800,
      lastSoldDate: '2025-01-14',
      supplier: 'Cement Industries',
      notes: 'Bulk order item'
    },
    {
      id: 3,
      name: 'Paint Brush Set',
      sku: 'PBS-001',
      description: 'Professional paint brush set of 5 brushes',
      hsnSac: '9603',
      unit: 'Set',
      unitPrice: 250.00,
      gstRate: 12,
      category: 'Tools',
      stock: 100,
      minStock: 10,
      maxStock: 200,
      image: null,
      status: 'Active',
      totalSold: 150,
      lastSoldDate: '2025-01-12',
      supplier: 'Tool Master',
      notes: 'Seasonal item'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showHSNLookup, setShowHSNLookup] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    description: '',
    hsnSac: '',
    unit: 'Pcs',
    unitPrice: 0,
    gstRate: 18,
    category: 'General',
    stock: 0,
    minStock: 0,
    maxStock: 0,
    supplier: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const categories = ['All', 'Steel Products', 'Construction', 'Tools', 'Electrical', 'Plumbing', 'General'];
  const units = ['Pcs', 'Kg', 'Bag', 'Set', 'Meter', 'Liter', 'Box', 'Roll', 'Sheet'];
  const gstRates = [0, 5, 12, 18, 28];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleInputChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newProduct.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!newProduct.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }
    if (!newProduct.hsnSac.trim()) {
      newErrors.hsnSac = 'HSN/SAC code is required';
    }
    if (newProduct.unitPrice <= 0) {
      newErrors.unitPrice = 'Unit price must be greater than 0';
    }
    if (newProduct.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProduct = () => {
    if (!validateForm()) return;

    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev.map(product => 
        product.id === editingProduct.id 
          ? { ...product, ...newProduct, id: editingProduct.id }
          : product
      ));
      setEditingProduct(null);
    } else {
      // Add new product
      const product = {
        ...newProduct,
        id: Date.now(),
        status: 'Active',
        totalSold: 0,
        lastSoldDate: null,
        image: null
      };
      setProducts(prev => [...prev, product]);
    }

    setNewProduct({
      name: '',
      sku: '',
      description: '',
      hsnSac: '',
      unit: 'Pcs',
      unitPrice: 0,
      gstRate: 18,
      category: 'General',
      stock: 0,
      minStock: 0,
      maxStock: 0,
      supplier: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      sku: product.sku,
      description: product.description,
      hsnSac: product.hsnSac,
      unit: product.unit,
      unitPrice: product.unitPrice,
      gstRate: product.gstRate,
      category: product.category,
      stock: product.stock,
      minStock: product.minStock,
      maxStock: product.maxStock,
      supplier: product.supplier,
      notes: product.notes
    });
    setShowAddForm(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(product => product.id !== productId));
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    onSelectProduct(product);
  };

  const handleSelectHSN = (hsn) => {
    setNewProduct(prev => ({
      ...prev,
      hsnSac: hsn.code,
      description: hsn.description,
      gstRate: hsn.gstRate
    }));
    setShowHSNLookup(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStockStatus = (product) => {
    if (product.stock <= product.minStock) {
      return { status: 'Low Stock', color: 'text-red-600 bg-red-100' };
    } else if (product.stock >= product.maxStock) {
      return { status: 'Overstocked', color: 'text-yellow-300 bg-yellow-100' };
    } else {
      return { status: 'In Stock', color: 'text-green-600 bg-green-100' };
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Product Catalog</h2>
              <p className="text-sm sm:text-base text-gray-600">Manage your products and inventory</p>
            </div>
            <div className="flex items-center flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 text-sm sm:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 sm:p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Product List */}
        <div className="p-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first product</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <div
                    key={product.id}
                    className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer ${
                      selectedProductId === product.id ? 'ring-2 ring-purple-500 border-purple-500' : 'border-gray-200'
                    }`}
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
                            {stockStatus.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProduct(product);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4" />
                        <span className="truncate">{product.description}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4" />
                        <span>HSN: {product.hsnSac} | {product.unit}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calculator className="h-4 w-4" />
                        <span>GST: {product.gstRate}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Price:</span>
                        <span className="font-semibold text-lg">{formatCurrency(product.unitPrice)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Stock:</span>
                        <span className="font-medium">{product.stock} {product.unit}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Category:</span>
                        <span className="text-sm font-medium">{product.category}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div>
                          <span>Sold:</span>
                          <span className="font-medium ml-1">{product.totalSold}</span>
                        </div>
                        <div>
                          <span>Last Sold:</span>
                          <span className="font-medium ml-1">
                            {product.lastSoldDate ? new Date(product.lastSoldDate).toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add/Edit Product Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProduct(null);
                      setNewProduct({
                        name: '',
                        sku: '',
                        description: '',
                        hsnSac: '',
                        unit: 'Pcs',
                        unitPrice: 0,
                        gstRate: 18,
                        category: 'General',
                        stock: 0,
                        minStock: 0,
                        maxStock: 0,
                        supplier: '',
                        notes: ''
                      });
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <form className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter product name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      value={newProduct.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.sku ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter SKU"
                    />
                    {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter product description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HSN/SAC Code *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newProduct.hsnSac}
                        onChange={(e) => handleInputChange('hsnSac', e.target.value)}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          errors.hsnSac ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter HSN/SAC code"
                      />
                      <button
                        type="button"
                        onClick={() => setShowHSNLookup(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <FileSearch className="h-4 w-4" />
                        <span>Lookup</span>
                      </button>
                    </div>
                    {errors.hsnSac && <p className="text-red-500 text-xs mt-1">{errors.hsnSac}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={newProduct.unit}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.unitPrice}
                      onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.unitPrice ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter unit price"
                    />
                    {errors.unitPrice && <p className="text-red-500 text-xs mt-1">{errors.unitPrice}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Rate (%)
                    </label>
                    <select
                      value={newProduct.gstRate}
                      onChange={(e) => handleInputChange('gstRate', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {gstRates.map(rate => (
                        <option key={rate} value={rate}>{rate}%</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {categories.filter(cat => cat !== 'All').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Stock
                    </label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.stock ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter current stock"
                    />
                    {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Stock
                    </label>
                    <input
                      type="number"
                      value={newProduct.minStock}
                      onChange={(e) => handleInputChange('minStock', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter minimum stock"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Stock
                    </label>
                    <input
                      type="number"
                      value={newProduct.maxStock}
                      onChange={(e) => handleInputChange('maxStock', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter maximum stock"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier
                    </label>
                    <input
                      type="text"
                      value={newProduct.supplier}
                      onChange={(e) => handleInputChange('supplier', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter supplier name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newProduct.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Add any additional notes about this product"
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProduct(null);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProduct}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* HSN Lookup Modal */}
        {showHSNLookup && (
          <HSNLookup
            onClose={() => setShowHSNLookup(false)}
            onSelectHSN={handleSelectHSN}
            selectedHSN={null}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;
