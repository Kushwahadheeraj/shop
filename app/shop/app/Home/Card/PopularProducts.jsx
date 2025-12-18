"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import API_BASE_URL from "@/lib/apiConfig";

export default function PopularProducts() {
  const { addItem } = useCart();
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/popularproducts/get`);
        const json = await res.json();
        let list = [];
        if (json && json.success && Array.isArray(json.data)) list = json.data;
        else if (Array.isArray(json)) list = json;
        else if (json && Array.isArray(json.products)) list = json.products;
        if (!mounted) return;
        setItems(list);
      } catch (e) {
        if (!mounted) return;
        setItems([]);
      }
    };
    load();
    return () => { mounted = false };
  }, []);
  if (items.length === 0) {
    return null;
  }

  const products = items.map((p) => {
    const img = p.images?.[0] || p.image || "/placeholder-image.jpg";
    const category = p.category || p.subCategory || '';
    const name = p.name || p.title || '';
    const base = p.fixPrice ?? p.price ?? p.mrp ?? null;
    const discount = p.discount ?? null;
    const discountPrice = p.discountPrice ?? (discount != null && base != null ? (Number(base) - (Number(base) * Number(discount) / 100)) : null);
    const originalPrice = discountPrice ? (base ? `₹${Number(base).toFixed(2)}` : '') : '';
    const price = discountPrice ? `₹${Number(discountPrice).toFixed(2)}` : (base != null ? `₹${Number(base).toFixed(2)}` : '');
    const badge = (typeof discount === 'number' ? `-${discount}%` : (p.discount || '')) || '';
    return {
      _id: p._id || name,
      image: img,
      category,
      name,
      price,
      originalPrice,
      discount: badge,
      buttonText: p.buttonText || 'Add to Cart',
      basePrice: base != null ? Number(base) : null,
      discountPriceNum: discountPrice != null ? Number(discountPrice) : null,
      discountValue: Number(discount) || 0,
    };
  });

  return (
    <div className="w-full mx-auto py-10 px-2">
      <h2 className="text-2xl font-bold mb-6">Popular products</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full group"
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product._id} className="md:basis-1/3 lg:basis-1/6">
              <div className="p-1">
                <Card>
                  <CardContent
                    className="flex flex-col items-center justify-center p-1 relative cursor-pointer"
                    onClick={() => {
                      try {
                        if (typeof window !== 'undefined' && product._id) {
                          const raw = {
                            _id: product._id,
                            name: product.name,
                            image: product.image,
                            images: [product.image],
                            category: product.category,
                            price: product.basePrice,
                            fixPrice: product.basePrice,
                            discountPrice: product.discountPriceNum,
                            minPrice: null,
                            maxPrice: null,
                            discount: product.discountValue,
                          };
                          window.sessionStorage.setItem('selectedProduct', JSON.stringify(raw));
                        }
                      } catch {}
                      router.push(`/product/${product._id}`);
                    }}
                  >
                    {product.discount && (
                      <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold rounded-full w-12 h-10 flex items-center justify-center">
                        {product.discount}
                      </div>
                    )}
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="object-contain h-24 w-full"
                    />
                    <div className="text-center mt-4 w-full">
                      <p className="text-xs text-gray-500">{product.category}</p>
                      <h3 className="font-semibold text-sm truncate whitespace-nowrap overflow-hidden w-full" title={product.name}>
                        {product.name}
                      </h3>
                      <p className="text-sm font-bold mt-2">
                        {product.originalPrice && (
                          <span className="line-through text-gray-400 mr-2">
                            {product.originalPrice}
                          </span>
                        )}
                        {product.price}
                      </p>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          // product.price is a formatted string like "₹314.94"
                          // Convert it to a number before adding to cart
                          const numericPrice = typeof product.price === "string"
                            ? parseFloat(product.price.replace(/[₹,\s]/g, "")) || 0
                            : Number(product.price) || 0;

                          addItem({
                            id: product._id,
                            name: product.name,
                            price: numericPrice,
                            image: product.image,
                            thumbnail: product.image
                          });
                        }}
                        variant="default"
                        className="w-full bg-yellow-300 hover:bg-yellow-300 text-white font-semibold py-2 rounded transition text-sm"
                      >
                        {product.buttonText}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious 
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-0 top-1/2 -translate-y-1/2 !bg-transparent !border-0 !shadow-none hover:!bg-transparent" 
        />
        <CarouselNext 
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-1/2 -translate-y-1/2 !bg-transparent !border-0 !shadow-none hover:!bg-transparent" 
        />
      </Carousel>
    </div>
  );
}
