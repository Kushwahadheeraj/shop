"use client";
 
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import API_BASE_URL from "@/lib/apiConfig";
import { getCategoryPath } from "@/lib/utils";
 
export default function BestQualityPage() {
  const [items, setItems] = useState([]);
  const router = useRouter();

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:mt-32 mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Best quality</h1>
          <p className="text-sm text-gray-500">
            All items added in the Best quality section
          </p>
        </div>
        <Link
          href="/Home"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Home
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                const path = getCategoryPath(item.name);
                router.push(path);
              }}
            >
              <div className="w-full h-32 md:h-40 relative mb-1.5">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-center w-full">
                <p
                  className="text-sm font-semibold text-gray-900 line-clamp-2"
                  title={item.name}
                >
                  {item.name}
                </p>
                {item.tag && (
                  <p
                    className="text-xs font-semibold text-emerald-600 truncate"
                    title={item.tag}
                  >
                    {item.tag}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
