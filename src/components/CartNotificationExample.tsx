import React from 'react';
import { useCartNotification } from '@/hooks/useCartNotification';

/**
 * Example component demonstrating how to use the cart notification controller
 * This shows how to integrate the controller into any component
 */
export const CartNotificationExample: React.FC = () => {
  const {
    isVisible,
    message,
    type,
    showAddToCartSuccess,
    showCartError,
    showCartInfo,
    hideNotification
  } = useCartNotification();

  const handleAddToCart = () => {
    // Example: Add item to cart
    const itemName = "Milaf Cola";
    const quantity = 2;
    
    // This would typically be called from your cart logic
    showAddToCartSuccess(itemName, quantity);
  };

  const handleShowError = () => {
    showCartError("Failed to add item to cart. Please try again.");
  };

  const handleShowInfo = () => {
    showCartInfo("Cart updated successfully!");
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Cart Notification Controller Example</h2>
      
      <div className="space-x-2">
        <button 
          onClick={handleAddToCart}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add to Cart (Success)
        </button>
        
        <button 
          onClick={handleShowError}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Show Error
        </button>
        
        <button 
          onClick={handleShowInfo}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show Info
        </button>
        
        <button 
          onClick={hideNotification}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Hide Notification
        </button>
      </div>

      {/* Display current notification state */}
      {isVisible && (
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Current Notification State:</h3>
          <p>Visible: {isVisible ? 'Yes' : 'No'}</p>
          <p>Message: {message}</p>
          <p>Type: {type}</p>
        </div>
      )}
    </div>
  );
};


