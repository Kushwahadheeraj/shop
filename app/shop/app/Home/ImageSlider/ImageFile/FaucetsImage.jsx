"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import API_BASE_URL from '@/lib/apiConfig';

const FaucetsImage = () => {
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
        const res = await fetch(`${API_BASE_URL}/home/imageslider/faucetimage/get`);
        const json = await res.json();
        let list = [];
        if (json && json.success && Array.isArray(json.data)) list = json.data; else if (Array.isArray(json)) list = json;
        if (!mounted) return;
        const mapped = list.map((s, idx) => ({
          id: s._id || idx,
          image: toAbs(s.uploadedImage || s.image || s.imageUrl || (Array.isArray(s.images) ? s.images[0] : '')),
          buttonText: s.buttonText || 'Shop Now',
          cssClasses: s.cssClasses || 'text-white text-xl border-2 border-white py-1 px-5 hover:bg-white hover:text-gray-900',
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
        <div key={slide.id} className='relative'>
          <img
            src={slide.image}
            alt={slide.mainText}
            className='w-full h-screen object-cover'
            loading='lazy'
          />
          {/* <div className='absolute inset-0 lg:ml-36 lg:w-[422px] w-[220px] mx-auto flex flex-col justify-center items-center text-center lg:text-center lg:items-center text-white lg:p-4'>
            <h2 className='lg:text-5xl text-4xl font-bold uppercase'>{slide.mainText}</h2>
            {slide.descText && (
              <p className='lg:mt-6 mt-2 lg:text-xs text-[10px]'>
                {slide.descText}
              </p>
            )}
            {slide.subText && (
              <p className='lg:mt-6 mt-2 lg:text-4xl text-2xl lg:mb-6'>{slide.subText}</p>
            )}
            {slide.buttonText && (
              <Link href={slide.link} passHref>
                <button className={`${slide.cssClasses} w-36`}> 
                  {slide.buttonText}
                </button>
              </Link>
            )}
          </div> */}
        </div>
      ))}
    </>
  );
};

export default FaucetsImage;
