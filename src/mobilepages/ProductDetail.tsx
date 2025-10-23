  import React, { useState, useEffect, useRef } from "react";
  import group5 from "@/assets/Group5.png";
  import milafframe from "@/assets/milafframe.png";
  import chocospread from "@/assets/chocospread.png";
  import datespread from "@/assets/datespread.png";
  import safawidates from "@/assets/safawidates.png";
  import segaidates from "@/assets/segaidates.png";
  import khalasdates from "@/assets/khalasdates.png";
  import { useCart } from "@/contexts/CartContext";
  import { Notification } from "@/mobilecomponents/Notification";
  import { BulkOrderPopup } from "@/mobilecomponents/BulkOrderPopup";
  import { useNavigate } from "react-router-dom";
  import { fetchAllProductsFromFirestore, ProductData } from "@/services/productService";
  import { getProductImage } from "@/utils/productImages";
  import { LoginPrompt } from "@/components/LoginPrompt";

interface ProductDetailProps {
  onGradientChange?: (gradient: string) => void;
  selectedProductId?: number;
  showBulkOrderPopup?: boolean;
}

  export const ProductDetail = ({ onGradientChange, selectedProductId, showBulkOrderPopup: enablePopup = true }: ProductDetailProps): JSX.Element => {
    
    const [currentProduct, setCurrentProduct] = useState(selectedProductId || 0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [showNotification, setShowNotification] = useState(false);
    const [showBulkOrderPopup, setShowBulkOrderPopup] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Debug: Log when popup state changes
  useEffect(() => {
    console.log('Mobile ProductDetail: showBulkOrderPopup state changed to:', showBulkOrderPopup);
  }, [showBulkOrderPopup]);

  // Listen for login prompt events
  useEffect(() => {
    const handleShowLoginPrompt = () => {
      console.log('Login prompt event received in mobile ProductDetail.tsx');
      setShowLoginPrompt(true);
    };

    window.addEventListener('showLoginPrompt', handleShowLoginPrompt);
    
    return () => {
      window.removeEventListener('showLoginPrompt', handleShowLoginPrompt);
    };
  }, []);

  // Show bulk order popup - simplified approach
  useEffect(() => {
    console.log('Mobile ProductDetail: Component mounted, enablePopup:', enablePopup);
    
    if (enablePopup) {
      // Check if popup has already been shown in this session
      const hasShownPopup = localStorage.getItem('bulkOrderPopupShown');
      console.log('Mobile ProductDetail: hasShownPopup:', hasShownPopup);
      
      if (!hasShownPopup) {
        // Simple timer approach - show popup after 2 seconds
        const timer = setTimeout(() => {
          console.log('Mobile ProductDetail: Timer triggered - showing popup');
          setShowBulkOrderPopup(true);
          localStorage.setItem('bulkOrderPopupShown', 'true');
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [enablePopup]);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
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
        
        if (firestoreProducts.length > 0) {
          // Use products from Firestore (backend) with proper formatting
          const formattedProducts = firestoreProducts.map((product, index) => ({
            id: index,
            name: product.name.toLowerCase(),
            displayName: product.name.toUpperCase().split(' '),
            image: getProductImage(product.name),
            description: product.description,
            backgroundImage: product.name.toLowerCase() === 'milaf cola' ? milafframe : undefined,
            textColor: product.name.toLowerCase() === 'milaf cola' ? "#BF7E3E" : undefined,
            gradient: getGradientForProduct(product.name),
            price: product.price,
            category: product.category
          }));
          setProducts(formattedProducts);
        } else {
          // Fallback to default products only if no data in Firestore
          setProducts(getDefaultProducts());
        }
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

    // Show bulk order popup when scrolled halfway through product details page - only once per session
    useEffect(() => {
      // Check if popup has already been shown in this session and if popup is enabled
      const hasShownPopup = localStorage.getItem('bulkOrderPopupShown');
      
      console.log('Mobile ProductDetail: Popup setup - hasShownPopup:', hasShownPopup, 'enablePopup:', enablePopup);
      
      if (!hasShownPopup && enablePopup) {
        // Simple approach: Show popup after a delay when component mounts
        const timer = setTimeout(() => {
          console.log('Mobile ProductDetail: Timer triggered - showing popup');
          setShowBulkOrderPopup(true);
          localStorage.setItem('bulkOrderPopupShown', 'true');
        }, 1000); // Show after 1 second for testing

        // Also try intersection observer as backup
        const productDetailSection = document.getElementById('product-detail-section');
        
        if (productDetailSection) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                console.log('Mobile ProductDetail: Intersection Observer - isIntersecting:', entry.isIntersecting, 'ratio:', entry.intersectionRatio);
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                  console.log('Mobile ProductDetail: Intersection Observer triggered popup');
                  setShowBulkOrderPopup(true);
                  localStorage.setItem('bulkOrderPopupShown', 'true');
                  observer.disconnect();
                  clearTimeout(timer);
                }
              });
            },
            { threshold: 0.3 }
          );

          observer.observe(productDetailSection);
          
          return () => {
            clearTimeout(timer);
            observer.disconnect();
          };
        } else {
          return () => clearTimeout(timer);
        }
      }
    }, [enablePopup]);

    // Listen for product change events from footer
    useEffect(() => {
      const handleProductChange = (event: CustomEvent) => {
        const { productId } = event.detail;
        setCurrentProduct(productId);
      };

      window.addEventListener('changeProduct', handleProductChange as EventListener);
      
      return () => {
        window.removeEventListener('changeProduct', handleProductChange as EventListener);
      };
    }, []);


  const currentProductData = products[currentProduct];

  // Navigation functions for mobile carousel
  const handlePrevious = () => {
    if (visibleStartIndex > 0) {
      setVisibleStartIndex(visibleStartIndex - 1);
    }
  };

  const handleNext = () => {
    if (visibleStartIndex < products.length - 2) {
      setVisibleStartIndex(visibleStartIndex + 1);
    }
  };

  // Get visible products (2 at a time, but ensure we don't go out of bounds)
  const maxStartIndex = Math.max(0, products.length - 2);
  const safeStartIndex = Math.min(visibleStartIndex, maxStartIndex);
  const visibleProducts = products.slice(safeStartIndex, safeStartIndex + 2);

    const handleAddToCart = () => {
      if (!currentProductData) {
        console.error('Product data is missing');
        return;
      }

      try {
        // Add product to cart with proper flags
        addToCart({
          name: currentProductData.name,
          price: currentProductData.price,
          quantity: quantity,
        cases: false, // Regular products are not bulk orders
          payment: false,
          category: currentProductData.category,
          description: currentProductData.description,
          gradient: currentProductData.gradient
        });
        
        // Show notification
        setShowNotification(true);
        
        // Reset quantity to 1 after adding to cart
        setQuantity(1);
      } catch (error) {
        console.error('Error adding product to cart:', error);
      }
    };

    useEffect(() => {
      if (onGradientChange && currentProductData.gradient) {
        onGradientChange(currentProductData.gradient);
      }
    }, [currentProduct, onGradientChange, currentProductData.gradient]);

  useEffect(() => {
    if (selectedProductId !== undefined) {
      setCurrentProduct(selectedProductId);
    }
  }, [selectedProductId]);

  // Auto-adjust visible range when current product changes
  useEffect(() => {
    const newStartIndex = Math.floor(currentProduct / 2) * 2;
    const maxStartIndex = Math.max(0, products.length - 2);
    const safeNewStartIndex = Math.min(newStartIndex, maxStartIndex);
    setVisibleStartIndex(safeNewStartIndex);
  }, [currentProduct, products.length]);

  // Don't render main content if no current product data (after all hooks)
  if (!currentProductData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading products...</p>
        </div>
      </div>
    );
  }

  // Show loading state while products are being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading products...</p>
        </div>
      </div>
    );
  }

  // Don't render if no products
  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <p className="text-white">No products available</p>
        </div>
      </div>
    );
  }

  return (
      <section id="product-detail-section" className="product-detail-section relative min-h-screen w-full overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 transition-all duration-700 ease-in-out"
          style={{
            background: currentProductData.id === 0 && currentProductData.backgroundImage
              ? `url(${currentProductData.backgroundImage})`
              : currentProductData.gradient,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-stretch justify-between h-full px-4 sm:px-8 pt-20">
          
          {/* Left: Product Title + Retailer Button */}
          <div className="flex-1 flex flex-col items-center lg:items-start justify-center text-center lg:text-left">
            <h1 
              className={`font-bold leading-tight uppercase transition-all duration-700 ${
                isAnimating ? "opacity-0" : "opacity-100"
              } text-4xl sm:text-6xl lg:text-[6.5rem]`}
              style={{ 
                fontFamily: 'Andada Pro, serif',
                color: currentProductData.textColor || "white" 
              }}
            >
              {currentProductData.displayName.map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h1>

            <button
              className="mt-4 sm:mt-6 px-4 py-2 sm:px-6 sm:py-3 border-2 rounded-lg text-sm sm:text-lg uppercase transition hover:opacity-80"
              style={{
                borderColor: currentProductData.textColor || "white",
                color: currentProductData.textColor || "white",
              }}
              onClick={() => navigate("/bulk-order")}
            >
              Are you retailer? Need in bulk
            </button>
            
          </div>

          {/* Center: Product Image + Carousel */}
          <div className="flex-1 flex flex-col items-center relative">
            <img 
              src={currentProductData.image as string}
              alt={currentProductData.name}
              className="max-h-[40vh] sm:max-h-[60vh] object-contain transition-all duration-700"
            />

            {/* Mobile Carousel with Navigation - Show 2 products at a time */}
            <div className="mt-6 w-full px-2">
              <div className="flex items-center justify-between gap-2">
                {/* Left Navigation Button */}
                <button
                  onClick={handlePrevious}
                  disabled={safeStartIndex === 0}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                    safeStartIndex === 0 
                      ? 'bg-white/20 text-white/50 cursor-not-allowed' 
                      : 'bg-white/80 text-gray-800 hover:bg-white hover:scale-105'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Visible Products Container */}
                <div className="flex-1 flex items-center gap-2 justify-center min-w-0 overflow-hidden">
                  {visibleProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => !isAnimating && setCurrentProduct(product.id)}
                      className={`cursor-pointer flex-shrink-0 p-2 rounded-lg transition-all duration-300 hover:scale-105 min-w-0 ${
                        currentProduct === product.id ? "ring-2 ring-blue-500 ring-offset-2" : "ring-1 ring-white/30"
                      }`}
                      style={{ background: product.gradient }}
                    >
                      <img 
                        src={product.image as string} 
                        alt={product.name}
                        className="w-12 h-12 object-contain rounded-md" 
                      />
                      <p className="text-xs text-white text-center truncate mt-1 max-w-[4rem]">
                        {product.displayName.join(" ")}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Right Navigation Button */}
                <button
                  onClick={handleNext}
                  disabled={safeStartIndex >= maxStartIndex}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                    safeStartIndex >= maxStartIndex 
                      ? 'bg-white/20 text-white/50 cursor-not-allowed' 
                      : 'bg-white/80 text-gray-800 hover:bg-white hover:scale-105'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Page Indicators */}
              <div className="flex justify-center mt-3 gap-1">
                {Array.from({ length: Math.ceil(products.length / 2) }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      Math.floor(safeStartIndex / 2) === index 
                        ? 'bg-white' 
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Description + Quantity + Add to Cart */}
          <div className="flex-1 flex flex-col items-center lg:items-start mt-8 lg:mt-0 mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold uppercase mb-4" style={{ color: currentProductData.textColor || "white" }}>
              {currentProductData.name}
            </h2>
            <p 
              className="text-base sm:text-lg max-w-md mb-6" 
              style={{ 
                color: currentProductData.id === 0 && currentProductData.textColor 
                  ? currentProductData.textColor 
                  : "white" 
              }}
            >
              {currentProductData.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 border rounded-full">-</button>
              <span className="text-lg font-bold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 border rounded-full">+</button>
            </div>

            {/* Add to Cart */}
            <button 
              className="w-full sm:w-auto px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Notification & Bulk Popup */}
        <Notification
          message={`${quantity} ${currentProductData.name} added to cart!`}
          isVisible={showNotification}
          onClose={() => setShowNotification(false)}
          type="success"
        />
        
        <BulkOrderPopup
          isVisible={showBulkOrderPopup}
          onClose={() => setShowBulkOrderPopup(false)}
        />
      </section>

      {/* Login Prompt Modal */}
      <LoginPrompt 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)}
        onLoginSuccess={() => {
          // Refresh page after successful login
          window.location.reload();
        }}
      />
    );
  };
