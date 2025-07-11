const fs = require('fs');
const path = require('path');

function getApiPath(filePath) {
  const parts = filePath.split(path.sep);
  const idx = parts.findIndex(p => p.toLowerCase() === 'productlist');
  if (idx === -1) return '/api/products';
  const rel = parts.slice(idx + 1, -1).map(p => p.toLowerCase()).join('/');
  return rel ? `/api/${rel}` : '/api/products';
}

function getCategoryName(filePath) {
  // Get the folder names after ProductList and before ProductList.jsx
  const parts = filePath.split(path.sep);
  const idx = parts.findIndex(p => p.toLowerCase() === 'productlist');
  if (idx === -1) return 'Product List';
  const rel = parts.slice(idx + 1, -1);
  if (rel.length === 0) return 'Product List';
  // Capitalize each part
  const name = rel.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  return name + ' Product List';
}

function getComponent(category, title) {
  return `"use client";
import React, { useEffect, useState } from "react";
import ProductTable from "@/components/ProductTable";
import { useRouter } from "next/navigation";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    router.push(`/dashboard/product/update/${product._id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    await fetch(\`${'${API_URL}/${id}'}\`, { method: "DELETE" });
    fetchProducts();
  };

  const handleView = (product) => {
    router.push(`/dashboard/product/view/${product._id}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">${title}</h1>
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
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
const title = getCategoryName(filePath.replace(/\\/g, '/').replace(/^.*app\/Dashboard\/ProductList\//, ''));
const code = getComponent(apiPath, title);
fs.writeFileSync(filePath, code, 'utf8');
console.log(`Updated: ${filePath} -> API: ${apiPath} -> Title: ${title}`); 