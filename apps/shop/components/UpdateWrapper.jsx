'use client';
import { usePathname } from 'next/navigation';
import Update from '@/app/Update/Update';
import Navbar from './Navbar';
import Footer from './footer';
import Header from './header';

export default function UpdateWrapper() {
  return (
    <>
      <Update />
      <Navbar />
      <Footer />
      <Header />
    </>
  );
}
