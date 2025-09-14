import HomeSection from './Home/HomeSection';
import Footer from '@/components/footer';
import Update from './Update/Update';
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
        <div >
          <HomeSection />
          <Update />
          <Footer />
        </div>

  );
}
