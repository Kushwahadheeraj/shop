"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";
import { useSectionTitle } from "@/hooks/useSectionTitle";

export default function Items() {
  const [items, setItems] = useState([]);
  const { title } = useSectionTitle('items', 'Featured Items');

  useEffect(() => {
    let mounted = true;
    const toAbsoluteUrl = (u) => {
      if (!u || typeof u !== 'string') return '';
      if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
      const base = API_BASE_URL.replace(/\/$/, '');
      const path = u.startsWith('/') ? u : `/${u}`;
      return `${base}${path}`;
    };
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/items/get`);
        const json = await res.json();
        let list = [];
        if (json && json.success && Array.isArray(json.data)) list = json.data;
        else if (Array.isArray(json)) list = json;
        if (!mounted) return;
        const mapped = list.map((b, idx) => ({
          id: b._id || idx,
          image: toAbsoluteUrl(b.image || b.photo || b.imageUrl),
          alt: b.alt || b.title || 'Banner',
          overlay: Boolean(b.overlay),
          title: b.title || '',
          subtitle: b.subtitle || b.subTitle || b.sub_title || b.sub || '',
          description: b.description || '',
          buttonText: b.buttonText || 'SHOP NOW',
          link: b.link || '#',
          textColor: b.textColor || 'text-white',
        }));
        // Move the banner with title containing 'whatsapp' or 'whatshop' to index 0
        const findWhats = (t) => {
          const s = (t || '').toLowerCase();
          return s.includes('whatsapp') || s.includes('whatshop');
        };
        const idxWhats = mapped.findIndex(x => findWhats(x.title));
        if (idxWhats > 0) {
          const [wh] = mapped.splice(idxWhats, 1);
          mapped.unshift(wh);
        }
        
        setItems(mapped);
      } catch {
        if (!mounted) return;
        setItems([]);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="px-6 py-8">
      {title && <h2 className="text-2xl font-bold mb-6 text-gray-900">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((banner) => (
          <div key={banner.id} className="relative rounded-lg overflow-hidden shadow-lg">
            <img
              src={banner.image}
              alt={banner.alt}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            {banner.overlay ? (
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-center items-start p-6 text-left ${banner.textColor}`}
              >
                {banner.title && <h3 className="text-2xl font-bold text-white">{banner.title}</h3>}
                {banner.subtitle && <p className="text-lg text-white">{banner.subtitle}</p>}
                {banner.description && <p className="text-sm mb-4 text-white/90">{banner.description}</p>}
                {banner.buttonText && (
                  <Link href="/Shop" passHref>
                    <button className="bg-black text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-800 transition self-start">
                      {banner.buttonText}
                    </button>
                  </Link>
                )}
              </div>
            ) : (
              banner.title && ((banner.title.toLowerCase().includes('whatsapp')) || (banner.title.toLowerCase().includes('whatshop'))) ? (
                <div className="absolute inset-0">
                  <Link href={banner.link || '#'} passHref className="block w-full h-full" aria-label={banner.alt} />
                </div>
              ) : (
                <div className="absolute inset-0 flex mt-20 pl-6 text-left">
                  <div className="flex flex-col items-start justify-center h-full p-4">
                    {banner.title && <h2 className="text-xl md:text-2xl font-bold mb-1">{banner.title}</h2>}
                    {banner.subtitle && <p className="text-base mb-1">{banner.subtitle}</p>}
                    {banner.description && <p className="text-sm text-gray-700 mb-3">{banner.description}</p>}
                    {banner.buttonText && (
                      <Link href="/Shop" className="inline-block">
                        <button className="bg-yellow-300 text-black font-bold py-2 px-6 rounded-full shadow-lg hover:bg-yellow-300 transition">
                          {banner.buttonText}
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
