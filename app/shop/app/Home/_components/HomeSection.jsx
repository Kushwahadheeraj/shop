"use client";

import dynamic from 'next/dynamic';
import ImageSlider from "../ImageSlider/ImageSlider";
import CouponsSection from "../CouponsSection/CouponsSection";
import CardSlider from "../CardSlider/CardSlider";

// Lazy load components below the fold
const Brands = dynamic(() => import("../Brands/Brands"), { ssr: false });
const Card = dynamic(() => import("../Card/Card"));
const PopularProducts = dynamic(() => import("../Card/PopularProducts"));
const Categories = dynamic(() => import("../Categories/Categories"));
const Electricals = dynamic(() => import("../Electrical/Electrical"));
const Items = dynamic(() => import("../Items/items"));
const Paints = dynamic(() => import("../Paints/paints"));
const Service = dynamic(() => import("../Service/Service"));
const PopularTools = dynamic(() => import("../Tools/PopularTools"));
const OfferProduct = dynamic(() => import("../OfferProduct/OfferProduct"));
const BestQuality = dynamic(() => import("../BestQuality/BestQuality"));
const TopSelection = dynamic(() => import("../TopSelection/TopSelection"));
const FashionBanner = dynamic(() => import("../FashionBanner/FashionBanner"));
const DealsSection = dynamic(() => import("../DealsSection/DealsSection"));
const ShopByCategory = dynamic(() => import("./ShopByCategory"));
const PromoBanner = dynamic(() => import("./PromoBanner"));

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-sky-100">
      <div className=" bg-sky-100">
        <ImageSlider />
      </div>
      <div className=" bg-sky-100">
        <CouponsSection />
      </div>
      <div className="mt-2 bg-sky-100">
        <CardSlider />
      </div>
      <div className="bg-sky-100">
        <div className="max-w-8xl mx-auto px-2 py-2 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="bg-white rounded-md shadow-sm border border-gray-100">
            <BestQuality />
          </div>
          <div className="bg-white rounded-md shadow-sm border border-gray-100">
            <TopSelection />
          </div>
          <div className="bg-white rounded-md shadow-sm border border-gray-100">
            <FashionBanner />
          </div>
        </div>
      </div>
      <div className=" bg-sky-100">
        <DealsSection />
      </div>
      <div className=" bg-sky-100">
        <ShopByCategory />
      </div>
      <div className=" bg-sky-100">
        <Card />
      </div>
      <div className=" bg-sky-100">
        <PromoBanner />
      </div>
      <div className=" bg-sky-100">
        <Paints />
      </div>
      <div className=" bg-sky-100">
        <Items />
      </div>
      <div className=" bg-sky-100">
        <Electricals />
      </div>
      <div className=" bg-sky-100">
        <OfferProduct/>
      </div>
      <div className=" bg-sky-100">
        <PopularTools />
      </div>
      <div className=" bg-sky-100">
        <Categories />
      </div>
      <div className=" bg-sky-100">
        <PopularProducts />
      </div>
      <div className=" bg-sky-100">
        <Brands />
      </div>
      <div className=" bg-sky-100">
        <Service />
      </div>
    </div>
  );
}
