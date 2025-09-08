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
  const { user } = useAuth();

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    console.log('🛒 addToCart called with item:', item);
    console.log('👤 Current user:', user);
    
    if (!user) {
      console.warn('❌ User not authenticated, cannot add to cart');
      return;
    }

    try {
      setIsCartLoading(true);
      console.log('🔄 Adding item to Firestore for user:', user.uid);
      
      // Add to Firestore (only store essential cart data)
      const success = await addItemToUserCart(user.uid, {
        name: item.name,
        quantity: item.quantity,
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
            return prev.map(cartItem =>
              cartItem.name === item.name
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            );
          } else {
            // If item doesn't exist, add new item with unique ID
            console.log('➕ Adding new item to local cart');
            const newItem: CartItem = {
              ...item,
              id: Date.now() // Simple unique ID generation
            };
            return [...prev, newItem];
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

  const removeFromCart = async (id: number) => {
    if (!user) {
      console.warn('User not authenticated, cannot remove from cart');
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
      console.warn('User not authenticated, cannot update cart');
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
      console.warn('User not authenticated, cannot clear cart');
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
    console.log('🔄 loadUserCart called');
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

  // Load user's cart when they log in
  useEffect(() => {
    if (user) {
      loadUserCart();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
    }
  }, [user]);

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
    clearCart,
    loadUserCart,
    isCartLoading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

