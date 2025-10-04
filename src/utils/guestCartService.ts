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
  const cartItems = getGuestCart();
  
  // Always create a new item for each cart addition
  const newItem: GuestCartItem = {
    ...item,
    id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    addedAt: Date.now()
  };
  cartItems.push(newItem);
  
  saveGuestCart(cartItems);
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
