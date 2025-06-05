'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import card1 from '@/public/paints.jpeg';
import card2 from '@/public/abrasives.jpeg';
import card3 from '@/public/mcb.jpeg';
import card4 from '@/public/pop.jpeg';
import card5 from '@/public/powertools.jpg';
import card6 from '@/public/cleaning.jpeg';
import card7 from '@/public/fans.jpeg';
import card8 from '@/public/almira.jpeg';
import card9 from '@/public/brackets.jpeg';
import card10 from '@/public/adhesives.jpeg';
import card11 from '@/public/electricalItems.jpeg';
import card12 from '@/public/locks.jpeg';
import card13 from '@/public/lights.webp';
import card14 from '@/public/motor.jpg';
import card15 from '@/public/pipes.jpeg';
import card16 from '@/public/pvcfiber.jpeg';
import card17 from '@/public/pvcmats.jpeg';
import card18 from '@/public/roofer.jpeg';
import card19 from '@/public/sanitaryware.jpeg';
import card20 from '@/public/spraypaints.jpeg';
import card21 from '@/public/tools.jpeg';
import card22 from '@/public/trank.webp';
import card23 from '@/public/wallpaper.jpeg';
import card24 from '@/public/waterproofing.avif';


const cards = [
  { title: 'PAINTS', image: card1 },
  { title: 'ABRASIVES', image: card2 },
  { title: 'MCB', image: card3 },
  { title: 'CEMENTS & POP', image: card4 },
  { title: 'POWER TOOLS', image: card5 },
  { title: 'CLEANING', image: card6 },
  { title: 'FANS', image: card7 },
  { title: 'ALMIRA', image: card8 },
  { title: 'BRACKETS', image: card9 },
  { title: 'ADHESIVES', image: card10 },
  { title: 'ELECTRICAL ITEMS', image: card11 },
  { title: 'LOCKS', image: card12 },
  { title: 'LIGHTS', image: card13 },
  { title: 'MOTOR', image: card14 },
  { title: 'PIPES', image: card15 },
  { title: 'PVC FIBER', image: card16 },
  { title: 'PVS MATS', image: card17 },
  { title: 'ROOFER', image: card18 },
  { title: 'SANITARYWARE', image: card19 },
  { title: 'SPRAY PAINTS', image: card20 },
  { title: 'TOOLS', image: card21 },
  { title: 'TRANK', image: card22 },
  { title: 'WALLPAPER', image: card23 },
  { title: 'WATER PROOFING', image: card24 },
];

export default function CardSlider() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

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
            key={idx}
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