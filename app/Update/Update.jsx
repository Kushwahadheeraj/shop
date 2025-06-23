import Image from "next/image";
import { Star } from "lucide-react";

const columns = [
  {
    title: "LATEST",
    products: [
      {
        image: "/paints.jpg",
        name: "Asian Paints Apcolite Rust Shield 4L",
        price: "₹2,212.00",
        originalPrice: "₹2,544.00",
        rating: 0,
      },
      {
        image: "/paints.jpg",
        name: "Asian Paints Apcolite Rust Shield 1L",
        price: "₹625.00 – ₹1,502.00",
        originalPrice: "",
        rating: 0,
      },
      {
        image: "/paints.jpg",
        name: "Asian Paints Apcolite Premium Satin Enamel 4L",
        price: "₹2,163.00",
        originalPrice: "₹2,487.00",
        rating: 5,
      },
    ],
  },
  {
    title: "BEST SELLING",
    products: [
      {
        image: "/blocks.png",
        name: "Renacon Light Weight AAC Blocks & Bricks",
        price: "₹60.00 – ₹120.00",
        originalPrice: "",
        rating: 0,
      },
      {
        image: "/holder.png",
        name: "Havells Reo Eco Batten Holder (Plastic Ring) - AHEHMPW000",
        price: "₹25.00",
        originalPrice: "₹30.00",
        rating: 0,
      },
      {
        image: "/putty.png",
        name: "Putty Blade/Plate",
        price: "₹12.00 – ₹35.00",
        originalPrice: "",
        rating: 5,
      },
      {
        image: "/socket.png",
        name: "ANCHOR PENTA 6A, 3 Pin Socket",
        price: "",
        originalPrice: "",
        rating: 5,
      },
    ],
  },
  {
    title: "TOP RATED",
    products: [
      {
        image: "/fevicol.png",
        name: "Pidilite Fevicol DDL",
        price: "₹28.00 – ₹178.00",
        originalPrice: "",
        rating: 5,
      },
      {
        image: "/cupwheel.png",
        name: "Caltex Cup Wheel Turbo",
        price: "₹241.00 – ₹339.00",
        originalPrice: "",
        rating: 5,
      },
      {
        image: "/allenkey.png",
        name: "Caltex Allen Key Set - Mini",
        price: "₹96.00",
        originalPrice: "₹111.00",
        rating: 5,
      },
    ],
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-red-500 fill-red-500" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

export default function Update() {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {columns.map((col, idx) => (
          <div key={col.title}>
            <h3 className="text-md font-bold tracking-widest mb-2 flex items-center gap-2">
              <span>{col.title}</span>
              <span className="flex-1 border-t border-gray-200"></span>
            </h3>
            <div className="space-y-4 pt-4">
              {col.products.map((product, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="object-contain rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm leading-tight">{product.name}</div>
                    {product.rating > 0 && (
                      <StarRating rating={product.rating} />
                    )}
                    <div className="mt-1 text-sm">
                      {product.originalPrice && (
                        <span className="line-through text-gray-400 mr-1">{product.originalPrice}</span>
                      )}
                      <span className="font-bold">{product.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
