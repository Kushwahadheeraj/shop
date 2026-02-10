"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import API_BASE_URL from "@/lib/apiConfig";
import { allCategories } from "@/lib/categoryData";

const getCategoryPath = (productName) => {
  const name = (productName || "").toLowerCase().trim();
  if (!name) return "/ShopPage/Uncategorized";

  // 1. Direct Match: Product Name contains Category Name (Longer categories first)
  // Sort categories by length descending to match specific subcategories first
  const sortedCategories = [...allCategories].sort((a, b) => b.name.length - a.name.length);
  
  const nameMatch = sortedCategories.find(cat => 
    name.includes(cat.name.toLowerCase())
  );
  if (nameMatch) return nameMatch.path;

  // 2. Reverse Match: Category Name contains Product Name (e.g. Product "Switch" matches Category "Switches")
  // Only if product name is substantial (> 3 chars) to avoid matching "it", "at", etc.
  if (name.length > 3) {
    const reverseMatch = sortedCategories.find(cat => 
      cat.name.toLowerCase().includes(name)
    );
    if (reverseMatch) return reverseMatch.path;
  }

  // 3. Fallback: Specific Keyword Mappings
  if (name.includes("fevicol") || name.includes("glue") || name.includes("adhesive")) return "/ShopPage/Adhesives";
  
  // Electrical Specifics
  if (name.includes("fan")) return "/ShopPage/Electrical/Fans";
  if (name.includes("wire") || name.includes("cable")) return "/ShopPage/Electrical/WiresAndCables";
  if (name.includes("bulb")) return "/ShopPage/Electrical/Lights/LEDBulbs";
  if (name.includes("led") || name.includes("light") || name.includes("lamp")) return "/ShopPage/Electrical/Lights";
  if (name.includes("switch")) return "/ShopPage/Electrical/Switches";
  if (name.includes("socket")) return "/ShopPage/Electrical/Sockets";
  if (name.includes("mcb") || name.includes("breaker")) return "/ShopPage/Electrical/MCB";
  
  // General Electrical
  if (name.includes("havells") || name.includes("crompton") || name.includes("anchor")) return "/ShopPage/Electrical"; 
  
  if (name.includes("paint") || name.includes("primer") || name.includes("distemper")) return "/ShopPage/Paint";
  if (name.includes("pipe") || name.includes("elbow") || name.includes("tee")) return "/ShopPage/Pipe";
  if (name.includes("cement") || name.includes("putty")) return "/ShopPage/Cements";
  if (name.includes("lock") || name.includes("padlock") || name.includes("handle")) return "/ShopPage/Locks";
  if (name.includes("tap") || name.includes("faucet") || name.includes("shower")) return "/ShopPage/Sanitary";
  
  return "/ShopPage/Uncategorized";
};

const SECTIONS = [
  { key: "Construction", title: "Construction & Hardware", cta: "See all construction" },
  { key: "Home Decor", title: "Revamp your home in style", cta: "Explore home decor" },
  { key: "Electrical", title: "Electrical & Appliances", cta: "See all electricals" },
  { key: "Tools", title: "Tools & Essentials", cta: "Shop tools & more" }
];

export default function HeroProductCards() {
  const [groupedItems, setGroupedItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/heroproductcard/getGrouped`);
        const json = await res.json();
        if (json.success) {
          setGroupedItems(json.data);
        }
      } catch (error) {
        // Error fetching hero cards
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return null; // Or a skeleton

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 z-20 relative -mt-32 md:-mt-48 lg:-mt-64 mb-8 max-w-[1500px] mx-auto">
      {SECTIONS.map((section, idx) => {
        const items = groupedItems[section.key] || [];

        return (
          <div key={idx} className="bg-white p-4 shadow-lg rounded-sm flex flex-col h-full z-20">
            <h2 className="text-xl font-bold mb-4 text-gray-900">{section.title}</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-4 flex-grow">
              {items.length > 0 ? (
                items.slice(0, 4).map((item, i) => {
                  const href = getCategoryPath(item.name);
                  return (
                    <Link 
                      href={href} 
                      key={i} 
                      className="group cursor-pointer block"
                    >
                      <div className="bg-gray-100 aspect-square relative overflow-hidden mb-1">
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                      <p className="text-xs text-gray-700 truncate">{item.name}</p>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-2 flex items-center justify-center h-40 text-gray-400 text-sm">
                  No items added yet
                </div>
              )}
            </div>
            
            <Link 
              href={`/Home/HeroSection/${encodeURIComponent(section.key)}`} 
              className="text-sm text-cyan-700 hover:text-red-500 hover:underline mt-auto font-medium"
            >
              {section.cta}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
