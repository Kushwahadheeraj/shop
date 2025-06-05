import Image6 from '@/public/tools.jpg';
import Image from 'next/image';

const dataSlider = [
  {
    image: Image6,
    buttonText: 'EXPLORE ALL',
    buttonTextTwo: 'POWERTOOLS',
    cssClasses:
      'text-white border-2 border-white py-1 px-5 hover:bg-white hover:text-gray-900',
    cssClasses:
      ' bg-opacity-70 absolute text-white z-40 flex w-[900px] -translate-x-1/2 left-1/2 space-x-2 ',
    mainText: 'UPTO 30% OFF ON TOOLS',
    subText: 'GETS EVERYWHERE. DOES EVERYTHING',
    descrText: 'Ryobi.Designed to do more.',
    descText: "A cut above.Power tools that won't quit",
    desText: 'UPTO 30% OFF',
  },
];

const ToolsImage = () => {
  return (
    <>
      {dataSlider.map((slide, index) => (
        <div key={index} className='relative'>
          <Image
            src={slide.image}
            alt={slide.title}
            className='w-full h-screen object-cover'
          />
          <div
            className='absolute bg-white bg-opacity-70 z-40
           flex w-[200px] h-[420px] lg:w-[700px] lg:h-[280px] md:w-[600px] md:h-[280px]
           -translate-x-1/2 left-1/2 
          lg:mt-40 md:mt-36 mt-24 lg:space-x-2 inset-0 flex-col lg:justify-center lg:items-center md:justify-center md:items-center text-center'
          >
            <h2 className='lg:text-4xl md:text-4xl text-[30px] px-8 leading-6 pt-4 font-bold'>
              {slide.mainText}
            </h2>
            <p className='mt-6 px-10 lg:text-xl md:text-xl text-[14px] leading-2 font-bold'>
              {slide.subText}
            </p>
            <p className='mt-2 lg:text-sm md:text-sm text-[10px]'>
              {slide.descrText}
            </p>
            <p className='lg:text-sm md:text-sm text-[10px] px-6'>
              {slide.descText}
            </p>
            <p className='lg:text-2xl md:text-2xl text-lg mt-2'>
              {slide.desText}
            </p>
            <ul className='lg:flex md:flex  items-center space-x-4'>
              <li>
                <button className='text-white lg:text-xl md:text-xl text-sm text-bold mt-4 lg:w-36 md:w-36 w-24 bg-yellow-400 hover:bg-yellow-600'>
                  {slide.buttonText}
                </button>
              </li>
              <li>
                <button
                  className='mt-4 border-2 border-white text-white lg:text-xl md:text-xl 
            text-sm lg:w-48 md:w-48 w-24 antialiased text-bold lg:px-6 
             hover:bg-white hover:text-black'
                >
                  {slide.buttonTextTwo}
                </button>
              </li>
            </ul>
          </div>
        </div>
      ))}
    </>
  );
};

export default ToolsImage;
