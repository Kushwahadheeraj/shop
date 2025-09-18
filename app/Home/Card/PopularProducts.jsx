"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
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
        className="w-full"
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product._id} className="md:basis-1/3 lg:basis-1/6">
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-1 relative">
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
                    <div className="text-center mt-4">
                      <p className="text-xs text-gray-500">{product.category}</p>
                      <h3 className="font-semibold text-sm h-14">{product.name}</h3>
                      <p className="text-sm font-bold mt-2">
                        {product.originalPrice && (
                          <span className="line-through text-gray-400 mr-2">
                            {product.originalPrice}
                          </span>
                        )}
                        {product.price}
                      </p>
                      <Button
                        onClick={() => {
                          addItem({
                            id: product._id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            thumbnail: product.image
                          });
                        }}
                        variant="outline"
                        className="mt-4 border-yellow-400 text-yellow-600 hover:bg-yellow-400 hover:text-white"
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
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
}
