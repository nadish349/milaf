export interface GuestCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  cases?: boolean; // Flag to identify bulk vs regular orders (true for bulk, false for regular)
  payment: boolean;
  category?: string;
  description?: string;
  gradient?: string;
  addedAt: number; // timestamp
}

const GUEST_CART_KEY = 'milaf_guest_cart';

export const getGuestCart = (): GuestCartItem[] => {
  try {
    const cartData = localStorage.getItem(GUEST_CART_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error reading guest cart from localStorage:', error);
    return [];
  }
};

export const saveGuestCart = (cartItems: GuestCartItem[]): void => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving guest cart to localStorage:', error);
  }
};

export const addToGuestCart = (item: Omit<GuestCartItem, 'id' | 'addedAt'>): void => {
  try {
    console.log('🛒 addToGuestCart called with item:', item);
    const cartItems = getGuestCart();
    console.log('🛒 Current guest cart items:', cartItems);
    
    // Find existing item by name
    const existingIndex = cartItems.findIndex(i => i.name === item.name);
    
    if (existingIndex >= 0) {
      const existing = cartItems[existingIndex];
      console.log('🛒 Found existing item:', existing);
      
      // Check cart type match (cases flag)
      if (existing.cases === item.cases) {
        // Merge quantities
        cartItems[existingIndex].quantity += item.quantity;
        console.log('🛒 Merged quantities, new quantity:', cartItems[existingIndex].quantity);
        saveGuestCart(cartItems);
        
        // Trigger custom event for immediate cart count update
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        console.log('🛒 Triggering cart update event with total items:', totalItems);
        window.dispatchEvent(new CustomEvent('guestCartUpdated', { 
          detail: { totalItems, cartItems } 
        }));
        return;
      } else {
        // Different cart type - show error
        console.error('❌ Cannot mix bulk and regular items in cart');
        window.dispatchEvent(new CustomEvent('cartError', { 
          detail: { message: "Cannot mix bulk and regular items in cart" } 
        }));
        return;
      }
    }
    
    // Add new item
    const newItem: GuestCartItem = {
      ...item,
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedAt: Date.now()
    };
    cartItems.push(newItem);
    console.log('🛒 Added new item to cart:', newItem);
    
    saveGuestCart(cartItems);
    console.log('✅ Guest cart saved to localStorage');
    
    // Trigger custom event for immediate cart count update
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    console.log('🛒 Triggering cart update event with total items:', totalItems);
    window.dispatchEvent(new CustomEvent('guestCartUpdated', { 
      detail: { totalItems, cartItems } 
    }));
  } catch (error) {
    console.error('❌ Error adding item to guest cart:', error);
    window.dispatchEvent(new CustomEvent('cartError', { 
      detail: { message: "Failed to add item to cart. Please try again." } 
    }));
  }
};

export const removeFromGuestCart = (itemId: string): void => {
  const cartItems = getGuestCart();
  const updatedCart = cartItems.filter(item => item.id !== itemId);
  saveGuestCart(updatedCart);
};

export const updateGuestCartQuantity = (itemId: string, quantity: number): void => {
  const cartItems = getGuestCart();
  const itemIndex = cartItems.findIndex(item => item.id === itemId);
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cartItems.splice(itemIndex, 1);
    } else {
      cartItems[itemIndex].quantity = quantity;
    }
    saveGuestCart(cartItems);
  }
};

export const clearGuestCart = (): void => {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch (error) {
    console.error('Error clearing guest cart:', error);
  }
};

export const getGuestCartTotal = (): number => {
  const cartItems = getGuestCart();
  return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getGuestCartTotalItems = (): number => {
  const cartItems = getGuestCart();
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};
