import React, { useState, useEffect } from "react";
import { HeroProducts } from "./HeroProducts";
import { Header } from "./Header";
import mobilepagehero from "@/assets/mobile/mobilepagehero.png";

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
            <main
          className="min-h-screen w-full relative overflow-hidden" 
      style={{ 
        backgroundImage: `url(${mobilepagehero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Mobile Header */}
      <Header />

      {/* Hero Products Component */}
      <div className="pt-20">
        <HeroProducts onGradientChange={setCurrentGradient} />
      </div>
    </main>
  );
};