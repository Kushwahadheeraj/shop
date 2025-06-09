"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

// You would fetch this from an API or context in a real app
const products = [
  {
    id: 1,
    name: "Asian Paints Apcolite Rust Shield 4L",
    image: "/images/paint1.jpg",
    price: 2544,
    discountPrice: 2212,
    discount: 13,
    description:
      "A paint in popular demand because of its first-of-a-kind 2 year warranty offer. Asian Paints Apcolite Rust Shield is a PU based anti-rust enamel that is superior to every other enamel in terms of strength and durability. It is suitable for brush and spray applications, and imparts a rich gloss and smooth finish to metal surfaces along with long-term protection.",
    type: "METAL PAINTS",
    colors: [
      "Black", "Blazing White", "Brilliant White", "Brown", "Gold", "Golden Brown", "Oxford Blue", "Phirozi", "Sky Blue", "Smoke Grey"
    ],
    dimensions: "20 × 20 × 25 cm"
  },
  {
    id: 2,
    name: "Asian Paints Apcolite Rust Shield 1L",
    image: "/images/paint2.jpg",
    price: 1502,
    discountPrice: 625,
    discount: 13,
    description:
      "A paint in popular demand because of its first-of-a-kind 2 year warranty offer. Asian Paints Apcolite Rust Shield is a PU based anti-rust enamel that is superior to every other enamel in statistical terms and durability. It is suitable for brush and spray applications, and imparts a rich gloss and smooth finish to metal surfaces along with long-term protection.",
    type: "METAL PAINTS",
    colors: [
      "Black", "Blazing White", "Brilliant White", "Brown", "Gold", "Golden Brown", "Oxford Blue", "Phirozi", "Sky Blue", "Smoke Grey"
    ],
    dimensions: "20 × 20 × 25 cm"
  },
  {
    id: 3,
    name: "Asian Paints Apcolite Premium Satin Enamel 4L",
    image: "/images/paint3.jpg",
    price: 2487,
    discountPrice: 2163,
    discount: 13,
    rating: 5,
    volume: "4L",
    type: "METAL PAINTS",
    description: "High-quality satin enamel for a smooth finish. Perfect for interior and exterior use.",
    colors: ["White", "Cream", "Grey"],
    dimensions: "25 × 25 × 30 cm"
  },
  {
    id: 4,
    name: "Asian Paints Apcolite Premium Satin Enamel 1L",
    image: "/images/paint4.jpg",
    price: 707,
    discountPrice: 615,
    discount: 13,
    rating: 0,
    volume: "1L",
    type: "METAL PAINTS",
    description: "Premium satin enamel in a convenient 1L size.",
    colors: ["Black", "White"],
    dimensions: "10 × 10 × 15 cm"
  },
  {
    id: 5,
    name: "Asian Paints Apcolite Premium Gloss Enamel 20L",
    image: "/images/paint5.jpg",
    price: 10179,
    discountPrice: 8851,
    discount: 13,
    rating: 0,
    volume: "20L",
    type: "METAL PAINTS",
    description: "Large volume premium gloss enamel for extensive projects.",
    colors: ["Orange", "Yellow"],
    dimensions: "40 × 40 × 50 cm"
  },
  {
    id: 6,
    name: "Asian Paints Apcolite Premium Gloss Enamel 10L",
    image: "/images/paint6.jpg",
    price: 5433,
    discountPrice: 4725,
    discount: 13,
    rating: 0,
    volume: "10L",
    type: "METAL PAINTS",
    description: "High-gloss enamel for a durable and shiny finish.",
    colors: ["Red", "Green"],
    dimensions: "30 × 30 × 40 cm"
  },
];

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  // State for quantity
  const [quantity, setQuantity] = useState(1);

  const handleDecreaseQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  if (!product) return <div>Product not found.</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8 px-8 py-10 max-w-6xl mx-auto">
      {/* Left: Image and Discount */}
      <div className="relative flex-shrink-0 flex justify-center items-start w-full md:w-1/2">
        <span className="absolute left-2 top-2 bg-black text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          -{product.discount}%
        </span>
        <Image
          src={product.image}
          alt={product.name}
          width={350}
          height={350}
          className="object-contain rounded shadow-lg bg-white"
        />
      </div>
      {/* Right: Info */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <div className="text-lg font-semibold mb-2">
          ₹{product.discountPrice.toLocaleString()}
          <span className="text-gray-500 text-base font-normal ml-2 line-through">
            ₹{product.price.toLocaleString()}
          </span>
        </div>
        <p className="mb-4 text-gray-700">{product.description}</p>
        <div className="flex items-center mb-4">
          <span className="mr-2">Delivering all over India</span>
          <span role="img" aria-label="truck">🚚</span>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">COLORS</label>
          <select className="border rounded px-2 py-1">
            {product.colors && product.colors.map((color) => (
              <option key={color}>{color}</option>
            ))}
          </select>
        </div>
        <div className="mb-4 flex items-center">
          <button onClick={handleDecreaseQuantity} className="px-4 py-2 bg-gray-200 rounded-l">-</button>
          <span className="px-4">{quantity}</span>
          <button onClick={handleIncreaseQuantity} className="px-4 py-2 bg-gray-200 rounded-r">+</button>
          <button className="ml-4 px-6 py-2 bg-black text-white rounded font-semibold hover:bg-gray-800 transition">
            ADD TO CART
          </button>
        </div>
        <div className="mt-8 border-t pt-4">
          <h2 className="font-bold text-sm mb-2">ADDITIONAL INFORMATION</h2>
          <div className="mb-1"><span className="font-semibold">DIMENSIONS:</span> {product.dimensions}</div>
          <div><span className="font-semibold">COLORS:</span> {product.colors && product.colors.join(", ")}</div>
        </div>
      </div>
    </div>
  );
} 