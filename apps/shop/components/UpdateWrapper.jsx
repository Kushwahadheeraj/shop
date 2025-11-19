'use client';
import { usePathname } from 'next/navigation';
import Update from '@/app/Update/Update';
import Navbar from './Navbar';
import Footer from './footer';
import Header from './header';

export default function UpdateWrapper() {
  const pathname = usePathname();
  const hideUpdate =
    pathname.startsWith('/login/seller') || pathname.startsWith('/Dashboard');

  if (hideUpdate) return null;
  return (<Update />), (<Navbar /> ,<Footer />, <Header/>);
}
