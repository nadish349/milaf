import { ProductCartItem } from "@/contexts/ProductCartContext";

export const addProductToCart = (
  productData: any,
  quantity: number,
  addToCart: (item: Omit<ProductCartItem, 'id'>) => void
): void => {
  const cartItem: Omit<ProductCartItem, 'id'> = {
    name: productData.name,
    price: productData.price,
    quantity: quantity,
    pieces: true, // Always true for regular product orders
    payment: false,
    gradient: productData.gradient || "linear-gradient(135deg, #666, #999)"
  };

  addToCart(cartItem);
};

export const handleProductAddToCart = (
  productData: any,
  quantity: number,
  addToCart: (item: Omit<ProductCartItem, 'id'>) => void,
  setShowNotification: (show: boolean) => void,
  setQuantity: (quantity: number) => void
): void => {
  if (!productData) return;

  addProductToCart(productData, quantity, addToCart);
  
  // Show notification
  setShowNotification(true);
  
  // Reset quantity to 1 after adding to cart
  setQuantity(1);
};
