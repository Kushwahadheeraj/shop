"use client";
import Image from "next/image";
import Link from "next/link";
import PersistentShopSidebar from "@/components/PersistentShopSidebar";

const categories = [
  { name: "Uncategorized", image: "/categories/uncategorized.png" },
  { name: "Adhesives", image: "/categories/adhesives.png" },
  { name: "Cements & POP", image: "/categories/cements.png" },
  { name: "Cleaning", image: "/categories/cleaning.png" },
  { name: "Dry Wall Gypsum Screws", image: "/categories/drywall.png" },
  { name: "Electrical Items", image: "/categories/electrical.png" },
  { name: "House Hold Ladder", image: "/categories/ladder.png" },
  { name: "Locks & Accessories", image: "/categories/locks.png" },
  { name: "Mask & Sanitizers", image: "/categories/mask.png" },
  { name: "Paints", image: "/categories/paints.png" },
  { name: "Pipes & Fittings", image: "/categories/pipes.png" },
  { name: "Sanitary Ware & Faucets", image: "/categories/sanitary.png" },
  { name: "Tools", image: "/categories/tools.png" },
  { name: "Waterproofing", image: "/categories/waterproofing.png" },
];



export default function Shop() {
  return (
    <div className="w-full max-w-7xl mx-auto py-8  px-4 flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <PersistentShopSidebar />
      {/* Main Content */}
      <main className="w-full mt-36 lg:w-3/4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            // Map category names to ShopPage folder names
            const categoryMap = {
              "Uncategorized": "Uncategorized",
              "Adhesives": "Adhesives", 
              "Cements & POP": "Cements",
              "Cleaning": "Cleaning",
              "Dry Wall Gypsum Screws": "Dry",
              "Electrical Items": "Electrical",
              "House Hold Ladder": "Hardware",
              "Locks & Accessories": "Locks",
              "Mask & Sanitizers": "Cleaning",
              "Paints": "Paint",
              "Pipes & Fittings": "Pipe",
              "Sanitary Ware & Faucets": "Sanitary",
              "Tools": "Tools",
              "Waterproofing": "WaterProofing"
            };
            
            const folderName = categoryMap[cat.name] || cat.name;
            
            return (
              <Link
                key={cat.name}
                href={`/ShopPage/${folderName}`}
                className="group flex flex-col items-center bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
              >
                <div className="w-full h-32 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={120}
                    height={120}
                    className="object-contain h-32 w-full"
                  />
                </div>
                <span className="text-sm font-semibold text-center text-gray-800 leading-tight group-hover:text-blue-600 transition-colors duration-200">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
