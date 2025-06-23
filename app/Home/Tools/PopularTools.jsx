import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const tools = [
  {
    discount: "-14%",
    image: "/tools.jpeg",
    category: "HAND TOOLS",
    name: "CALTEX Aluminium Try Square With Level",
    rating: 4,
    price: "₹168.00 - ₹284.00",
    originalPrice: "",
    buttonText: "Select Options",
  },
  {
    discount: "-12%",
    image: "/adhesives.jpeg",
    category: "ALLEN KEYS",
    name: "Taparia KM-9V Allen Key Sets - Black Finish (mm)",
    rating: 0,
    price: "₹181.00",
    originalPrice: "₹205.00",
    buttonText: "Add to Cart",
  },
  {
    discount: "-9%",
    image: "/file.svg",
    category: "FILES",
    name: "TAPARIA Flat Super Light",
    rating: 3,
    price: "₹138.00",
    originalPrice: "₹152.00",
    buttonText: "Add to Cart",
  },
  {
    discount: "-11%",
    image: "/tools.jpeg",
    category: "MEASURING TAPE",
    name: "Caltex Measuring Tape",
    rating: 4.5,
    price: "₹63.95 - ₹327.44",
    originalPrice: "",
    buttonText: "Select Options",
  },
  {
    discount: "-20%",
    image: "/powertools.jpg",
    category: "GRINDERS & VIBRATORS",
    name: "Bosch GWS 2000 Professional Angle Grinder",
    rating: 5,
    price: "₹7,000.00",
    originalPrice: "₹8,750.00",
    buttonText: "Add to Cart",
  },
  {
    discount: "-9%",
    image: "/tools.jpeg",
    category: "WRENCH",
    name: "TAPARIA Pipe Wrenches",
    rating: 4.5,
    price: "₹8,220.00 - ₹102,230.00",
    originalPrice: "",
    buttonText: "Select Options",
  },
];

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

export default function PopularTools() {
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
            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/6">
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-2 relative">
                    <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold rounded-full w-12 h-10 flex items-center justify-center">
                      {tool.discount}
                    </div>
                    <Image
                      src={tool.image}
                      alt={tool.name}
                      width={150}
                      height={150}
                      className="object-contain h-36 w-full"
                    />
                    <div className="text-center mt-4">
                      <p className="text-xs text-gray-500">{tool.category}</p>
                      <h3 className="font-semibold text-sm h-10">{tool.name}</h3>
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