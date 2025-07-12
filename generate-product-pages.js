const fs = require('fs');
const path = require('path');

const productListRoot = path.join(__dirname, 'app', 'Dashboard', 'ProductList');
const productAddRoot = path.join(__dirname, 'app', 'Dashboard', 'ProductAdd');

function getFolders(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

function getApiPath(folderPath) {
  // e.g. /app/Dashboard/ProductList/Adhesives => /api/adhesives
  const rel = folderPath.replace(productListRoot, '').split(path.sep).filter(Boolean).map(s => s.toLowerCase()).join('/');
  return rel ? `/api/${rel}` : '/api/products';
}

function getProductAddPath(folderPath) {
  // e.g. /app/Dashboard/ProductList/Adhesives => /Dashboard/ProductAdd/Adhesives
  const rel = folderPath.replace(productListRoot, '').split(path.sep).filter(Boolean).join('/');
  return rel ? `/Dashboard/ProductAdd/${rel}` : '/Dashboard/ProductAdd';
}

function getTitle(folderPath) {
  const rel = folderPath.replace(productListRoot, '').split(path.sep).filter(Boolean);
  if (rel.length === 0) return 'Product List';
  return rel.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') + ' Product List';
}

function writeFileIfNotExists(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function createProductList(folderPath) {
  const apiPath = getApiPath(folderPath);
  const addPath = getProductAddPath(folderPath);
  const title = getTitle(folderPath);
  const listFile = path.join(folderPath, 'ProductList.jsx');
  const viewFile = path.join(folderPath, 'ProductView.jsx');
  const pageFile = path.join(folderPath, 'page.js');

  // ProductList.jsx
  const listCode = `"use client";
import React, { useEffect, useState } from "react";
import ProductTable from "@/components/ProductTable";
import { useRouter } from "next/navigation";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = "${apiPath}";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch(API_URL + '/get');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const handleEdit = (product) => {
    router.push("${addPath}?id=" + product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    await fetch(API_URL + '/delete:' + id, { method: "DELETE" });
    fetchProducts();
  };

  const handleView = (product) => {
    router.push("./ProductView?id=" + product._id);
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

  // ProductView.jsx
  const viewCode = `"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ProductView() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const res = await fetch("${apiPath}/getOne:" + id);
    const data = await res.json();
    setProduct(data);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">{product.name}</h2>
      <div className="mb-2">Category: {product.category}</div>
      <div className="mb-2">Price: {product.fixPrice}</div>
      <div className="mb-2">Discount: {product.discount}</div>
      <div className="mb-2">Discount Price: {product.discountPrice}</div>
      <div className="mb-2">Total Product: {product.totalProduct}</div>
      <div className="mb-2">Description: {product.description}</div>
      <div className="mb-2">Tags: {product.tags && product.tags.join(', ')}</div>
      <div className="flex flex-row gap-2 flex-wrap mb-2">
        {product.photos && product.photos.map((url, idx) => (
          <img key={idx} src={url} alt="photo" className="w-16 h-16 object-cover rounded" />
        ))}
      </div>
      <div className="mb-2">Created At: {product.createdAt}</div>
      <div className="mb-2">Updated At: {product.updatedAt}</div>
    </div>
  );
}
`;

  // page.js
  const pageCode = `import ProductList from './ProductList';
export default function Page() {
  return <ProductList />;
}
`;

  fs.writeFileSync(listFile, listCode, 'utf8');
  fs.writeFileSync(viewFile, viewCode, 'utf8');
  writeFileIfNotExists(pageFile, pageCode);
}

function walkFolders(dir) {
  createProductList(dir);
  getFolders(dir).forEach(sub => walkFolders(path.join(dir, sub)));
}

walkFolders(productListRoot);

console.log('All ProductList, ProductView, and page.js files generated/updated!'); 