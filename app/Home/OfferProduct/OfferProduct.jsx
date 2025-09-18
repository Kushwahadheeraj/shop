"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import API_BASE_URL from "@/lib/apiConfig";

export default function OfferProduct() {
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    let mounted = true;
    const toAbs = (u) => {
      if (!u || typeof u !== 'string') return '';
      if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
      const base = API_BASE_URL.replace(/\/$/, '');
      const path = u.startsWith('/') ? u : `/${u}`;
      return `${base}${path}`;
    };
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/offer/get`);
        const json = await res.json();
        let list = [];
        if (json && json.success && Array.isArray(json.data)) list = json.data; else if (Array.isArray(json)) list = json;
        if (!mounted) return;
        if (list.length === 0) { setOffer(null); return; }
        const o = list[0];
        setOffer({
          image: toAbs(o.image || o.photo || o.imageUrl || (Array.isArray(o.images) ? o.images[0] : '')),
          title: o.title || o.name || 'Special Offer',
          description: o.description || '',
          buttonText: o.buttonText || 'SHOP NOW',
          link: o.link || '#',
        });
      } catch {
        if (!mounted) return;
        setOffer(null);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  if (!offer) return null;

  return (
    <div className="flex flex-col md:flex-row items-stretch w-full my-10 bg-white shadow-lg  overflow-hidden min-h-[340px] md:min-h-[460px]">
      <div className="w-full md:w-1/2 h-[340px] md:h-[460px]">
        <img
          src={offer.image}
          alt={offer.title}
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center md:pl-20 px-8 text-center md:text-left h-[340px] md:h-[460px]">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-wide uppercase">
          {offer.title}
        </h2>
        {offer.description && (
          <p className="mt-3 text-sm md:text-base text-gray-600 max-w-xl">
            {offer.description}
          </p>
        )}
        {offer.buttonText && (
          <Link href={offer.link} passHref>
            <button className="mt-6 rounded-full border-yellow-500 px-6 py-2 text-sm font-semibold text-black hover:bg-yellow-500 hover:text-white transition-colors duration-300 border shadow-sm">
              {offer.buttonText}
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
