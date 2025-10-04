import React, { useState, useEffect } from "react";
import group5 from "@/assets/Group5.png";
import milafframe from "@/assets/milafframe.png";
import chocospread from "@/assets/chocospread.png";
import datespread from "@/assets/datespread.png";
import safawidates from "@/assets/safawidates.png";
import segaidates from "@/assets/segaidates.png";
import khalasdates from "@/assets/khalasdates.png";
import { useBulkCart } from "../contexts/BulkCartContext";
import { Notification } from "../mobilecomponents/Notification";
import { BulkOrderPopup } from "../mobilecomponents/BulkOrderPopup";
import { useNavigate } from "react-router-dom";
import { Header } from "../mobilecomponents/Header";
import { fetchAllProductsFromFirestore, ProductData } from "@/services/productService";
import { getProductImage } from "@/utils/productImages";
import { handleBulkAddToCart } from "@/services/bulkCartPlacer";

interface BulkOrderProps {
  onGradientChange?: (gradient: string) => void;
  selectedProductId?: number;
}

export const BulkOrder = ({ onGradientChange, selectedProductId }: BulkOrderProps): JSX.Element => {
  
  const [currentProduct, setCurrentProduct] = useState(selectedProductId || 0);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [showBulkOrderPopup, setShowBulkOrderPopup] = useState(false);
  const { addToCart } = useBulkCart();
  const navigate = useNavigate();

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
      price: 99.80 // Case price for 20 units
    },
    {
      id: 1,
      name: "chocolate spread",
      displayName: ["CHOCO", "SPREAD"],
      image: chocospread,
      description: "Rich and creamy chocolate spread, made with premium cocoa and natural ingredients for the perfect indulgence.",
      gradient: "linear-gradient(135deg, #743002, #7C3C16)",
      price: 167.76 // Case price for 24 units
    },
    {
      id: 2,
      name: "date spread",
      displayName: ["DATE", "SPREAD"],
      image: datespread,
      description: "Natural and nutritious date spread, made from premium Ajwa dates, rich in fiber and natural sweetness.",
      gradient: "linear-gradient(135deg, #CE8437, #FBDCA4)",
      price: 159.80 // Case price for 20 units
    },
    {
      id: 3,
      name: "khalas dates",
      displayName: ["KHALAS", "DATES"],
      image: khalasdates,
      description: "Classic Khalas dates with caramel-like sweetness and a smooth bite.",
      gradient: "linear-gradient(135deg, #98371F, #A94733)",
      price: 299.70 // Case price for 30 units
    },
    {
      id: 4,
      name: "safawi dates",
      displayName: ["SAFAWI", "DATES"],
      image: safawidates,
      description: "Premium Safawi dates known for their rich flavor and soft texture.",
      gradient: "linear-gradient(135deg, #D69150, #B66325)",
      price: 224.75 // Case price for 25 units
    },
    {
      id: 5,
      name: "segai dates",
      displayName: ["SEGAI", "DATES"],
      image: segaidates,
      description: "Segai dates featuring a delightful blend of firm and soft textures with a balanced sweetness.",
      gradient: "linear-gradient(135deg, #722E17, #D8582C)",
      price: 274.75 // Case price for 25 units
    }
  ];

  const [products, setProducts] = useState<any[]>(getDefaultProducts());
  const [loading, setLoading] = useState(false);

  // Load products from database in background (non-blocking)
  useEffect(() => {
    const loadProducts = async () => {
      try {
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
            price: product.casePrice || product.price, // Use case price for bulk orders
            category: product.category
          }));
          setProducts(formattedProducts);
        }
        // If no Firestore products, keep using default products (already set)
      } catch (error) {
        console.error('Error loading products:', error);
        // Keep using default products on error
      }
    };

    loadProducts();
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };


  const nextProduct = () => {
    setCurrentProduct((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentProduct((prev) => (prev - 1 + products.length) % products.length);
  };

  const currentProductData = products[currentProduct];

  const handleAddToCart = () => {
    handleBulkAddToCart(
      currentProductData,
      quantity,
      addToCart,
      setShowNotification,
      setQuantity
    );
  };

  useEffect(() => {
    if (onGradientChange && currentProductData?.gradient) {
      onGradientChange(currentProductData.gradient);
    }
  }, [currentProduct, onGradientChange, currentProductData?.gradient]);

  // Update currentProduct when selectedProductId changes
  useEffect(() => {
    if (selectedProductId !== undefined) {
      setCurrentProduct(selectedProductId);
    }
  }, [selectedProductId]);



      // Guard clause to prevent rendering when currentProductData is undefined
      if (!currentProductData) {
        return (
          <section className="bulk-order-section relative min-h-screen w-full bg-black text-white">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">No products available</h2>
                <p className="text-gray-300">Please try again later.</p>
              </div>
            </div>
          </section>
        );
      }

      return (
      <section className="bulk-order-section relative min-h-screen w-full bg-black text-white">
        <style>
          {`
            .carousel-scroll::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {/* Header with Cart */}
        <Header />
        
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
      
      {/* Go Back Button */}
      <button
        onClick={handleGoBack}
        className="absolute top-6 left-4 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 py-16 space-y-12">
        {/* Main Title */}
        <div className="text-center">
          <h1 
            className="font-bold leading-tight uppercase text-4xl sm:text-6xl lg:text-7xl mb-4"
            style={{ 
              fontFamily: 'Andada Pro, serif',
              color: currentProductData.textColor || "white" 
            }}
          >
            {currentProductData.displayName.map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h1>
          

        </div>

        {/* Product Image */}
        <div className="relative">
          <img 
            src={currentProductData.image as string}
            alt={currentProductData.name}
            className="max-h-[30vh] sm:max-h-[40vh] object-contain transition-all duration-700"
          />
        </div>

        {/* Product Carousel - Scrollable */}
        <div className="w-full">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 px-2 carousel-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => setCurrentProduct(product.id)}
                className={`cursor-pointer flex-shrink-0 p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  currentProduct === product.id ? "ring-2 ring-blue-500 ring-offset-2" : "ring-1 ring-white/30"
                }`}
                style={{ background: product.gradient }}
              >
                <img 
                  src={product.image as string} 
                  alt={product.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg" 
                />
                <p className="text-xs text-white text-center truncate mt-2 max-w-[4rem]">
                  {product.displayName.join(" ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      
              {/* Product Info Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/20">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase mb-4 text-center" 
              style={{ color: currentProductData.textColor || "white" }}>
            {currentProductData.name}
          </h2>
          
          <p className="text-base sm:text-lg text-center mb-6 leading-relaxed" 
             style={{ 
               color: currentProductData.id === 0 && currentProductData.textColor 
                 ? currentProductData.textColor 
                 : "white" 
             }}>
            {currentProductData.description}
          </p>

          {/* Product Availability */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-black text-center mb-3">
              Product Availability
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="text-sm text-black/80">Available Cases:</span>
                <p className="text-xl font-bold text-black">150</p>
              </div>
              <div>
                <span className="text-sm text-black/80">Batch Date:</span>
                <p className="text-xl font-bold text-black">Dec 15, 2024</p>
              </div>
            </div>
          </div>

          {/* Dimensions - Only for Milaf Cola */}
          {currentProductData.id === 0 && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-4">
              <h3 className="text-sm font-semibold text-black text-center mb-2">
                Dimensions
              </h3>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <span className="text-xs text-black/70">H:</span>
                  <span className="text-sm font-semibold text-black ml-1">14cm</span>
                </div>
                <div>
                  <span className="text-xs text-black/70">W:</span>
                  <span className="text-sm font-semibold text-black ml-1">22cm</span>
                </div>
                <div>
                  <span className="text-xs text-black/70">L:</span>
                  <span className="text-sm font-semibold text-black ml-1">32cm</span>
                </div>
                <div>
                  <span className="text-xs text-black/70">Wt:</span>
                  <span className="text-sm font-semibold text-black ml-1">6kg</span>
                </div>
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="text-center mb-6">
            <label className="block text-base font-medium mb-3 text-black">
              Cases (20 units per case)
            </label>
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                className="w-10 h-10 rounded-full border-2 border-black/50 flex items-center justify-center hover:bg-black/20 transition-all duration-300 text-black"
              >
                -
              </button>
              <span className="text-3xl font-bold text-black min-w-[3rem] text-center">
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(quantity + 1)} 
                className="w-10 h-10 rounded-full border-2 border-black/50 flex items-center justify-center hover:bg-black/20 transition-all duration-300 text-black"
              >
                +
              </button>
            </div>
            

          </div>

          {/* Add to Cart Button */}
          <button 
            className="w-full px-6 py-4 bg-black text-white font-bold text-lg uppercase rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg"
            onClick={handleAddToCart}
          >
            Add {quantity} Case{quantity > 1 ? 's' : ''} to Cart
          </button>
        </div>

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
