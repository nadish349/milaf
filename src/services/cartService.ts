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
import { fetchProductFromFirestore, ProductData } from './productService';

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  pieces?: boolean; // Flag to identify regular product orders (true for regular products)
  cases?: boolean; // Flag to identify bulk orders (true for bulk orders)
  price: number;
  payment: boolean;
  addedAt: any; // Firestore timestamp
}

export interface CartItemWithProductDetails extends CartItem {
  price: number;
  category: string;
  description: string;
  image: string;
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
    
    // Always create a new document for each cart addition
    const priceToStore = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    
    // Create document with only the relevant field
    const docData: any = {
      name: item.name,
      quantity: item.quantity,
      price: priceToStore,
      payment: item.payment || false,
      addedAt: serverTimestamp(),
      lastUpdated: serverTimestamp()
    };

    // Add only the relevant field based on order type
    if (item.pieces !== undefined) {
      docData.pieces = item.pieces;
    }
    if (item.cases !== undefined) {
      docData.cases = item.cases;
    }

    await addDoc(cartRef, docData);
    
    // Update user's cart summary
    await updateUserCartSummary(userId);
    
    return true;
  } catch (error) {
    console.error('Error adding item to cart:', error);
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
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error removing item from cart:', error);
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
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating item quantity:', error);
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
      const price = typeof data.price === 'string' ? parseFloat(data.price) : (data.price || 0);
      const cartItem: any = {
        id: doc.id,
        name: data.name,
        quantity: data.quantity,
        price: price,
        payment: data.payment || false,
        addedAt: data.addedAt
      };

      // Add only the relevant field if it exists
      if (data.pieces !== undefined) {
        cartItem.pieces = data.pieces;
      }
      if (data.cases !== undefined) {
        cartItem.cases = data.cases;
      }

      cartItems.push(cartItem);
    });
    
    return cartItems;
  } catch (error) {
    console.error('Error fetching user cart:', error);
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
    
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
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

// Get user's cart with current product details from products database
export const getUserCartWithProductDetails = async (userId: string): Promise<CartItemWithProductDetails[]> => {
  try {
    // First get the basic cart items
    const cartItems = await getUserCart(userId);
    
    // Then fetch product details for each item
    const cartItemsWithDetails: CartItemWithProductDetails[] = [];
    
    for (const cartItem of cartItems) {
      const productData = await fetchProductFromFirestore(cartItem.name);
      
      if (productData) {
        const cartPrice = typeof cartItem.price === 'string' ? parseFloat(cartItem.price) : cartItem.price;
        const productPrice = typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price;
        const finalPrice = cartPrice > 0 ? cartPrice : productPrice;
        
        cartItemsWithDetails.push({
          ...cartItem,
          price: finalPrice, // Use cart price if > 0, otherwise use current product price
          category: productData.category,
          description: productData.description,
          image: '' // Will be handled by getProductImage utility
        });
      } else {
        // Add item with default values if product not found
        cartItemsWithDetails.push({
          ...cartItem,
          price: 0,
          category: 'Unknown',
          description: 'Product not found',
          image: ''
        });
      }
    }
    
    return cartItemsWithDetails;
  } catch (error) {
    console.error('Error fetching cart with product details:', error);
    return [];
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
