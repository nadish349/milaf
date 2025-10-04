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

export interface BulkCartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  cases: boolean; // Always true for bulk orders
  payment: boolean;
  category?: string;
  description?: string;
  gradient?: string;
}

interface BulkCartContextType {
  cartItems: BulkCartItem[];
  addToCart: (item: Omit<BulkCartItem, 'id'>) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => Promise<void>;
  loadUserCart: () => Promise<void>;
  isCartLoading: boolean;
}

const BulkCartContext = createContext<BulkCartContextType | undefined>(undefined);

export const useBulkCart = () => {
  const context = useContext(BulkCartContext);
  if (context === undefined) {
    throw new Error('useBulkCart must be used within a BulkCartProvider');
  }
  return context;
};

interface BulkCartProviderProps {
  children: ReactNode;
}

export const BulkCartProvider: React.FC<BulkCartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<BulkCartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const { user } = useAuth();

  const addToCart = async (item: Omit<BulkCartItem, 'id'>) => {
    if (!user) {
      console.error('User must be logged in to add bulk orders to cart');
      return;
    }

    try {
      setIsCartLoading(true);
      
      // Add to Firestore (store cart data with price)
      const success = await addItemToUserCart(user.uid, {
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        cases: item.cases, // Use the cases value from the item
        payment: item.payment || false
      });

      if (success) {
        // Update local state
        setCartItems(prev => {
          const newItem: BulkCartItem = {
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

  const removeFromCart = async (id: number) => {
    if (!user) {
      console.error('User must be logged in to remove items from cart');
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
      console.error('User must be logged in to update cart quantities');
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
      console.error('User must be logged in to clear cart');
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
      
      // Convert to local format - only include bulk orders (cases: true)
      const localCartItems: BulkCartItem[] = cartItemsWithDetails
        .filter(item => item.cases === true) // Only bulk orders
        .map((item, index) => ({
          id: Date.now() + index, // Generate unique ID
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          cases: true, // Always true for bulk orders
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

  // Load user's cart when they log in
  useEffect(() => {
    if (user) {
      loadUserCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const value: BulkCartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
    loadUserCart,
    isCartLoading,
  };

  return (
    <BulkCartContext.Provider value={value}>
      {children}
    </BulkCartContext.Provider>
  );
};
