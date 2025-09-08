import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/firebase';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  description: string;
  payment: boolean;
  addedAt: any; // Firestore timestamp
}

export interface UserCart {
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  lastUpdated: any;
}

// Add item to user's cart in Firestore
export const addItemToUserCart = async (userId: string, item: Omit<CartItem, 'id' | 'addedAt'>): Promise<boolean> => {
  try {
    const cartRef = collection(db, 'users', userId, 'cart');
    
    // Check if item already exists in cart
    const existingItemQuery = query(cartRef, where('name', '==', item.name));
    const existingItemSnap = await getDocs(existingItemQuery);
    
    if (!existingItemSnap.empty) {
      // Update existing item quantity
      const existingItem = existingItemSnap.docs[0];
      const currentData = existingItem.data();
      const newQuantity = currentData.quantity + item.quantity;
      
      await updateDoc(doc(db, 'users', userId, 'cart', existingItem.id), {
        quantity: newQuantity,
        lastUpdated: serverTimestamp()
      });
    } else {
      // Add new item to cart
      await addDoc(cartRef, {
        ...item,
        addedAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
    }
    
    // Update user's cart summary
    await updateUserCartSummary(userId);
    
    console.log(`✅ Item "${item.name}" added to cart for user ${userId}`);
    return true;
  } catch (error) {
    console.error('❌ Error adding item to cart:', error);
    return false;
  }
};

// Remove item from user's cart
export const removeItemFromUserCart = async (userId: string, itemName: string): Promise<boolean> => {
  try {
    const cartRef = collection(db, 'users', userId, 'cart');
    const itemQuery = query(cartRef, where('name', '==', itemName));
    const itemSnap = await getDocs(itemQuery);
    
    if (!itemSnap.empty) {
      const itemDoc = itemSnap.docs[0];
      await deleteDoc(doc(db, 'users', userId, 'cart', itemDoc.id));
      
      // Update user's cart summary
      await updateUserCartSummary(userId);
      
      console.log(`✅ Item "${itemName}" removed from cart for user ${userId}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error removing item from cart:', error);
    return false;
  }
};

// Update item quantity in user's cart
export const updateItemQuantityInCart = async (userId: string, itemName: string, newQuantity: number): Promise<boolean> => {
  try {
    if (newQuantity <= 0) {
      return await removeItemFromUserCart(userId, itemName);
    }
    
    const cartRef = collection(db, 'users', userId, 'cart');
    const itemQuery = query(cartRef, where('name', '==', itemName));
    const itemSnap = await getDocs(itemQuery);
    
    if (!itemSnap.empty) {
      const itemDoc = itemSnap.docs[0];
      await updateDoc(doc(db, 'users', userId, 'cart', itemDoc.id), {
        quantity: newQuantity,
        lastUpdated: serverTimestamp()
      });
      
      // Update user's cart summary
      await updateUserCartSummary(userId);
      
      console.log(`✅ Item "${itemName}" quantity updated to ${newQuantity} for user ${userId}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error updating item quantity:', error);
    return false;
  }
};

// Get user's cart from Firestore
export const getUserCart = async (userId: string): Promise<CartItem[]> => {
  try {
    const cartRef = collection(db, 'users', userId, 'cart');
    const cartSnap = await getDocs(cartRef);
    
    const cartItems: CartItem[] = [];
    cartSnap.forEach((doc) => {
      const data = doc.data();
      cartItems.push({
        id: doc.id,
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        category: data.category,
        description: data.description,
        payment: data.payment || false,
        addedAt: data.addedAt
      });
    });
    
    return cartItems;
  } catch (error) {
    console.error('❌ Error fetching user cart:', error);
    return [];
  }
};

// Clear user's entire cart
export const clearUserCart = async (userId: string): Promise<boolean> => {
  try {
    const cartRef = collection(db, 'users', userId, 'cart');
    const cartSnap = await getDocs(cartRef);
    
    const deletePromises = cartSnap.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    
    await Promise.all(deletePromises);
    
    // Update user's cart summary
    await updateUserCartSummary(userId);
    
    console.log(`✅ Cart cleared for user ${userId}`);
    return true;
  } catch (error) {
    console.error('❌ Error clearing cart:', error);
    return false;
  }
};

// Update user's cart summary (total items, total price)
export const updateUserCartSummary = async (userId: string): Promise<void> => {
  try {
    const cartItems = await getUserCart(userId);
    
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      cartSummary: {
        totalItems,
        totalPrice,
        lastUpdated: serverTimestamp()
      }
    }, { merge: true });
    
  } catch (error) {
    console.error('❌ Error updating cart summary:', error);
  }
};

// Get user's cart summary
export const getUserCartSummary = async (userId: string): Promise<{totalItems: number, totalPrice: number} | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return data.cartSummary || { totalItems: 0, totalPrice: 0 };
    }
    
    return { totalItems: 0, totalPrice: 0 };
  } catch (error) {
    console.error('❌ Error fetching cart summary:', error);
    return null;
  }
};
