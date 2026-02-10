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
        </div>
      ))}
    </>
  );
};

export default ToolsImage;
