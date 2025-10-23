import React, { useState, useEffect } from "react";
import group5 from "@/assets/Group5.png";
import milafframe from "@/assets/milafframe.png";
import chocospread from "@/assets/chocospread.png";
import datespread from "@/assets/datespread.png";
import safawidates from "@/assets/safawidates.png";
import segaidates from "@/assets/segaidates.png";
import khalasdates from "@/assets/khalasdates.png";

interface HeroProductsProps {
  onGradientChange?: (gradient: string) => void;
  onOrderNow?: (productId: number) => void;
}

export const HeroProducts = ({ onGradientChange, onOrderNow }: HeroProductsProps): JSX.Element => {
  const [currentProduct, setCurrentProduct] = useState(0); // Start with milaf cola (id: 0)
  const [isAnimating, setIsAnimating] = useState(false);

  const products = [
    {
      id: 0,
      name: "milaf cola",
      displayName: ["MILAF", "COLA"],
      image: group5,
      description: "Milaf Cola, crafted in Saudi Arabia, enriched with Ajwa dates, zero sugar, bold refreshing taste.",
      backgroundImage: milafframe,
      textColor: "#BF7E3E"
    },
    {
      id: 1,
      name: "chocolate spread",
      displayName: ["CHOCO", "SPREAD"],
      image: chocospread,
      description: "Rich and creamy chocolate spread, made with premium cocoa and natural ingredients for the perfect indulgence.",
      gradient: "linear-gradient(135deg, #743002, #7C3C16)"
    },
    {
      id: 2,
      name: "date spread",
      displayName: ["DATE", "SPREAD"],
      image: datespread,
      description: "Natural and nutritious date spread, made from premium Ajwa dates, rich in fiber and natural sweetness.",
      gradient: "linear-gradient(135deg, #CE8437, #FBDCA4)"
    },
    {
      id: 3,
      name: "khalas dates",
      displayName: ["KHALAS", "DATES"],
      image: khalasdates,
      description: "Classic Khalas dates with caramel-like sweetness and a smooth bite.",
      gradient: "linear-gradient(135deg, #98371F, #A94733)"
    },
    {
      id: 4,
      name: "safawi dates",
      displayName: ["SAFAWI", "DATES"],
      image: safawidates,
      description: "Premium Safawi dates known for their rich flavor and soft texture.",
      gradient: "linear-gradient(135deg, #D69150, #B66325)"
    },
    {
      id: 5,
      name: "segai dates",
      displayName: ["SEGAI", "DATES"],
      image: segaidates,
      description: "Segai dates featuring a delightful blend of firm and soft textures with a balanced sweetness.",
      gradient: "linear-gradient(135deg, #722E17, #D8582C)"
    }
  ];

  const nextProduct = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentProduct((prev) => (prev + 1) % products.length);
      setTimeout(() => setIsAnimating(false), 50);
    }, 350);
  };

  const prevProduct = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentProduct((prev) => (prev - 1 + products.length) % products.length);
      setTimeout(() => setIsAnimating(false), 50);
    }, 350);
  };

  // Auto-advance function that bypasses animation checks
  const autoAdvanceProduct = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentProduct((prev) => (prev + 1) % products.length);
      setTimeout(() => setIsAnimating(false), 50);
    }, 350);
  };

  const currentProductData = products[currentProduct];

  useEffect(() => {
    if (onGradientChange) {
      onGradientChange(currentProductData.gradient);
    }
  }, [currentProduct, onGradientChange, currentProductData.gradient]);

  // Simple auto-advance without lazy loading
  useEffect(() => {
    const interval = setInterval(() => {
      autoAdvanceProduct();
    }, 4000); // 4 seconds for all products
    
    return () => clearInterval(interval);
  }, [currentProduct]);

  return (
    <div 
      className="hero-products-section flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 pt-20 md:pt-32 transition-all duration-700 ease-in-out"
      style={{ 
        backgroundImage: currentProductData.id === 0 && currentProductData.backgroundImage 
          ? `url(${currentProductData.backgroundImage})` 
          : currentProductData.gradient,
        backgroundSize: currentProductData.id === 0 ? 'cover' : 'auto',
        backgroundPosition: currentProductData.id === 0 ? 'center' : 'auto',
        backgroundRepeat: currentProductData.id === 0 ? 'no-repeat' : 'auto'
      }}
    >
      {/* Mobile Layout - Stacked vertically on small screens */}
      
      {/* Product Title - Top on mobile - Reduced spacing */}
      <div className="w-full md:flex-1 flex flex-col items-center justify-center overflow-hidden order-1 md:order-1 mb-4 md:mb-8">
        <div className="relative text-center">
          <h1 
            className={`font-thin leading-tight mb-2 md:mb-8 uppercase transition-all duration-700 ease-in-out ${
              isAnimating ? 'transform -translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
            }`}
            style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 6.5rem)',
              fontFamily: 'Andada Pro, serif',
              fontWeight: 200,
              color: currentProductData.id === 0 && currentProductData.textColor ? currentProductData.textColor : 'white'
            }}
          >
            <span className="block">{currentProductData.displayName[0]}</span>
            {currentProductData.displayName[1] && <span className="block">{currentProductData.displayName[1]}</span>}
          </h1>
        </div>
      </div>
      
      {/* Product Image Container with Navigation Buttons on Sides */}
      <div className="w-full md:flex-1 flex flex-col items-center justify-center overflow-hidden order-2 md:order-2 mb-4 md:mb-0 relative">
        {/* Left Navigation Arrow - Positioned to the left of image */}
        <button 
          onClick={prevProduct}
          disabled={isAnimating}
          className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50 touch-manipulation z-10"
          style={{ borderColor: currentProductData.id === 0 && currentProductData.textColor ? currentProductData.textColor : 'white' }}
        >
          <svg 
            className="w-5 h-5 md:w-6 md:h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ color: currentProductData.id === 0 && currentProductData.textColor ? currentProductData.textColor : 'white' }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Product Image - Center */}
        <div className="relative">
          <img 
            src={currentProductData.image as string} 
            alt={`${currentProductData.name} product`}
            loading="lazy"
            decoding="async"
            className={`max-h-[35vh] md:max-h-[68.25vh] max-w-[80vw] md:max-w-[47.25vw] object-contain transition-all duration-700 ease-in-out ${
              isAnimating ? 'transform scale-95 opacity-0' : 'transform scale-100 opacity-100'
            }`}
            style={{
              transform: isAnimating ? 'translateX(-100vw)' : 'translateX(0)',
              transition: 'all 700ms ease-in-out'
            }}
          />
        </div>

        {/* Right Navigation Arrow - Positioned to the right of image */}
        <button 
          onClick={nextProduct}
          disabled={isAnimating}
          className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50 touch-manipulation z-10"
          style={{ borderColor: currentProductData.textColor ? currentProductData.textColor : 'white' }}
        >
          <svg 
            className="w-5 h-5 md:w-6 md:h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ color: currentProductData.textColor ? currentProductData.textColor : 'white' }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      
      {/* Product Info - Bottom on mobile - Reduced spacing */}
      <div className="w-full md:flex-1 flex flex-col items-center md:items-start justify-center overflow-hidden order-3 md:order-3 text-center md:text-left mb-4 md:mb-0">
        <h2 className={`font-bold font-poppins text-xl md:text-4xl mb-2 md:mb-6 uppercase transition-all duration-700 ease-in-out ${
          isAnimating ? 'transform translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
        }`} style={{ color: currentProductData.id === 0 && currentProductData.textColor ? currentProductData.textColor : 'white' }}>
          {currentProductData.name}
        </h2>
        <p className={`font-poppins text-sm md:text-lg max-w-md leading-relaxed transition-all duration-700 ease-in-out ${
          isAnimating ? 'transform translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
        }`} style={{ color: currentProductData.textColor ? currentProductData.textColor : 'white' }}>
          {currentProductData.description}
        </p>
        
        {/* Order Now Button - Now positioned after product description */}
        <div className="mt-4 md:mt-6 flex justify-center md:justify-start">
          <button 
            className={`px-4 md:px-8 py-2 md:py-4 font-bold font-poppins text-base md:text-xl uppercase rounded-[20px] border-2 hover:opacity-80 transition-all duration-700 touch-manipulation ${
              isAnimating ? 'transform translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
            }`}
            style={{ 
              backgroundColor: 'transparent',
              borderColor: currentProductData.id === 0 && currentProductData.textColor ? currentProductData.textColor : 'white',
              color: currentProductData.id === 0 && currentProductData.textColor ? currentProductData.textColor : 'white'
            }}
            onClick={() => {
              console.log('Order Now button clicked for:', currentProductData.id, currentProductData.name);
              // Call the parent function to update the selected product
              onOrderNow?.(currentProductData.id);
              // Navigate directly to ProductDetail section using the same logic as ProductInfo
              setTimeout(() => {
                const productDetailSection = document.querySelector('.product-detail-section');
                if (productDetailSection) {
                  console.log('Scrolling to ProductDetail section');
                  productDetailSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start',
                    inline: 'nearest'
                  });
                } else {
                  console.log('ProductDetail section not found');
                }
              }, 200);
            }}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};
