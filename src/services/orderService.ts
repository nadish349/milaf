import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc,
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '@/firebase';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: any; // Firestore timestamp
  deliveryAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderWithId extends Order {
  id: string;
}

// Create a new order
export const createOrder = async (userId: string, orderData: Omit<Order, 'id' | 'orderDate'>): Promise<string | null> => {
  try {
    const ordersRef = collection(db, 'orders');
    const orderDoc = await addDoc(ordersRef, {
      ...orderData,
      orderDate: serverTimestamp(),
      createdAt: serverTimestamp()
    });
    
    return orderDoc.id;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};

// Get user's order history
export const getUserOrders = async (userId: string): Promise<OrderWithId[]> => {
  try {
    if (!userId) {
      return [];
    }
    
    const ordersRef = collection(db, 'orders');
    
    // Try with orderBy first, fallback to simple query if index not ready
    let userOrdersQuery;
    try {
      userOrdersQuery = query(
        ordersRef, 
        where('userId', '==', userId),
        orderBy('orderDate', 'desc')
      );
    } catch (indexError) {
      userOrdersQuery = query(
        ordersRef, 
        where('userId', '==', userId)
      );
    }
    
    const ordersSnapshot = await getDocs(userOrdersQuery);
    
    const orders: OrderWithId[] = [];
    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data as Order
      });
    });
    
    // Sort orders by date if we couldn't use orderBy
    if (!userOrdersQuery.toString().includes('orderBy')) {
      orders.sort((a, b) => {
        const dateA = a.orderDate?.toDate ? a.orderDate.toDate() : new Date(a.orderDate);
        const dateB = b.orderDate?.toDate ? b.orderDate.toDate() : new Date(b.orderDate);
        return dateB.getTime() - dateA.getTime(); // Descending order
      });
    }
    
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    
    // Check if it's a permissions error
    if (error.code === 'permission-denied') {
      console.error('Permission denied - check Firestore rules');
    } else if (error.code === 'failed-precondition') {
      // Fallback: try simple query without orderBy
      try {
        const ordersRef = collection(db, 'orders');
        const fallbackQuery = query(ordersRef, where('userId', '==', userId));
        const fallbackSnapshot = await getDocs(fallbackQuery);
        
        const orders: OrderWithId[] = [];
        fallbackSnapshot.forEach((doc) => {
          const data = doc.data();
          orders.push({
            id: doc.id,
            ...data as Order
          });
        });
        
        // Sort manually
        orders.sort((a, b) => {
          const dateA = a.orderDate?.toDate ? a.orderDate.toDate() : new Date(a.orderDate);
          const dateB = b.orderDate?.toDate ? b.orderDate.toDate() : new Date(b.orderDate);
          return dateB.getTime() - dateA.getTime();
        });
        
        return orders;
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
      }
    }
    
    return [];
  }
};

// Get a specific order by ID
export const getOrderById = async (orderId: string): Promise<OrderWithId | null> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      const data = orderSnap.data();
      return {
        id: orderSnap.id,
        ...data as Order
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return null;
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<boolean> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      lastUpdated: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
};

// Get all orders (admin function)
export const getAllOrders = async (): Promise<OrderWithId[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(ordersRef, orderBy('orderDate', 'desc'));
    
    const ordersSnapshot = await getDocs(ordersQuery);
    
    const orders: OrderWithId[] = [];
    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data as Order
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};
