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

export default function Home() {
  return (
        <div >
          <ImageSlider />
          <CardSlider />
          <Card />
          <Paints />
          <Items />
          <Electricals />
          <OfferProduct/>
          <PopularTools />
          <Categories />
          <PopularProducts />
          <Brands />
          <Service />
        </div>

  );
}