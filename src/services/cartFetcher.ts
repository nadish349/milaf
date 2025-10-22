import { useState, useEffect } from "react";
import { getUserOrders, OrderWithId } from "@/services/orderService";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { getProductImage } from "@/utils/productImages";
import { fetchProductFromFirestore } from "@/services/productService";
import { getOrderedItems } from "@/services/cartService";
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
  
  const [orderedItems, setOrderedItems] = useState<OrderWithId[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Function to get the correct cart image (same logic as ProductDetail)
  const getCartImage = (productName: string): string => {
    const isMilafCola = productName.toLowerCase() === "milaf cola";
    return isMilafCola ? milafcola : getProductImage(productName);
  };

  // Price cache to avoid repeated fetches
  const priceCache = new Map<string, number>();

  // Function to get the correct price based on cases field
  const getCorrectPrice = async (item: any): Promise<number> => {
    // If item has cases=true, fetch casePrice from product data
    if (item.cases === true) {
      const cacheKey = `${item.name}_case`;
      
      // Check cache first
      if (priceCache.has(cacheKey)) {
        return priceCache.get(cacheKey)!;
      }
      
      try {
        const productData = await fetchProductFromFirestore(item.name);
        if (productData && productData.casePrice) {
          // Cache the result
          priceCache.set(cacheKey, productData.casePrice);
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
      try {
        // Load only the main cart (now filters out paid items)
        await loadRegularCart();
        
        // Load user orders and cart ordered items
        setIsLoadingOrders(true);
        try {
          const [userOrders, cartOrderedItems] = await Promise.all([
            getUserOrders(user.uid),
            getOrderedItems(user.uid)
          ]);
          
          // Combine orders from both sources
          const combinedOrders = [...userOrders, ...cartOrderedItems.map(item => ({
            id: item.id,
            orderDate: item.paidAt || new Date(),
            status: 'confirmed',
            items: [{
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              cases: item.cases,
              pieces: item.pieces
            }],
            totalAmount: item.price * item.quantity
          }))];
          
          setOrderedItems(combinedOrders);
        } catch (error) {
          console.error('Error loading user orders:', error);
        } finally {
          setIsLoadingOrders(false);
        }
      } catch (error) {
        console.error('Error in loadCartAndOrders:', error);
      }
    }
  };

  // Process cart items with correct pricing
  const [processedCartItems, setProcessedCartItems] = useState<any[]>([]);

  // Process cart items when they change
  useEffect(() => {
    const processCartItems = async () => {
      const allItems = [
        ...regularCartItems.map(item => ({ ...item, cartType: 'regular' }))
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
  }, [regularCartItems]);

  return {
    cartItems: processedCartItems,
    orderedItems,
    isLoadingOrders,
    loadCartAndOrders,
    getCartImage
  };
};