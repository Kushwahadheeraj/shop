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

export default function Home() {
  return (
        <div>
          <div className=" bg-gradient-to-r from-indigo-50 to-purple-50">
            <ImageSlider />
          </div>
          <div className=" bg-gradient-to-r from-emerald-50 to-teal-50">
            <CouponsSection />
          </div>
          <div className=" bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardSlider />
          </div>
          <div className=" bg-gradient-to-r from-amber-50 to-yellow-50">
            <Card />
          </div>
          <div className=" bg-gradient-to-r from-rose-50 to-pink-50">
            <Paints />
          </div>
          <div className=" bg-gradient-to-r from-sky-50 to-cyan-50">
            <Items />
          </div>
          <div className=" bg-gradient-to-r from-blue-50 to-indigo-50">
            <Electricals />
          </div>
          <div className=" bg-gradient-to-r from-orange-50 to-red-50">
            <OfferProduct/>
          </div>
          <div className=" bg-gradient-to-r from-lime-50 to-green-50">
            <PopularTools />
          </div>
          <div className=" bg-gradient-to-r from-violet-50 to-fuchsia-50">
            <Categories />
          </div>
          <div className=" bg-gradient-to-r from-teal-50 to-sky-50">
            <PopularProducts />
          </div>
          <div className=" bg-gradient-to-r from-stone-50 to-zinc-50">
            <Brands />
          </div>
          <div className=" bg-gradient-to-r from-yellow-50 to-amber-50">
            <Service />
          </div>
        </div>

  );
}
