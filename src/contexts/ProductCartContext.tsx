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
  const { user } = useAuth();

  const addToCart = async (item: Omit<ProductCartItem, 'id'>) => {
    if (!user) {
      console.error('User must be logged in to add products to cart');
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

  // Load user's cart when they log in
  useEffect(() => {
    if (user) {
      loadUserCart();
    } else {
      setCartItems([]);
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
  };

  return (
    <ProductCartContext.Provider value={value}>
      {children}
    </ProductCartContext.Provider>
  );
};
