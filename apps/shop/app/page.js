import HomeSection from './Home/_components/HomeSection';
import Update from './Update/_components/Update';
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
        <div >
          <HomeSection />
          <Update />
        </div>

  );
}
