"use client";
import Image from "next/image";
import Link from "next/link";

const electricalProducts = [
  {
    id: 1,
    name: "L&T enGem 1 Way Switch 6ax 1m",
    image: "/images/electrical1.jpg", // Replace with your image path
    price: 68,
    discountPrice: 49,
    discount: 16,
    type: "SWITCHES",
    stockStatus: "in_stock", // "in_stock", "out_of_stock", "price_range"
  },
  {
    id: 2,
    name: "ANCHOR PENTA 16A, Deluxe Kit Kat Fuse",
    image: "/images/electrical2.jpg", // Replace with your image path
    price: 60,
    discountPrice: 60, // No discount shown
    discount: 0,
    type: "FUSE CARRIERS",
    stockStatus: "out_of_stock",
  },
  {
    id: 3,
    name: "Standard Phase Selector Rotatory Switch",
    image: "/images/electrical3.jpg", // Replace with your image path
    price: null, // Price range
    discountPrice: null,
    priceRange: "₹539.00 – ₹799.00",
    discount: 5,
    type: "ROTATORY SWITCH",
    stockStatus: "price_range",
  },
  {
    id: 4,
    name: "Samson Led Downlight 3 Watt Warm White",
    image: "/images/electrical4.jpg", // Replace with your image path
    price: 250,
    discountPrice: 150,
    discount: 40,
    type: "LED DOWNLIGHTERS/SPOT LIGHT",
    stockStatus: "in_stock",
  },
  {
    id: 5,
    name: "GM G-ERA 6A SS COMBINED – with indicator & gang box",
    image: "/images/electrical5.jpg", // Replace with your image path
    price: 90,
    discountPrice: 80,
    discount: 11,
    type: "SOCKETS",
    stockStatus: "out_of_stock_read_more", // Specific for "READ MORE"
  },
  {
    id: 6,
    name: "Havells Reo 16 A 3 Pin Multipurpose Adaptor (5 Pin) Coral – AHEMPXG165",
    image: "/images/electrical6.jpg", // Replace with your image path
    price: 150,
    discountPrice: 130,
    discount: 13,
    type: "ADAPTORS",
    stockStatus: "in_stock",
  },
];

export default function Electricals() {
  return (
    <div className="px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">Electricals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {electricalProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-3 relative flex flex-col">
            {/* Discount Badge */}
            {product.discount > 0 && (
              <span className="absolute left-3 top-3 bg-black text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                -{product.discount}%
              </span>
            )}
            {/* Product Image */}
            <div className="h-40 flex items-center justify-center mb-3 relative group">
              <Image
                src={product.image}
                alt={product.name}
                width={160}
                height={160}
                className="object-contain h-full w-full rounded"
              />
              {/* Overlay for Quick View or Out of Stock */}
              {/* {product.stockStatus === "in_stock" && (
                <div className="absolute left-0 right-0 bottom-0 h-10 flex items-center justify-center bg-yellow-400 rounded-b transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer">
                  <span className="text-white font-semibold text-lg">QUICK VIEW</span>
                </div>
              )} */}
              {(product.stockStatus === "out_of_stock" || product.stockStatus === "out_of_stock_read_more") && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-600 bg-opacity-75 text-white font-bold text-lg rounded">
                  OUT OF STOCK
                </div>
              )}
            </div>
            {/* Product Info */}
            <div className="flex-1 flex flex-col">
              <span className="text-xs text-gray-500 mb-1">{product.type}</span>
              <span className="font-medium text-sm mb-1">{product.name}</span>
              {/* Price */}
              <div className="mb-1">
                {product.priceRange ? (
                  <span className="font-bold text-base">{product.priceRange}</span>
                ) : (
                  <>
                    <span className="text-gray-400 line-through text-xs mr-2">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="font-bold text-base">
                      ₹{product.discountPrice.toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              {/* Button */}
              {product.stockStatus === "in_stock" && (
                <Link href={`/product/${product.id}`} passHref>
                  <button className="mt-auto bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded transition w-full">
                    ADD TO CART
                  </button>
                </Link>
              )}
              {product.stockStatus === "price_range" && (
                <Link href={`/product/${product.id}`} passHref>
                  <button className="mt-auto bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded transition w-full">
                    SELECT OPTIONS
                  </button>
                </Link>
              )}
              {product.stockStatus === "out_of_stock_read_more" && (
                <Link href={`/product/${product.id}`} passHref>
                  <button className="mt-auto bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded transition w-full">
                    READ MORE
                  </button>
                </Link>
              )}
              {product.stockStatus === "out_of_stock" && (
                <button className="mt-auto bg-gray-300 text-gray-600 font-semibold py-2 rounded cursor-not-allowed w-full">
                  SELECT OPTIONS
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}