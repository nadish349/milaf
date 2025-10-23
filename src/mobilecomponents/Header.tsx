import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import milaflogo from "@/assets/milaflogo.png";
import { useCart } from "@/mobilecontexts/CartContext";
import { User } from "lucide-react";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { LoginPrompt } from "@/components/LoginPrompt";

interface HeaderProps {
  showOnlyLogo?: boolean;
  showNavigationWithoutShop?: boolean;
}

export const Header = ({ showOnlyLogo = false, showNavigationWithoutShop = false }: HeaderProps): JSX.Element => {
  const navigate = useNavigate();
  const { getTotalItems, cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Force re-render when cart items change
  useEffect(() => {
    // This will trigger a re-render when cartItems change
    setCartUpdateTrigger(prev => prev + 1);
  }, [cartItems, getTotalItems]);

  // Listen for cart update events
  useEffect(() => {
    const handleCartUpdate = () => {
      setCartUpdateTrigger(prev => prev + 1);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleCartClick = () => {
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }
    navigate('/cart');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleShopClick = () => {
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }
    navigate('/my-orders');
  };

  // Scroll functions for navigation
  const scrollToSection = (sectionIndex: number) => {
    const container = document.querySelector('.h-screen.overflow-y-scroll');
    if (container) {
      const windowHeight = window.innerHeight;
      const scrollPosition = sectionIndex * windowHeight;
      container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(1); // HeroProductsSection is at index 1
    setIsMenuOpen(false);
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(2); // Page4Section is at index 2 in mobile
    setIsMenuOpen(false);
  };

  const handleProductsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(3); // ProductInfo is at index 3 in mobile
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between p-4">
        {/* Left - Milaf Logo */}
        <div className="flex items-center">
          <img
            src={milaflogo}
            alt="Milaf Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Center - Navigation Links (Hidden on mobile) */}
        {(!showOnlyLogo || showNavigationWithoutShop) && (
          <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
            <button 
              onClick={handleHomeClick}
              className="text-white font-bold font-poppins text-base uppercase hover:opacity-80 transition-opacity cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={handleAboutClick}
              className="text-white font-bold font-poppins text-base uppercase hover:opacity-80 transition-opacity cursor-pointer"
            >
              About
            </button>
            <button 
              onClick={handleProductsClick}
              className="text-white font-bold font-poppins text-base uppercase hover:opacity-80 transition-opacity cursor-pointer"
            >
              Products
            </button>
          </nav>
        )}
        
        {/* Right side - Cart and Menu */}
        {!showOnlyLogo && !showNavigationWithoutShop && (
          <div className="flex items-center space-x-3">
            {/* Cart Icon */}
            <div className="relative">
              <svg 
                className="w-7 h-7 text-white hover:opacity-80 transition-opacity cursor-pointer" 
                fill="currentColor" 
                viewBox="0 0 24 24"
                onClick={handleCartClick}
              >
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              {/* Cart Badge */}
              {getTotalItems() > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </div>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 text-white hover:opacity-80 transition-opacity"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Shop Button (Hidden on mobile) */}
            <button 
              onClick={handleShopClick}
              className="hidden md:flex px-4 py-2 font-bold font-poppins text-sm uppercase rounded-[20px] border-2 hover:opacity-80 transition-all duration-300 items-center space-x-2"
              style={{ 
                backgroundColor: 'transparent',
                borderColor: 'white',
                color: 'white'
              }}
            >
              <User className="w-4 h-4" />
              <span>{currentUser ? 'MY ORDERS' : 'Shop'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/20">
          <nav className="flex flex-col p-4 space-y-4">
            <button 
              onClick={handleHomeClick}
              className="text-white font-bold font-poppins text-lg uppercase hover:opacity-80 transition-opacity py-2 border-b border-white/20 text-left"
            >
              Home
            </button>
            <button 
              onClick={handleAboutClick}
              className="text-white font-bold font-poppins text-lg uppercase hover:opacity-80 transition-opacity py-2 border-b border-white/20 text-left"
            >
              About
            </button>
            <button 
              onClick={handleProductsClick}
              className="text-white font-bold font-poppins text-lg uppercase hover:opacity-80 transition-opacity py-2 border-b border-white/20 text-left"
            >
              Products
            </button>
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                handleShopClick();
              }}
              className="w-full mt-4 px-6 py-3 font-bold font-poppins text-lg uppercase rounded-[20px] border-2 text-center flex items-center justify-center space-x-2"
              style={{ 
                backgroundColor: 'transparent',
                borderColor: 'white',
                color: 'white'
              }}
            >
              <User className="w-5 h-5" />
              <span>{currentUser ? 'MY ORDERS' : 'Shop'}</span>
            </button>
          </nav>
        </div>
      )}

      {/* Login Prompt Modal */}
      <LoginPrompt 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)}
        onLoginSuccess={() => {
          // Refresh page after successful login
          window.location.reload();
        }}
      />
    </header>
  );
};
