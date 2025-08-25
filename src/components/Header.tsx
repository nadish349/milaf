import React from "react";
import { useNavigate } from "react-router-dom";
import milaflogo from "@/assets/milaflogo.png";
import { useCart } from "@/contexts/CartContext";

interface HeaderProps {
  showOnlyLogo?: boolean;
  showNavigationWithoutShop?: boolean;
}

export const Header = ({ showOnlyLogo = false, showNavigationWithoutShop = false }: HeaderProps): JSX.Element => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();

  const handleCartClick = () => {
    navigate('/cart');
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
            <a href="#" className="text-white font-bold font-poppins text-lg uppercase hover:opacity-80 transition-opacity">
              Home
            </a>
            <a href="#" className="text-white font-bold font-poppins text-lg uppercase hover:opacity-80 transition-opacity">
              About
            </a>
            <a href="#" className="text-white font-bold font-poppins text-lg uppercase hover:opacity-80 transition-opacity">
              Products
            </a>
            <a href="#" className="text-white font-bold font-poppins text-lg uppercase hover:opacity-80 transition-opacity">
              Contact
            </a>
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
            
            {/* Shop Button */}
            <button 
              className="px-6 py-3 font-bold font-poppins uppercase rounded-[20px] border-2 hover:opacity-80 transition-all duration-300"
              style={{ 
                backgroundColor: 'transparent',
                borderColor: 'white',
                color: 'white'
              }}
            >
              Shop
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
