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
    console.log('🛒 Mobile addToCart called with item:', item);
    console.log('👤 Current user:', user);
    
    if (!user) {
      console.log('👤 Guest user - adding to localStorage cart');
      // Add to guest cart (localStorage)
      addToGuestCart(item);
      loadGuestCart();
      return;
    }

    try {
      setIsCartLoading(true);
      console.log('🔄 Adding item to Firestore for user:', user.uid);
      
      // Add to Firestore (store cart data with price)
      const success = await addItemToUserCart(user.uid, {
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        payment: false
      });

      console.log('✅ Firestore add result:', success);

      if (success) {
        // Update local state
        setCartItems(prev => {
          const existingItem = prev.find(cartItem => cartItem.name === item.name);
          
          if (existingItem) {
            // If item already exists, increase quantity
            console.log('📈 Updating existing item quantity');
            const updated = prev.map(cartItem =>
              cartItem.name === item.name
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            );
            console.log('🛒 Mobile cart updated (existing):', updated);
            return updated;
          } else {
            // If item doesn't exist, add new item with unique ID
            console.log('➕ Adding new item to local cart');
            const newItem: CartItem = {
              ...item,
              id: Date.now() // Simple unique ID generation
            };
            const updated = [...prev, newItem];
            console.log('🛒 Mobile cart updated (new):', updated);
            return updated;
          }
        });
      } else {
        console.error('❌ Failed to add item to Firestore');
      }
    } catch (error) {
      console.error('❌ Error adding item to cart:', error);
    } finally {
      setIsCartLoading(false);
    }
  };

  const loadGuestCart = () => {
    console.log('🔄 Mobile loadGuestCart called');
    const guestCartItems = getGuestCart();
    console.log('🛒 Guest cart items from localStorage:', guestCartItems);
    const localCartItems: CartItem[] = guestCartItems.map((item, index) => ({
      id: Date.now() + index, // Generate unique ID
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      payment: item.payment,
      category: item.category,
      description: item.description,
      gradient: item.gradient
    }));
    console.log('🛒 Mobile cart items being set:', localCartItems);
    setCartItems(localCartItems);
    setIsGuest(true);
    console.log('✅ Mobile guest cart loaded, items count:', localCartItems.length);
  };

  const removeFromCart = async (id: number) => {
    if (!user) {
      console.log('👤 Guest user - removing from localStorage cart');
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
      console.log('👤 Guest user - updating quantity in localStorage cart');
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
    console.log('🛒 Mobile getTotalItems called:', total, 'cartItems:', cartItems.length);
    return total;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = async () => {
    if (!user) {
      console.log('👤 Guest user - clearing localStorage cart');
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
    console.log('🔄 Mobile loadUserCart called');
    console.log('👤 Current user:', user);
    
    if (!user) {
      console.warn('❌ User not authenticated, cannot load cart');
      return;
    }

    try {
      setIsCartLoading(true);
      console.log('🔄 Loading cart with product details from Firestore for user:', user.uid);
      
      // Load from Firestore with current product details
      const cartItemsWithDetails = await getUserCartWithProductDetails(user.uid);
      console.log('📦 Cart items with product details:', cartItemsWithDetails);
      
      // Convert to local format
      const localCartItems: CartItem[] = cartItemsWithDetails.map((item, index) => ({
        id: Date.now() + index, // Generate unique ID
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        payment: item.payment,
        category: item.category,
        description: item.description,
        gradient: undefined // Add gradient if needed
      }));

      console.log('🛒 Converted local cart items:', localCartItems);
      setCartItems(localCartItems);
    } catch (error) {
      console.error('❌ Error loading user cart:', error);
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
      console.log('🔄 Merging guest cart with user cart:', guestCartItems);
      
      // Add each guest cart item to user's Firestore cart
      for (const guestItem of guestCartItems) {
        await addItemToUserCart(user.uid, {
          name: guestItem.name,
          quantity: guestItem.quantity,
          price: guestItem.price
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
    console.log('🔄 Mobile cart useEffect triggered, user:', user?.uid);
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
    console.log('🛒 Mobile cart items changed:', cartItems);
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