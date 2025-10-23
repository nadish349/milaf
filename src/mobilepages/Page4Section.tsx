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
    <section id="page4-section" className="relative min-h-screen w-full overflow-hidden">
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
      
      {/* Content Container */}
      <div className="relative z-20 min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 py-20">
        
        {/* About Milaf Section - Left Side */}
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
          <div className="max-w-2xl mx-auto lg:mx-0">
                               <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-wide mb-8 text-center">
                     About Milaf
                   </h2>
            
            <div className="space-y-6 text-white">
              <p className="text-base sm:text-lg leading-relaxed text-left">
                We take pride in bringing the authentic flavors of Saudi Arabia to your table with our diverse range of premium dates.
              </p>
              
              <p className="text-base sm:text-lg leading-relaxed text-left">
                Sourced from the rich cultural tapestry of the kingdom, our selection includes the esteemed Ajwa dates, revered for their historical and religious significance.
              </p>
              
              <p className="text-base sm:text-lg leading-relaxed text-left">
                Indulge in the sweet goodness of Sukkari dates, known for their delightful taste and tender texture. Explore the unique flavor profile of Segai dates, offering a distinct culinary experience.
              </p>
              
              <p className="text-base sm:text-lg leading-relaxed text-left">
                Our commitment is to deliver the finest quality dates, carefully curated to showcase the heritage and richness of Saudi Arabian agriculture. Taste the essence of Saudi Arabia with every bite, as we bring you a selection that reflects the tradition and excellence of our date varieties.
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal Three-Part Carousel - Right Side */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-[400px] h-[300px] sm:w-[500px] sm:h-[375px] md:w-[600px] md:h-[450px] lg:w-[640px] lg:h-[480px] overflow-hidden">
            {/* Three-Part Image Stack - Horizontal Layout */}
            <div className="relative h-full">
              {images.map((image, index) => {
                // Calculate position for three-part horizontal display (left, center, right)
                const adjustedIndex = (index - currentImage + images.length) % images.length;
                let position, scale, opacity, zIndex;
                
                if (adjustedIndex === 0) {
                  // Center card - main focus
                  position = '50%';
                  scale = 1;
                  opacity = 1;
                  zIndex = 20;
                } else if (adjustedIndex === 1) {
                  // Left card
                  position = '25%';
                  scale = 0.8;
                  opacity = 0.7;
                  zIndex = 15;
                } else if (adjustedIndex === 2) {
                  // Right card
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
                    className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-in-out"
                    style={{
                      left: position,
                      zIndex: zIndex,
                      opacity: opacity,
                      transform: `translateY(-50%) translateX(-50%) scale(${scale})`,
                    }}
                  >
                    {/* Image Card */}
                    <div className="relative">
                      <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-60 lg:h-60 bg-white/10 rounded-xl shadow-lg border border-white/20 p-3 sm:p-4">
                        <img 
                          src={image} 
                          alt={`Product ${index + 1}`}
                          decoding="async"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Navigation Controls - Horizontal Layout */}
            <div className="absolute top-1/2 transform -translate-y-1/2 -left-16 sm:-left-20">
              <button 
                onClick={prevImage}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white bg-black/60 flex items-center justify-center hover:bg-black/80 transition-all duration-300 cursor-pointer shadow-lg hover:scale-105"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            <div className="absolute top-1/2 transform -translate-y-1/2 -right-16 sm:-right-20">
              <button 
                onClick={nextImage}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white bg-black/60 flex items-center justify-center hover:bg-black/80 transition-all duration-300 cursor-pointer shadow-lg hover:scale-105"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Progress Indicator - Horizontal Layout */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
      </div>
    </section>
  );
};
