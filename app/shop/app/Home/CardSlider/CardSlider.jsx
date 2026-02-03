 'use client';
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import API_BASE_URL from '@/lib/apiConfig';
import { useSectionTitle } from "@/hooks/useSectionTitle";

export default function CardSlider() {
  const scrollRef = useRef(null);
  const [cards, setCards] = useState([]);
  const { title } = useSectionTitle('card-slider', 'Top Deals');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/cardslider/get`);
        const json = await res.json();
        let list = [];
        if (json && json.success && Array.isArray(json.data)) list = json.data;
        else if (Array.isArray(json)) list = json;
        if (!mounted) return;
        setCards(
          list.map((c) => ({
            _id: c._id,
            title: c.title || c.name || "",
            image: c.image,
            subtitle:
              c.subtitle ||
              c.subTitle ||
              c.priceText ||
              c.caption ||
              c.description ||
              "",
          }))
        );
      } catch (e) {
        if (!mounted) return;
        setCards([]);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const item = container.querySelector("[data-card-item]");
    if (!item) return;
    const itemWidth = item.getBoundingClientRect().width;
    const gap = 16;
    const step = itemWidth + gap;
    const delta = direction === "left" ? -step : step;
    container.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (cards.length === 0) return null;

  return (
    <section className="w-full py-6 bg-white">
      <div className="flex items-center justify-between px-3 md:px-6 mb-3">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="relative w-full">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full shadow p-1.5"
          aria-label="Scroll Left"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 md:gap-6 no-scrollbar items-start justify-start w-full"
          style={{ scrollBehavior: "smooth" }}
        >
          {cards.map((card, idx) => (
            <div
              key={card._id || idx}
              data-card-item
              className="min-w-[140px] md:min-w-[170px] flex flex-col items-center"
            >
              <div className="w-28 h-28 md:w-32 md:h-32 flex items-center justify-center mb-2">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={120}
                  height={120}
                  className="object-contain max-h-full max-w-full"
                />
              </div>
              <p className="text-xs md:text-sm text-gray-800 text-center truncate w-full max-w-[140px]">
                {card.title}
              </p>
              {card.subtitle && (
                <p className="text-[11px] md:text-xs text-gray-500 text-center mt-0.5">
                  {card.subtitle}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full shadow p-1.5"
          aria-label="Scroll Right"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
