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
import { useRef, useEffect } from "react";

const brands = [
  { name: "Havells", image: "/brands/havells.png" },
  { name: "Stanley", image: "/brands/stanley.png" },
  { name: "Philips", image: "/brands/philips.png" },
  { name: "Finolex", image: "/brands/finolex.png" },
  { name: "Anchor", image: "/brands/anchor.png" },
  { name: "Fevicol", image: "/brands/fevicol.png" },
  { name: "Asian Paints", image: "/brands/asianpaints.png" },
  { name: "Bosch", image: "/brands/bosch.png" },
  { name: "Crompton", image: "/brands/crompton.png" },
  { name: "Godrej", image: "/brands/godrej.png" },
  { name: "Havmor", image: "/brands/havmor.png" },
  { name: "Jindal", image: "/brands/jindal.png" },
  { name: "Pidilite", image: "/brands/pidilite.png" },
  { name: "Polycab", image: "/brands/polycab.png" },
  { name: "RR Kabel", image: "/brands/rrkabel.png" },
  { name: "Schneider", image: "/brands/schneider.png" },
  { name: "Usha", image: "/brands/usha.png" },
  { name: "V-Guard", image: "/brands/vguard.png" },
  { name: "Venus", image: "/brands/venus.png" },
  { name: "Wipro", image: "/brands/wipro.png" },
];

export default function Brands() {
  const carouselRef = useRef(null);

  // Autoplay effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        // Find the next button and click it
        const nextBtn = carouselRef.current.querySelector('[data-carousel-next]');
        if (nextBtn) nextBtn.click();
      }
    }, 2000); // Change slide every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full mx-auto py-10 px-2">
      <h2 className="text-lg font-bold mb-4">Shop the brands</h2>
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
              <CarouselItem key={index} className="md:basis-1/4 lg:basis-1/6">
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
          <CarouselPrevious data-carousel-prev className="absolute left-0 top-1/2 -translate-y-1/2" />
          <CarouselNext data-carousel-next className="absolute right-0 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </div>
  );
}
