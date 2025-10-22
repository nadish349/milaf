import { useState, useEffect } from 'react';
import { cartNotificationController, CartNotificationState } from '@/controllers/CartNotificationController';

/**
 * React hook for managing cart notifications
 * Provides easy access to cart notification controller with reactive state
 */
export const useCartNotification = () => {
  const [notificationState, setNotificationState] = useState<CartNotificationState>(
    cartNotificationController.getNotificationState()
  );

  useEffect(() => {
    // Subscribe to notification state changes
    const unsubscribe = cartNotificationController.subscribe((state) => {
      setNotificationState(state);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return {
    // State
    isVisible: notificationState.isVisible,
    message: notificationState.message,
    type: notificationState.type,
    
    // Actions
    showNotification: cartNotificationController.showNotification.bind(cartNotificationController),
    showAddToCartSuccess: cartNotificationController.showAddToCartSuccess.bind(cartNotificationController),
    showCartError: cartNotificationController.showCartError.bind(cartNotificationController),
    showCartInfo: cartNotificationController.showCartInfo.bind(cartNotificationController),
    hideNotification: cartNotificationController.hideNotification.bind(cartNotificationController),
  };
};

