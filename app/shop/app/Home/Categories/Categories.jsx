"use client";
import Image from "next/image";
import Link from "next/link";
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
import { useSectionTitle } from "@/hooks/useSectionTitle";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const { title } = useSectionTitle('categories', 'Categories');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/categories/get`);
        const json = await res.json();
        let list = [];
        if (json && json.success && Array.isArray(json.data)) list = json.data;
        else if (Array.isArray(json)) list = json;
        if (!mounted) return;
        setCategories(list.map(c => ({
          _id: c._id,
          image: c.image,
          title: c.title || c.name,
          items: c.items || c.points || [],
          link: c.link || '#',
        })));
      } catch (e) {
        if (!mounted) return;
        setCategories([]);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  if (categories.length === 0) return null;

  return (
    <div className="w-full mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full group"
      >
        <CarouselContent className="!-ml-0 gap-4">
          {categories.map((category, index) => (
            <CarouselItem key={category._id || index} className="md:basis-1/2 lg:basis-1/4 !pl-0">
              <Card className="overflow-hidden w-full m-0 border-0 shadow-none">
                <CardContent className="!p-0">
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={450}
                    height={250}
                    className="object-cover w-full h-48"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{category.title}</h3>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600 h-24">
                      {category.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <Link href="/Shop" className="block">
                      <Button className="w-full bg-black text-white rounded-full mt-4 hover:bg-gray-800">
                        SHOP NOW <span className="ml-2 font-bold">&gt;</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
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