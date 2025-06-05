import Image3 from '../Image/electrical.jpg';
import Image from 'next/image';

const dataSlider = [
  {
    image: Image3,
    buttonText: 'EXPLORE ALL',
    mainText: 'UPTO 30% OFF ON ELECTRICALS',
    subText: "It's about time you switched to a new sparky!",
  },
];

const ElectricImage = () => {
  return (
    <>
      {dataSlider.map((slide, index) => (
        <div key={index} className='relative'>
          <Image
            src={slide.image}
            alt={slide.title}
            className='w-full h-screen  object-cover'
          />
          <div
            className='flex flex-col text-center gap-2 p-6 md:p-12 inset-0
          justify-center items-center  text-black absolute z-40
           lg:w-[800px] w-[200px] -translate-x-1/2 left-1/2 space-x-2'
          >
            <h2 className='lg:text-5xl text-4xl font-bold'>{slide.mainText}</h2>
            <p className='mt-2 lg:text-base text-xs'>{slide.subText}</p>
            <button className='mt-4 border-2 border-black text-black lg:text-lg text-sm antialiased  text-bold px-6 py-1 hover:bg-black hover:text-white'>
              {slide.buttonText}
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default ElectricImage;
