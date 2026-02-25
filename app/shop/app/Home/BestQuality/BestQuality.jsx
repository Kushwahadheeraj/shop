"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";
import { useSectionTitle } from "@/hooks/useSectionTitle";
import { getCategoryPath } from "@/lib/utils";

export default function BestQuality() {
  const [items, setItems] = useState([]);
  const router = useRouter();
  const { title } = useSectionTitle('best-quality', 'Best quality');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/bestquality/get`);
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
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <button
          type="button"
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 text-lg leading-none hover:bg-gray-100"
          onClick={() => {
            router.push("/Home/BestQuality");
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
