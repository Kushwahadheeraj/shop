import Brands from "./Brands/Brands";
import Card from "./Card/Card";
import PopularProducts from "./Card/PopularProducts";
import CardSlider from "./CardSlider/CardSlider";
import Categories from "./Categories/Categories";
import Electricals from "./Electrical/Electrical";
import ImageSlider from "./ImageSlider/ImageSlider";
import Items from "./Items/items";
import Paints from "./Paints/paints";
import Service from "./Service/Service";
import PopularTools from "./Tools/PopularTools";
import Tools from "./Tools/Tools";

export default function Home() {
  return (
        <div >
          <ImageSlider />
          <CardSlider />
          <Card />
          <Paints />
          <Items />
          <Electricals />
          <Tools/>
          <PopularTools />
          <Categories />
          <PopularProducts />
          <Brands />
          <Service />
        </div>

  );
}