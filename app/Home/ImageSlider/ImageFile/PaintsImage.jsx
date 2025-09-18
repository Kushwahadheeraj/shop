"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import API_BASE_URL from '@/lib/apiConfig';

const PaintsImage = () => {
  const [slides, setSlides] = useState([]);

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
        const res = await fetch(`${API_BASE_URL}/home/imageslider/paintsimage/get`);
        const json = await res.json();
        let list = [];
        if (json && json.success && Array.isArray(json.data)) list = json.data; else if (Array.isArray(json)) list = json;
        if (!mounted) return;
        const mapped = list.map((s, idx) => ({
          id: s._id || idx,
          image: toAbs(s.uploadedImage || s.image || s.imageUrl || (Array.isArray(s.images) ? s.images[0] : '')),
          buttonText: s.buttonText || 'EXPLORE ALL',
          mainText: s.mainText,
          subText: s.subtext,
          descText: s.descText,
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
            className='w-full h-screen  object-cover'
            loading='lazy'
          />
          <div
            className='absolute inset-0 flex flex-col mt-44 text-black bg-white ml-auto h-[260px] w-[150px] md:h-[200px] md:w-[350px] lg:h-[250px] lg:w-[450px] lg:mr-36  lg:ml-auto'
          >
            <div className='lg:py-10 lg:px-10 py-6 px-6'>
              <h2 className='lg:text-4xl md:text-2xl text-xl font-bold '>
                {slide.mainText}
              </h2>
              {slide.subText && (
                <p className='mt-2 lg:text-4xl md:text-2xl text-xl text-gray-800'>
                  {slide.subText}
                </p>
              )}
              {slide.descText && (
                <p className='mt-2 lg:text-base md:text-sm text-[12px] text-gray-500'>
                  {slide.descText}
                </p>
              )}
              {slide.buttonText && (
                <Link href={slide.link} passHref>
                  <button className='text-white text-sm lg:text-xl lg:text-bold mt-4 py-1 md:w-24 w-20 lg:w-36 bg-yellow-400 hover:bg-yellow-600'>
                    {slide.buttonText}
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PaintsImage;
