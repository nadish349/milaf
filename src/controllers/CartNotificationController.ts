import { toast } from '@/components/ui/use-toast';

interface CartNotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
}

class CartNotificationController {
  private static instance: CartNotificationController;

  private constructor() {}

  public static getInstance(): CartNotificationController {
    if (!CartNotificationController.instance) {
      CartNotificationController.instance = new CartNotificationController();
    }
    return CartNotificationController.instance;
  }

  /**
   * Show success notification when item is added to cart
   */
  public showAddToCartSuccess(itemName: string, quantity: number, options?: CartNotificationOptions): void {
    toast({
      title: options?.title || "Added to Cart",
      description: options?.description || `${itemName} (${quantity} ${quantity === 1 ? 'item' : 'items'}) has been added to your cart.`,
      duration: options?.duration || 3000,
    });
  }

  /**
   * Show error notification for cart operations
   */
  public showCartError(message: string, options?: CartNotificationOptions): void {
    toast({
      title: options?.title || "Cart Error",
      description: options?.description || message,
      duration: options?.duration || 4000,
      variant: "destructive",
    });
  }

  /**
   * Show info notification for cart operations
   */
  public showCartInfo(message: string, options?: CartNotificationOptions): void {
    toast({
      title: options?.title || "Cart Info",
      description: options?.description || message,
      duration: options?.duration || 3000,
    });
  }

  /**
   * Show notification when item is removed from cart
   */
  public showRemoveFromCartSuccess(itemName: string, options?: CartNotificationOptions): void {
    toast({
      title: options?.title || "Removed from Cart",
      description: options?.description || `${itemName} has been removed from your cart.`,
      duration: options?.duration || 3000,
    });
  }

  /**
   * Show notification when cart is cleared
   */
  public showClearCartSuccess(options?: CartNotificationOptions): void {
    toast({
      title: options?.title || "Cart Cleared",
      description: options?.description || "All items have been removed from your cart.",
      duration: options?.duration || 3000,
    });
  }

  /**
   * Show notification when cart is updated
   */
  public showCartUpdated(itemName: string, newQuantity: number, options?: CartNotificationOptions): void {
    toast({
      title: options?.title || "Cart Updated",
      description: options?.description || `${itemName} quantity updated to ${newQuantity}.`,
      duration: options?.duration || 3000,
    });
  }
}

// Export singleton instance
export const cartNotificationController = CartNotificationController.getInstance();

// Export individual functions for convenience
export const showAddToCartSuccess = (itemName: string, quantity: number, options?: CartNotificationOptions) => 
  cartNotificationController.showAddToCartSuccess(itemName, quantity, options);

export const showCartError = (message: string, options?: CartNotificationOptions) => 
  cartNotificationController.showCartError(message, options);

export const showCartInfo = (message: string, options?: CartNotificationOptions) => 
  cartNotificationController.showCartInfo(message, options);

export const showRemoveFromCartSuccess = (itemName: string, options?: CartNotificationOptions) => 
  cartNotificationController.showRemoveFromCartSuccess(itemName, options);

export const showClearCartSuccess = (options?: CartNotificationOptions) => 
  cartNotificationController.showClearCartSuccess(options);

export const showCartUpdated = (itemName: string, newQuantity: number, options?: CartNotificationOptions) => 
  cartNotificationController.showCartUpdated(itemName, newQuantity, options);

// Export the class for advanced usage
export { CartNotificationController };
