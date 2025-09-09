import React, { useState, useEffect } from "react";
import m1 from "@/assets/m1.png";
import { Header } from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { getProductImage } from "@/utils/productImages";
import group5 from "@/assets/Group5.png";
import { LoginForm } from "@/components/LoginForm";
import { getUserOrders, OrderWithId } from "@/services/orderService";
import { useAuth } from "@/contexts/AuthContext";

export const Cart = (): JSX.Element => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, isGuest, mergeGuestCart, loadUserCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [orderedItems, setOrderedItems] = useState<OrderWithId[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Debug logging removed for production

  // Function to get the correct cart image (same logic as ProductDetail)
  const getCartImage = (productName: string): string => {
    const isMilafCola = productName.toLowerCase() === "milaf cola";
    return isMilafCola ? group5 : getProductImage(productName);
  };

  // Load user cart and orders when component mounts
  useEffect(() => {
    const loadCartAndOrders = async () => {
      if (user) {
        // Load user cart
        await loadUserCart();
        
        // Load user orders
        setIsLoadingOrders(true);
        try {
          const userOrders = await getUserOrders(user.uid);
          setOrderedItems(userOrders);
        } catch (error) {
          console.error('Error loading user orders:', error);
        } finally {
          setIsLoadingOrders(false);
        }
      }
    };

    loadCartAndOrders();
  }, [user]); // Removed loadUserCart from dependencies to prevent infinite loop

  const handleBackToShop = () => {
    // Navigate back to the main shop page
    window.history.back();
  };

  const handleProceedToCheckout = () => {
    if (isGuest) {
      // Show login modal for guest users
      setShowLoginModal(true);
    } else {
      // Navigate to payment for authenticated users
      navigate('/payment');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    
    let date;
    if (timestamp.toDate) {
      // Firestore timestamp
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      // Firestore timestamp object
      date = new Date(timestamp.seconds * 1000);
    } else {
      // Regular date string or number
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div 
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundImage: `url(${m1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Header without shop button */}
      <Header showNavigationWithoutShop={true} />
      
      {/* Cart Content - Single screen height */}
      <div className="pt-16 h-full overflow-y-auto px-4 pb-4">
        <div className="max-w-6xl mx-auto">
          {/* Back to Shop Button */}
          <div className="relative z-50 mb-2">
            <button
              onClick={handleBackToShop}
              className="w-10 h-10 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-800 ml-4 cursor-pointer"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          <div className="p-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-4 mt-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Cart Items
                  </h2>
                  
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🛒</div>
                      <h3 className="text-lg font-semibold text-gray-600 mb-1">
                        Your cart is empty
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Add some products to get started!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[calc(4*4.5rem+3*0.75rem)] overflow-y-auto pr-2">
                      {cartItems.map((item) => (
                        <div 
                          key={item.id}
                          className="flex items-center p-3 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
                        >
                          {/* Product Image */}
                          <div 
                            className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 mr-4 bg-white"
                          >
                            <img
                              src={getCartImage(item.name)}
                              alt={item.name}
                              className="w-full h-full object-contain p-1"
                              onLoad={() => {}}
                              onError={() => {}}
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                              {item.name}
                            </h3>
                            <p className="text-xl font-bold text-green-600">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2 mr-4">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-800"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            
                            <span className="text-lg font-bold text-gray-800 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-800"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>

                          {/* Total Price */}
                          <div className="text-right mr-4">
                            <p className="text-sm font-semibold text-gray-600 mb-1">
                              Total
                            </p>
                            <p className="text-xl font-bold text-green-600">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition-colors flex items-center justify-center text-red-600 hover:text-red-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ordered Items Card */}
                <div className="bg-white rounded-2xl shadow-xl p-4 mt-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Ordered Items
                  </h2>
                  
                  {isLoadingOrders ? (
                    <div className="text-center py-6">
                      <div className="text-3xl mb-2">⏳</div>
                      <h3 className="text-lg font-semibold text-gray-600 mb-1">
                        Loading orders...
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Please wait while we fetch your order history
                      </p>
                    </div>
                  ) : orderedItems.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="text-3xl mb-2">📦</div>
                      <h3 className="text-lg font-semibold text-gray-600 mb-1">
                        No orders yet
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Your completed orders will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                      {orderedItems.map((order) => (
                        <div key={order.id} className="space-y-2">
                          {/* Order Header */}
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                            <div className="text-sm font-semibold text-gray-700">
                              Order #{order.id.slice(-8)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatDate(order.orderDate)}
                            </div>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : order.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          
                          {/* Order Items */}
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div 
                                key={`${order.id}-${index}`}
                                className="flex items-center p-2 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300"
                              >
                                {/* Product Image */}
                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 mr-3">
                                  <img
                                    src={getCartImage(item.name)}
                                    alt={item.name}
                                    className="w-full h-full object-contain p-1"
                                    onLoad={() => {}}
                                    onError={() => {}}
                                  />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold text-gray-800">
                                    {item.name}
                                  </h4>
                                  <div className="flex items-center space-x-3 text-xs">
                                    <span className="text-gray-600">
                                      Qty: {item.quantity}
                                    </span>
                                    <span className="text-green-600 font-semibold">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Order Total */}
                          <div className="text-right text-sm font-semibold text-gray-800 border-t pt-2">
                            Total: ${order.totalAmount.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary - Fixed Position */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl p-4 mt-8" style={{ position: 'sticky', top: '1rem' }}>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Order Summary
                  </h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Shipping</span>
                      <span 
                        className="text-gray-600 cursor-pointer hover:text-gray-800 underline"
                        onClick={handleProceedToCheckout}
                      >
                        SELECT LOCATION
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-xl font-bold text-gray-800">
                        <span>Total Amount</span>
                        <span>${getTotalPrice().toFixed(2)} <span className="text-base text-gray-600 font-normal">+ SHIPPING CHARGE</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button 
                    onClick={handleProceedToCheckout}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg mb-3"
                  >
                    Proceed to Checkout
                  </button>

                  {/* Continue Shopping */}
                  <button 
                    onClick={handleBackToShop}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-base py-2 px-6 rounded-xl transition-all duration-300"
                  >
                    Continue Shopping
                  </button>

                  {/* Security Badge */}
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-green-600 mb-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-semibold">Secure Checkout</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Form for Guest Users */}
      <LoginForm 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={async () => {
          // Merge guest cart with user cart after successful login
          await mergeGuestCart();
          // After successful login, navigate to payment
          navigate('/payment');
        }}
      />
    </div>
  );
};
