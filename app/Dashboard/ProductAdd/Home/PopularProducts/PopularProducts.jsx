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

const products = [
  {
    discount: "-25%",
    image: "/opcolite.png", // Replace with your actual image path
    category: "STAINERS/THINNERS",
    name: "Asian Paints Apcolite Paint Remover",
    price: "₹800.00 – ₹2600.00",
    originalPrice: "",
    buttonText: "Select Options",
  },
  {
    discount: "17%",
    image: "/faucet.png", // Replace with your actual image path
    category: "FAUCETS",
    name: "Hindware Avior Pillar Cock Tall",
    price: "₹2,988.00",
    originalPrice: "₹3,600.00",
    buttonText: "Add to Cart",
  },
  {
    discount: "-13%",
    image: "/epoxy.png", // Replace with your actual image path
    category: "WATERPROOFING",
    name: "Asian Paints SmartCare Epoxy TileBlock",
    price: "₹812.00 – ₹2,238.00",
    originalPrice: "",
    buttonText: "Select Options",
  },
  {
    discount: "-30%",
    image: "/woodstain.png", // Replace with your actual image path
    category: "STAINERS/THINNERS",
    name: "Sheenlac Wood Stain 100ml",
    price: "₹170.00",
    originalPrice: "₹200.00",
    buttonText: "Select Options",
  },
  {
    discount: "-31%",
    image: "/tones.png", // Replace with your actual image path
    category: "STAINERS/THINNERS",
    name: "Asian Paints WoodTech Tones Wood Stainer Walnut 100ml",
    price: "₹95.00",
    originalPrice: "₹135.00",
    buttonText: "Add to Cart",
  },
  {
    discount: "-33%",
    image: "/adapter.png", // Replace with your actual image path
    category: "ADAPTORS",
    name: "Havells Reo 6 A 3 Pin Multipurpose Adaptor (6 Pin) Blue – AHREWDX065",
    price: "₹39.00",
    originalPrice: "₹59.00",
    buttonText: "Add to Cart",
  },
];

export default function PopularProducts() {
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
          {products.map((product, index) => (
            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/6">
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-1 relative">
                    <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold rounded-full w-12 h-10 flex items-center justify-center">
                      {product.discount}
                    </div>
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
