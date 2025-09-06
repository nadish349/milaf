import React, { useState, useEffect } from "react";
import mobilepagehero from "@/assets/mobile/mobilepagehero.png";
import dates2 from "@/assets/dates2.png";
import dates1 from "@/assets/dates1.png";
import dates3 from "@/assets/dates3.png";
import cutdate4 from "@/assets/CUTDATE4.png";
import titledcolacan from "@/assets/titledcolacan.png";

export const HeroPage2 = (): JSX.Element => {
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
    const timer = setTimeout(() => {
      setShowIntroduction(false);
      setShowMainContent(true);
    }, 3000);
    return () => clearTimeout(timer);
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
      }`} style={{ zIndex: 999999 }}>
        {/* DATES2 - Mobile and tablet optimized */}
        <img 
          src={dates2} 
          alt="Dates 2" 
          className="absolute animate-sway-dates2"
          style={{
            left: isTablet ? 'calc(50% - 10rem)' : 'calc(50% - 8.4rem)', // Tablet: moved left
            top: isTablet ? 'calc(60% + 8rem)' : 'calc(60% + 10rem)', // Tablet: moved up
            width: isTablet ? '5rem' : '4rem', // Tablet: larger
            height: isTablet ? '4.375rem' : '3.5rem' // Tablet: larger
          }}
        />
        
        {/* DATES1 - Mobile and tablet optimized */}
        <img 
          src={dates1} 
          alt="Dates 1" 
          className="absolute animate-float-dates1"
          style={{
            left: isTablet ? 'calc(50% - 1.5rem)' : 'calc(50% - 1rem)', // Tablet: moved left
            top: isTablet ? 'calc(55% + 8rem)' : 'calc(55% + 10.2rem)', // Tablet: moved up
            width: isTablet ? '7.5rem' : '6.325rem', // Tablet: larger
            height: isTablet ? '6rem' : '5.06rem' // Tablet: larger
          }}
        />
        
        {/* DATES3 - Mobile and tablet optimized */}
        <img 
          src={dates3} 
          alt="Dates 3" 
          className="absolute animate-sway"
          style={{
            left: isTablet ? 'calc(50% + 5rem)' : 'calc(50% + 4rem)', // Tablet: moved right
            top: isTablet ? 'calc(45% + 8rem)' : 'calc(45% + 10rem)', // Tablet: moved up
            width: isTablet ? '6rem' : '4.95rem', // Tablet: larger
            height: isTablet ? '5.28rem' : '4.4rem' // Tablet: larger
          }}
        />
        
        {/* CUTDATE4 - Mobile and tablet optimized */}
        <img 
          src={cutdate4} 
          alt="Cut Date 4" 
          className="absolute animate-float"
          style={{
            left: isTablet ? 'calc(50% - 1.5rem)' : 'calc(50% - 1rem)', // Tablet: moved left
            top: isTablet ? 'calc(25% + 10rem)' : 'calc(25% + 12.6rem)', // Tablet: moved up
            width: isTablet ? '4.5rem' : '3.85rem', // Tablet: larger
            height: isTablet ? '4.5rem' : '3.85rem' // Tablet: larger
          }}
        />
        
      </div>
      
      {/* Tilted COLA can - Mobile and tablet optimized positioning */}
      <img 
        src={titledcolacan} 
        alt="Tilted COLA can" 
        className={`absolute transition-all duration-1000 ease-out ${
          showMainContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-32'
        }`}
        style={{
          left: isTablet ? 'calc(50% - 10rem)' : 'calc(50% - 8rem)', // Tablet: moved left
          top: isTablet ? 'calc(50% - 2rem)' : 'calc(50% - 1.2rem)', // Tablet: moved up
          width: isTablet ? '20rem' : '17.16rem', // Tablet: larger
          height: isTablet ? '30rem' : '25.74rem', // Tablet: larger
          transform: showMainContent ? 'rotate(14.77deg)' : 'rotate(14.77deg) translateY(-8rem)',
          zIndex: 5
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
      `}</style>
    </main>
  );
};
