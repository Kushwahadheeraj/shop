"use client";
import Image from "next/image";
import Link from "next/link";
import PersistentShopSidebar from "@/components/PersistentShopSidebar";
import { useEffect, useState } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = mobileOpen ? "hidden" : "";
    }
  }, [mobileOpen]);

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8">
      {/* Sidebar: hidden on mobile, visible on md+ like UniversalShopPage */}
      <div className="hidden md:block">
        <PersistentShopSidebar />
      </div>
      {/* Main Content */}
      <main className="w-full md:flex-1 lg:mt-36 mt-16">
        {/* Breadcrumb + Filter (centered on mobile) */}
        <div className="bg-white border-b border-gray-200 py-3 mb-4">
          <div className="px-2 sm:px-4">
            <nav className="flex items-center justify-center md:justify-start space-x-2 text-xs md:text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">HOME</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-semibold">SHOP</span>
            </nav>
            <button onClick={() => setMobileOpen(true)} className="md:hidden mt-2 flex items-center justify-center gap-2 text-gray-600 text-xs w-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 5h18M6 12h12M10 19h4" />
              </svg>
              <span>FILTER</span>
            </button>
          </div>
        </div>
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

      {/* Mobile Filter Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 md:hidden z-50">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-white transform transition-transform duration-300 translate-x-0 relative z-10">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close filter"
              className="absolute top-2 right-2 w-6 h-6 rounded-full border border-white text-black flex items-center justify-center bg-transparent"
            >
              ×
            </button>
            <div className="p-0 pt-2">
              <PersistentShopSidebar forceMobile />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
