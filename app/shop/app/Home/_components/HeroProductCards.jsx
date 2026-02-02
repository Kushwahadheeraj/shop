"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import API_BASE_URL from "@/lib/apiConfig";

const getCategoryPath = (productName) => {
  const name = (productName || "").toLowerCase();

  // Explicit Pipe Brands
  if (name.includes("prinzia")) return "/ShopPage/Pipe/PrinziaPipes";
  if (name.includes("apollo")) return "/ShopPage/Pipe/ApolloPipes";
  if (name.includes("ashirvad")) return "/ShopPage/Pipe/AshirvadPipes";
  if (name.includes("birla")) return "/ShopPage/Pipe/BirlaPipe";
  if (name.includes("finolex")) return "/ShopPage/Pipe/FinolexPipes";
  if (name.includes("nepul")) return "/ShopPage/Pipe/NepulPipes";
  if (name.includes("prakash")) return "/ShopPage/Pipe/PrakashPipe";
  if (name.includes("prince")) return "/ShopPage/Pipe/PrincePipe";
  if (name.includes("supreme")) return "/ShopPage/Pipe/SupremePipe";
  if (name.includes("tsa")) return "/ShopPage/Pipe/TSAPipe";
  if (name.includes("tata")) return "/ShopPage/Pipe/TataPipe";

  if (name.includes("adhesive") || name.includes("fevicol") || name.includes("glue")) {
    return "/ShopPage/Adhesives";
  } else if (name.includes("cement") || name.includes("pop") || name.includes("birla")) {
    return "/ShopPage/Cements";
  } else if (name.includes("cleaning") || name.includes("brush") || name.includes("mop")) {
    return "/ShopPage/Cleaning";
  } else if (
    name.includes("electrical") ||
    name.includes("wire") ||
    name.includes("switch") ||
    name.includes("bulb") ||
    name.includes("fan")
  ) {
    return "/ShopPage/Electrical/Adaptors";
  } else if (name.includes("paint") || name.includes("emulsion") || name.includes("primer")) {
    return "/ShopPage/Paint/AcrylicEmulsionPaint";
  } else if (
    name.includes("tool") ||
    name.includes("hammer") ||
    name.includes("screwdriver") ||
    name.includes("wrench")
  ) {
    return "/ShopPage/Tools/abrasives";
  } else if (
    name.includes("sanitary") ||
    name.includes("faucet") ||
    name.includes("bathroom")
  ) {
    return "/ShopPage/Sanitary/AcrylicProducts";
  } else if (name.includes("lock") || name.includes("key") || name.includes("door")) {
    return "/ShopPage/Locks/DoorAccessories";
  } else if (
    name.includes("pipe") ||
    name.includes("fitting") ||
    name.includes("plumbing")
  ) {
    return "/ShopPage/Pipe/AshirvadPipes";
  } else if (
    name.includes("roof") ||
    name.includes("sheet") ||
    name.includes("aluminium")
  ) {
    return "/ShopPage/Roofer/AluminiumSheet";
  } else if (name.includes("waterproof") || name.includes("water proof")) {
    return "/ShopPage/WaterProofing/Bathrooms";
  } else if (
    name.includes("hardware") ||
    name.includes("screw") ||
    name.includes("bolt") ||
    name.includes("nut")
  ) {
    return "/ShopPage/Hardware";
  } else if (name.includes("fiber") || name.includes("fiberglass")) {
    return "/ShopPage/Fiber";
  } else if (name.includes("fitting") || name.includes("joint")) {
    return "/ShopPage/Fitting";
  } else if (
    name.includes("home") ||
    name.includes("decor") ||
    name.includes("decoration")
  ) {
    return "/ShopPage/HomeDecor";
  } else if (name.includes("pvc") || name.includes("mat")) {
    return "/ShopPage/PvcMats";
  } else {
    return "/ShopPage/Uncategorized";
  }
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
        console.error("Error fetching hero cards:", error);
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
        // Fill with placeholders if less than 4 items to maintain layout? 
        // Or just show what we have. Amazon cards usually have 4.
        // Let's just show available items.

        return (
          <div key={idx} className="bg-white p-4 shadow-lg rounded-sm flex flex-col h-full z-20">
            <h2 className="text-xl font-bold mb-4 text-gray-900">{section.title}</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-4 flex-grow">
              {items.length > 0 ? (
                items.slice(0, 4).map((item, i) => {
                  const href = item.link || getCategoryPath(item.name);
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
