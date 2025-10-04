import { BulkCartItem } from "@/contexts/BulkCartContext";

export const addBulkToCart = (
  productData: any,
  quantity: number,
  addToCart: (item: Omit<BulkCartItem, 'id'>) => void
): void => {
  const cartItem: Omit<BulkCartItem, 'id'> = {
    name: productData.name,
    price: productData.price,
    quantity: quantity,
    cases: true, // Always true for bulk orders
    payment: false,
    gradient: productData.gradient || "linear-gradient(135deg, #666, #999)"
  };

  addToCart(cartItem);
};

export const handleBulkAddToCart = (
  productData: any,
  quantity: number,
  addToCart: (item: Omit<BulkCartItem, 'id'>) => void,
  setShowNotification: (show: boolean) => void,
  setQuantity: (quantity: number) => void
): void => {
  if (!productData) return;

  addBulkToCart(productData, quantity, addToCart);
  
  // Show notification
  setShowNotification(true);
  
  // Reset quantity to 1 after adding to cart
  setQuantity(1);
};