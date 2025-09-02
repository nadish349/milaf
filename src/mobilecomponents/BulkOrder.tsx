import React, { useState, useEffect } from "react";
import group5 from "@/assets/Group5.png";
import milafframe from "@/assets/milafframe.png";
import chocospread from "@/assets/chocospread.png";
import datespread from "@/assets/datespread.png";
import safawidates from "@/assets/safawidates.png";
import segaidates from "@/assets/segaidates.png";
import khalasdates from "@/assets/khalasdates.png";
import { useCart } from "@/contexts/CartContext";
import { Notification } from "./Notification";
import { BulkOrderPopup } from "./BulkOrderPopup";
import { useNavigate } from "react-router-dom";

interface BulkOrderProps {
  onGradientChange?: (gradient: string) => void;
  selectedProductId?: number;
}

export const BulkOrder = ({ onGradientChange, selectedProductId }: BulkOrderProps): JSX.Element => {
  const [currentProduct, setCurrentProduct] = useState(selectedProductId || 0);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [showBulkOrderPopup, setShowBulkOrderPopup] = useState(false);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Hide scrollbar for the product carousel
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const products = [
    {
      id: 0,
      name: "milaf cola",
      displayName: ["MILAF", "COLA"],
      image: group5,
      description: "Milaf Cola, crafted in Saudi Arabia, enriched with Ajwa dates, zero sugar, bold refreshing taste.",
      backgroundImage: milafframe,
      textColor: "#BF7E3E",
      price: 4.99,
      gradient: "linear-gradient(135deg, #66A992, #FFFFFF)"
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

  const currentProductData = products[currentProduct];

  const handleAddToCart = () => {
    addToCart({
      name: currentProductData.name,
      image: currentProductData.image,
      price: currentProductData.price,
      quantity: quantity,
      gradient: currentProductData.gradient
    });
    
    setShowNotification(true);
    setQuantity(1);
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

  return (
    <section className="bulk-order-section relative min-h-screen w-full bg-black">
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
        onClick={() => navigate(-1)}
        className="absolute top-6 left-4 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Main content - Mobile Optimized */}
      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 py-16 space-y-12">
        
        {/* Main Title */}
        <div className="text-center">
          <h1 
            className="font-bold font-poppins leading-tight uppercase text-4xl sm:text-6xl lg:text-7xl mb-4 text-white"
            style={{ color: currentProductData.textColor || "white" }}
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
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 px-2">
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
                <p className="text-xs text-black text-center truncate mt-2 max-w-[4rem]">
                  {product.displayName.join(" ")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/20">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase mb-4 text-center text-white" 
              style={{ color: currentProductData.textColor || "white" }}>
            {currentProductData.name}
          </h2>
          
          <p className="text-base sm:text-lg text-center mb-6 leading-relaxed text-white" 
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
            
            {/* Price Display */}
            <div className="mt-4">
              <span className="text-sm text-black/80">Total Price:</span>
              <p className="text-2xl font-bold text-black">
                ${(currentProductData.price * quantity * 20).toFixed(2)}
              </p>
              <p className="text-sm text-black/60">
                ${(currentProductData.price).toFixed(2)} per unit
              </p>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button 
            className="w-full px-6 py-4 bg-black text-white font-bold text-lg uppercase rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg mb-4"
            onClick={handleAddToCart}
          >
            Add {quantity} Case{quantity > 1 ? 's' : ''} to Cart
          </button>

          {/* Bulk Order Info Button */}
          <button 
            className="w-full px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
            onClick={() => setShowBulkOrderPopup(true)}
          >
            ℹ️ Learn About Bulk Orders
          </button>
        </div>

        {/* Contact Info */}
        <div className="text-center text-white/80 text-sm sm:text-base">
          <p>Need larger quantities? Contact us directly:</p>
          <p className="font-semibold mt-1">📧 bulk@milafarabia.com</p>
          <p className="font-semibold">📞 +966 50 123 4567</p>
        </div>
      </div>

      {/* Notification */}
      <Notification
        message={`${quantity} case${quantity > 1 ? 's' : ''} of ${currentProductData.name} added to cart!`}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        type="success"
      />
      
      <BulkOrderPopup
        isVisible={showBulkOrderPopup}
        onClose={() => setShowBulkOrderPopup(false)}
      />
    </section>
  );
};
