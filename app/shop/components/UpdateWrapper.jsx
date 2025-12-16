'use client';
import { usePathname } from 'next/navigation';
import Update from '@/app/Update/Update';

export default function UpdateWrapper() {
  const pathname = usePathname();
  
  // Don't render Update on home page since it's already rendered in page.js
  if (pathname === '/' || pathname === '') {
    return null;
  }
  
  return <Update />;
}
