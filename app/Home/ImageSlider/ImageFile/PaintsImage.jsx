
import Image2 from '@/public/paints.jpg'
import Image from 'next/image';

const dataSlider = [
    
    {
        image: Image2,
            buttonText: "EXPLORE ALL",
            // cssClasses: "text-white text-xl bg-yellow-400 py-2.5 px-5",
            // cssClasses: "text-black bg-white md:ml-6 lg:h-[300px] lg:w-[500px] lg:mr-40 md:text-left lg:ml-auto",
            mainText: "PAINTS",
            subText: "Upto 20% OFF",
            descText:"ONE SHOP FOR ALL YOUR DECOR NEEDS "
    }

];

const PaintsImage = () => {

  return (
   <>
    {dataSlider.map((slide, index) => (
        <div key={index} className="relative">
          <Image src={slide.image} alt={slide.title} className="w-full h-screen  object-cover" />
          <div className="absolute inset-0 flex flex-col mt-44
          text-black bg-white ml-auto h-[260px] w-[150px] md:h-[200px] md:w-[350px] lg:h-[250px] lg:w-[450px] lg:mr-36  lg:ml-auto
        ">
            <div className="lg:py-10 lg:px-10 py-6 px-6">
            <h2 className="lg:text-4xl md:text-2xl text-xl font-bold ">{slide.mainText}</h2>
            <p className="mt-2 lg:text-4xl md:text-2xl text-xl text-gray-800">{slide.subText}</p>
            <p className="mt-2 lg:text-base md:text-sm text-[12px] text-gray-500">{slide.descText}</p>
            <button className="text-white text-sm lg:text-xl lg:text-bold mt-4 py-1 md:w-24 w-20 lg:w-36 bg-yellow-400 hover:bg-yellow-600">{slide.buttonText}</button>
            </div>
           
          </div>
        </div>
      ))}
   </>
  );
};

export default PaintsImage;