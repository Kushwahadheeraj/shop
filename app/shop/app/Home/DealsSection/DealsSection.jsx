"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";
import { useSectionTitle } from "@/hooks/useSectionTitle";

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

function DealsColumn({ title, subtitleKey, items, onViewAll }) {
  const router = useRouter();
  if (!items || items.length === 0) return null;
  const displayItems = items.slice(0, 4);

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        </div>
        <button
          type="button"
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 text-sm leading-none hover:bg-gray-100"
          onClick={onViewAll}
        >
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 p-3">
        {displayItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col items-start gap-3 cursor-pointer hover:shadow-md transition-shadow"
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
            <div className="w-full px-1 py-2">
              <p className="text-[11px] font-medium text-gray-900 line-clamp-2" title={item.name}>
                {item.name}
              </p>
              {item[subtitleKey] && (
                <p className="text-[11px] font-semibold text-emerald-600 mt-1 truncate">
                  {item[subtitleKey]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DealsSection() {
  const [discountItems, setDiscountItems] = useState([]);
  const [topRatedItems, setTopRatedItems] = useState([]);
  const [furnitureItems, setFurnitureItems] = useState([]);
  const router = useRouter();

  const { title: discountTitle } = useSectionTitle('deals-discount', 'Discounts for you');
  const { title: topRatedTitle } = useSectionTitle('deals-top-rated', 'Top rated');
  const { title: furnitureTitle } = useSectionTitle('deals-furniture', 'Furniture deals');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [discountRes, topRes, furnitureRes] = await Promise.all([
          fetch(`${API_BASE_URL}/home/deals/get`).catch(() => null),
          fetch(`${API_BASE_URL}/home/toprateddeals/get`).catch(() => null),
          fetch(`${API_BASE_URL}/home/furnituredeals/get`).catch(() => null),
        ]);

        const handleJson = async (res, setter) => {
          if (!res) {
            setter([]);
            return;
          }
          try {
            const json = await res.json();
            let list = [];
            if (json && json.success && Array.isArray(json.data)) list = json.data;
            else if (Array.isArray(json)) list = json;
            if (!mounted) return;
            setter(list);
          } catch {
            if (!mounted) return;
            setter([]);
          }
        };

        await Promise.all([
          handleJson(discountRes, setDiscountItems),
          handleJson(topRes, setTopRatedItems),
          handleJson(furnitureRes, setFurnitureItems),
        ]);
      } catch {
        if (!mounted) return;
        setDiscountItems([]);
        setTopRatedItems([]);
        setFurnitureItems([]);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (
    discountItems.length === 0 &&
    topRatedItems.length === 0 &&
    furnitureItems.length === 0
  ) {
    return null;
  }

  return (
    <div className="bg-sky-100">
      <div className="max-w-8xl mx-auto px-2 py-2 grid grid-cols-1 lg:grid-cols-3 gap-3">
        <DealsColumn
          title={discountTitle}
          subtitleKey="subtitle"
          items={discountItems}
          onViewAll={() => router.push("/Home/DiscountsForYou")}
        />
        <DealsColumn
          title={topRatedTitle}
          subtitleKey="discount"
          items={topRatedItems}
          onViewAll={() => router.push("/Home/TopRatedDeals")}
        />
        <DealsColumn
          title={furnitureTitle}
          subtitleKey="discount"
          items={furnitureItems}
          onViewAll={() => router.push("/Home/FurnitureDeals")}
        />
      </div>
    </div>
  );
}
