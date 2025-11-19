"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ProductList() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: ''
  });
  const [editFile, setEditFile] = useState(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState('');

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/simple-products`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/simple-products/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setProducts(products.filter(product => product._id !== id));
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      alert('Network error. Please try again.');
      console.error('Error deleting product:', err);
    }
  };

  // Start editing
  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name
    });
    setEditFile(null);
    setEditPreviewUrl('');
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditForm({ name: '' });
    setEditFile(null);
    setEditPreviewUrl('');
  };

  // Handle edit file change
  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFile(file);
      const url = URL.createObjectURL(file);
      setEditPreviewUrl(url);
    }
  };

  // Save edit
  const handleSaveEdit = async (id) => {
    if (!editForm.name.trim()) {
      alert('Product name is required');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', editForm.name.trim());
      if (editFile) {
        formDataToSend.append('image', editFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/simple-products/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setProducts(products.map(product => 
          product._id === id ? data.data : product
        ));
        setEditingProduct(null);
        setEditForm({ name: '' });
        setEditFile(null);
        setEditPreviewUrl('');
      } else {
        alert(data.message || 'Failed to update product');
      }
    } catch (err) {
      alert('Network error. Please try again.');
      console.error('Error updating product:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Product List</h1>
              <p className="text-gray-600">Manage your products</p>
            </div>
            <button
              onClick={() => router.push('/ProductAdd')}
              className="bg-yellow-300 hover:bg-yellow-300 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
            >
              Add New Product
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Start by adding your first product</p>
              <button
                onClick={() => router.push('/ProductAdd')}
                className="bg-yellow-300 hover:bg-yellow-300 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
              >
                Add Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="aspect-square p-4 flex items-center justify-center">
                    <Image
                      src={`${API_BASE_URL}${product.image}`}
                      alt={product.name}
                      width={150}
                      height={150}
                      className="object-contain max-h-full max-w-full"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  
                  <div className="p-4 pt-0">
                    {editingProduct === product._id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Product name"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditFileChange}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                        {editPreviewUrl && (
                          <div className="w-20 h-20 border border-gray-300 rounded overflow-hidden">
                            <Image
                              src={editPreviewUrl}
                              alt="Preview"
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(product._id)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-2 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
