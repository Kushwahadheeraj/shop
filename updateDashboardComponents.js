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

function writeProductList(folder, category) {
  const file = path.join(folder, 'ProductList.jsx');
  if (!isEmptyOrCommentOnly(file)) return;
  const code = `"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_URL = "/api/electrical/${category.toLowerCase()}";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);

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
    await fetch(`${'${API_URL}/${id}'}`, {
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
    await fetch(`${'${API_URL}/${id}'}`, { method: "DELETE" });
    fetchProducts();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Photos</th>
            <th className="border px-2 py-1">Price</th>
            <th className="border px-2 py-1">Discount</th>
            <th className="border px-2 py-1">Discount Price</th>
            <th className="border px-2 py-1">Total Product</th>
            <th className="border px-2 py-1">Category</th>
            <th className="border px-2 py-1">Tags</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="border px-2 py-1">
                {editId === product._id ? (
                  <Input name="name" value={editData.name} onChange={handleEditChange} />
                ) : (
                  product.name
                )}
              </td>
              <td className="border px-2 py-1">
                {product.photos && product.photos.length > 0 ? (
                  <div className="flex flex-row gap-1 flex-wrap">
                    {product.photos.map((url, idx) => (
                      <img key={idx} src={url} alt="photo" className="w-10 h-10 object-cover rounded" />
                    ))}
                  </div>
                ) : (
                  "-"
                )}
              </td>
              <td className="border px-2 py-1">
                {editId === product._id ? (
                  <Input name="price" type="number" value={editData.price} onChange={handleEditChange} />
                ) : (
                  product.price
                )}
              </td>
              <td className="border px-2 py-1">
                {editId === product._id ? (
                  <Input name="discount" type="number" value={editData.discount} onChange={handleEditChange} />
                ) : (
                  product.discount
                )}
              </td>
              <td className="border px-2 py-1">{product.discountPrice}</td>
              <td className="border px-2 py-1">
                {editId === product._id ? (
                  <Input name="totalProduct" type="number" value={editData.totalProduct} onChange={handleEditChange} />
                ) : (
                  product.totalProduct
                )}
              </td>
              <td className="border px-2 py-1">
                {editId === product._id ? (
                  <Input name="category" value={editData.category} onChange={handleEditChange} />
                ) : (
                  product.category
                )}
              </td>
              <td className="border px-2 py-1">
                {editId === product._id ? (
                  <Input name="tags" value={Array.isArray(editData.tags) ? editData.tags.join(", ") : (editData.tags || "")} onChange={e => setEditData(prev => ({ ...prev, tags: e.target.value.split(",").map(t => t.trim()) }))} />
                ) : (
                  Array.isArray(product.tags) && product.tags.length > 0 ? product.tags.join(", ") : "-"
                )}
              </td>
              <td className="border px-2 py-1">
                {editId === product._id ? (
                  <>
                    <Button size="sm" onClick={() => handleEditSave(product._id)} className="mr-2">Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" onClick={() => handleEdit(product)} className="mr-2">Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(product._id)}>Delete</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
`;
  fs.writeFileSync(file, code);
}

function writePageForList(folder) {
  const file = path.join(folder, 'page.jsx');
  const code = `import ProductList from "./ProductList";
export default function Page() {
  return <ProductList />;
}
`;
  fs.writeFileSync(file, code);
}

function writeProductForm(folder, category) {
  const file = path.join(folder, 'ProductForm.jsx');
  if (!isEmptyOrCommentOnly(file)) return;
  const code = `"use client";
import { useState } from "react";

export default function ProductForm() {
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
    tags: "",
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
      <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" />
      <input name="photos" type="file" multiple accept="image/*" onChange={handleFileChange} />
      <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Product"}</button>
      {message && <div>{message}</div>}
    </form>
  );
}
`;
  fs.writeFileSync(file, code);
}

function writePageForForm(folder) {
  const file = path.join(folder, 'page.jsx');
  const code = `import ProductForm from "./ProductForm";
export default function Page() {
  return <ProductForm />;
}
`;
  fs.writeFileSync(file, code);
}

// ProductList
getAllSubfolders('app/Dashboard/ProductList').forEach(folder => {
  const category = getCategoryFromPath(folder);
  writeProductList(folder, category);
  writePageForList(folder);
});
// ProductAdd
getAllSubfolders('app/Dashboard/ProductAdd').forEach(folder => {
  const category = getCategoryFromPath(folder);
  writeProductForm(folder, category);
  writePageForForm(folder);
});

console.log('All ProductList and ProductAdd folders updated with advanced ProductList.jsx/ProductForm.jsx and page.jsx files.'); 