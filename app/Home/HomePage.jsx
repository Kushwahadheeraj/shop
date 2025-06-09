import Card from "./Card/Card";
import CardSlider from "./CardSlider/CardSlider";
import ImageSlider from "./ImageSlider/ImageSlider";
import Paints from "./Paints/paints";

export default function HomePage() {
  return (
        <div >
          <ImageSlider />
          <CardSlider />
          <Card />
          <Paints />
        </div>

  );
}