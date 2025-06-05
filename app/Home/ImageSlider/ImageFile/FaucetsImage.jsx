
import Image from 'next/image';
import Image4 from '../Image/saver.png'

const dataSlider = [ 
    {
        image: Image4,
        buttonText: "Shop Now",
            cssClasses: "text-white text-xl border-2 border-white py-1 px-5 hover:bg-white hover:text-gray-900",
            // cssClasses: "text-white lg:ml-36 w-[500px]",
            mainText: "CLASSIO LUXURY FAUCETS",
            descText:"Your Bathroom can be your heaven and aur job is to deliver you the finest quality of Sanitary Wares",
            subText:"Upto 20% OFF",
    }
];
const FaucetsImage = () => { 
  return (
   <>
    {dataSlider.map((slide, index) => (
        <div key={index} className="relative">
          <Image src={slide.image} alt={slide.title} className="w-full h-screen object-cover" />
          <div className="absolute inset-0 lg:ml-36 lg:w-[422px] w-[220px] flex flex-col justify-center lg:text-center lg:items-center text-white lg:p-4">
            <h2 className="lg:text-5xl text-4xl font-bold">{slide.mainText}</h2>
            <p className="lg:mt-6 mt-2 lg:text-xs text-[10px]">{slide.descText}</p>
            <p className="lg:mt-6 mt-2 lg:text-4xl text-2xl">{slide.subText}</p>
            <button className="mt-4 border-2 border-white text-white lg:text-lg text-sm w-36 antialiased  text-bold px-4 lg:px-6 py-1 hover:bg-white hover:text-black">{slide.buttonText}</button>
          </div>
        </div>
      ))}
   </>
  );
};

export default FaucetsImage;