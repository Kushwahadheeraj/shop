"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";

const getCategoryPath = (productName) => {
  const name = (productName || "").toLowerCase();

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

export default function TopSelection() {
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/topselection/get`);
        const json = await res.json();
        let list = [];
        if (json && json.success && Array.isArray(json.data)) list = json.data;
        else if (Array.isArray(json)) list = json;
        if (!mounted) return;
        setItems(list);
      } catch (e) {
        if (!mounted) return;
        setItems([]);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (items.length === 0) return null;

  const displayItems = items.slice(0, 4);

  return (
    <div className="w-full h-full px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Top Selection</h2>
        <button
          type="button"
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 text-lg leading-none hover:bg-gray-100"
          onClick={() => {
            router.push("/Home/TopSelection");
          }}
        >
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {displayItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              const path = getCategoryPath(item.name);
              router.push(path);
            }}
          >
            <div className="w-full h-28 md:h-32 relative mb-1.5">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center w-full">
              <p className="text-xs font-semibold text-gray-900 line-clamp-2" title={item.name}>
                {item.name}
              </p>
              {item.tag && (
                <p className="text-xs font-semibold text-emerald-600 truncate" title={item.tag}>
                  {item.tag}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
