const fs = require('fs');
const path = require('path');

function isEmptyOrCommentOnly(filePath) {
  if (!fs.existsSync(filePath)) return true;
  const content = fs.readFileSync(filePath, 'utf8').trim();
  return !content || content.startsWith('//');
}

function getAllSubfolders(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    if (entry.isDirectory()) {
      const subdir = path.join(dir, entry.name);
      results.push(subdir);
      results = results.concat(getAllSubfolders(subdir));
    }
  }
  return results;
}

function getCategoryFromPath(folderPath) {
  return path.basename(folderPath);
}

function writeProductAddPage(folder, category) {
  const file = path.join(folder, 'page.jsx');
  if (!isEmptyOrCommentOnly(file)) return;
  const code = `"use client";
import { useState } from "react";

export default function ProductAddPage() {
  const [form, setForm] = useState({
    type: "",
    name: "",
    productNo: "",
    productQualityName: "",
    description: "",
    discount: 0,
    price: "",
    totalProduct: "",
    category: "${category}",
    tag: "",
    photos: [],
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setForm({ ...form, photos: Array.from(e.target.files) });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "photos") {
        value.forEach(file => data.append("photos", file));
      } else {
        data.append(key, value);
      }
    });
    try {
      const res = await fetch("/api/electrical/${category}", {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error("Failed to add product");
      setMessage("Product added successfully!");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input name="type" value={form.type} onChange={handleChange} placeholder="Type" required />
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <input name="productNo" value={form.productNo} onChange={handleChange} placeholder="Product No" required />
      <input name="productQualityName" value={form.productQualityName} onChange={handleChange} placeholder="Quality Name" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      <input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="Discount" />
      <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required />
      <input name="totalProduct" type="number" value={form.totalProduct} onChange={handleChange} placeholder="Total Product" required />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
      <input name="tag" value={form.tag} onChange={handleChange} placeholder="Tags (comma separated)" />
      <input name="photos" type="file" multiple accept="image/*" onChange={handleFileChange} />
      <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Product"}</button>
      {message && <div>{message}</div>}
    </form>
  );
}
`;
  fs.writeFileSync(file, code);
}

function writeProductListPage(folder, category) {
  const file = path.join(folder, 'page.jsx');
  if (!isEmptyOrCommentOnly(file)) return;
  const code = `"use client";
import { useEffect, useState } from "react";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/electrical/${category}")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!products.length) return <div>No products found.</div>;

  return (
    <ul>
      {products.map(product => (
        <li key={product._id}>
          <strong>{product.name}</strong> - {product.price} ({product.category})
        </li>
      ))}
    </ul>
  );
}
`;
  fs.writeFileSync(file, code);
}

// Update ProductAdd
getAllSubfolders('app/Dashboard/ProductAdd').forEach(folder => {
  const category = getCategoryFromPath(folder);
  writeProductAddPage(folder, category);
});
// Update ProductList
getAllSubfolders('app/Dashboard/ProductList').forEach(folder => {
  const category = getCategoryFromPath(folder);
  writeProductListPage(folder, category);
});

console.log('All ProductAdd and ProductList page.jsx files updated with API code.'); 