import React, { useState, useEffect } from "react";
import mobilepagehero from "@/assets/mobile/mobilepagehero.png";
import dates2 from "@/assets/browndate4-2.png";
import dates1 from "@/assets/browndate2.png";
import dates3 from "@/assets/browndate4.png";
import cutdate4 from "@/assets/browndates5.png";
import mfhq from "@/assets/mfhq.png";
import colapowderburst from "@/assets/colapowderburst.png";
import { preloadHeroImages, preloadCriticalHeroImages } from "@/utils/imagePreloader";

export const HeroPage3 = (): JSX.Element => {
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Start animations immediately for fast loading
    const timer = setTimeout(() => {
      setShowIntroduction(false);
      setShowMainContent(true);
    }, 800); // Very fast transition
    
    return () => clearTimeout(timer);
  }, []);

  // Preload critical images immediately for instant loading
  useEffect(() => {
    preloadCriticalHeroImages(true);
    // Preload remaining images in background
    preloadHeroImages(true).catch(console.error);
  }, []);

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
        zIndex: 9999999, 
        position: 'relative', 
        marginTop: isTablet ? '-8rem' : '-11.2rem' // Tablet: -8rem, Mobile: -11.2rem
      }}>
        <div className="flex flex-col items-center justify-center w-full px-4 md:px-8 lg:px-12">
          <div className="flex justify-center">
            <h1 className={`text-black font-bold font-poppins uppercase transition-all duration-1000 ease-out ${
              showMainContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-32'
            }`} style={{ 
              fontSize: isTablet ? 'clamp(4rem, 12vw, 7rem)' : 'clamp(3rem, 15vw, 6rem)', // Larger for tablet
              opacity: showMainContent ? 0.7 : 0 
            }}>M I L A F</h1>
          </div>
          <div className="flex justify-center">
            <h1 className={`text-black font-normal font-poppins uppercase transition-all duration-1000 ease-out ${
              showMainContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-32'
            }`} style={{ 
              fontSize: isTablet ? 'clamp(4rem, 12vw, 7rem)' : 'clamp(3rem, 15vw, 6rem)', // Larger for tablet
              opacity: showMainContent ? 0.7 : 0, 
              marginTop: isTablet ? '-1.5rem' : '-1.2rem' // Tablet: -1.5rem, Mobile: -1.2rem
            }}>C O L A</h1>
          </div>
        </div>
      </div>
      
      {/* ENRICHED . SMOOTH . text - Mobile and tablet optimized */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
        showMainContent ? 'opacity-100' : 'opacity-0'
      }`} style={{ 
        zIndex: 9999999, 
        marginTop: isTablet ? '-7rem' : '-10.4rem' // Tablet: -7rem, Mobile: -10.4rem
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
      }`} style={{ zIndex: 999999, transitionDelay: showMainContent ? '0.5s' : '0s' }}>
        
        
        {/* CUTDATE4 - Mobile and tablet optimized */}
        <img 
          src={cutdate4} 
          alt="Cut Date 4" 
          className="absolute animate-float"
          style={{
            left: isTablet ? 'calc(50% - 1.5rem - 70px - 20px)' : 'calc(50% - 1rem - 70px - 20px)', // Tablet: moved left - 70px - 20px
            top: isTablet ? 'calc(25% + 10rem - 70px - 25px)' : 'calc(25% + 12.6rem - 70px - 25px)', // Tablet: moved up - 70px - 25px
            width: isTablet ? 'calc(4.5rem * 1.2 * 1.1 * 0.9 * 1.1)' : 'calc(3.85rem * 1.2 * 1.1 * 0.9 * 1.1)', // Tablet: larger + 20% + 10% - 10% + 10%
            height: isTablet ? 'calc(4.5rem * 1.2 * 1.1 * 0.9 * 1.1)' : 'calc(3.85rem * 1.2 * 1.1 * 0.9 * 1.1)' // Tablet: larger + 20% + 10% - 10% + 10%
          }}
        />
        
      </div>
      
      {/* DATES2 - Moved outside high z-index container to appear behind mfhq - Mobile and tablet optimized */}
      <img 
        src={dates2} 
        alt="Dates 2" 
        className={`absolute animate-sway-rotated transition-all duration-1000 ease-in-out ${
          showMainContent ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: isTablet ? 'calc(50% + 5rem - 40px + 40px + 40px - 50px + 10px)' : 'calc(50% + 4rem - 40px + 40px + 40px - 50px + 10px)', // Tablet: moved right - 40px + 40px + 40px - 50px + 10px
          top: isTablet ? 'calc(45% + 8rem - 200px + 20px + 20px + 10px)' : 'calc(45% + 10rem - 200px + 20px + 20px + 10px)', // Tablet: moved up - 200px + 20px + 20px + 10px
          width: isTablet ? 'calc(6rem * 1.2 * 1.15 * 0.7 * 0.9)' : 'calc(4.95rem * 1.2 * 1.15 * 0.7 * 0.9)', // Tablet: larger + 20% + 15% - 30% - 10%
          height: isTablet ? 'calc(5.28rem * 1.2 * 1.15 * 0.7 * 0.9)' : 'calc(4.4rem * 1.2 * 1.15 * 0.7 * 0.9)', // Tablet: larger + 20% + 15% - 30% - 10%
          zIndex: 1,
          transitionDelay: showMainContent ? '0.5s' : '0s'
        }}
      />
      
       {/* Cola Powder Burst - Circular reveal animation - Mobile and tablet optimized */}
       <img 
         src={colapowderburst} 
         alt="Cola Powder Burst" 
         className={`absolute cola-powder-reveal transition-all duration-1000 ease-in-out ${
           showMainContent ? 'opacity-100' : 'opacity-0'
         }`}
         style={{
           left: isTablet ? 'calc(50% - 10rem - 50px - 40px + 10px)' : 'calc(50% - 8rem - 50px - 40px + 10px)', // Tablet: moved left + 50px + 40px + 10px
          top: isTablet ? 'calc(50% - 2rem - 50px - 60px - 50px)' : 'calc(50% - 1.2rem - 50px - 60px - 50px)', // Tablet: moved up + 50px + 60px + 50px
          width: isTablet ? 'calc(20rem * 1.2 * 1.3)' : 'calc(17.16rem * 1.2 * 1.3)', // Tablet: larger + 20% + 30%
          height: isTablet ? 'calc(30rem * 1.2 * 1.3)' : 'calc(25.74rem * 1.2 * 1.3)', // Tablet: larger + 20% + 30%
          transform: 'rotate(14.77deg)',
          zIndex: 0,
          transitionDelay: showMainContent ? '0.5s' : '0s'
        }}
      />
      
      {/* DATES1 - Browndate2 image positioned behind mfhq can - Mobile and tablet optimized */}
      <img 
        src={dates1} 
        alt="Dates 1" 
        className={`absolute animate-float-dates1 transition-all duration-1000 ease-in-out ${
          showMainContent ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: isTablet ? 'calc(50% - 1.5rem + 60px + 40px + 20px - 50px - 30px - 20px + 20px - 10px)' : 'calc(50% - 1rem + 60px + 40px + 20px - 50px - 30px - 20px + 20px - 10px)', // Tablet: moved left + 60px + 40px + 20px - 50px - 30px - 20px + 20px - 10px
          top: isTablet ? 'calc(55% + 8rem - 250px - 20px - 30px - 40px + 30px + 50px + 25px + 150px + 70px)' : 'calc(55% + 10.2rem - 250px - 20px - 30px - 40px + 30px + 50px + 25px + 150px + 70px)', // Tablet: moved up - 250px - 20px - 30px - 40px + 30px + 50px + 25px + 150px + 70px
          width: isTablet ? 'calc(7.5rem * 0.7)' : 'calc(6.325rem * 0.7)', // Tablet: larger - 30%
          height: isTablet ? 'calc(6rem * 0.7)' : 'calc(5.06rem * 0.7)', // Tablet: larger - 30%
          zIndex: 1,
          transitionDelay: showMainContent ? '0.5s' : '0s'
        }}
      />
      
      {/* DATES3 - Browndate4 image positioned in front of mfhq can - Mobile and tablet optimized */}
      <img 
        src={dates3} 
        alt="Dates 3" 
        className={`absolute animate-sway-dates2 transition-all duration-1000 ease-in-out ${
          showMainContent ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: isTablet ? 'calc(50% - 10rem)' : 'calc(50% - 8.4rem)', // Tablet: moved left
          top: isTablet ? 'calc(60% + 8rem)' : 'calc(60% + 10rem)', // Tablet: moved up
          width: isTablet ? 'calc(5rem * 1.15 * 1.2 * 1.15)' : 'calc(4rem * 1.15 * 1.2 * 1.15)', // Tablet: larger + 15% + 20% + 15%
          height: isTablet ? 'calc(4.375rem * 1.15 * 1.2 * 1.15)' : 'calc(3.5rem * 1.15 * 1.2 * 1.15)', // Tablet: larger + 15% + 20% + 15%
          zIndex: 10,
          transitionDelay: showMainContent ? '0.5s' : '0s'
        }}
      />
      
       {/* Tilted COLA can - Mobile and tablet optimized positioning */}
       <img 
         src={mfhq} 
         alt="Tilted COLA can" 
         className={`absolute transition-all duration-1000 ease-out ${
           showMainContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-32'
         }`}
         style={{
          left: isTablet ? 'calc(50% - 10rem + 20px + 20px - 40px)' : 'calc(50% - 8rem + 20px + 20px - 40px)', // Tablet: moved left + 20px + 20px - 40px
          top: isTablet ? 'calc(50% - 2rem - 40px - 10px)' : 'calc(50% - 1.2rem - 40px - 10px)', // Tablet: moved up - 40px - 10px
           width: isTablet ? 'calc(20rem * 0.9)' : 'calc(17.16rem * 0.9)', // Tablet: larger - 10%
           height: isTablet ? 'calc(30rem * 0.9)' : 'calc(25.74rem * 0.9)', // Tablet: larger - 10%
          transform: showMainContent ? 'rotate(-0.23deg)' : 'rotate(-0.23deg) translateY(-8rem)',
          zIndex: 5
         }}
       />
       
       {/* Bottom Tilted COLA can - Opposite side rotation - Mobile and tablet optimized */}
       <img 
         src={mfhq} 
         alt="Bottom Tilted COLA can" 
         className={`absolute transition-all duration-1000 ease-out ${
           showMainContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-32'
         }`}
         style={{
          left: isTablet ? 'calc(50% + 8rem - 20px - 60px - 70px + 70px)' : 'calc(50% + 6rem - 20px - 60px - 70px + 70px)', // Tablet: moved right - 20px - 60px - 70px + 70px
          top: isTablet ? 'calc(100vh - 12rem + 40px + 20px)' : 'calc(100vh - 10rem + 40px + 20px)', // Tablet: moved up from bottom + 40px + 20px
           width: isTablet ? 'calc(20rem * 0.9 * 0.6 * 1.1 * 1.2)' : 'calc(17.16rem * 0.9 * 0.6 * 1.1 * 1.2)', // Tablet: larger - 10% - 40% + 10% + 20%
           height: isTablet ? 'calc(30rem * 0.9 * 0.6 * 1.1 * 1.2)' : 'calc(25.74rem * 0.9 * 0.6 * 1.1 * 1.2)', // Tablet: larger - 10% - 40% + 10% + 20%
           transform: showMainContent ? 'rotate(-50deg)' : 'rotate(-50deg) translateY(8rem)',
           zIndex: 6
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
         
         @keyframes float {
           0%, 100% {
             transform: translateY(0px);
           }
           50% {
             transform: translateY(-10px);
           }
         }
         .animate-float {
           animation: float 1.5s ease-in-out infinite;
         }
         
         @keyframes sway {
           0%, 100% {
             transform: translateX(0px);
           }
           50% {
             transform: translateX(-8px);
           }
         }
         .animate-sway {
           animation: sway 2s ease-in-out infinite;
         }
         
         @keyframes swayRotated {
           0%, 100% {
             transform: rotate(80deg) translateX(0px);
           }
           50% {
             transform: rotate(80deg) translateX(-8px);
           }
         }
         .animate-sway-rotated {
           animation: swayRotated 2s ease-in-out infinite;
         }
         
         @keyframes floatDates1 {
           0%, 100% {
             transform: translateY(0px);
           }
           50% {
             transform: translateY(-12px);
           }
         }
         .animate-float-dates1 {
           animation: floatDates1 2.5s ease-in-out infinite;
         }
         
         @keyframes swayDates2 {
           0%, 100% {
             transform: translateX(0px);
           }
           50% {
             transform: translateX(-6px);
           }
         }
         .animate-sway-dates2 {
           animation: swayDates2 2.2s ease-in-out infinite;
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