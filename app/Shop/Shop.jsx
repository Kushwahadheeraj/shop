"use client";
import Image from "next/image";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

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

const browse = [
  "Adhesives",
  "Cements & POP",
  "Cleaning",
  "Dry Wall Gypsum Screws",
  "Electrical Items",
  "Home",
  "House Hold Ladder",
  "LED Luminaires",
  "Locks & accessories",
  "Mask & Sanitizers",
  "Paints",
  "Pipes & Fittings",
  "Sanitary Ware & faucets",
  "Tools",
  "Uncategorized",
  "WaterProofing",
];

const electricalSubcategories = [
  "Adaptors",
  "ceiling Roses",
  "Dimmer",
  "Distribution Boards",
  "Door Bells",
  "DP-switch",
  "Earthing Accessories",
  "ELCBs OR RCCBs",
  {
    label: "Electrical Fittings",
    sub: ["Fans", "Flexible Conduit", "Flexible Wires", "Fuse Carriers", "Holders", "Indicator", "Insulation Tapes", "Isolators", "Jacks", "KIT KAT Fuses"]
  },
  {
    label: "Lights",
    sub: ["Main Switch", "MCB", "Modular/Surface Box", "Motor Starters", "Motors", "Others", "Pin top", "Plug", "Power Strips", "PVC Clips", "Regulators", "Rotary Switch", "Sockets", "Switch & Socket"]
  },
  // ...add more as needed
];

export default function Shop() {
  const [price, setPrice] = useState([0, 10000]);

  

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-2 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4">
        <div className="mb-8">
          <div className="text-gray-600 font-bold text-lg mb-1">FILTER BY PRICE</div>
          <div className="h-1 w-8 bg-gray-200 mb-4" />
          <Slider
            min={0}
            max={10000}
            step={1}
            value={price}
            onValueChange={setPrice}
            className="mb-2"
          />
          <div className="flex items-center gap-2 mt-2">
            <button
              className="bg-gray-600 text-white font-bold px-6 py-2 rounded-full text-xs tracking-widest"
            >
              FILTER
            </button>
            <span className="text-gray-600 text-sm">
              Price: <span className="font-bold">₹{price[0]}</span> — <span className="font-bold">₹{price[1]}</span>
            </span>
          </div>
        </div>
        <div>
          <Label className="font-bold mb-2 block">BROWSE</Label>
          <div className="space-y-1">
            {browse.map((cat) =>
              cat === "Electrical Items" ? (
                <Collapsible key={cat}>
                  <CollapsibleTrigger className="flex items-center w-full justify-between px-2 py-1 hover:bg-gray-100 rounded text-sm font-bold">
                    <span>{cat}</span>
                    <ChevronDown className="w-4 h-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4">
                    {electricalSubcategories.map((sub, idx) =>
                      typeof sub === "string" ? (
                        <Link key={sub} href={`/category/${sub.toLowerCase().replace(/\s+/g, "-")}`}
                          className="py-0.5 text-xs text-gray-700 hover:underline cursor-pointer block">
                          {sub}
                        </Link>
                      ) : (
                        <Collapsible key={sub.label}>
                          <CollapsibleTrigger className="flex items-center w-full justify-between py-0.5 text-xs font-semibold">
                            <span>{sub.label}</span>
                            <ChevronDown className="w-3 h-3" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-4">
                            {sub.sub.map((item) => (
                              <Link key={item} href={`/category/${item.toLowerCase().replace(/\s+/g, "-")}`}
                                className="py-0.5 text-xs text-gray-700 hover:underline cursor-pointer block">
                                {item}
                              </Link>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      )
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-2 py-1 text-sm text-gray-700 hover:underline cursor-pointer block"
                >
                  {cat}
                </Link>
              )
            )}
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="w-full md:w-3/4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories
            
            .map((cat) => (
              <div
                key={cat.name}
                className="flex flex-col items-center bg-white rounded-lg shadow hover:shadow-lg transition p-2"
              >
                <div className="w-full h-24 flex items-center justify-center mb-2">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={100}
                    height={80}
                    className="object-contain h-24 w-full"
                  />
                </div>
                <span className="text-xs font-bold text-center uppercase">{cat.name}</span>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
