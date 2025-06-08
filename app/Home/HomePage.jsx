import Card from "./Card/Card";
import CardSlider from "./CardSlider/CardSlider";
import ImageSlider from "./ImageSlider/ImageSlider";

export default function HomePage() {
  return (
        <div >
          <ImageSlider />
          <CardSlider />
          <Card />
        </div>

  );
}