import React, { useState, useEffect } from "react";
import group5 from "@/assets/Group5.png";
import milafframe from "@/assets/milafframe.png";
import chocospread from "@/assets/chocospread.png";
import datespread from "@/assets/datespread.png";
import safawidates from "@/assets/safawidates.png";
import segaidates from "@/assets/segaidates.png";
import khalasdates from "@/assets/khalasdates.png";
import { useCart } from "@/contexts/CartContext";
import { Notification } from "@/components/Notification";
import { BulkOrderPopup } from "@/components/BulkOrderPopup";
import { useNavigate } from "react-router-dom";
import { fetchAllProductsFromFirestore, ProductData } from "@/services/productService";
import { getProductImage } from "@/utils/productImages";

interface ProductDetailProps {
  onGradientChange?: (gradient: string) => void;
  selectedProductId?: number;
}

export const ProductDetail = ({ onGradientChange, selectedProductId }: ProductDetailProps): JSX.Element => {
  
  const [currentProduct, setCurrentProduct] = useState(selectedProductId || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [showBulkOrderPopup, setShowBulkOrderPopup] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Load products from database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const firestoreProducts = await fetchAllProductsFromFirestore();
        
        // Always use default products to show all products
        setProducts(getDefaultProducts());
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts(getDefaultProducts());
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Helper function to get gradient for product
  const getGradientForProduct = (productName: string): string => {
    const gradients: { [key: string]: string } = {
      "Milaf Cola": "linear-gradient(135deg, #BF7E3E, #D4A574)",
      "Choco Spread": "linear-gradient(135deg, #743002, #7C3C16)",
      "Date Spread": "linear-gradient(135deg, #CE8437, #FBDCA4)",
      "Khalas Dates": "linear-gradient(135deg, #98371F, #A94733)",
      "Safawi Dates": "linear-gradient(135deg, #D69150, #B66325)",
      "Segai Dates": "linear-gradient(135deg, #722E17, #D8582C)"
    };
    return gradients[productName] || "linear-gradient(135deg, #666, #999)";
  };

  // Default products fallback
  const getDefaultProducts = () => [
    {
      id: 0,
      name: "milaf cola",
      displayName: ["MILAF", "COLA"],
      image: group5,
      description: "Milaf Cola, crafted in Saudi Arabia, enriched with Ajwa dates, zero sugar, bold refreshing taste.",
      backgroundImage: milafframe,
      textColor: "#BF7E3E",
      price: 4.99
    },
    {
      id: 1,
      name: "chocolate spread",
      displayName: ["CHOCO", "SPREAD"],
      image: chocospread,
      description: "Rich and creamy chocolate spread, made with premium cocoa and natural ingredients for the perfect indulgence.",
      gradient: "linear-gradient(135deg, #743002, #7C3C16)",
      price: 3.99
    },
    {
      id: 2,
      name: "date spread",
      displayName: ["DATE", "SPREAD"],
      image: datespread,
      description: "Natural and nutritious date spread, made from premium Ajwa dates, rich in fiber and natural sweetness.",
      gradient: "linear-gradient(135deg, #CE8437, #FBDCA4)",
      price: 2.99
    },
    {
      id: 3,
      name: "khalas dates",
      displayName: ["KHALAS", "DATES"],
      image: khalasdates,
      description: "Classic Khalas dates with caramel-like sweetness and a smooth bite.",
      gradient: "linear-gradient(135deg, #98371F, #A94733)",
      price: 5.99
    },
    {
      id: 4,
      name: "safawi dates",
      displayName: ["SAFAWI", "DATES"],
      image: safawidates,
      description: "Premium Safawi dates known for their rich flavor and soft texture.",
      gradient: "linear-gradient(135deg, #D69150, #B66325)",
      price: 5.99
    },
    {
      id: 5,
      name: "segai dates",
      displayName: ["SEGAI", "DATES"],
      image: segaidates,
      description: "Segai dates featuring a delightful blend of firm and soft textures with a balanced sweetness.",
      gradient: "linear-gradient(135deg, #722E17, #D8582C)",
      price: 4.99
    }
  ];

  // Show bulk order popup after 2 seconds when page becomes visible - only once per session
  useEffect(() => {
    if (isVisible && hasInitialized) {
      // Check if popup has already been shown in this session
      const hasShownPopup = localStorage.getItem('bulkOrderPopupShown');
      
      if (!hasShownPopup) {
        const timer = setTimeout(() => {
          setShowBulkOrderPopup(true);
          // Mark as shown in localStorage
          localStorage.setItem('bulkOrderPopupShown', 'true');
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, hasInitialized]);

  // Listen for product change events from footer
  useEffect(() => {
    const handleProductChange = (event: CustomEvent) => {
      console.log('ProductDetail received changeProduct event:', event.detail);
      const { productId } = event.detail;
      console.log('Setting current product to:', productId);
      setCurrentProduct(productId);
    };

    console.log('ProductDetail: Adding changeProduct event listener');
    window.addEventListener('changeProduct', handleProductChange as EventListener);
    
    return () => {
      console.log('ProductDetail: Removing changeProduct event listener');
      window.removeEventListener('changeProduct', handleProductChange as EventListener);
    };
  }, []);


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

  const currentProductData = products[currentProduct];

  const handleAddToCart = () => {
    addToCart({
      name: currentProductData.name,
      price: currentProductData.price,
      quantity: quantity,
      payment: false,
      category: currentProductData.category || 'General',
      description: currentProductData.description || '',
      gradient: currentProductData.gradient
    });
    
    // Show notification
    setShowNotification(true);
    
    // Reset quantity to 1 after adding to cart
    setQuantity(1);
  };

  useEffect(() => {
    if (onGradientChange && currentProductData.gradient) {
      onGradientChange(currentProductData.gradient);
    }
  }, [currentProduct, onGradientChange, currentProductData.gradient]);

  // Update currentProduct when selectedProductId changes
  useEffect(() => {
    if (selectedProductId !== undefined) {
      setCurrentProduct(selectedProductId);
    }
  }, [selectedProductId]);

  // Intersection Observer to detect when page is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasInitialized) {
          // First time visiting - don't change the product, just mark as initialized
          setIsVisible(true);

          setHasInitialized(true);
        } else if (entry.isIntersecting && hasInitialized) {
          // Page is visible again but already initialized - just make it visible
          setIsVisible(true);
        } else {
          // Page is not visible, reset states
          setIsVisible(false);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    const currentElement = document.querySelector('.product-detail-section');
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [hasInitialized]);

  // Don't render main content if no current product data (after all hooks)
  if (!currentProductData) {
    return (
      <section id="product-detail-section" className="product-detail-section relative min-h-screen w-full overflow-hidden snap-start snap-always flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading products...</p>
        </div>
      </section>
    );
  }

  // Show loading state while products are being fetched
  if (loading) {
    return (
      <section id="product-detail-section" className="product-detail-section relative min-h-screen w-full overflow-hidden snap-start snap-always flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading products...</p>
        </div>
      </section>
    );
  }

  // Don't render if no products
  if (products.length === 0) {
    return (
      <section id="product-detail-section" className="product-detail-section relative min-h-screen w-full overflow-hidden snap-start snap-always flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">No products available</p>
        </div>
      </section>
    );
  }

  return (
      <section id="product-detail-section" className="product-detail-section relative min-h-screen w-full overflow-hidden snap-start snap-always">
      {/* Background - either gradient or background image */}
      <div 
        className="absolute inset-0 transition-all duration-700 ease-in-out"
        style={{
          background: currentProductData.id === 0 && currentProductData.backgroundImage
            ? `url(${currentProductData.backgroundImage})`
            : currentProductData.gradient,
          backgroundSize: currentProductData.id === 0 ? 'cover' : 'auto',
          backgroundPosition: currentProductData.id === 0 ? 'center' : 'auto',
          backgroundRepeat: currentProductData.id === 0 ? 'no-repeat' : 'auto'
        }}
      />
      
      <div 
        className="product-detail-content flex items-center justify-between h-full px-6 pt-20 transition-all duration-700 ease-in-out"
        style={{ 
          background: currentProductData.id === 0 && currentProductData.backgroundImage 
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
              className={`font-bold leading-tight mb-8 uppercase text-center transition-all duration-700 ease-in-out ${
                isAnimating ? 'transform -translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
              }`}
              style={{ 
                fontSize: '6.5rem',
                fontFamily: 'Andada Pro, serif',
                color: currentProductData.id === 0 && currentProductData.textColor ? currentProductData.textColor : 'white'
              }}
            >
              <span className="block">{currentProductData.displayName[0]}</span>
              {currentProductData.displayName[1] && <span className="block">{currentProductData.displayName[1]}</span>}
            </h1>
          </div>
          
          {/* Retailer Button */}
          <button 
            className={`px-8 py-4 font-bold font-poppins text-xl uppercase rounded-[20px] border-2 hover:opacity-80 transition-all duration-700 -mt-4 ${
              isAnimating ? 'transform -translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
            }`}
            style={{ 
              backgroundColor: 'transparent',
              borderColor: currentProductData.id === 0 && currentProductData.textColor ? currentProductData.textColor : 'white',
              color: currentProductData.id === 0 && currentProductData.textColor ? currentProductData.textColor : 'white'
            }}
            onClick={() => navigate('/bulk-order')}
          >
            Are you retailer ? Need in bulk
          </button>
        </div>
        
        {/* Center - Product Image */}
        <div className="flex-1 flex items-center justify-center relative">
          <img 
            src={currentProductData.image as string} 
            alt={`${currentProductData.name} product`}
            className={`max-h-[68.25vh] max-w-[47.25vw] object-contain transition-all duration-700 ease-in-out ${
              isAnimating ? 'transform translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
            }`}
          />
          
          {/* Product Selection Carousel - Positioned absolutely below the image */}
          <div className="absolute bottom-[-2.5cm] left-1/2 transform -translate-x-1/2 flex items-center gap-4 max-w-4xl">
            {/* Previous Button */}
            <button 
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-300 text-white"
              onClick={() => {
                if (isAnimating) return;
                prevProduct();
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Product Cards Container */}
            <div className="flex gap-2 overflow-hidden">
              {products.slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 flex-shrink-0 ${
                    currentProduct === product.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  }`}
                  onClick={() => {
                    if (isAnimating) return;
                    setIsAnimating(true);
                    setTimeout(() => {
                      setCurrentProduct(product.id);
                      setTimeout(() => setIsAnimating(false), 50);
                    }, 350);
                  }}
                >
                  <div 
                    className="rounded-lg p-2 hover:opacity-80 transition-all duration-300"
                    style={{
                      background: product.gradient || 'linear-gradient(135deg, #666, #999)'
                    }}
                  >
                    <img
                      src={product.image as string}
                      alt={product.name}
                      className="w-12 h-12 object-contain rounded-md"
                    />
                    <p className="text-xs text-center mt-1 text-white font-medium truncate max-w-[3rem]">
                      {product.displayName.join(' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Next Button */}
            <button 
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-300 text-white"
              onClick={() => {
                if (isAnimating) return;
                nextProduct();
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Right side - Description Text */}
        <div className="flex-1 flex flex-col items-start justify-center overflow-hidden -mt-40">
          <h2 className={`font-bold font-poppins text-4xl mb-6 uppercase transition-all duration-700 ease-in-out ${
            isAnimating ? 'transform translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
          }`} style={{ color: currentProductData.id === 0 && currentProductData.textColor ? currentProductData.textColor : 'white' }}>
            {currentProductData.name}
          </h2>
          <p className={`font-poppins text-lg max-w-md leading-relaxed transition-all duration-700 ease-in-out ${
            isAnimating ? 'transform translate-x-full opacity-0' : 'transform translate-y-0 opacity-100'
          }`} style={{ color: currentProductData.textColor ? currentProductData.textColor : 'white' }}>
            {currentProductData.description}
          </p>
        </div>
      </div>
      
      {/* Quantity Selector - Positioned separately to avoid affecting description */}
      <div className={`absolute right-[7.3cm] bottom-[calc(20%+2.5cm)] transition-all duration-700 ease-in-out ${
        isAnimating ? 'transform translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
      }`}>
        <label className="block text-sm font-medium mb-2 text-black text-center">
          Quantity
        </label>
        <div className="flex items-center space-x-3">
          <button 
            className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center hover:opacity-80 transition-all duration-300 text-black"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </button>
          <span className="text-xl font-semibold min-w-[3rem] text-center text-black">
            {quantity}
          </span>
          <button 
            className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center hover:opacity-80 transition-all duration-300 text-black"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>

      </div>
      
      {/* Add to Cart Button */}
      <div className={`absolute right-[0.8cm] bottom-[calc(20%+2.5cm)] transition-all duration-700 ease-in-out ${
        isAnimating ? 'transform translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
      }`}>
        <button 
          className="px-8 py-3 bg-black text-white font-bold font-poppins text-lg uppercase rounded-lg hover:bg-gray-800 transition-all duration-300"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>

      {/* Notification */}
      <Notification
        message={`${quantity} ${currentProductData.name} added to cart!`}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        type="success"
      />

      {/* Bulk Order Popup */}
      <BulkOrderPopup
        isVisible={showBulkOrderPopup}
        onClose={() => setShowBulkOrderPopup(false)}
      />
    </section>
  );
};
