"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ProductForm({ product, onSave }) {
  const [form, setForm] = useState(product || {
    name: '', rate: '', min: '', max: '', description: '', discount: '', price: '', photos: []
  });
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = e => {
    setFiles([...e.target.files]);
    setPreview([...e.target.files].map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    files.forEach(f => data.append('photos', f));
    const res = await fetch('/api/products', { method: product ? 'PUT' : 'POST', body: data });
    if (res.ok) onSave && onSave();
  };

  const discountPrice = form.price && form.discount
    ? form.price - (form.price * form.discount / 100)
    : form.price;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      <Input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required />
      <Input name="rate" type="number" value={form.rate} onChange={handleChange} placeholder="Rate" required />
      <Input name="min" type="number" value={form.min} onChange={handleChange} placeholder="Min" required />
      <Input name="max" type="number" value={form.max} onChange={handleChange} placeholder="Max" required />
      <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      <Input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required />
      <Input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="Discount (%)" />
      <div>Discounted Price: <b>{discountPrice}</b></div>
      <Input name="photos" type="file" multiple onChange={handleFiles} />
      <div className="flex gap-2">{preview.map((src, i) => <img key={i} src={src} className="w-16 h-16 object-cover" />)}</div>
      <Button type="submit">{product ? 'Update' : 'Create'} Product</Button>
    </form>
  );
} 