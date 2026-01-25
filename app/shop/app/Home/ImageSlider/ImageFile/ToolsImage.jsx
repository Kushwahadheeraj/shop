"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import API_BASE_URL from '@/lib/apiConfig';

const ToolsImage = () => {
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
        const res = await fetch(`${API_BASE_URL}/home/imageslider/toolsimage/get`);
        const json = await res.json();
        let list = [];
        if (json && json.success && Array.isArray(json.data)) list = json.data; else if (Array.isArray(json)) list = json;
        if (!mounted) return;
        const mapped = list.map((s, idx) => ({
          id: s._id || idx,
          image: toAbs(s.uploadedImage || s.image || s.imageUrl || (Array.isArray(s.images) ? s.images[0] : '')),
          buttonText: s.buttonText || 'EXPLORE ALL',
          buttonTextTwo: s.buttonTextTwo || s.secondaryButtonText || 'POWERTOOLS',
          mainText: s.mainText || s.MainText || s.title || '',
          subText: s.subText || s.SubText || s.subtitle || s.subTitle || s.subtext || '',
          descrText: s.descrText || s.description || s.desc || s.descText || '',
          descText: s.descText || s.description2 || s.descTwo || '',
          desText: s.desText || s.highlight || '',
          link: s.link || '#',
          linkTwo: s.linkTwo || s.secondaryLink || '#',
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
          <div
            className='absolute z-40 flex flex-col items-center justify-center
                       bg-[#333333] bg-opacity-95 text-white
                       w-[220px] sm:w-[260px] h-[240px]
                       md:bg-white md:bg-opacity-70 md:text-black md:w-[600px] md:h-[280px]
                       lg:w-[700px] lg:h-[280px] lg:bg-opacity-70
                       top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       lg:space-x-2 rounded-xl text-center'
          >
            <h2 className='lg:text-4xl md:text-4xl text-xl sm:text-2xl px-4 leading-6 pt-4 font-bold'>
              {slide.mainText}
            </h2>
            {slide.subText && (
              <p className='mt-4 px-4 lg:text-xl md:text-xl text-sm leading-5 font-bold'>
                {slide.subText}
              </p>
            )}
            {slide.descrText && (
              <p className='mt-2 lg:text-sm md:text-sm text-[10px]'>
                {slide.descrText}
              </p>
            )}
            {slide.descText && (
              <p className='lg:text-sm md:text-sm text-[10px] px-6'>
                {slide.descText}
              </p>
            )}
            {slide.desText && (
              <p className='lg:text-2xl md:text-2xl text-lg mt-2'>
                {slide.desText}
              </p>
            )}
            <ul className='flex md:flex lg:flex items-center justify-center gap-2'>
              {slide.buttonText && (
                <li>
                  <Link href={slide.link} passHref>
                    <button className='text-white lg:text-xl md:text-xl text-sm font-bold mt-4 lg:w-36 md:w-36 w-24 bg-yellow-300 hover:bg-yellow-300'>
                      {slide.buttonText}
                    </button>
                  </Link>
                </li>
              )}
              {slide.buttonTextTwo && (
                <li>
                  <Link href={slide.linkTwo || slide.link || '#'} passHref>
                    <button className='mt-4 border-2 border-white text-white md:border-black md:text-black lg:text-xl md:text-xl text-sm lg:w-48 md:w-48 w-24 antialiased font-bold lg:px-6 hover:bg-white hover:text-black'>
                      {slide.buttonTextTwo}
                    </button>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      ))}
    </>
  );
};

export default ToolsImage;
