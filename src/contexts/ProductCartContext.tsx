import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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

export interface ProductCartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  pieces: boolean; // Always true for regular product orders
  payment: boolean;
  category?: string;
  description?: string;
  gradient?: string;
}

interface ProductCartContextType {
  cartItems: ProductCartItem[];
  addToCart: (item: Omit<ProductCartItem, 'id'>) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => Promise<void>;
  loadUserCart: () => Promise<void>;
  isCartLoading: boolean;
  isGuest: boolean;
  mergeGuestCart: () => Promise<void>;
}

const ProductCartContext = createContext<ProductCartContextType | undefined>(undefined);

export const useProductCart = () => {
  const context = useContext(ProductCartContext);
  if (context === undefined) {
    throw new Error('useProductCart must be used within a ProductCartProvider');
  }
  return context;
};

interface ProductCartProviderProps {
  children: ReactNode;
}

export const ProductCartProvider: React.FC<ProductCartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<ProductCartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const { user } = useAuth();

  const addToCart = async (item: Omit<ProductCartItem, 'id'>) => {
    if (!user) {
      // Add to guest cart (localStorage)
      addToGuestCart({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        cases: false, // Regular products are not bulk orders
        payment: item.payment || false,
        category: item.category,
        description: item.description,
        gradient: item.gradient
      });
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
        pieces: item.pieces, // Use the pieces value from the item
        payment: item.payment || false
      });

      if (success) {
        // Update local state
        setCartItems(prev => {
          const newItem: ProductCartItem = {
            ...item,
            id: Date.now() + Math.random() // More unique ID generation
          };
          return [...prev, newItem];
        });
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setIsCartLoading(false);
    }
  };

  const loadGuestCart = () => {
    const guestCartItems = getGuestCart();
    // Filter only regular product items (not bulk orders)
    const productItems = guestCartItems.filter(item => !item.cases);
    const localCartItems: ProductCartItem[] = productItems.map((item, index) => ({
      id: Date.now() + index, // Generate unique ID
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      pieces: true, // Always true for regular products
      payment: item.payment,
      category: item.category,
      description: item.description,
      gradient: item.gradient
    }));
    setCartItems(localCartItems);
    setIsGuest(true);
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
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = async () => {
    if (!user) {
      // Clear only regular product items from guest cart
      const guestCartItems = getGuestCart();
      const updatedGuestCart = guestCartItems.filter(item => item.cases === true); // Keep bulk orders
      saveGuestCart(updatedGuestCart);
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
      
      // Convert to local format - only include regular orders (pieces: true)
      const localCartItems: ProductCartItem[] = cartItemsWithDetails
        .filter(item => item.pieces === true) // Only regular product orders
        .map((item, index) => ({
          id: Date.now() + index, // Generate unique ID
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          pieces: true, // Always true for regular product orders
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

  // Merge guest cart with user cart when user logs in
  const mergeGuestCart = async () => {
    if (!user) return;
    
    const guestCartItems = getGuestCart();
    // Filter only regular product items (not bulk orders)
    const productItems = guestCartItems.filter(item => !item.cases);
    
    if (productItems.length > 0) {
      // Add each guest cart item to user's Firestore cart
      for (const guestItem of productItems) {
        await addItemToUserCart(user.uid, {
          name: guestItem.name,
          quantity: guestItem.quantity,
          price: guestItem.price,
          pieces: true, // Regular products
          payment: false
        });
      }
      
      // Remove product items from guest cart (keep bulk orders)
      const updatedGuestCart = guestCartItems.filter(item => item.cases === true);
      saveGuestCart(updatedGuestCart);
      
      // Load user's cart
      await loadUserCart();
    }
  };

  // Load user's cart when they log in, or load guest cart when not logged in
  useEffect(() => {
    if (user) {
      setIsGuest(false);
      loadUserCart();
    } else {
      // Load guest cart when not logged in
      loadGuestCart();
    }
  }, [user]);

  const value: ProductCartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
    loadUserCart,
    isCartLoading,
    isGuest,
    mergeGuestCart,
  };

  return (
    <ProductCartContext.Provider value={value}>
      {children}
    </ProductCartContext.Provider>
  );
};
