import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export interface ProductData {
  name: string;
  price: number;
  casesInStock: number;
  casesPerCase: number;
  totalUnits: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  category: string;
  description: string;
  lastUpdated?: string;
}

export const fetchProductFromFirestore = async (productName: string): Promise<ProductData | null> => {
  try {
    console.log('🔍 fetchProductFromFirestore called with productName:', productName);
    const productRef = doc(db, 'products', productName);
    console.log('📁 Product reference path:', productRef.path);
    const productSnap = await getDoc(productRef);
    console.log('📊 Product snapshot exists:', productSnap.exists());
    
    if (productSnap.exists()) {
      const data = productSnap.data();
      console.log('✅ Product data found:', data);
      return {
        name: data.name,
        price: data.price,
        casesInStock: data.casesInStock,
        casesPerCase: data.casesPerCase,
        totalUnits: data.totalUnits,
        status: data.status,
        category: data.category,
        description: data.description,
        lastUpdated: data.lastUpdated
      };
    }
    console.log('❌ Product not found in Firestore for name:', productName);
    return null;
  } catch (error) {
    console.error('❌ Error fetching product from Firestore:', error);
    return null;
  }
};

export const fetchAllProductsFromFirestore = async (): Promise<ProductData[]> => {
  try {
    // For now, we'll fetch the known products
    // In a real app, you might want to use a collection query
    const productNames = [
      'Milaf Cola',
      'Choco Spread', 
      'Date Spread',
      'Safawi Dates',
      'Khalas Dates',
      'Segai Dates'
    ];

    const products: ProductData[] = [];
    
    for (const productName of productNames) {
      const product = await fetchProductFromFirestore(productName);
      if (product) {
        products.push(product);
      }
    }
    
    return products;
  } catch (error) {
    console.error('Error fetching all products from Firestore:', error);
    return [];
  }
};
