import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchProductFromFirestore, ProductData } from '@/services/productService';
import { 
  addItemToUserCart, 
  removeItemFromUserCart, 
  updateItemQuantityInCart, 
  getUserCart, 
  getUserCartWithProductDetails,
  clearUserCart,
  CartItem as FirestoreCartItem,
  CartItemWithProductDetails
} from '@/services/cartService';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getGuestCart, 
  saveGuestCart, 
  addToGuestCart, 
  removeFromGuestCart, 
  updateGuestCartQuantity, 
  clearGuestCart,
  getGuestCartTotal,
  getGuestCartTotalItems,
  GuestCartItem
} from '@/utils/guestCartService';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  cases?: boolean; // Flag to identify bulk vs regular orders (true for bulk, false for regular)
  payment: boolean;
  category?: string;
  description?: string;
  gradient?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  updateCartPrices: () => Promise<void>;
  clearCart: () => Promise<void>;
  loadUserCart: () => Promise<void>;
  isCartLoading: boolean;
  isGuest: boolean;
  mergeGuestCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const { user } = useAuth();

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    // Check if we're trying to mix bulk and regular orders
    const isBulkOrder = item.cases || false;
    const hasExistingItems = cartItems.length > 0;
    
    if (hasExistingItems) {
      const existingIsBulk = cartItems[0].cases || false;
      if (existingIsBulk !== isBulkOrder) {
        // Clear existing cart if trying to mix bulk and regular orders
        await clearCart();
      }
    }

    if (!user) {
      // Add to guest cart (localStorage)
      addToGuestCart(item);
      loadGuestCart();
      return;
    }

    try {
      setIsCartLoading(true);
      
      // Add to Firestore (store cart data with price)
      const success = await addItemToUserCart(user.uid, {
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        cases: item.cases,
        payment: item.payment || false
      });

      if (success) {
        // Update local state
        setCartItems(prev => {
          const existingItem = prev.find(cartItem => 
            cartItem.name === item.name && 
            (cartItem.cases || false) === isBulkOrder
          );
          
          if (existingItem) {
            // If item already exists with same type (bulk/regular), increase quantity
            console.log('📈 Desktop: Updating existing item quantity');
            const updated = prev.map(cartItem =>
              cartItem.name === item.name && (cartItem.cases || false) === isBulkOrder
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            );
            console.log('🛒 Desktop cart updated (existing):', updated);
            return updated;
          } else {
            // If item doesn't exist, add new item with unique ID
            console.log('➕ Desktop: Adding new item to local cart');
            const newItem: CartItem = {
              ...item,
              id: Date.now() + Math.random() // More unique ID generation
            };
            const updated = [...prev, newItem];
            console.log('🛒 Desktop cart updated (new):', updated);
            return updated;
          }
        });
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setIsCartLoading(false);
    }
  };

  const loadGuestCart = () => {
    console.log('🔄 Desktop loadGuestCart called');
    const guestCartItems = getGuestCart();
    console.log('🛒 Guest cart items from localStorage:', guestCartItems);
    const localCartItems: CartItem[] = guestCartItems.map((item, index) => ({
      id: Date.now() + index, // Generate unique ID
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      cases: item.cases || false,
      payment: item.payment,
      category: item.category,
      description: item.description,
      gradient: item.gradient
    }));
    console.log('🛒 Desktop cart items being set:', localCartItems);
    setCartItems(localCartItems);
    setIsGuest(true);
    console.log('✅ Desktop guest cart loaded, items count:', localCartItems.length);
  };

  const removeFromCart = async (id: number) => {
    if (!user) {
      // For guest users, we need to find the item by name since we don't have the original ID
      const itemToRemove = cartItems.find(item => item.id === id);
      if (itemToRemove) {
        // Find and remove from guest cart by name
        const guestCartItems = getGuestCart();
        const updatedGuestCart = guestCartItems.filter(item => item.name !== itemToRemove.name);
        saveGuestCart(updatedGuestCart);
        loadGuestCart();
      }
      return;
    }

    try {
      setIsCartLoading(true);
      
      // Find the item to get its name
      const itemToRemove = cartItems.find(item => item.id === id);
      if (!itemToRemove) return;

      // Remove from Firestore
      const success = await removeItemFromUserCart(user.uid, itemToRemove.name);

      if (success) {
        // Update local state
        setCartItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    } finally {
      setIsCartLoading(false);
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (!user) {
      // For guest users, we need to find the item by name
      const itemToUpdate = cartItems.find(item => item.id === id);
      if (itemToUpdate) {
        const guestCartItems = getGuestCart();
        const updatedGuestCart = guestCartItems.map(item => 
          item.name === itemToUpdate.name ? { ...item, quantity } : item
        );
        saveGuestCart(updatedGuestCart);
        loadGuestCart();
      }
      return;
    }

    if (quantity < 1) return;

    try {
      setIsCartLoading(true);
      
      // Find the item to get its name
      const itemToUpdate = cartItems.find(item => item.id === id);
      if (!itemToUpdate) return;

      // Update in Firestore
      const success = await updateItemQuantityInCart(user.uid, itemToUpdate.name, quantity);

      if (success) {
        // Update local state
        setCartItems(prev =>
          prev.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
    } finally {
      setIsCartLoading(false);
    }
  };

  const getTotalItems = () => {
    const total = cartItems.reduce((total, item) => total + item.quantity, 0);
    console.log('🛒 Desktop getTotalItems called:', total, 'cartItems:', cartItems.length);
    return total;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = async () => {
    if (!user) {
      clearGuestCart();
      setCartItems([]);
      return;
    }

    try {
      setIsCartLoading(true);
      
      // Clear from Firestore
      const success = await clearUserCart(user.uid);

      if (success) {
        // Update local state
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setIsCartLoading(false);
    }
  };

  const loadUserCart = async () => {
    if (!user) {
      return;
    }

    try {
      setIsCartLoading(true);
      
      // Load from Firestore with current product details
      const cartItemsWithDetails = await getUserCartWithProductDetails(user.uid);
      
      // Convert to local format
      const localCartItems: CartItem[] = cartItemsWithDetails.map((item, index) => ({
        id: Date.now() + index, // Generate unique ID
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        cases: item.cases || false,
        payment: item.payment,
        category: item.category,
        description: item.description,
        gradient: undefined // Add gradient if needed
      }));

      setCartItems(localCartItems);
    } catch (error) {
      console.error('Error loading user cart:', error);
    } finally {
      setIsCartLoading(false);
    }
  };

  const updateCartPrices = async () => {
    try {
      const updatedCartItems = await Promise.all(
        cartItems.map(async (item) => {
          const productData = await fetchProductFromFirestore(item.name);
          if (productData) {
            return {
              ...item,
              price: productData.price
            };
          }
          return item; // Keep original price if fetch fails
        })
      );
      
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error('Error updating cart prices:', error);
    }
  };

  // Merge guest cart with user cart when user logs in
  const mergeGuestCart = async () => {
    if (!user) return;
    
    const guestCartItems = getGuestCart();
    if (guestCartItems.length > 0) {
      // Add each guest cart item to user's Firestore cart
      for (const guestItem of guestCartItems) {
        await addItemToUserCart(user.uid, {
          name: guestItem.name,
          quantity: guestItem.quantity,
          price: guestItem.price,
          payment: false
        });
      }
      
      // Clear guest cart
      clearGuestCart();
      
      // Load user's cart
      await loadUserCart();
    }
  };

  // Load user's cart when they log in, or load guest cart when not logged in
  useEffect(() => {
    console.log('🔄 Desktop cart useEffect triggered, user:', user?.uid);
    if (user) {
      setIsGuest(false);
      loadUserCart();
    } else {
      // Load guest cart when not logged in
      loadGuestCart();
    }
  }, [user]);

  // Debug cart items changes
  useEffect(() => {
    console.log('🛒 Desktop cart items changed:', cartItems);
  }, [cartItems]);

  // Note: Removed automatic price updates to preserve cart prices
  // Cart prices should be locked in when items are added, not updated from current product prices

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    updateCartPrices,
    clearCart,
    loadUserCart,
    isCartLoading,
    isGuest,
    mergeGuestCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

