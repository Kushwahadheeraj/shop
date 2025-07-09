"use client";
import { useEffect, useState } from "react";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/electrical/Exposed Mixers")
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
