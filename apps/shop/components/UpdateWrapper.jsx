'use client';
import Update from '@/app/Update/_components/Update';
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
