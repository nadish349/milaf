import { 
  cartNotificationController, 
  showAddToCartSuccess, 
  showCartError, 
  showCartInfo 
} from '../CartNotificationController';

// Mock the toast function
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn()
}));

describe('CartNotificationController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('showAddToCartSuccess', () => {
    it('should show success notification with correct message', () => {
      const itemName = 'Milaf Cola';
      const quantity = 2;
      
      showAddToCartSuccess(itemName, quantity);
      
      const state = cartNotificationController.getNotificationState();
      expect(state.isVisible).toBe(true);
      expect(state.message).toBe('2 Milaf Colas added to cart!');
      expect(state.type).toBe('success');
    });

    it('should handle singular item names correctly', () => {
      const itemName = 'Milaf Cola';
      const quantity = 1;
      
      showAddToCartSuccess(itemName, quantity);
      
      const state = cartNotificationController.getNotificationState();
      expect(state.message).toBe('Milaf Cola added to cart!');
    });
  });

  describe('showCartError', () => {
    it('should show error notification with custom message', () => {
      const errorMessage = 'Failed to add item to cart';
      
      showCartError(errorMessage);
      
      const state = cartNotificationController.getNotificationState();
      expect(state.isVisible).toBe(true);
      expect(state.message).toBe(errorMessage);
      expect(state.type).toBe('error');
    });
  });

  describe('showCartInfo', () => {
    it('should show info notification with custom message', () => {
      const infoMessage = 'Cart updated successfully';
      
      showCartInfo(infoMessage);
      
      const state = cartNotificationController.getNotificationState();
      expect(state.isVisible).toBe(true);
      expect(state.message).toBe(infoMessage);
      expect(state.type).toBe('info');
    });
  });

  describe('hideNotification', () => {
    it('should hide the current notification', () => {
      showAddToCartSuccess('Test Item', 1);
      expect(cartNotificationController.getNotificationState().isVisible).toBe(true);
      
      cartNotificationController.hideNotification();
      
      const state = cartNotificationController.getNotificationState();
      expect(state.isVisible).toBe(false);
      expect(state.message).toBe('');
    });
  });

  describe('subscription system', () => {
    it('should notify subscribers when state changes', () => {
      const mockListener = jest.fn();
      const unsubscribe = cartNotificationController.subscribe(mockListener);
      
      showAddToCartSuccess('Test Item', 1);
      
      expect(mockListener).toHaveBeenCalledWith({
        isVisible: true,
        message: 'Test Item added to cart!',
        type: 'success'
      });
      
      unsubscribe();
    });

    it('should not notify after unsubscribing', () => {
      const mockListener = jest.fn();
      const unsubscribe = cartNotificationController.subscribe(mockListener);
      unsubscribe();
      
      showAddToCartSuccess('Test Item', 1);
      
      expect(mockListener).not.toHaveBeenCalled();
    });
  });

  describe('message building', () => {
    it('should build correct message for multiple items', () => {
      showAddToCartSuccess('Milaf Cola', 3);
      
      const state = cartNotificationController.getNotificationState();
      expect(state.message).toBe('3 Milaf Colas added to cart!');
    });

    it('should build correct message for single item', () => {
      showAddToCartSuccess('Milaf Cola', 1);
      
      const state = cartNotificationController.getNotificationState();
      expect(state.message).toBe('Milaf Cola added to cart!');
    });
  });
});


