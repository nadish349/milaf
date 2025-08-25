import React, { useState, useEffect } from "react";
import final4 from "@/assets/final4.png";
import dates2 from "@/assets/dates2.png";
import dates1 from "@/assets/dates1.png";
import dates3 from "@/assets/dates3.png";
import cutdate4 from "@/assets/CUTDATE4.png";
import titledcolacan from "@/assets/titledcolacan.png";

export const HeroPage2 = (): JSX.Element => {
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntroduction(false);
      setShowMainContent(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
      }`} style={{ zIndex: 9999999, position: 'relative' }}>
        <div className="flex items-center justify-center w-full px-6 space-x-16">
          <div className="flex justify-center">
            <h1 className={`text-black font-bold font-poppins uppercase transition-all duration-1000 ease-out ${
              showMainContent ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-32'
            }`} style={{ fontSize: '8.5rem', transform: showMainContent ? 'translateX(-1cm) translateY(-2cm)' : 'translateX(-8rem) translateY(-2cm)', opacity: showMainContent ? 0.7 : 0 }}>M I L A F</h1>
          </div>
          <div className="flex justify-center">
            <h1 className={`text-black font-normal font-poppins uppercase transition-all duration-1000 ease-out ${
              showMainContent ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-32'
            }`} style={{ fontSize: '8.5rem', transform: showMainContent ? 'translateX(1cm) translateY(-2cm)' : 'translateX(8rem) translateY(-2cm)', opacity: showMainContent ? 0.7 : 0 }}>C O L A</h1>
          </div>
        </div>
      </div>
      
      {/* ENRICHED . SMOOTH . text */}
      <div className={`absolute inset-0 flex flex-col items-start justify-end pb-48 pl-[21.7cm] transition-all duration-1000 ease-in-out ${
        showMainContent ? 'opacity-100' : 'opacity-0'
      }`} style={{ zIndex: 9999999 }}>
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
      }`} style={{ zIndex: 999999 }}>
        {/* DATES2 - x=439, y=813, w=156, h=135 - moved 4cm left and 8cm up, reduced by 20% with left-right animation */}
        <img 
          src={dates2} 
          alt="Dates 2" 
          className="absolute animate-sway-dates2"
          style={{
            left: 'calc(439px - 4cm)',
            top: 'calc(813px - 8cm)',
            width: 'calc(156px * 0.8)',
            height: 'calc(135px * 0.8)'
          }}
        />
        
        {/* DATES1 - x=824, y=743, w=237, h=188 - moved 8cm left and 8cm up, reduced by 20% total with up-down animation */}
        <img 
          src={dates1} 
          alt="Dates 1" 
          className="absolute animate-float-dates1"
          style={{
            left: 'calc(824px - 8cm)',
            top: 'calc(743px - 8cm)',
            width: 'calc(237px * 0.9 * 0.9)',
            height: 'calc(188px * 0.9 * 0.9)'
          }}
        />
        
        {/* DATES3 - x=976, y=552, w=170.45, h=149.9 - moved 7.5cm left, 5.5cm up, and reduced by 20% total with left-right animation */}
        <img 
          src={dates3} 
          alt="Dates 3" 
          className="absolute animate-sway"
          style={{
            left: 'calc(976px - 7.5cm)',
            top: 'calc(552px - 5.5cm)',
            width: 'calc(170.45px * 0.7 * 1.1)',
            height: 'calc(149.9px * 0.7 * 1.1)'
          }}
        />
        
        {/* CUTDATE4 - x=778, y=194, w=144, h=150 - moved 7cm left and 3cm up with animation, reduced by 30% total */}
        <img 
          src={cutdate4} 
          alt="Cut Date 4" 
          className="absolute animate-float"
          style={{
            left: 'calc(778px - 7cm)',
            top: 'calc(194px - 3cm)',
            width: 'calc(144px * 0.9 * 0.9 * 0.9)',
            height: 'calc(150px * 0.9 * 0.9 * 0.9)'
          }}
        />
        
      </div>
      
      {/* Tilted COLA can - x=315, y=-537, w=1131.01, h=1696.52, rotation=14.77°, reduced by 30% total, moved 4.5cm down and 0.5cm right with animation */}
      <img 
        src={titledcolacan} 
        alt="Tilted COLA can" 
        className={`absolute transition-all duration-1000 ease-out ${
          showMainContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-32'
        }`}
        style={{
          left: 'calc(315px + 0.5cm)',
          top: 'calc(-537px + 16.5cm)',
          width: 'calc(1131.01px * 0.9 * 0.9 * 0.9 * 0.5 * 1.1)',
          height: 'calc(1696.52px * 0.9 * 0.9 * 0.9 * 0.5 * 1.1)',
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
