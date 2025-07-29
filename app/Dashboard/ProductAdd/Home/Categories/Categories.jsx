import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const categories = [
  {
    image: "/paints.jpg",
    title: "Asian Paints",
    items: ["Interior Paints", "Exterior Paints", "Wood & Metal", "Painting Tools"],
    link: "/paints",
  },
  {
    image: "/electrical.jpg",
    title: "Electricals",
    items: ["Fans", "Lights", "MCB", "Motors/Water Pumps"],
    link: "/electricals",
  },
  {
    image: "/tools.jpg",
    title: "Tools",
    items: ["Screw Driver", "Hammers", "Power Tools", "Tool Kit Set"],
    link: "/tools",
  },
  {
    image: "/sanitaryware.jpg",
    title: "Fittings",
    items: ["Parryware", "Watertec", "Hindware", "Corsa"],
    link: "/fittings",
  },
  {
    image: "/wallpaper.jpeg",
    title: "Home Decor",
    items: ["Wallpaper", "Curtains", "Clocks", "Mirrors"],
    link: "/decor",
  },
  {
    image: "/locks.jpeg",
    title: "Hardware Parts",
    items: ["Locks & Latches", "Brackets", "Hinges", "Screws & Nails"],
    link: "/hardware",
  },
  {
    image: "/roofer.jpg",
    title: "Roofer",
    items: ["Roofing Sheets", "Waterproofing", "Gutters", "Ventilators"],
    link: "/roofer",
  },
];

export default function Categories() {
  return (
    <div className="w-full mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6">Categories</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {categories.map((category, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
              <div className="p-1">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <Image
                      src={category.image}
                      alt={category.title}
                      width={400}
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
                      <Link href={category.link} passHref>
                        <Button className="w-full bg-black text-white rounded-full mt-4 hover:bg-gray-800">
                          SHOP NOW <span className="ml-2 font-bold">&gt;</span>
                        </Button>
                      </Link>
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