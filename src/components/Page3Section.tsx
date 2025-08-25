import React from "react";
import about3page from "@/assets/about3page.png";

export const Page3Section = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden snap-start snap-always">
          {/* Background image - about3page.png */}
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${about3page})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    />
      
      {/* Main title - "About Al Madinah Heritage Company" */}
      <div className="absolute z-20 left-[50%] transform -translate-x-1/2 top-[60px] sm:top-[70px] md:top-[80px] lg:top-[90px] xl:top-[100px] max-sm:top-[40px] max-sm:px-4">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-normal text-white leading-tight tracking-wide text-center max-sm:text-sm">
          About Al Madinah Heritage Company
        </h1>
      </div>
      

      
      {/* Description text */}
      <div className="absolute z-20 left-[20%] top-[160px] sm:top-[170px] md:top-[180px] lg:top-[190px] xl:top-[200px] max-sm:left-1/2 max-sm:transform max-sm:-translate-x-1/2 max-sm:top-[120px] max-sm:px-4">
        <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white leading-relaxed text-left max-w-[600px] sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] max-sm:text-xs max-sm:text-center max-sm:max-w-[280px]">
          <p>Al Madinah Heritage Company is wholly owned by the Public Investment Fund, and embraces Saudi Arabia's deep-rooted heritage and culture, cherishing tradition while pursuing excellence.</p>
          <p>We embark on a journey towards the seamless fusion of heritage and innovation, celebrating the timeless appeal of Saudi dates.</p>
        </div>
      </div>

      {/* Three Design Concept Columns */}
      <div className="absolute z-20 left-1/2 transform -translate-x-1/2 top-[240px] sm:top-[260px] md:top-[280px] lg:top-[300px] xl:top-[320px] max-sm:top-[200px] max-sm:px-4">
        <div className="flex flex-col sm:flex-row items-start justify-center space-y-6 sm:space-y-0 sm:space-x-2 lg:space-x-3 xl:space-x-4">
          {/* Column 1 - Heritage Ambassador */}
          <div className="flex flex-col items-center min-w-[240px] sm:min-w-[280px] md:min-w-[320px] lg:min-w-[360px] xl:min-w-[400px] h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] xl:h-[280px] justify-between">
            <div className="w-full">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-normal text-white leading-tight tracking-wide max-sm:text-base mb-4 text-center">
                Heritage<br />Ambassador
              </h3>
              <p className="text-xs sm:text-xs md:text-xs lg:text-sm xl:text-base text-white leading-relaxed text-left max-w-[220px] sm:max-w-[260px] md:max-w-[300px] lg:max-w-[340px] xl:max-w-[380px] max-sm:text-xs max-sm:max-w-[200px] px-8">
                MHC aspires to become Saudi Arabia's ambassador to a heritage product, and catalyzing growth by enriching the lives of those it touches and sharing the cultural significance of Ajwa Al Madinah and Saudi dates globally.
              </p>
            </div>
          </div>
          
          {/* Column 2 - Cultivating Cultural Prestige */}
          <div className="flex flex-col items-center min-w-[240px] sm:min-w-[280px] md:min-w-[320px] lg:min-w-[360px] xl:min-w-[400px] h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] xl:h-[280px] justify-between">
            <div className="w-full">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-normal text-white leading-tight tracking-wide max-sm:text-base mb-4 text-center">
                Cultivating<br />Cultural Prestige
              </h3>
              <p className="text-xs sm:text-xs md:text-xs lg:text-sm xl:text-base text-white leading-relaxed text-left max-w-[220px] sm:max-w-[260px] md:max-w-[300px] lg:max-w-[340px] xl:max-w-[380px] max-sm:text-xs max-sm:max-w-[200px] px-8">
                Our mission is to harness and promote the historical and cultural aspects of Ajwa Al Madinah and Saudi dates, cultivating unique and premium brands that harmoniously represent Saudi tradition while embracing modern production methods, consumption trends, retail dynamics, and consumer preferences.
              </p>
            </div>
          </div>
          
          {/* Column 3 - Elevating Ajwa Excellence */}
          <div className="flex flex-col items-center min-w-[240px] sm:min-w-[280px] md:min-w-[320px] lg:min-w-[360px] xl:min-w-[400px] h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] xl:h-[280px] justify-between">
            <div className="w-full">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-normal text-white leading-tight tracking-wide max-sm:text-base mb-4 text-center">
                Elevating Ajwa<br />Excellence
              </h3>
              <p className="text-xs sm:text-xs md:text-xs lg:text-sm xl:text-base text-white leading-relaxed text-left max-w-[220px] sm:max-w-[260px] md:max-w-[300px] lg:max-w-[340px] xl:max-w-[380px] max-sm:text-xs max-sm:max-w-[200px] px-8">
                MHC aims to enhance the production, promotion, and global presence of premium organic Ajwa Al Madinah dates, highlighting their quality and cultural significance. We focus on sustainable cultivation, industry growth, and supporting Saudi Arabia's leadership in date production, while honoring the rich heritage of Ajwa Al Madinah dates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
