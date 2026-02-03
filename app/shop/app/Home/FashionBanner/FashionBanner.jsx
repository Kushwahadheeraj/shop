 "use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";
import { useSectionTitle } from "@/hooks/useSectionTitle";

function formatTwoLines(text) {
  if (!text) return null;
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return null;
  const words = clean.split(" ");
  if (words.length <= 1) return clean;
  const mid = Math.ceil(words.length / 2);
  const firstLine = words.slice(0, mid).join(" ");
  const secondLine = words.slice(mid).join(" ");
  return (
    <>
      <span className="block whitespace-nowrap">{firstLine}</span>
      <span className="block whitespace-nowrap">{secondLine}</span>
    </>
  );
}

export default function FashionBanner() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/fashionbanner/get`);
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

  const banner = items[0];
  const { title } = useSectionTitle('fashion-banner', banner.title);
  const imageOnLeft = banner.contentPosition !== "right";
  const verticalAlign = banner.verticalAlign || "center";
  const justifyClass =
    verticalAlign === "start"
      ? "justify-start"
      : verticalAlign === "end"
      ? "justify-end"
      : "justify-center";
  const backgroundColor = banner.backgroundColor || "#f3f4f6";
  const imageJustifyClass = imageOnLeft ? "justify-start" : "justify-end";

  return (
    <div className="w-full h-full">
      <div
        className="relative w-full h-56 md:h-64 lg:h-full overflow-hidden cursor-pointer shadow-md bg-gray-100"
        style={{ backgroundColor }}
      >
        <div className="absolute inset-0 flex flex-row">
          <div
            className={`flex-1 flex ${justifyClass} px-6 md:px-8 py-6 md:py-8 ${
              imageOnLeft ? "order-2 md:order-1" : "order-1"
            }`}
          >
            <div className="w-full max-w-xs md:max-w-sm lg:max-w-md">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-emerald-900 leading-snug tracking-tight">
                {formatTwoLines(title)}
              </h2>
              {banner.subtitle && (
                <p className="text-sm md:text-base mb-4 text-gray-600 leading-snug">
                  {formatTwoLines(banner.subtitle)}
                </p>
              )}
              {banner.buttonText && (
                <button
                  className="inline-flex items-center px-4 py-2.5 rounded-md bg-yellow-300 hover:bg-yellow-300 text-black text-sm font-semibold shadow transition-colors"
                  onClick={() => {
                    window.location.href = "/Shop";
                  }}
                >
                  {banner.buttonText}
                  <span className="ml-2 text-base">›</span>
                </button>
              )}
            </div>
          </div>
          <div
            className={`flex-1 relative flex items-end ${imageJustifyClass} px-3 md:px-0 py-2 md:py-6 ${
              imageOnLeft ? "order-1 md:order-2" : "order-2"
            }`}
          >
            <div className="relative w-32 h-32 md:w-44 md:h-44 lg:w-56 lg:h-56">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
