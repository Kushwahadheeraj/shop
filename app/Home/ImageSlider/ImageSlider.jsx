"use client"
import { useState, useEffect } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import PaintsImage from "./ImageFile/PaintsImage";
import ElectricImage from "./ImageFile/ElectricImage";
import FaucetsImage from "./ImageFile/FaucetsImage";
import SanitaryImage from "./ImageFile/SanitaryImage";
import ToolsImage from "./ImageFile/ToolsImage";

const slides = [
  <PaintsImage />,
  <ElectricImage />,
  <FaucetsImage />,
  <SanitaryImage />,
  <ToolsImage />,
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000); // Change slide every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentIndex]);

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden lg:mt-32 md:mt32 mt-12">
        {slides[currentIndex]}

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute  hidden left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 p-3 rounded-full"
        >
          <BsChevronCompactLeft size={30} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute hidden right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 p-3 rounded-full"
        >
          <BsChevronCompactRight size={30} />
        </button>

        <div className="absolute z-40 flex -translate-x-1/2 bottom-5 left-1/2 space-x-1 rtl:space-x-reverse">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-gray-500"
                }`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ImageSlider;
