'use client';
import { usePathname } from 'next/navigation';
import Update from '@/app/Update/Update';
import Navbar from './Navbar';

export default function UpdateWrapper() {
  const pathname = usePathname();
  const hideUpdate =
    pathname.startsWith('/login/seller') || pathname.startsWith('/dashboard');

  if (hideUpdate) return null;
  return (<Update />), (<Navbar />);
}
