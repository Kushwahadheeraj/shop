"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
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
import { Star } from "lucide-react";

export default function PopularTools() {
  const [tools, setTools] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    let mounted = true;
    const toAbs = (u) => {
      if (!u || typeof u !== 'string') return '';
      if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
      const base = API_BASE_URL.replace(/\/$/, '');
      const path = u.startsWith('/') ? u : `/${u}`;
      return `${base}${path}`;
    };
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/producttools/get`);
        const json = await res.json();
        let list = [];
        if (json && json.success && Array.isArray(json.data)) list = json.data; else if (Array.isArray(json)) list = json;
        if (!mounted) return;
        const mapped = list.map((p, idx) => {
          const images = Array.isArray(p.images) ? p.images : (Array.isArray(p.photos) ? p.photos : []);
          const image = images[0] ? toAbs(images[0]) : '';
          const name = p.name || p.title || '';
          const category = p.category || '';
          const rating = Number(p.rating || 0);
          const base = p.price ?? p.fixPrice ?? null;
          const current = p.discountPrice ?? p.fixPrice ?? p.price ?? null;
          let discount = p.discount ?? 0;
          if ((!discount || isNaN(discount)) && base && current && Number(base) > 0 && Number(base) > Number(current)) {
            discount = Math.round((1 - (Number(current) / Number(base))) * 100);
          }
          const priceStr = current != null ? `₹${Number(current).toLocaleString('en-IN')}` : '';
          const originalStr = base != null && Number(discount) > 0 ? `₹${Number(base).toLocaleString('en-IN')}` : '';
          const hasRange = p.minPrice != null && p.maxPrice != null && Number(p.minPrice) !== Number(p.maxPrice);
          const rangeStr = hasRange ? `₹${Number(p.minPrice).toLocaleString('en-IN')} - ₹${Number(p.maxPrice).toLocaleString('en-IN')}` : '';
          return {
            id: p._id || idx,
            image,
            name,
            category,
            rating,
            price: hasRange ? rangeStr : priceStr,
            originalPrice: hasRange ? '' : originalStr,
            discount: discount ? `-${discount}%` : '',
            buttonText: hasRange ? 'Select Options' : 'Add to Cart',
          };
        });
        setTools(mapped);
      } catch {
        if (!mounted) return;
        setTools([]);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  if (tools.length === 0) return null;

  return (
    <div className="w-full mx-auto py-10 px-2">
      <h2 className="text-3xl font-bold mb-6">Popular Tools</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {tools.map((tool, index) => (
            <CarouselItem key={tool.id || index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-2 relative">
                    {tool.discount && (
                    <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold rounded-full w-12 h-10 flex items-center justify-center">
                      {tool.discount}
                    </div>
                    )}
                    <Image
                      src={tool.image || '/placeholder-image.jpg'}
                      alt={tool.name}
                      width={150}
                      height={150}
                      className="object-contain h-36 w-full"
                    />
                    <div className="text-center mt-4">
                      <p className="text-xs text-gray-500">{tool.category}</p>
                      <h3
                        className="font-semibold text-sm"
                        style={expanded[tool.id] ? {} : {
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {tool.name}
                      </h3>
                      {tool.name && tool.name.length > 60 && (
                        <button
                          className="mt-1 text-xs text-blue-600 underline"
                          onClick={() => setExpanded(prev => ({ ...prev, [tool.id]: !prev[tool.id] }))}
                        >
                          {expanded[tool.id] ? 'Read less' : 'Read more'}
                        </button>
                      )}
                      <div className="flex justify-center my-2">
                        <StarRating rating={tool.rating} />
                      </div>
                      <p className="text-sm font-bold">
                        {tool.originalPrice && (
                          <span className="line-through text-gray-400 mr-2">
                            {tool.originalPrice}
                          </span>
                        )}
                        {tool.price}
                      </p>
                      <Button variant="outline" className="mt-4 border-yellow-400 text-yellow-600 hover:bg-yellow-400 hover:text-white">
                        {tool.buttonText}
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

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />);
    } else if (i - 0.5 === rating) {
      stars.push(<Star key={i} className="w-4 h-4 text-yellow-500" />);
    } else {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
  }
  return <div className="flex">{stars}</div>;
};

// (component exported above)