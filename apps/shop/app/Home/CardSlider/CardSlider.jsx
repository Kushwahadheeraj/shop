'use client';
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import API_BASE_URL from '@/lib/apiConfig';

export default function CardSlider() {
  const scrollRef = useRef(null);
  const [cards, setCards] = useState([]);

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
        setCards(list.map(c => ({ _id: c._id, title: c.title || c.name || '', image: c.image })));
      } catch (e) {
        if (!mounted) return;
        setCards([]);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (cards.length === 0) return null;

  return (
    <div className="relative w-full max-w-full mx-auto py-8 bg-white">
      {/* Left Arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full shadow p-2"
        aria-label="Scroll Left"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-12 px-10 scrollbar-hide items-end justify-center"
        style={{ scrollBehavior: 'smooth' }}
      >
        {cards.map((card, idx) => (
          <div
            key={card._id || idx}
            className="min-w-[200px] flex flex-col items-center"
          >
            <Image
              src={card.image}
              alt={card.title}
              className="w-[200px] h-[180px] object-contain mb-3"
              width={200}
              height={180}
            />
            <h3 className="font-bold text-base md:text-lg tracking-wide uppercase text-center mt-2 mb-1">
              {card.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full shadow p-2"
        aria-label="Scroll Right"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}