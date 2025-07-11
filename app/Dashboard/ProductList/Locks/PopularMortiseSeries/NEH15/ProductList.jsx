"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_URL = "/api/cleaning-products";

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
    await fetch(`${API_URL}/${id}`, {
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
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
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
            <th className="border px-2 py-1">Fix Price</th>
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
                  <Input name="fixPrice" type="number" value={editData.fixPrice} onChange={handleEditChange} />
                ) : (
                  product.fixPrice
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
                  <Input name="tags" value={editData.tags ? editData.tags.join(", ") : ""} onChange={e => setEditData(prev => ({ ...prev, tags: e.target.value.split(",").map(t => t.trim()) }))} />
                ) : (
                  product.tags && product.tags.length > 0 ? product.tags.join(", ") : "-"
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