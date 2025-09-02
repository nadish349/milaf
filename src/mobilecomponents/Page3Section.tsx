import React, { useState, useEffect } from "react";
import about3page from "@/assets/about3page.png";

export const Page3Section = () => {
  const [currentColumn, setCurrentColumn] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start animation sequence when component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Animate columns sequentially
    const interval = setInterval(() => {
      setCurrentColumn((prev) => (prev + 1) % 3);
    }, 3000); // Change column every 3 seconds

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${about3page})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 py-16 sm:py-24 md:py-32 lg:py-40 space-y-12">
        
        {/* Title */}
        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-normal text-white leading-tight tracking-wide text-left">
          About Al Madinah Heritage Company
        </h1>

        {/* Description */}
        <div className="max-w-3xl">
          <p className="text-base text-white leading-relaxed mb-4 text-left">
            Al Madinah Heritage Company is wholly owned by the Public Investment Fund, and embraces Saudi Arabia's deep-rooted heritage and culture, cherishing tradition while pursuing excellence.
          </p>
          <p className="text-base text-white leading-relaxed text-left">
            We embark on a journey towards the seamless fusion of heritage and innovation, celebrating the timeless appeal of Saudi dates.
          </p>
        </div>

        {/* Columns (desktop) */}
        <div className="hidden sm:flex flex-row flex-wrap justify-center gap-6 mt-12">
          {/* Column 1 */}
          <div className="bg-black/40 rounded-xl p-6 max-w-xs">
            <h3 className="text-xl text-white mb-2">Heritage Ambassador</h3>
            <p className="text-base text-white leading-relaxed">
              MHC aspires to become Saudi Arabia's ambassador to a heritage product, and catalyzing growth by enriching the lives of those it touches and sharing the cultural significance of Ajwa Al Madinah and Saudi dates globally.
            </p>
          </div>
          {/* Column 2 */}
          <div className="bg-black/40 rounded-xl p-6 max-w-xs">
            <h3 className="text-xl text-white mb-2">Cultivating Cultural Prestige</h3>
            <p className="text-base text-white leading-relaxed">
              Our mission is to harness and promote the historical and cultural aspects of Ajwa Al Madinah and Saudi dates, cultivating unique and premium brands that harmoniously represent Saudi tradition while embracing modern production methods, consumption trends, retail dynamics, and consumer preferences.
            </p>
          </div>
          {/* Column 3 */}
          <div className="bg-black/40 rounded-xl p-6 max-w-xs">
            <h3 className="text-xl text-white mb-2">Elevating Ajwa Excellence</h3>
            <p className="text-base text-white leading-relaxed">
              MHC aims to enhance the production, promotion, and global presence of premium organic Ajwa Al Madinah dates, highlighting their quality and cultural significance. We focus on sustainable cultivation, industry growth, and supporting Saudi Arabia's leadership in date production, while honoring the rich heritage of Ajwa Al Madinah dates.
            </p>
          </div>
        </div>

        {/* Mobile carousel */}
        <div className="sm:hidden mt-8 w-full max-w-md">
          {/* Fixed Position Container - All columns positioned at same spot */}
          <div className="relative w-full h-[200px] flex items-center justify-center mt-16">
            {/* Column 1 - Heritage Ambassador */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-in-out ${
              currentColumn === 0 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}>
              <h3 className="text-lg font-normal text-white leading-tight tracking-wide mb-4">
                Heritage<br />Ambassador
              </h3>
              <p className="text-base text-white leading-relaxed max-w-[280px] mx-auto text-left">
                MHC aspires to become Saudi Arabia's ambassador to a heritage product, and catalyzing growth by enriching the lives of those it touches and sharing the cultural significance of Ajwa Al Madinah and Saudi dates globally.
              </p>
            </div>
            
            {/* Column 2 - Cultivating Cultural Prestige */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-in-out ${
              currentColumn === 1 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}>
              <h3 className="text-lg font-normal text-white leading-tight tracking-wide mb-4">
                Cultivating<br />Cultural Prestige
              </h3>
              <p className="text-base text-white leading-relaxed max-w-[280px] mx-auto text-left">
                Our mission is to harness and promote the historical and cultural aspects of Ajwa Al Madinah and Saudi dates, cultivating unique and premium brands that harmoniously represent Saudi tradition while embracing modern production methods, consumption trends, retail dynamics, and consumer preferences.
              </p>
            </div>
            
            {/* Column 3 - Elevating Ajwa Excellence */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-in-out ${
              currentColumn === 2 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}>
              <h3 className="text-lg font-normal text-white leading-tight tracking-wide mb-4">
                Elevating Ajwa<br />Excellence
              </h3>
              <p className="text-base text-white leading-relaxed max-w-[280px] mx-auto text-left">
                MHC aims to enhance the production, promotion, and global presence of premium organic Ajwa Al Madinah dates, highlighting their quality and cultural significance. We focus on sustainable cultivation, industry growth, and supporting Saudi Arabia's leadership in date production, while honoring the rich heritage of Ajwa Al Madinah dates.
              </p>
            </div>
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentColumn(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentColumn === index ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
