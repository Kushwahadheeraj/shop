"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import API_BASE_URL from '@/lib/apiConfig';

const SanitaryImage = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    let mounted = true;
    const toAbs = (u) => {
      if (!u || typeof u !== 'string') return '';
      if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
      
      // Remove /api suffix if present to get the root URL for static files
      const base = API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
      const path = u.startsWith('/') ? u : `/${u}`;
      return `${base}${path}`;
    };
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/imageslider/sanitaryimage/get`);
        const json = await res.json();
        let list = [];
        if (json && json.success && Array.isArray(json.data)) list = json.data; else if (Array.isArray(json)) list = json;
        if (!mounted) return;
        const mapped = list.map((s, idx) => ({
          id: s._id || idx,
          image: toAbs(s.uploadedImage || s.image || s.imageUrl || (Array.isArray(s.images) ? s.images[0] : '')),
          buttonText: s.buttonText || 'EXPLORE ALL',
          mainText: s.mainText,
          descText: s.descText,
          subText: s.subtext,
          link: s.link || '#',
        }));
        setSlides(mapped);
      } catch {
        if (!mounted) return;
        setSlides([]);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  if (slides.length === 0) return null;

  return (
   <>
    {slides.map((slide) => (
        <div key={slide.id} className="relative">
          <img src={slide.image} alt={slide.mainText} className="w-full h-screen  object-cover" loading="lazy" />
          <div className="flex flex-col text-center gap-2 p-6 md:p-12 absolute inset-0 bg-opacity-50 
          justify-center items-center text-white  z-40 
           lg:w-[800px] md:[500px] w-[300px] -translate-x-1/2 left-1/2 space-x-2">
            <h2 className="lg:text-5xl text-4xl font-bold uppercase">{slide.mainText}</h2>
            {slide.descText && <p className="mt-2 lg:text-lg text-xs">{slide.descText}</p>}
            {slide.subText && <p className="mt-2 lg:text-lg text-xs">{slide.subText}</p>}
            {slide.buttonText && (
              <Link href={slide.link} passHref>
                <button className="mt-4 border-2 border-white text-white text-sm lg:text-lg antialiased font-bold px-6 py-1 hover:bg-white hover:text-black">{slide.buttonText}</button>
              </Link>
            )}
          </div>
        </div>
      ))}
   </>
  );
};

export default SanitaryImage;