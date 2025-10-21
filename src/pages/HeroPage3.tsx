import React, { useState, useEffect } from "react";
import final4 from "@/assets/final4.png";
import dates2 from "@/assets/browndate4-2.png";
import dates1 from "@/assets/browndate2.png";
import dates3 from "@/assets/browndate4.png";
import cutdate4 from "@/assets/browndates5.png";
import mfhq from "@/assets/mfhq.png";
import colapowderburst from "@/assets/colapowderburst.png";
import { preloadHeroImagesOptimized, preloadCriticalHeroImages } from "@/utils/imagePreloader";

export const HeroPage3 = (): JSX.Element => {
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  // First: Load background image
  useEffect(() => {
    const bgImg = new Image();
    bgImg.onload = () => {
      setBackgroundLoaded(true);
    };
    bgImg.src = final4;
  }, []);

  // Second: Show content immediately after background loads (no image preloading dependency)
  useEffect(() => {
    if (backgroundLoaded) {
      const timer = setTimeout(() => {
        setShowIntroduction(false);
        setShowMainContent(true);
        // Load other images in background after main content is visible
        preloadHeroImagesOptimized(false, () => {}).catch(console.error);
      }, 300); // Reduced from 1000ms for faster landing
      
      return () => clearTimeout(timer);
    }
  }, [backgroundLoaded]);

  return (
    <main 
      className="h-screen w-full relative overflow-hidden snap-start snap-always bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${final4})` }}
    >
      {showIntroduction && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black bg-opacity-80">
          <div className="text-center">
            <h1 className="text-white font-bold font-poppins text-6xl md:text-8xl mb-8 animate-pulse">
              INTRODUCING
            </h1>
            <p className="text-white font-poppins text-2xl md:text-4xl leading-relaxed max-w-4xl animate-fade-in">
              THE FIRST EVER DATE'S COLA
            </p>
          </div>
        </div>
      )}
      
      <div className={`flex items-center justify-center h-full pt-20 transition-all duration-1000 ease-in-out ${
        showMainContent ? 'blur-none opacity-100' : 'blur-md opacity-30'
      }`} style={{ zIndex: 10, position: 'relative' }}>
        <div className="flex items-center justify-center w-full px-6 space-x-16">
          <div className="flex justify-center">
            <h1 className={`text-black font-bold font-poppins uppercase transition-all duration-1000 ease-out ${
              showMainContent ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-32'
            }`} style={{ fontSize: '8.5rem', transform: showMainContent ? 'translateX(-0.5cm) translateY(-2cm)' : 'translateX(-8rem) translateY(-2cm)', opacity: showMainContent ? 0.7 : 0 }}>M I L A F</h1>
          </div>
          <div className="flex justify-center">
            <h1 className={`text-black font-normal font-poppins uppercase transition-all duration-1000 ease-out ${
              showMainContent ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-32'
            }`} style={{ fontSize: '7rem', transform: showMainContent ? 'translateX(-0.7cm) translateY(-1.7cm)' : 'translateX(8rem) translateY(-1.7cm)', opacity: showMainContent ? 0.7 : 0 }}>C O L A</h1>
          </div>
        </div>
      </div>
      
      {/* ENRICHED . SMOOTH . text */}
      <div className={`absolute inset-0 flex flex-col items-start justify-end pb-48 pl-[21.7cm] transition-all duration-1000 ease-in-out ${
        showMainContent ? 'opacity-100' : 'opacity-0'
      }`} style={{ zIndex: 5 }}>
        <p className={`text-black font-bold font-poppins uppercase transition-all duration-1000 ease-out ${
          showMainContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`} style={{ fontSize: '30px', opacity: showMainContent ? 0.3 : 0 }}>ENRICHED . SMOOTH .</p>
        <p className={`text-black font-bold font-poppins uppercase transition-all duration-1000 ease-out ${
          showMainContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`} style={{ fontSize: '30px', opacity: showMainContent ? 0.3 : 0, marginTop: '-0.5rem' }}>NUTRITIOUS .</p>
      </div>

      {/* Date Elements positioned according to Figma design */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 ease-in-out ${
        showMainContent ? 'opacity-100' : 'opacity-0'
      }`} style={{ zIndex: 3, transitionDelay: showMainContent ? '0.5s' : '0s' }}>
        {/* CUTDATE4 - Lazy loaded with optimized positioning and animation */}
        <img 
          src={cutdate4} 
          alt="Cut Date 4" 
          className="absolute animate-float-optimized"
          loading="lazy"
          style={{
            left: 'calc(778px - 7cm - 70px)',
            top: 'calc(194px - 3cm)',
            width: 'calc(144px * 0.9 * 0.9 * 0.9 * 1.2 * 1.1 * 0.9 * 1.1)',
            height: 'calc(150px * 0.9 * 0.9 * 0.9 * 1.2 * 1.1 * 0.9 * 1.1)',
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        />
        
      </div>
      
      {/* DATES2 - Lazy loaded with optimized animation and positioning */}
      <img 
        src={dates2} 
        alt="Dates 2" 
        className={`absolute animate-sway-optimized transition-all duration-1000 ease-in-out ${
          showMainContent ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        style={{
          left: 'calc(976px - 7.5cm - 40px + 40px + 40px)',
          top: 'calc(552px - 5.5cm - 200px + 20px + 20px + 10px)',
          width: 'calc(170.45px * 0.7 * 1.1 * 1.2 * 1.15 * 0.7 * 0.9)',
          height: 'calc(149.9px * 0.7 * 1.1 * 1.2 * 1.15 * 0.7 * 0.9)',
          zIndex: 1,
          transitionDelay: showMainContent ? '0.5s' : '0s',
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
      
       {/* Cola Powder Burst - Lazy loaded circular reveal animation */}
       <img 
         src={colapowderburst} 
         alt="Cola Powder Burst" 
         className={`absolute cola-powder-reveal transition-all duration-1000 ease-in-out ${
           showMainContent ? 'opacity-100' : 'opacity-0'
         }`}
         loading="lazy"
         style={{
           left: 'calc(315px + 0.5cm - 50px - 40px)',
           top: 'calc(-537px + 16.5cm - 50px - 60px - 50px)',
           width: 'calc(1131.01px * 0.9 * 0.9 * 0.9 * 0.5 * 1.1 * 1.2 * 1.3 - 10px)',
           height: 'calc(1696.52px * 0.9 * 0.9 * 0.9 * 0.5 * 1.1 * 1.2 * 1.3 - 10px)',
           transform: 'rotate(14.77deg)',
           zIndex: 0,
           transitionDelay: showMainContent ? '0.5s' : '0s',
           willChange: 'transform',
           backfaceVisibility: 'hidden'
         }}
       />
      
      {/* DATES1 - Lazy loaded Browndate2 image positioned behind mfhq can */}
      <img 
        src={dates1} 
        alt="Dates 1" 
        className={`absolute animate-float-optimized transition-all duration-1000 ease-in-out ${
          showMainContent ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        style={{
          left: 'calc(824px - 8cm + 60px + 40px + 20px + 30px)',
          top: 'calc(743px - 8cm - 250px - 20px - 30px - 40px + 30px)',
          width: 'calc(237px * 0.9 * 0.9 * 0.7 * 0.5)',
          height: 'calc(188px * 0.9 * 0.9 * 0.7 * 0.5)',
          zIndex: 1,
          transitionDelay: showMainContent ? '0.5s' : '0s',
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
      
      {/* DATES3 - Lazy loaded Browndate4 image positioned in front of mfhq can */}
      <img 
        src={dates3} 
        alt="Dates 3" 
        className={`absolute animate-sway-optimized transition-all duration-1000 ease-in-out ${
          showMainContent ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        style={{
          left: 'calc(439px - 4cm)',
          top: 'calc(813px - 8cm)',
          width: 'calc(156px * 0.8 * 1.15 * 1.2 * 1.15)',
          height: 'calc(135px * 0.8 * 1.15 * 1.2 * 1.15)',
          zIndex: 10,
          transitionDelay: showMainContent ? '0.5s' : '0s',
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
      
       {/* Tilted COLA can - Lazy loaded with optimized animation */}
       <img 
         src={mfhq} 
         alt="Tilted COLA can" 
         className={`absolute transition-all duration-1000 ease-out ${
           showMainContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-32'
         }`}
         loading="lazy"
         style={{
           left: 'calc(315px + 0.5cm + 20px + 20px)',
           top: 'calc(-537px + 16.5cm)',
           width: 'calc(1131.01px * 0.9 * 0.9 * 0.9 * 0.5 * 1.1 * 0.9 - 10px)',
           height: 'calc(1696.52px * 0.9 * 0.9 * 0.9 * 0.5 * 1.1 * 0.9 - 10px)',
           transform: showMainContent ? 'rotate(14.77deg)' : 'rotate(14.77deg) translateY(-8rem)',
           zIndex: 5,
           willChange: 'transform',
           backfaceVisibility: 'hidden'
         }}
       />
      
      {/* Bottom Tilted COLA can - Lazy loaded with opposite side rotation */}
      <img 
        src={mfhq} 
        alt="Bottom Tilted COLA can" 
        className={`absolute transition-all duration-1000 ease-out ${
          showMainContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-32'
        }`}
        loading="lazy"
        style={{
          left: 'calc(50% + 200px - 20px - 60px - 70px)',
          top: 'calc(100vh - 200px)',
          width: 'calc(1131.01px * 0.9 * 0.9 * 0.9 * 0.5 * 1.1 * 0.9 * 0.6 * 1.1 * 1.2 - 10px)',
          height: 'calc(1696.52px * 0.9 * 0.9 * 0.9 * 0.5 * 1.1 * 0.9 * 0.6 * 1.1 * 1.2 - 10px)',
          transform: showMainContent ? 'rotate(-50deg)' : 'rotate(-50deg) translateY(8rem)',
          zIndex: 6,
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      />
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        /* Optimized animations with hardware acceleration */
        @keyframes floatOptimized {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -8px, 0);
          }
        }
        .animate-float-optimized {
          animation: floatOptimized 3s ease-in-out infinite;
          will-change: transform;
        }
        
        @keyframes swayOptimized {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-4px, 0, 0);
          }
        }
        .animate-sway-optimized {
          animation: swayOptimized 4s ease-in-out infinite;
          will-change: transform;
        }
        
        @keyframes colaDrop {
          0% {
            transform: rotate(14.77deg) translateY(-200px);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: rotate(14.77deg) translateY(0px);
            opacity: 1;
          }
        }
        .animate-cola-drop {
          animation: colaDrop 2s ease-out forwards;
        }
        
        @keyframes circularReveal {
          0% {
            clip-path: circle(0% at 50% 50%);
          }
          100% {
            clip-path: circle(100% at 50% 50%);
          }
        }
         .cola-powder-reveal {
           animation: circularReveal 1.5s ease-out 2s forwards; /* 2s delay - after dates appear */
         }
      `}</style>
    </main>
  );
};
