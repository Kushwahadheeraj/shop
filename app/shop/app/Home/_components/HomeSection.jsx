import Brands from "../Brands/Brands";
import Card from "../Card/Card";
import PopularProducts from "../Card/PopularProducts";
import CardSlider from "../CardSlider/CardSlider";
import Categories from "../Categories/Categories";
import Electricals from "../Electrical/Electrical";
import ImageSlider from "../ImageSlider/ImageSlider";
import Items from "../Items/items";
import Paints from "../Paints/paints";
import Service from "../Service/Service";
import PopularTools from "../Tools/PopularTools";
import OfferProduct from "../OfferProduct/OfferProduct";
import CouponsSection from "../CouponsSection/CouponsSection";
import BestQuality from "../BestQuality/BestQuality";
import TopSelection from "../TopSelection/TopSelection";
import FashionBanner from "../FashionBanner/FashionBanner";
import DealsSection from "../DealsSection/DealsSection";
import ShopByCategory from "./ShopByCategory";
import PromoBanner from "./PromoBanner";

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
