import { Header } from "@/components/Header";
import { HeroPage3 as Hero3 } from "@/pages/HeroPage3";
import { HeroPage2 as Hero } from "@/pages/HeroPage2";
import { HeroProductsSection } from "@/components/HeroProductsSection";
import { Page2Section } from "@/components/Page2Section";
import { Page3Section } from "@/components/Page3Section";
import { Page4Section } from "@/components/Page4Section";
import { ProductInfo } from "@/components/ProductInfo";
import { ProductDetail } from "@/components/ProductDetail";
import { CompanyInfoSection } from "@/components/CompanyInfoSection";
import { Footer } from "@/components/Footer";
import React, { useState, useEffect, useRef } from "react";

const Index = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [heroGradient, setHeroGradient] = useState("linear-gradient(135deg, #84B393, #C5E2CE)");
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Define colors for each section - memoized to prevent unnecessary re-renders
  const sectionColors = React.useMemo(() => [
    "#ffffff", // Hero3 (white background for main product display)
    "#ffffff", // Hero (white background for main product display)
    heroGradient, // HeroProductsSection (dynamic gradient from HeroProducts)
    "#8B4513", // Page2Section (brown from m1 background)
    "#8B4513", // Page3Section (brown from m1 background)
    "#8B4513", // Page4Section (brown from m1 background)
    "#8B4513", // ProductInfo (brown from m1 background)
    "#8B4513", // ProductDetail (brown from m1 background)
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
        className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
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
        <Hero3 />
        <Hero />
        <HeroProductsSection onGradientChange={setHeroGradient} />
        <Page2Section />
        <Page3Section />
        <Page4Section />
        <ProductInfo onProductSelect={setSelectedProductId} />
        <ProductDetail selectedProductId={selectedProductId} showBulkOrderPopup={true} />
        <CompanyInfoSection />
        <Footer />
      </div>
    </div>
    </>
  );
};

export default Index;
