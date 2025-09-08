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
    console.log('🔥 addItemToUserCart called with:', { userId, item });
    const cartRef = collection(db, 'users', userId, 'cart');
    console.log('📁 Cart reference created:', cartRef.path);
    
    // Check if item already exists in cart
    const existingItemQuery = query(cartRef, where('name', '==', item.name));
    console.log('🔍 Checking for existing item with name:', item.name);
    const existingItemSnap = await getDocs(existingItemQuery);
    console.log('📊 Existing items found:', existingItemSnap.size);
    
    if (!existingItemSnap.empty) {
      // Update existing item quantity
      const existingItem = existingItemSnap.docs[0];
      const currentData = existingItem.data();
      const newQuantity = currentData.quantity + item.quantity;
      console.log('📈 Updating existing item quantity from', currentData.quantity, 'to', newQuantity);
      
      console.log('💰 Updating existing item price in Firestore:', item.price, 'type:', typeof item.price);
      const priceToStore = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      console.log('💰 Storing price as:', priceToStore);
      await updateDoc(doc(db, 'users', userId, 'cart', existingItem.id), {
        quantity: newQuantity,
        price: priceToStore,
        lastUpdated: serverTimestamp()
      });
      console.log('✅ Existing item updated successfully');
    } else {
      // Add new item to cart
      console.log('➕ Adding new item to cart');
      console.log('💰 Storing price in Firestore:', item.price, 'type:', typeof item.price);
      const priceToStore = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      console.log('💰 Storing price as:', priceToStore);
      const docRef = await addDoc(cartRef, {
        name: item.name,
        quantity: item.quantity,
        price: priceToStore,
        payment: false,
        addedAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
      console.log('✅ New item added with ID:', docRef.id);
    }
    
    // Update user's cart summary
    console.log('📊 Updating cart summary for user:', userId);
    await updateUserCartSummary(userId);
    
    console.log(`✅ Item "${item.name}" added to cart for user ${userId}`);
    return true;
  } catch (error) {
    console.error('❌ Error adding item to cart:', error);
    console.error('❌ Error details:', error);
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
    console.log('🔄 getUserCart called for user:', userId);
    const cartRef = collection(db, 'users', userId, 'cart');
    console.log('📁 Cart reference:', cartRef.path);
    
    const cartSnap = await getDocs(cartRef);
    console.log('📊 Cart snapshot size:', cartSnap.size);
    
    const cartItems: CartItem[] = [];
    cartSnap.forEach((doc) => {
      const data = doc.data();
      console.log('📄 Processing cart item:', doc.id, data);
      console.log('💰 Retrieved price from Firestore:', data.price, 'type:', typeof data.price);
      const price = typeof data.price === 'string' ? parseFloat(data.price) : (data.price || 0);
      console.log('💰 Converted price:', price);
      cartItems.push({
        id: doc.id,
        name: data.name,
        quantity: data.quantity,
        price: price,
        payment: data.payment || false,
        addedAt: data.addedAt
      });
    });
    
    console.log('🛒 Final cart items:', cartItems);
    return cartItems;
  } catch (error) {
    console.error('❌ Error fetching user cart:', error);
    console.error('❌ Error details:', error);
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

// Get user's cart with current product details from products database
export const getUserCartWithProductDetails = async (userId: string): Promise<CartItemWithProductDetails[]> => {
  try {
    console.log('🔄 getUserCartWithProductDetails called for user:', userId);
    
    // First get the basic cart items
    const cartItems = await getUserCart(userId);
    console.log('📦 Basic cart items:', cartItems);
    
    // Then fetch product details for each item
    const cartItemsWithDetails: CartItemWithProductDetails[] = [];
    
    for (const cartItem of cartItems) {
      console.log('🔍 Fetching product details for:', cartItem.name);
      const productData = await fetchProductFromFirestore(cartItem.name);
      
      if (productData) {
        console.log('✅ Product details found:', productData);
        console.log('💰 Price check - cartItem.price:', cartItem.price, 'type:', typeof cartItem.price, 'productData.price:', productData.price, 'type:', typeof productData.price);
        const cartPrice = typeof cartItem.price === 'string' ? parseFloat(cartItem.price) : cartItem.price;
        const productPrice = typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price;
        const finalPrice = cartPrice > 0 ? cartPrice : productPrice;
        console.log('💰 Final price selected:', finalPrice);
        console.log('🔍 Debug - cartPrice > 0 check:', cartPrice > 0, 'cartPrice:', cartPrice, 'productPrice:', productPrice);
        
        cartItemsWithDetails.push({
          ...cartItem,
          price: finalPrice, // Use cart price if > 0, otherwise use current product price
          category: productData.category,
          description: productData.description,
          image: '' // Will be handled by getProductImage utility
        });
      } else {
        console.warn('⚠️ Product details not found for:', cartItem.name);
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
    
    console.log('🛒 Final cart items with details:', cartItemsWithDetails);
    return cartItemsWithDetails;
  } catch (error) {
    console.error('❌ Error fetching cart with product details:', error);
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
