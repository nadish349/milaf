import React, { useState, useEffect } from "react";
import { HeroProducts } from "./HeroProducts";

interface HeroProductsSectionProps {
  onGradientChange?: (gradient: string) => void;
}

export const HeroProductsSection = ({ onGradientChange }: HeroProductsSectionProps): JSX.Element => {
  const [currentGradient, setCurrentGradient] = useState("linear-gradient(135deg, #84B393, #C5E2CE)");

  useEffect(() => {
    if (onGradientChange) {
      onGradientChange(currentGradient);
    }
  }, [currentGradient, onGradientChange]);

  return (
    <main id="hero-products-section" className="h-screen w-full relative overflow-hidden" style={{ background: currentGradient }}>
      {/* Hero Products Component */}
      <HeroProducts onGradientChange={setCurrentGradient} />
    </main>
  );
};
