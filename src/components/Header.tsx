import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import milaflogo from "@/assets/milaflogo.png";
import { useCart } from "@/contexts/CartContext";
import { User } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

interface HeaderProps {
  showOnlyLogo?: boolean;
  showNavigationWithoutShop?: boolean;
}

export const Header = ({ showOnlyLogo = false, showNavigationWithoutShop = false }: HeaderProps): JSX.Element => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleShopClick = () => {
    if (currentUser) {
      // User is logged in - navigate to MyShop page
      navigate('/my-orders');
    } else {
      // User is not logged in - show login form
      setIsLoginOpen(true);
    }
  };

  const handleLoginClose = () => {
    setIsLoginOpen(false);
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
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(4); // Page4Section is at index 4
  };

  const handleProductsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(5); // ProductInfo is at index 5
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6">
      <div className="flex items-center relative">
        {/* Left - Milaf Logo */}
        <div className="flex items-center">
          <img
            src={milaflogo}
            alt="Milaf Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Center - Navigation Links */}
        {(!showOnlyLogo || showNavigationWithoutShop) && (
          <nav className="flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <button 
              onClick={handleHomeClick}
              className="text-white font-bold font-poppins text-lg uppercase hover:opacity-80 transition-opacity cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={handleAboutClick}
              className="text-white font-bold font-poppins text-lg uppercase hover:opacity-80 transition-opacity cursor-pointer"
            >
              About
            </button>
            <button 
              onClick={handleProductsClick}
              className="text-white font-bold font-poppins text-lg uppercase hover:opacity-80 transition-opacity cursor-pointer"
            >
              Products
            </button>
          </nav>
        )}
        
        {/* Right side - Cart Image and Shop Button */}
        {!showOnlyLogo && !showNavigationWithoutShop && (
          <div className="flex items-center space-x-4 ml-auto">
            {/* Cart Image */}
            <div className="relative">
              <svg 
                className="w-8 h-8 text-white hover:opacity-80 transition-opacity cursor-pointer" 
                fill="currentColor" 
                viewBox="0 0 24 24"
                onClick={handleCartClick}
              >
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              {/* Cart Badge - shows real item count */}
              {getTotalItems() > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </div>
              )}
            </div>
            
            {/* Shop Button - Shows different text based on auth status */}
            <div className="relative">
              <button 
                onClick={handleShopClick}
                className="px-6 py-3 font-bold font-poppins uppercase rounded-[20px] border-2 hover:opacity-80 transition-all duration-300 flex items-center space-x-2"
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
          </div>
        )}
      </div>

      {/* Login Form Modal */}
      <LoginForm isOpen={isLoginOpen} onClose={handleLoginClose} />
    </header>
  );
};
