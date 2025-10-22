import { Header } from "@/mobilecomponents/Header";
import { HeroPage3 as Hero3 } from "@/mobilepages/HeroPage3";
import { HeroPage2 as Hero } from "@/mobilepages/HeroPage2";
import { HeroProductsSection } from "@/mobilecomponents/HeroProductsSection";
import { Page2Section } from "@/mobilecomponents/Page2Section";
import { Page3Section } from "@/mobilecomponents/Page3Section";
import { Page4Section } from "@/mobilecomponents/Page4Section";
import { ProductInfo } from "@/mobilecomponents/ProductInfo";
import { ProductDetail } from "@/mobilecomponents/ProductDetail";
import { CompanyInfoSection } from "@/mobilecomponents/CompanyInfoSection";
import { Footer } from "@/mobilecomponents/Footer";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { LoginPrompt } from "@/components/LoginPrompt";

const Index = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [heroGradient, setHeroGradient] = useState("linear-gradient(135deg, #84B393, #C5E2CE)");
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Handle Order Now click from HeroProductsSection
  const handleOrderNow = (productId: number) => {
    setSelectedProductId(productId);
    // Scroll to ProductDetail section (index 5)
    if (containerRef.current) {
      const targetSection = 5; // ProductDetail is at index 5 in mobile
      const windowHeight = window.innerHeight;
      containerRef.current.scrollTo({
        top: targetSection * windowHeight,
        behavior: 'smooth'
      });
    }
  };

  // Define colors for each section - memoized to prevent unnecessary re-renders
  const sectionColors = React.useMemo(() => [
    "#ffffff", // Hero3 (white background for main product display)
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

  // Listen for login prompt events
  useEffect(() => {
    const handleShowLoginPrompt = () => {
      console.log('Login prompt event received in mobile Index.tsx');
      setShowLoginPrompt(true);
    };

    window.addEventListener('showLoginPrompt', handleShowLoginPrompt);
    
    return () => {
      window.removeEventListener('showLoginPrompt', handleShowLoginPrompt);
    };
  }, []);

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
        <Hero3 />
        {/* <Hero /> */}
        <HeroProductsSection onGradientChange={setHeroGradient} onOrderNow={handleOrderNow} />
        <Page4Section />
        <ProductInfo onProductSelect={setSelectedProductId} />
        <ProductDetail selectedProductId={selectedProductId} showBulkOrderPopup={true} />
        <Page2Section />
        <Page3Section />
        <CompanyInfoSection />
        <Footer />
      </div>
      
      {/* Login Prompt Modal - ONLY for protected route redirects */}
      <LoginPrompt 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)}
        onLoginSuccess={() => {
          // Check if there was a pending cart item
          const pendingItem = localStorage.getItem('pendingCartItem');
          if (pendingItem) {
            // Redirect to cart to show the added item
            window.location.href = '/cart';
            return;
          }
          
          // Redirect to the originally requested page if available
          if (location.state?.from) {
            window.location.href = location.state.from.pathname;
          }
        }}
      />
    </div>
    </>
  );
};

export default Index;
