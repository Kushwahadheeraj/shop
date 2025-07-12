"use client";
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
    const res = await fetch(API_BASE_URL + "/sanitary/essess/labtaps/getOne:" + id);
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
