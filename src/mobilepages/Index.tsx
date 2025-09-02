import { Header } from "@/mobilecomponents/Header";
import { HeroPage2 as Hero } from "@/mobilecomponents/HeroPage2";
import { HeroProductsSection } from "@/mobilecomponents/HeroProductsSection";
import { Page2Section } from "@/mobilecomponents/Page2Section";
import { Page3Section } from "@/mobilecomponents/Page3Section";
import { Page4Section } from "@/mobilecomponents/Page4Section";
import { ProductInfo } from "@/mobilecomponents/ProductInfo";
import { ProductDetail } from "@/mobilecomponents/ProductDetail";
import { CompanyInfoSection } from "@/mobilecomponents/CompanyInfoSection";
import { Footer } from "@/mobilecomponents/Footer";
import React, { useState, useEffect, useRef } from "react";

const Index = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [heroGradient, setHeroGradient] = useState("linear-gradient(135deg, #84B393, #C5E2CE)");
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Define colors for each section - memoized to prevent unnecessary re-renders
  const sectionColors = React.useMemo(() => [
    "#ffffff", // Hero (white background for main product display)
    heroGradient, // HeroProductsSection (dynamic gradient from HeroProducts)
    "#8B4513", // Page4Section (brown from m1 background)
    "#8B4513", // ProductInfo (brown from m1 background)
    "#8B4513", // ProductDetail (brown from m1 background)
    "#8B4513", // Page2Section (brown from m1 background)
    "#8B4513", // Page3Section (brown from m1 background)
    "#8B4513", // CompanyInfoSection (brown from m1 background)
    "#1f2937"  // Footer (dark gray)
  ], [heroGradient]);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const windowHeight = window.innerHeight;
        const currentIndex = Math.round(scrollTop / windowHeight);
        setCurrentSection(currentIndex);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);



  return (
    <>
      <Header showOnlyLogo={false} />
      <div 
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-proximity scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: `${sectionColors[currentSection]} transparent`
        }}
      >
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 12px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${sectionColors[currentSection]};
            border-radius: 6px;
            border: 2px solid transparent;
            background-clip: content-box;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${sectionColors[currentSection]};
            opacity: 0.8;
          }
        `}
      </style>
      <div className="custom-scrollbar">
        <Hero />
        <HeroProductsSection onGradientChange={setHeroGradient} />
        <Page4Section />
        <ProductInfo onProductSelect={setSelectedProductId} />
        <ProductDetail selectedProductId={selectedProductId} />
        <Page2Section />
        <Page3Section />
        <CompanyInfoSection />
        <Footer />
      </div>
    </div>
    </>
  );
};

export default Index;
