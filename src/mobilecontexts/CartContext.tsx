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
import { showAddToCartSuccess, showCartError, showCartInfo } from '@/controllers/CartNotificationController';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  cases?: boolean; // Flag to identify bulk vs regular orders (true for bulk, false for regular)
  pieces?: boolean; // Flag to identify regular products (true for regular products)
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
    try {
      if (!user) {
        // User must be logged in to add items to cart - show login form
        // Store the item to add after login
        localStorage.setItem('pendingCartItem', JSON.stringify(item));
        // Dispatch event to show login form
        window.dispatchEvent(new CustomEvent('showLoginPrompt'));
        return;
      }

      setIsCartLoading(true);
      
      // Check for existing item in user's cart to prevent duplicates
      const existingCartItems = await getUserCart(user.uid);
      const existingItem = existingCartItems.find(cartItem => 
        cartItem.name === item.name && cartItem.cases === item.cases
      );

      if (existingItem) {
        // Merge quantities instead of adding duplicate
        const newQuantity = existingItem.quantity + item.quantity;
        const success = await updateItemQuantityInCart(user.uid, item.name, newQuantity);
        
        if (success) {
          setCartItems(prev => prev.map(cartItem => 
            cartItem.name === item.name && cartItem.cases === item.cases
              ? { ...cartItem, quantity: newQuantity }
              : cartItem
          ));
          showAddToCartSuccess(item.name, item.quantity);
        } else {
          showCartError("Failed to update item quantity. Please try again.");
        }
        return;
      }
      
      // Add new item to Firestore
      const success = await addItemToUserCart(user.uid, {
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        cases: item.cases || false,
        payment: item.payment || false
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
        
        // Show success notification
        showAddToCartSuccess(item.name, item.quantity);
      } else {
        console.error('❌ Failed to add item to Firestore');
        showCartError("Failed to add item to cart. Please try again.");
      }
    } catch (error) {
      console.error('❌ Error adding item to cart:', error);
      showCartError("Failed to add item to cart. Please try again.");
    } finally {
      setIsCartLoading(false);
    }
  };


  const removeFromCart = async (id: number) => {
    if (!user) {
      showCartError("Please log in to manage your cart.");
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
      showCartError("Please log in to manage your cart.");
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
    return total;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = async () => {
    if (!user) {
      showCartError("Please log in to manage your cart.");
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
        payment: item.payment,
        category: item.category,
        description: item.description,
        gradient: undefined // Add gradient if needed
      }));

      setCartItems(localCartItems);
    } catch (error) {
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
      setIsGuest(false);
      loadUserCart();
      
      // Check for pending cart item after login
      const pendingItem = localStorage.getItem('pendingCartItem');
      if (pendingItem) {
        try {
          const item = JSON.parse(pendingItem);
          // Add the pending item to cart
          addToCart(item);
          localStorage.removeItem('pendingCartItem');
        } catch (error) {
          console.error('Error adding pending cart item:', error);
          localStorage.removeItem('pendingCartItem');
        }
      }
    } else {
      // Clear cart when user logs out
      setCartItems([]);
      setIsGuest(false);
    }
  }, [user]);

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
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};