"use client"
import { useState, useEffect } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import PaintsImage from "./ImageFile/PaintsImage";
import ElectricImage from "./ImageFile/ElectricImage";
import FaucetsImage from "./ImageFile/FaucetsImage";
import SanitaryImage from "./ImageFile/SanitaryImage";
import ToolsImage from "./ImageFile/ToolsImage";
import HeroProductCards from "../_components/HeroProductCards";

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
    <div className="relative w-full lg:mt-32 md:mt-32 mt-12 bg-gray-100 pb-8">
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        {slides[currentIndex]}

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gray-100 to-transparent z-10" />

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute z-20 hidden md:block left-4 top-1/3 transform -translate-y-1/2 text-white hover:text-gray-200"
        >
          <BsChevronCompactLeft size={50} className="drop-shadow-lg" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute z-20 hidden md:block right-4 top-1/3 transform -translate-y-1/2 text-white hover:text-gray-200"
        >
          <BsChevronCompactRight size={50} className="drop-shadow-lg" />
        </button>

        <div className="absolute z-20 flex -translate-x-1/2 bottom-1/3 left-1/2 space-x-2 rtl:space-x-reverse">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-white w-8" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      <HeroProductCards />
    </div>
  );
};

export default ImageSlider;
