import Header from '@/components/header';
import Navbar from '@/components/Navbar';
import HomeSection from './Home/HomeSection';
import Footer from '@/components/footer';
import Update from './Update/Update';
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
        <div >
          <Header />
          <Navbar />
          <HomeSection />
          <Update />
          <Footer />
        </div>

  );
}
