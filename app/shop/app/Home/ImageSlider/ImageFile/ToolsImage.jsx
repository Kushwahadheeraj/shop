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
      const base = API_BASE_URL.replace(/\/$/, '');
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
            className='absolute bg-white bg-opacity-70 z-40 flex w-[200px] h-[420px] lg:w-[700px] lg:h-[280px] md:w-[600px] md:h-[280px] -translate-x-1/2 left-1/2 lg:mt-40 md:mt-36 mt-24 lg:space-x-2 inset-0 flex-col lg:justify-center lg:items-center md:justify-center md:items-center text-center'
          >
            <h2 className='lg:text-4xl md:text-4xl text-[30px] px-8 leading-6 pt-4 font-bold'>
              {slide.mainText}
            </h2>
            {slide.subText && (
              <p className='mt-6 px-10 lg:text-xl md:text-xl text-[14px] leading-2 font-bold'>
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
            <ul className='lg:flex md:flex items-center space-x-4'>
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
                    <button className='mt-4 border-2 border-black text-black lg:text-xl md:text-xl text-sm lg:w-48 md:w-48 w-24 antialiased font-bold lg:px-6 hover:bg-white hover:text-black'>
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
