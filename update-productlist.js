const fs = require('fs');
const path = require('path');

function getApiPath(filePath) {
  // Extract the category/subcategory from the file path
  // e.g., app/Dashboard/ProductList/Adhesives/ProductList.jsx => /api/adhesives
  // e.g., app/Dashboard/ProductList/Sanitary/Essess/Croma/ProductList.jsx => /api/sanitary/essess/croma
  const parts = filePath.split(path.sep);
  const idx = parts.findIndex(p => p.toLowerCase() === 'productlist');
  if (idx === -1) return '/api/products';
  const rel = parts.slice(idx + 1, -1).map(p => p.toLowerCase()).join('/');
  return rel ? `/api/${rel}` : '/api/products';
}

function getComponent(category) {
  return `"use client";
import React, { useEffect, useState } from "react";
import ProductTable from "@/components/ProductTable";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);

  const API_URL = "${category}";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setEditData({ ...product });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (id) => {
    setLoading(true);
    await fetch(\`${'${API_URL}/${id}'}\`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setEditId(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    await fetch(\`${'${API_URL}/${id}'}\`, { method: "DELETE" });
    fetchProducts();
  };

  const handleView = (product) => {
    setViewProduct(product);
  };

  const handleCloseView = () => {
    setViewProduct(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        editId={editId}
        editData={editData}
        onEditChange={handleEditChange}
        onEditSave={handleEditSave}
        onEditCancel={() => setEditId(null)}
      />
      {viewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[300px] max-w-[90vw]">
            <h2 className="text-lg font-bold mb-2">{viewProduct.name}</h2>
            <div className="mb-2">Category: {viewProduct.category}</div>
            <div className="mb-2">Price: {viewProduct.fixPrice}</div>
            <div className="mb-2">Discount: {viewProduct.discount}</div>
            <div className="mb-2">Discount Price: {viewProduct.discountPrice}</div>
            <div className="mb-2">Total Product: {viewProduct.totalProduct}</div>
            <div className="mb-2">Tags: {viewProduct.tags && viewProduct.tags.join(', ')}</div>
            <div className="flex flex-row gap-2 flex-wrap mb-2">
              {viewProduct.photos && viewProduct.photos.map((url, idx) => (
                <img key={idx} src={url} alt="photo" className="w-16 h-16 object-cover rounded" />
              ))}
            </div>
            <button onClick={handleCloseView} className="mt-2 px-4 py-1 bg-gray-200 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
`;
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node update-productlist.js <ProductList.jsx path>');
  process.exit(1);
}

const apiPath = getApiPath(filePath.replace(/\\/g, '/').replace(/^.*app\/Dashboard\/ProductList\//, ''));
const code = getComponent(apiPath);
fs.writeFileSync(filePath, code, 'utf8');
console.log(`Updated: ${filePath} -> API: ${apiPath}`); 