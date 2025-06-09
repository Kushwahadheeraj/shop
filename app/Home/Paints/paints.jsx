"use client";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Asian Paints Apcolite Rust Shield 4L",
    image: "/images/paint1.jpg",
    price: 2544,
    discountPrice: 2212,
    discount: 13,
    rating: 0,
    volume: "4L",
    type: "METAL PAINTS",
  },
  {
    id: 2,
    name: "Asian Paints Apcolite Rust Shield 1L",
    image: "/images/paint2.jpg",
    price: 1502,
    discountPrice: 625,
    discount: 13,
    rating: 0,
    volume: "1L",
    type: "METAL PAINTS",
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
  },
];

export default function Paints() {

  return (
    <div className="px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">New arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-3 relative flex flex-col">
            {/* Discount Badge */}
            <span className="absolute left-3 top-3 bg-black text-white text-xs font-bold px-2 py-1 rounded-full z-10">
              -{product.discount}%
            </span>
            {/* Product Image */}
            <div className="h-40 flex items-center justify-center mb-3 relative group">
              <Image
                src={product.image}
                alt={product.name}
                width={160}
                height={160}
                className="object-contain h-full w-full rounded"
              />
 
            </div>
            {/* Product Info */}
            <div className="flex-1 flex flex-col">
              
              <span className="text-xs text-gray-500 mb-1">{product.type}</span>
              <span className="font-medium text-sm mb-1">{product.name}</span>
              {/* Price */}
              <div className="mb-1">
                <span className="text-gray-400 line-through text-xs mr-2">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="font-bold text-base">
                  ₹{product.discountPrice.toLocaleString()}
                </span>
              </div>
              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < product.rating ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                </div>
              )}
              {/* Button */}
              <Link href={`/product/${product.id}`} passHref>
                <button className="mt-auto cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded transition w-full">
                  SELECT OPTIONS
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}