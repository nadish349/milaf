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
}

export const HeroProducts = ({ onGradientChange }: HeroProductsProps): JSX.Element => {
  const [currentProduct, setCurrentProduct] = useState(0); // Start with milaf cola (id: 0)
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

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

  // Intersection Observer to detect when page is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasInitialized) {
          // First time visiting - show milaf cola immediately
          setCurrentProduct(0);
          setIsVisible(true);
          setShouldAnimate(true); // Enable animations immediately
          setHasInitialized(true); // Mark as initialized immediately
        } else if (entry.isIntersecting && hasInitialized) {
          // Page is visible again but already initialized - just make it visible without changing product
          setIsVisible(true);
        } else {
          // Page is not visible, reset states
          setIsVisible(false);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    const currentElement = document.querySelector('.hero-products-section');
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [hasInitialized]);

  // Auto-advance with custom timing: milaf cola stays for 10 seconds, others for 5 seconds
  useEffect(() => {
    // Start auto-advance immediately when page is initialized
    if (!hasInitialized) return;
    
    const getDisplayTime = () => {
      return currentProduct === 0 ? 10000 : 5000; // 10 seconds for milaf cola, 5 for others
    };

    // Set a timeout for the current product instead of an interval
    const timeoutId = setTimeout(() => {
      autoAdvanceProduct();
    }, getDisplayTime());
    
    return () => clearTimeout(timeoutId);
  }, [currentProduct, hasInitialized]);

  return (
    <div 
      className="hero-products-section flex items-center justify-between h-full px-6 pt-20 transition-all duration-700 ease-in-out"
      style={{ 
        backgroundImage: currentProductData.id === 0 && currentProductData.backgroundImage 
          ? `url(${currentProductData.backgroundImage})` 
          : currentProductData.gradient,
        backgroundSize: currentProductData.id === 0 ? 'cover' : 'auto',
        backgroundPosition: currentProductData.id === 0 ? 'center' : 'auto',
        backgroundRepeat: currentProductData.id === 0 ? 'no-repeat' : 'auto'
      }}
    >
      {/* Left side - Product Text */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
        <div className="relative">
          <h1 
            className={`font-thin leading-tight mb-8 uppercase text-center transition-all duration-700 ease-in-out ${
              isAnimating ? 'transform -translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
            }`}
            style={{ 
              fontSize: '6.5rem',
              fontFamily: 'Andada Pro, serif',
              fontWeight: 200,
              color: currentProductData.id === 0 && currentProductData.textColor ? currentProductData.textColor : 'white'
            }}
          >
            <span className="block">{currentProductData.displayName[0]}</span>
            {currentProductData.displayName[1] && <span className="block">{currentProductData.displayName[1]}</span>}
          </h1>
        </div>
        
        {/* Order Now Button */}
        <button 
          className={`px-8 py-4 font-bold font-poppins text-xl uppercase rounded-[20px] border-2 hover:opacity-80 transition-all duration-700 ${
            isAnimating ? 'transform -translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
          }`}
          style={{ 
            backgroundColor: 'transparent',
            borderColor: currentProductData.id === 0 && currentProductData.textColor ? currentProductData.textColor : 'white',
            color: currentProductData.id === 0 && currentProductData.textColor ? currentProductData.textColor : 'white'
          }}
        >
          Order Now
        </button>
      </div>
      
      {/* Center - Product Image */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
        <div className="relative">
          <img 
            src={currentProductData.image as string} 
            alt={`${currentProductData.name} product`}
            loading="lazy"
            decoding="async"
            className={`max-h-[68.25vh] max-w-[47.25vw] object-contain transition-all duration-700 ease-in-out ${
              isAnimating ? 'transform translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
            }`}
          />
        </div>
        
        {/* Navigation Arrows */}
        <div className={`flex items-center space-x-8 mt-12 transition-all duration-700 ease-in-out ${
          isAnimating ? 'transform translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
        }`}>
          {/* Left Arrow */}
          <button 
            onClick={prevProduct}
            disabled={isAnimating}
            className="w-12 h-12 rounded-full border-2 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50"
            style={{ borderColor: currentProductData.id === 0 && currentProductData.textColor ? currentProductData.textColor : 'white' }}
          >
            <svg 
              className="w-6 h-6" 
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
          
          {/* Right Arrow */}
          <button 
            onClick={nextProduct}
            disabled={isAnimating}
            className="w-12 h-12 rounded-full border-2 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50"
            style={{ borderColor: currentProductData.id === 0 && currentProductData.textColor ? currentProductData.textColor : 'white' }}
          >
            <svg 
              className="w-6 h-6" 
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
      </div>
      
      {/* Right side - Description Text */}
      <div className="flex-1 flex flex-col items-start justify-center overflow-hidden">
        <h2 className={`font-bold font-poppins text-4xl mb-6 uppercase transition-all duration-700 ease-in-out ${
          isAnimating ? 'transform translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
        }`} style={{ color: currentProductData.id === 0 && currentProductData.textColor ? currentProductData.textColor : 'white' }}>
          {currentProductData.name}
        </h2>
        <p className={`font-poppins text-lg max-w-md leading-relaxed transition-all duration-700 ease-in-out ${
          isAnimating ? 'transform translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
        }`} style={{ color: currentProductData.textColor ? currentProductData.textColor : 'white' }}>
          {currentProductData.description}
        </p>
      </div>
    </div>
  );
};
