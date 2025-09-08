import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchProductFromFirestore, ProductData } from '@/services/productService';

export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  gradient?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  updateCartPrices: () => Promise<void>;
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

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.name === item.name);
      
      if (existingItem) {
        // If item already exists, increase quantity
        return prev.map(cartItem =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        // If item doesn't exist, add new item with unique ID
        const newItem: CartItem = {
          ...item,
          id: Date.now() // Simple unique ID generation
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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

  // Update prices when cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      updateCartPrices();
    }
  }, [cartItems.length]); // Only run when items are added/removed, not on every price update

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    updateCartPrices,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

