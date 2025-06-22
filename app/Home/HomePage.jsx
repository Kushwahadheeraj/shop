import Card from "./Card/Card";
import CardSlider from "./CardSlider/CardSlider";
import Electricals from "./Electrical/Electrical";
import ImageSlider from "./ImageSlider/ImageSlider";
import Items from "./Items/items";
import Paints from "./Paints/paints";

export default function HomePage() {
  return (
        <div >
          <ImageSlider />
          <CardSlider />
          <Card />
          <Paints />
          <Items />
          <Electricals />
        </div>

  );
}