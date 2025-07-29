import Image5 from '@/public/both.jpg'
import Image from "next/image";

const dataSlider = [
    
    {
        image: Image5,
            buttonText: "EXPLORE ALL",
            mainText: "UPTO 30% OFF ON SANITARY WARE",
            descrText:"In Need of exquisite ware with affordable price ?",
            subText:"we heard you!"
    }

];
const SanitaryImage = () => {

  return (
   <>
    {dataSlider.map((slide, index) => (
        <div key={index} className="relative">
          <Image src={slide.image} alt={slide.mainText} className="w-full h-screen  object-cover" />
          <div className="flex flex-col text-center gap-2 p-6 md:p-12 absolute inset-0 bg-opacity-50 
          justify-center items-center text-white  z-40 
           lg:w-[800px] md:[500px] w-[300px] -translate-x-1/2 left-1/2 space-x-2">
            <h2 className="lg:text-5xl text-4xl font-bold">{slide.mainText}</h2>
            <p className="mt-2 lg:text-lg text-xs">{slide.descrText}</p>
            <p className="mt-2 lg:text-lg text-xs">{slide.subText}</p>
            <button className="mt-4 border-2 border-white text-white text-sm lg:text-lg antialiased  text-bold px-6 py-1 hover:bg-white hover:text-black">{slide.buttonText}</button>
          </div>
        </div>
      ))}
   </>
  );
};

export default SanitaryImage;