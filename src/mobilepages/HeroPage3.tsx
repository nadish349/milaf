import React, { useState, useEffect } from "react";
import mobilepagehero from "@/assets/mobile/mobilepagehero.png";
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
  const [isTablet, setIsTablet] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // First: Load background image
  useEffect(() => {
    const bgImg = new Image();
    bgImg.onload = () => {
      setBackgroundLoaded(true);
    };
    bgImg.src = mobilepagehero;
  }, []);

  // Second: Show content immediately after background loads (no image preloading dependency)
  useEffect(() => {
    if (backgroundLoaded) {
      const timer = setTimeout(() => {
        setShowIntroduction(false);
        setShowMainContent(true);
        // Load other images in background after main content is visible
        preloadHeroImagesOptimized(true, () => {}).catch(console.error);
      }, 300); // Reduced from 1000ms for faster landing
      
      return () => clearTimeout(timer);
    }
  }, [backgroundLoaded]);

  return (
    <main 
      className="h-screen w-full relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${mobilepagehero})` }}
    >
      {showIntroduction && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black bg-opacity-80">
          <div className="text-center">
            <h1 className="text-white font-bold font-poppins text-4xl md:text-6xl mb-6 animate-pulse">
              INTRODUCING
            </h1>
            <p className="text-white font-poppins text-xl md:text-3xl leading-relaxed max-w-4xl animate-fade-in">
              THE FIRST EVER DATE'S COLA
            </p>
          </div>
        </div>
      )}
      
      {/* Main Content - Optimized for mobile and tablet */}
      <div className={`flex items-center justify-center h-full transition-all duration-1000 ease-in-out ${
        showMainContent ? 'blur-none opacity-100' : 'blur-md opacity-30'
      }`} style={{ 
        zIndex: 10, 
        position: 'relative', 
        marginTop: isTablet ? '-8rem' : '-11.2rem' // Tablet: -8rem, Mobile: -11.2rem
      }}>
        <div className="flex flex-col items-center justify-center w-full px-4 md:px-8 lg:px-12">
          <div className="flex justify-center">
            <h1 className={`text-black font-bold font-poppins uppercase transition-all duration-1000 ease-out ${
              showMainContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-32'
            }`} style={{ 
              fontSize: isTablet ? 'clamp(4rem, 12vw, 7rem)' : 'clamp(3rem, 15vw, 6rem)', // Larger for tablet
              opacity: showMainContent ? 0.7 : 0,
              marginTop: isTablet ? '-40px' : '-40px' // Move MILAF up by 40px to match COLA
            }}>M I L A F</h1>
          </div>
          <div className="flex justify-center">
            <h1 className={`text-black font-normal font-poppins uppercase transition-all duration-1000 ease-out ${
              showMainContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-32'
            }`} style={{ 
              fontSize: isTablet ? 'clamp(4rem, 12vw, 7rem)' : 'clamp(3rem, 15vw, 6rem)', // Larger for tablet
              opacity: showMainContent ? 0.7 : 0, 
              marginTop: isTablet ? 'calc(-1.5rem - 40px + 10px + 15px)' : 'calc(-1.2rem - 40px + 10px + 15px)' // Tablet: -1.5rem - 40px + 10px + 15px, Mobile: -1.2rem - 40px + 10px + 15px
            }}>C O L A</h1>
          </div>
        </div>
      </div>
      
      {/* ENRICHED . SMOOTH . text - Mobile and tablet optimized */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
        showMainContent ? 'opacity-100' : 'opacity-0'
      }`} style={{ 
        zIndex: 5, 
        marginTop: isTablet ? 'calc(-7rem - 30px - 30px)' : 'calc(-10.4rem - 30px - 30px)' // Tablet: -7rem - 60px, Mobile: -10.4rem - 60px
      }}>
        <p className={`text-black font-bold font-poppins uppercase transition-all duration-1000 ease-out ${
          showMainContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`} style={{ 
          fontSize: isTablet ? 'clamp(1.5rem, 3vw, 2rem)' : 'clamp(1rem, 4vw, 1.5rem)', // Larger for tablet
          opacity: showMainContent ? 0.3 : 0 
        }}>ENRICHED . SMOOTH .</p>
        <p className={`text-black font-bold font-poppins uppercase transition-all duration-1000 ease-out ${
          showMainContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`} style={{ 
          fontSize: isTablet ? 'clamp(1.5rem, 3vw, 2rem)' : 'clamp(1rem, 4vw, 1.5rem)', // Larger for tablet
          opacity: showMainContent ? 0.3 : 0, 
          marginTop: isTablet ? '-0.5rem' : '-0.25rem' // Tablet: -0.5rem, Mobile: -0.25rem
        }}>NUTRITIOUS .</p>
      </div>

      {/* Date Elements - Mobile and tablet optimized positioning */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 ease-in-out ${
        showMainContent ? 'opacity-100' : 'opacity-0'
      }`} style={{ zIndex: 3, transitionDelay: showMainContent ? '1.5s' : '0s' }}>
        
        
        {/* CUTDATE4 - Mobile and tablet optimized with hardware acceleration */}
        <img 
          src={cutdate4} 
          alt="Cut Date 4" 
          className="absolute animate-float-optimized"
          loading="lazy"
          style={{
            left: isTablet ? 'calc(50% - 1.5rem - 70px - 20px)' : 'calc(50% - 1rem - 70px - 20px)', // Tablet: moved left - 70px - 20px
            top: isTablet ? 'calc(25% + 10rem - 70px - 25px)' : 'calc(25% + 12.6rem - 70px - 25px)', // Tablet: moved up - 70px - 25px
            width: isTablet ? 'calc(4.5rem * 1.2 * 1.1 * 0.9 * 1.1)' : 'calc(3.85rem * 1.2 * 1.1 * 0.9 * 1.1)', // Tablet: larger + 20% + 10% - 10% + 10%
            height: isTablet ? 'calc(4.5rem * 1.2 * 1.1 * 0.9 * 1.1)' : 'calc(3.85rem * 1.2 * 1.1 * 0.9 * 1.1)', // Tablet: larger + 20% + 10% - 10% + 10%
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        />
        
      </div>
      
      {/* DATES2 - Lazy loaded with optimized animation - Mobile and tablet optimized */}
      <img 
        src={dates2} 
        alt="Dates 2" 
        className={`absolute animate-sway-optimized transition-all duration-1000 ease-in-out ${
          showMainContent ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        style={{
          left: isTablet ? 'calc(50% + 5rem - 40px + 40px + 40px - 50px + 10px)' : 'calc(50% + 4rem - 40px + 40px + 40px - 50px + 10px)', // Tablet: moved right - 40px + 40px + 40px - 50px + 10px
          top: isTablet ? 'calc(45% + 8rem - 200px + 20px + 20px + 10px)' : 'calc(45% + 10rem - 200px + 20px + 20px + 10px)', // Tablet: moved up - 200px + 20px + 20px + 10px
          width: isTablet ? 'calc(6rem * 1.2 * 1.15 * 0.7 * 0.9)' : 'calc(4.95rem * 1.2 * 1.15 * 0.7 * 0.9)', // Tablet: larger + 20% + 15% - 30% - 10%
          height: isTablet ? 'calc(5.28rem * 1.2 * 1.15 * 0.7 * 0.9)' : 'calc(4.4rem * 1.2 * 1.15 * 0.7 * 0.9)', // Tablet: larger + 20% + 15% - 30% - 10%
          zIndex: 1,
          transitionDelay: showMainContent ? '1.5s' : '0s',
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
      
       {/* Cola Powder Burst - Lazy loaded circular reveal animation - Mobile and tablet optimized */}
       <img 
         src={colapowderburst} 
         alt="Cola Powder Burst" 
         className={`absolute cola-powder-reveal transition-all duration-1000 ease-in-out ${
           showMainContent ? 'opacity-100' : 'opacity-0'
         }`}
         loading="lazy"
         style={{
           left: isTablet ? 'calc(50% - 10rem - 50px - 40px + 10px)' : 'calc(50% - 8rem - 50px - 40px + 10px)', // Tablet: moved left + 50px + 40px + 10px
          top: isTablet ? 'calc(50% - 2rem - 50px - 60px - 50px)' : 'calc(50% - 1.2rem - 50px - 60px - 50px)', // Tablet: moved up + 50px + 60px + 50px
          width: isTablet ? 'calc(20rem * 1.2 * 1.3)' : 'calc(17.16rem * 1.2 * 1.3)', // Tablet: larger + 20% + 30%
          height: isTablet ? 'calc(30rem * 1.2 * 1.3)' : 'calc(25.74rem * 1.2 * 1.3)', // Tablet: larger + 20% + 30%
          transform: 'rotate(14.77deg)',
          zIndex: 0,
          transitionDelay: showMainContent ? '2.5s' : '0s',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      />
      
      {/* DATES1 - Lazy loaded Browndate2 image positioned behind mfhq can - Mobile and tablet optimized */}
      <img 
        src={dates1} 
        alt="Dates 1" 
        className={`absolute animate-float-optimized transition-all duration-1000 ease-in-out ${
          showMainContent ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        style={{
          left: isTablet ? 'calc(50% - 1.5rem + 60px + 40px + 20px - 50px - 30px - 20px + 20px - 10px)' : 'calc(50% - 1rem + 60px + 40px + 20px - 50px - 30px - 20px + 20px - 10px)', // Tablet: moved left + 60px + 40px + 20px - 50px - 30px - 20px + 20px - 10px
          top: isTablet ? 'calc(55% + 8rem - 250px - 20px - 30px - 40px + 30px + 50px + 25px + 150px + 70px)' : 'calc(55% + 10.2rem - 250px - 20px - 30px - 40px + 30px + 50px + 25px + 150px + 70px)', // Tablet: moved up - 250px - 20px - 30px - 40px + 30px + 50px + 25px + 150px + 70px
          width: isTablet ? 'calc(7.5rem * 0.7)' : 'calc(6.325rem * 0.7)', // Tablet: larger - 30%
          height: isTablet ? 'calc(6rem * 0.7)' : 'calc(5.06rem * 0.7)', // Tablet: larger - 30%
          zIndex: 1,
          transitionDelay: showMainContent ? '1.5s' : '0s',
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
      
      {/* DATES3 - Lazy loaded Browndate4 image positioned in front of mfhq can - Mobile and tablet optimized */}
      <img 
        src={dates3} 
        alt="Dates 3" 
        className={`absolute animate-sway-optimized transition-all duration-1000 ease-in-out ${
          showMainContent ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        style={{
          left: isTablet ? 'calc(50% - 10rem)' : 'calc(50% - 8.4rem)', // Tablet: moved left
          top: isTablet ? 'calc(60% + 8rem)' : 'calc(60% + 10rem)', // Tablet: moved up
          width: isTablet ? 'calc(5rem * 1.15 * 1.2 * 1.15)' : 'calc(4rem * 1.15 * 1.2 * 1.15)', // Tablet: larger + 15% + 20% + 15%
          height: isTablet ? 'calc(4.375rem * 1.15 * 1.2 * 1.15)' : 'calc(3.5rem * 1.15 * 1.2 * 1.15)', // Tablet: larger + 15% + 20% + 15%
          zIndex: 10,
          transitionDelay: showMainContent ? '1.5s' : '0s',
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
      
       {/* Tilted COLA can - Lazy loaded with mobile and tablet optimized positioning */}
       <img 
         src={mfhq} 
         alt="Tilted COLA can" 
         className={`absolute transition-all duration-1000 ease-out ${
           showMainContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-32'
         }`}
         loading="lazy"
         style={{
          left: isTablet ? 'calc(50% - 10rem + 20px + 20px - 40px)' : 'calc(50% - 8rem + 20px + 20px - 40px)', // Tablet: moved left + 20px + 20px - 40px
          top: isTablet ? 'calc(50% - 2rem - 40px - 10px)' : 'calc(50% - 1.2rem - 40px - 10px)', // Tablet: moved up - 40px - 10px
           width: isTablet ? 'calc(20rem * 0.9)' : 'calc(17.16rem * 0.9)', // Tablet: larger - 10%
           height: isTablet ? 'calc(30rem * 0.9)' : 'calc(25.74rem * 0.9)', // Tablet: larger - 10%
          transform: showMainContent ? 'rotate(-0.23deg)' : 'rotate(-0.23deg) translateY(-8rem)',
          zIndex: 5,
          willChange: 'transform',
          backfaceVisibility: 'hidden'
         }}
       />
       
       {/* Bottom Tilted COLA can - Lazy loaded with opposite side rotation - Mobile and tablet optimized */}
       <img 
         src={mfhq} 
         alt="Bottom Tilted COLA can" 
         className={`absolute transition-all duration-1000 ease-out ${
           showMainContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-32'
         }`}
         loading="lazy"
         style={{
          left: isTablet ? 'calc(50% + 8rem - 20px - 60px - 70px + 70px)' : 'calc(50% + 6rem - 20px - 60px - 70px + 70px)', // Tablet: moved right - 20px - 60px - 70px + 70px
          top: isTablet ? 'calc(100vh - 12rem + 40px + 20px)' : 'calc(100vh - 10rem + 40px + 20px)', // Tablet: moved up from bottom + 40px + 20px
           width: isTablet ? 'calc(20rem * 0.9 * 0.6 * 1.1 * 1.2)' : 'calc(17.16rem * 0.9 * 0.6 * 1.1 * 1.2)', // Tablet: larger - 10% - 40% + 10% + 20%
           height: isTablet ? 'calc(30rem * 0.9 * 0.6 * 1.1 * 1.2)' : 'calc(25.74rem * 0.9 * 0.6 * 1.1 * 1.2)', // Tablet: larger - 10% - 40% + 10% + 20%
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
           animation: circularReveal 1.5s ease-out 3s forwards; /* 3s delay - after dates appear */
         }
       `}</style>
    </main>
  );
};