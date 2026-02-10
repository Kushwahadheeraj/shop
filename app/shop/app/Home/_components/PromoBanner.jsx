"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import API_BASE_URL from "@/lib/apiConfig";
import { useSectionTitle } from "@/hooks/useSectionTitle";

export default function PromoBanner() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { title } = useSectionTitle('promo-banner', data?.title || 'Promo Banner');

  useEffect(() => {
    fetch(`${API_BASE_URL}/home/promobanner/get`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  if (loading) return null;
  if (!data) return null;

  return (
    <div className="w-full max-w-8xl mx-auto px-2 py-2">
      <div className="flex flex-col md:flex-row w-full h-auto md:h-[380px] rounded-xl overflow-hidden shadow-sm">
        
        {/* Left Section - Promotional Text */}
        <div className="w-full md:w-[40%] bg-amber-500 p-8 flex flex-col justify-center items-start text-white relative overflow-hidden">
           {/* Background decorative circles or gradients can be added here via CSS */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full blur-2xl opacity-50 -mr-10 -mt-10"></div>
           
           <h3 className="text-xl md:text-2xl font-medium mb-1 z-10">{title}</h3>
           <h2 className="text-3xl md:text-5xl font-bold mb-4 z-10 text-yellow-100">{data.subtitle}</h2>
        </div>

        {/* Right Section - 4 Cards */}
        <div className="w-full md:w-[60%] bg-[#800080] p-4 md:p-8 flex items-center justify-center relative">
          {/* Background decorative elements */}
           <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full blur-xl opacity-50"></div>
           
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full z-10 h-full items-center">
            {data.cards && data.cards.map((card, index) => (
              <Link 
                key={index} 
                href={card.link || "/shop"}
                className="flex flex-col items-center group h-full justify-center"
              >
                <div className="w-full aspect-[3/4] bg-amber-100 border-2 border-amber-200 rounded-xl p-2 flex items-center justify-center mb-3 shadow-md group-hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-purple-700 bg-white rounded-full p-1 shadow-sm z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                    </svg>
                  </div>
                  <div className="relative w-full h-full">
                     <Image 
                       src={card.image && card.image.startsWith('http') ? card.image : `${API_BASE_URL.replace('/api', '')}${card.image}`} 
                       alt={card.label}
                       fill
                       className="object-cover rounded-lg"
                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     />
                  </div>
                </div>
                <span className="text-purple-900 bg-white text-xs md:text-sm font-bold text-center px-3 py-1.5 rounded-full w-[90%] truncate shadow-sm">
                  {card.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
