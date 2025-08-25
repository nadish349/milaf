import React, { useState, useEffect } from "react";
import m1 from "@/assets/m1.png";
import mc1 from "@/assets/gridimages/mc1.png";
import mc2 from "@/assets/gridimages/mc2.png";
import mc3 from "@/assets/gridimages/mc3.png";
import mc4 from "@/assets/gridimages/mc4.png";
import mc5 from "@/assets/gridimages/mc5.png";
import mc6 from "@/assets/gridimages/mc6.png";
import mc7 from "@/assets/gridimages/mc7.png";
import mc8 from "@/assets/gridimages/mc8.png";
import mc9 from "@/assets/gridimages/mc9.png";
import mc10 from "@/assets/gridimages/mc10.png";
import mc11 from "@/assets/gridimages/mc11.png";
import mc12 from "@/assets/gridimages/mc12.png";
import mc13 from "@/assets/gridimages/mc13.png";
import mc14 from "@/assets/gridimages/mc14.png";
import mc15 from "@/assets/gridimages/mc15.png";

export const Page4Section = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const images = [
    mc1,
    mc2,
    mc3,
    mc4,
    mc5,
    mc6,
    mc7,
    mc8,
    mc9,
    mc10,
    mc11,
    mc12,
    mc13,
    mc14,
    mc15
  ];

  // Fast cyclic carousel animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 800); // Fast rotation every 800ms

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden snap-start snap-always">
      {/* Background image - m1.png */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${m1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      


      {/* About Milaf Section - Left Side */}
      <div className="absolute z-20 left-[3cm] top-1/2 transform -translate-y-1/2 max-sm:left-1/2 max-sm:transform max-sm:-translate-x-1/2 max-sm:top-[200px] max-sm:px-4">
        <div className="max-w-[500px] sm:max-w-[550px] md:max-w-[600px] lg:max-w-[650px] xl:max-w-[700px]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-wide mb-6 max-sm:text-xl max-sm:text-center max-sm:mb-4">
            About Milaf
          </h2>
          
          <div className="text-base sm:text-base md:text-base lg:text-base xl:text-lg text-white leading-relaxed space-y-4 max-sm:text-xs max-sm:text-center max-sm:space-y-3">
            <p>
              We take pride in bringing the authentic flavors of Saudi Arabia to your table with our diverse range of premium dates.
            </p>
            
            <p>
              Sourced from the rich cultural tapestry of the kingdom, our selection includes the esteemed Ajwa dates, revered for their historical and religious significance.
            </p>
            
            <p>
              Indulge in the sweet goodness of Sukkari dates, known for their delightful taste and tender texture. Explore the unique flavor profile of Segai dates, offering a distinct culinary experience.
            </p>
            
            <p>
              Our commitment is to deliver the finest quality dates, carefully curated to showcase the heritage and richness of Saudi Arabian agriculture. Taste the essence of Saudi Arabia with every bite, as we bring you a selection that reflects the tradition and excellence of our date varieties.
            </p>
          </div>
        </div>
      </div>

      {/* Compressed Three-Part Carousel - Right Side */}
      <div className="absolute z-20 right-[3cm] top-1/2 transform -translate-y-1/2 max-sm:right-1/2 max-sm:transform max-sm:translate-x-1/2 max-sm:translate-y-0 max-sm:top-[400px]">
        <div className="relative w-[260px] h-[390px] sm:w-[286px] sm:h-[416px] md:w-[312px] md:h-[442px] lg:w-[338px] lg:h-[468px] xl:w-[364px] xl:h-[494px] overflow-hidden">
          {/* Three-Part Image Stack */}
          <div className="relative h-full">
            {images.map((image, index) => {
              // Calculate position for three-part display (upper, center, lower)
              const adjustedIndex = (index - currentImage + images.length) % images.length;
              let position, scale, opacity, zIndex;
              
              if (adjustedIndex === 0) {
                // Center card - main focus
                position = '50%';
                scale = 1;
                opacity = 1;
                zIndex = 20;
              } else if (adjustedIndex === 1) {
                // Upper card
                position = '25%';
                scale = 0.8;
                opacity = 0.7;
                zIndex = 15;
              } else if (adjustedIndex === 2) {
                // Lower card
                position = '75%';
                scale = 0.8;
                opacity = 0.7;
                zIndex = 15;
              } else {
                // Hidden cards
                position = '200%';
                scale = 0.6;
                opacity = 0.3;
                zIndex = 10;
              }
              
              return (
                <div
                  key={index}
                  className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out"
                  style={{
                    top: position,
                    zIndex: zIndex,
                    opacity: opacity,
                    transform: `translateX(-50%) translateY(-50%) scale(${scale})`,
                  }}
                >
                  {/* Image Card */}
                  <div className="relative">
                    <div className="w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 xl:w-56 xl:h-56 bg-white/5 rounded-xl shadow-lg border border-white/20 p-4">
                      <img 
                        src={image} 
                        alt={`Product ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          

          
          {/* Navigation Controls */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-20">
            <button 
              onClick={prevImage}
              className="w-16 h-16 rounded-full border border-white bg-black/60 flex items-center justify-center hover:bg-black/80 transition-all duration-300 cursor-pointer shadow-lg hover:scale-105"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
          
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-20">
            <button 
              onClick={nextImage}
              className="w-16 h-16 rounded-full border border-white bg-black/60 flex items-center justify-center hover:bg-black/80 transition-all duration-300 cursor-pointer shadow-lg hover:scale-105"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {/* Progress Indicator */}
          <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImage 
                    ? 'bg-white scale-110' 
                    : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
