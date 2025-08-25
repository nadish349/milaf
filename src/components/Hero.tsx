import React, { useState, useEffect } from "react";
import { HeroProducts } from "./HeroProducts";
import milaflogo from "@/assets/milaflogo.png";

interface HeroProps {
  onGradientChange?: (gradient: string) => void;
}

export const Hero = ({ onGradientChange }: HeroProps): JSX.Element => {
  const [currentGradient, setCurrentGradient] = useState("linear-gradient(135deg, #84B393, #C5E2CE)");

  useEffect(() => {
    if (onGradientChange) {
      onGradientChange(currentGradient);
    }
  }, [currentGradient, onGradientChange]);

  return (
    <main className="h-screen w-full relative overflow-hidden snap-start snap-always" style={{ background: currentGradient }}>
      {/* Navigation Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4 sm:p-6">
        <div className="flex items-center relative">
          {/* Left - Milaf Logo */}
          <div className="flex items-center">
            <img
              src={milaflogo}
              alt="Milaf Logo"
              className="h-12 w-auto object-contain sm:h-16"
            />
          </div>

          {/* Center - Navigation Links (Hidden on mobile) */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <a href="#" className="text-white font-bold font-poppins text-lg uppercase hover:opacity-80 transition-opacity">
              Home
            </a>
            <a href="#" className="text-white font-bold font-poppins text-lg uppercase hover:opacity-80 transition-opacity">
              About
            </a>
            <a href="#" className="text-white font-bold font-poppins text-lg uppercase hover:opacity-80 transition-opacity">
              Products
            </a>
            <a href="#" className="text-white font-bold font-poppins text-lg uppercase hover:opacity-80 transition-opacity">
              Contact
            </a>
          </nav>
          
          {/* Right side - Shop Button */}
          <button 
            className="px-3 py-2 sm:px-6 sm:py-3 font-bold font-poppins uppercase rounded-[20px] border-2 hover:opacity-80 transition-all duration-300 text-sm sm:text-base ml-auto"
            style={{ 
              backgroundColor: 'transparent',
              borderColor: 'white',
              color: 'white'
            }}
          >
            Shop
          </button>
        </div>
      </header>

      {/* Hero Products Component */}
      <HeroProducts onGradientChange={setCurrentGradient} />
    </main>
  );
};