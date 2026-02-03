"use client"
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRef, useEffect, useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";
import { useSectionTitle } from "@/hooks/useSectionTitle";

export default function Brands() {
  const carouselRef = useRef(null);
  const [brands, setBrands] = useState([]);
  const { title } = useSectionTitle('brands', 'Shop the brands');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/brands/get`);
        const json = await res.json();
        let list = [];
        if (json && json.success && Array.isArray(json.data)) list = json.data;
        else if (Array.isArray(json)) list = json;
        if (!mounted) return;
        setBrands(list.map(b => ({ _id: b._id, name: b.name, image: b.logo })));
      } catch (e) {
        if (!mounted) return;
        setBrands([]);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  // Autoplay effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const nextBtn = carouselRef.current.querySelector('[data-carousel-next]');
        if (nextBtn) nextBtn.click();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (brands.length === 0) return null;

  return (
    <div className="w-full mx-auto py-10 px-2">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div ref={carouselRef}>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {brands.map((brand, index) => (
              <CarouselItem key={brand._id || index} className="md:basis-1/4 lg:basis-1/6">
                <div className="p-2">
                  <Card className="flex items-center justify-center h-32">
                    <CardContent className="flex items-center justify-center h-full w-full p-2">
                      <Image
                        src={brand.image}
                        alt={brand.name}
                        width={120}
                        height={60}
                        className="object-contain h-16 w-full"
                        priority={index < 6}
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious 
            // variant="ghost"
            data-carousel-prev
            className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-0 top-1/2 -translate-y-1/2 !bg-transparent !border-0 !shadow-none hover:!bg-transparent" 
          />
          <CarouselNext 
            // variant="ghost"
            data-carousel-next
            className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-1/2 -translate-y-1/2 !bg-transparent !border-0 !shadow-none hover:!bg-transparent" 
          />
        </Carousel>
      </div>
    </div>
  );
}
