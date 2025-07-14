"use client";
import { useState } from "react";

export default function ProductForm() {
  return (<h2 className="text-xl font-bold mb-2">Add DoorPulls Product</h2>)
  const [form, setForm] = useState({
    type: "",
    name: "",
    productNo: "",
    productQualityName: "",
    description: "",
    discount: 0,
    price: "",
    totalProduct: "",
    category: "Door Pulls",
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
      const res = await fetch(API_BASE_URL + "/electrical/Door Pulls", {
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

