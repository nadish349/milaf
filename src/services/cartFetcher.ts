import { useState, useEffect } from "react";
import { getUserOrders, OrderWithId } from "@/services/orderService";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useProductCart } from "@/contexts/ProductCartContext";
import { useBulkCart } from "@/contexts/BulkCartContext";
import { getProductImage } from "@/utils/productImages";
import { fetchProductFromFirestore } from "@/services/productService";
import milafcola from "@/assets/milafcola.png";

export interface CartFetcherData {
  cartItems: any[];
  orderedItems: OrderWithId[];
  isLoadingOrders: boolean;
  loadCartAndOrders: () => Promise<void>;
  getCartImage: (productName: string) => string;
}

export const useCartFetcher = (): CartFetcherData => {
  const { user } = useAuth();
  const { cartItems: regularCartItems, loadUserCart: loadRegularCart } = useCart();
  const { cartItems: productCartItems, loadUserCart: loadProductCart } = useProductCart();
  const { cartItems: bulkCartItems, loadUserCart: loadBulkCart } = useBulkCart();
  
  const [orderedItems, setOrderedItems] = useState<OrderWithId[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Function to get the correct cart image (same logic as ProductDetail)
  const getCartImage = (productName: string): string => {
    const isMilafCola = productName.toLowerCase() === "milaf cola";
    return isMilafCola ? milafcola : getProductImage(productName);
  };

  // Function to get the correct price based on cases field
  const getCorrectPrice = async (item: any): Promise<number> => {
    // If item has cases=true, fetch casePrice from product data
    if (item.cases === true) {
      try {
        const productData = await fetchProductFromFirestore(item.name);
        if (productData && productData.casePrice) {
          return productData.casePrice;
        }
      } catch (error) {
        console.error('Error fetching case price for', item.name, error);
      }
    }
    // Otherwise use the regular price
    return item.price || 0;
  };

  // Load user cart and orders when component mounts
  const loadCartAndOrders = async () => {
    if (user) {
      // Load all cart types
      await Promise.all([
        loadRegularCart(),
        loadProductCart(),
        loadBulkCart()
      ]);
      
      // Load user orders
      setIsLoadingOrders(true);
      try {
        const userOrders = await getUserOrders(user.uid);
        setOrderedItems(userOrders);
      } catch (error) {
        console.error('Error loading user orders:', error);
      } finally {
        setIsLoadingOrders(false);
      }
    }
  };

  // Process cart items with correct pricing
  const [processedCartItems, setProcessedCartItems] = useState<any[]>([]);

  // Process cart items when they change
  useEffect(() => {
    const processCartItems = async () => {
      const allItems = [
        ...regularCartItems.map(item => ({ ...item, cartType: 'regular' })),
        ...productCartItems.map(item => ({ ...item, cartType: 'product' })),
        ...bulkCartItems.map(item => ({ ...item, cartType: 'bulk' }))
      ];

      // Process each item to get correct pricing
      const processedItems = await Promise.all(
        allItems.map(async (item) => {
          const correctPrice = await getCorrectPrice(item);
          return {
            ...item,
            price: correctPrice,
            originalPrice: item.price // Keep original price for reference
          };
        })
      );

      setProcessedCartItems(processedItems);
    };

    processCartItems();
  }, [regularCartItems, productCartItems, bulkCartItems]);

  return {
    cartItems: processedCartItems,
    orderedItems,
    isLoadingOrders,
    loadCartAndOrders,
    getCartImage
  };
};

// Alternative hook for specific cart types
export const useRegularCartFetcher = (): CartFetcherData => {
  const { user } = useAuth();
  const { cartItems, loadUserCart } = useCart();
  
  const [orderedItems, setOrderedItems] = useState<OrderWithId[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [processedCartItems, setProcessedCartItems] = useState<any[]>([]);

  const getCartImage = (productName: string): string => {
    const isMilafCola = productName.toLowerCase() === "milaf cola";
    return isMilafCola ? milafcola : getProductImage(productName);
  };

  // Function to get the correct price based on cases field
  const getCorrectPrice = async (item: any): Promise<number> => {
    // If item has cases=true, fetch casePrice from product data
    if (item.cases === true) {
      try {
        const productData = await fetchProductFromFirestore(item.name);
        if (productData && productData.casePrice) {
          return productData.casePrice;
        }
      } catch (error) {
        console.error('Error fetching case price for', item.name, error);
      }
    }
    // Otherwise use the regular price
    return item.price || 0;
  };

  // Process cart items with correct pricing
  useEffect(() => {
    const processCartItems = async () => {
      const processedItems = await Promise.all(
        cartItems.map(async (item) => {
          const correctPrice = await getCorrectPrice(item);
          return {
            ...item,
            price: correctPrice,
            originalPrice: item.price // Keep original price for reference
          };
        })
      );

      setProcessedCartItems(processedItems);
    };

    processCartItems();
  }, [cartItems]);

  const loadCartAndOrders = async () => {
    if (user) {
      await loadUserCart();
      
      setIsLoadingOrders(true);
      try {
        const userOrders = await getUserOrders(user.uid);
        setOrderedItems(userOrders);
      } catch (error) {
        console.error('Error loading user orders:', error);
      } finally {
        setIsLoadingOrders(false);
      }
    }
  };

  return {
    cartItems: processedCartItems,
    orderedItems,
    isLoadingOrders,
    loadCartAndOrders,
    getCartImage
  };
};

export const useProductCartFetcher = (): CartFetcherData => {
  const { user } = useAuth();
  const { cartItems, loadUserCart } = useProductCart();
  
  const [orderedItems, setOrderedItems] = useState<OrderWithId[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [processedCartItems, setProcessedCartItems] = useState<any[]>([]);

  const getCartImage = (productName: string): string => {
    const isMilafCola = productName.toLowerCase() === "milaf cola";
    return isMilafCola ? milafcola : getProductImage(productName);
  };

  // Function to get the correct price based on cases field
  const getCorrectPrice = async (item: any): Promise<number> => {
    // If item has cases=true, fetch casePrice from product data
    if (item.cases === true) {
      try {
        const productData = await fetchProductFromFirestore(item.name);
        if (productData && productData.casePrice) {
          return productData.casePrice;
        }
      } catch (error) {
        console.error('Error fetching case price for', item.name, error);
      }
    }
    // Otherwise use the regular price
    return item.price || 0;
  };

  // Process cart items with correct pricing
  useEffect(() => {
    const processCartItems = async () => {
      const processedItems = await Promise.all(
        cartItems.map(async (item) => {
          const correctPrice = await getCorrectPrice(item);
          return {
            ...item,
            price: correctPrice,
            originalPrice: item.price // Keep original price for reference
          };
        })
      );

      setProcessedCartItems(processedItems);
    };

    processCartItems();
  }, [cartItems]);

  const loadCartAndOrders = async () => {
    if (user) {
      await loadUserCart();
      
      setIsLoadingOrders(true);
      try {
        const userOrders = await getUserOrders(user.uid);
        setOrderedItems(userOrders);
      } catch (error) {
        console.error('Error loading user orders:', error);
      } finally {
        setIsLoadingOrders(false);
      }
    }
  };

  return {
    cartItems: processedCartItems,
    orderedItems,
    isLoadingOrders,
    loadCartAndOrders,
    getCartImage
  };
};

export const useBulkCartFetcher = (): CartFetcherData => {
  const { user } = useAuth();
  const { cartItems, loadUserCart } = useBulkCart();
  
  const [orderedItems, setOrderedItems] = useState<OrderWithId[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [processedCartItems, setProcessedCartItems] = useState<any[]>([]);

  const getCartImage = (productName: string): string => {
    const isMilafCola = productName.toLowerCase() === "milaf cola";
    return isMilafCola ? milafcola : getProductImage(productName);
  };

  // Function to get the correct price based on cases field
  const getCorrectPrice = async (item: any): Promise<number> => {
    // If item has cases=true, fetch casePrice from product data
    if (item.cases === true) {
      try {
        const productData = await fetchProductFromFirestore(item.name);
        if (productData && productData.casePrice) {
          return productData.casePrice;
        }
      } catch (error) {
        console.error('Error fetching case price for', item.name, error);
      }
    }
    // Otherwise use the regular price
    return item.price || 0;
  };

  // Process cart items with correct pricing
  useEffect(() => {
    const processCartItems = async () => {
      const processedItems = await Promise.all(
        cartItems.map(async (item) => {
          const correctPrice = await getCorrectPrice(item);
          return {
            ...item,
            price: correctPrice,
            originalPrice: item.price // Keep original price for reference
          };
        })
      );

      setProcessedCartItems(processedItems);
    };

    processCartItems();
  }, [cartItems]);

  const loadCartAndOrders = async () => {
    if (user) {
      await loadUserCart();
      
      setIsLoadingOrders(true);
      try {
        const userOrders = await getUserOrders(user.uid);
        setOrderedItems(userOrders);
      } catch (error) {
        console.error('Error loading user orders:', error);
      } finally {
        setIsLoadingOrders(false);
      }
    }
  };

  return {
    cartItems: processedCartItems,
    orderedItems,
    isLoadingOrders,
    loadCartAndOrders,
    getCartImage
  };
};
