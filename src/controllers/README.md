# Cart Notification Controller

A centralized controller for managing cart notifications throughout the application. This controller provides a unified way to show success, error, and info notifications when items are added to the cart.

## Features

- **Centralized Management**: Single source of truth for all cart notifications
- **Multiple Notification Types**: Support for success, error, and info notifications
- **Toast Integration**: Automatically shows toast notifications using the existing toast system
- **React Hook**: Easy integration with React components
- **Backward Compatibility**: Works alongside existing notification systems

## Usage

### 1. Using the React Hook (Recommended)

```tsx
import { useCartNotification } from '@/hooks/useCartNotification';

const MyComponent = () => {
  const {
    isVisible,
    message,
    type,
    showAddToCartSuccess,
    showCartError,
    showCartInfo,
    hideNotification
  } = useCartNotification();

  const handleAddToCart = () => {
    // Your cart logic here
    showAddToCartSuccess("Milaf Cola", 2);
  };

  return (
    <div>
      <button onClick={handleAddToCart}>Add to Cart</button>
      {isVisible && <div>Notification: {message}</div>}
    </div>
  );
};
```

### 2. Using Direct Controller Functions

```tsx
import { 
  showAddToCartSuccess, 
  showCartError, 
  showCartInfo 
} from '@/controllers/CartNotificationController';

// Show success notification
showAddToCartSuccess("Milaf Cola", 2);

// Show error notification
showCartError("Failed to add item to cart");

// Show info notification
showCartInfo("Cart updated successfully");
```

### 3. Using the Controller Instance

```tsx
import { cartNotificationController } from '@/controllers/CartNotificationController';

// Show custom notification
cartNotificationController.showNotification({
  itemName: "Milaf Cola",
  quantity: 2,
  type: 'success',
  duration: 3000,
  showCartCount: true
});
```

## API Reference

### useCartNotification Hook

Returns an object with the following properties:

#### State
- `isVisible: boolean` - Whether notification is currently visible
- `message: string` - Current notification message
- `type: 'success' | 'error' | 'info'` - Current notification type

#### Actions
- `showAddToCartSuccess(itemName: string, quantity: number)` - Show success notification for adding item to cart
- `showCartError(message: string)` - Show error notification
- `showCartInfo(message: string)` - Show info notification
- `hideNotification()` - Hide current notification

### CartNotificationController

#### Methods

##### `showNotification(options: CartNotificationOptions)`
Show a custom notification with full control over options.

**Options:**
- `itemName: string` - Name of the item
- `quantity: number` - Quantity being added
- `type?: 'success' | 'error' | 'info'` - Notification type (default: 'success')
- `duration?: number` - Auto-hide duration in ms (default: 3000)
- `showCartCount?: boolean` - Whether to show cart count (default: true)

##### `showAddToCartSuccess(itemName: string, quantity: number)`
Show success notification for adding item to cart.

##### `showCartError(message: string)`
Show error notification with custom message.

##### `showCartInfo(message: string)`
Show info notification with custom message.

##### `hideNotification()`
Hide the current notification.

##### `getNotificationState(): CartNotificationState`
Get current notification state.

##### `subscribe(listener: (state: CartNotificationState) => void): () => void`
Subscribe to notification state changes. Returns unsubscribe function.

## Integration Examples

### In Cart Contexts

The controller is already integrated into the following cart contexts:
- `src/contexts/CartContext.tsx`
- `src/mobilecontexts/CartContext.tsx`
- `src/contexts/ProductCartContext.tsx`

### In Cart Services

The controller is integrated into:
- `src/services/productCartPlacer.ts`
- `src/services/bulkCartPlacer.ts`

### In Components

You can use the hook in any component:

```tsx
import { useCartNotification } from '@/hooks/useCartNotification';

const ProductCard = ({ product }) => {
  const { showAddToCartSuccess } = useCartNotification();
  
  const handleAddToCart = () => {
    // Add to cart logic
    addToCart(product);
    showAddToCartSuccess(product.name, 1);
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
};
```

## Notification Types

### Success Notifications
- Green background
- Checkmark icon
- Used for successful cart operations

### Error Notifications
- Red background
- Used for failed cart operations
- Shows error messages

### Info Notifications
- Blue background
- Used for informational messages
- Cart updates, warnings, etc.

## Customization

The controller uses the existing toast system, so notifications will follow your app's toast styling. You can customize the appearance by modifying the toast components in:
- `src/components/ui/toast.tsx`
- `src/mobilecomponents/ui/toast.tsx`

## Migration from Old System

The controller is designed to work alongside existing notification systems. You can gradually migrate by:

1. Keep existing `setShowNotification(true)` calls for backward compatibility
2. Add controller calls for enhanced notifications
3. Eventually remove old notification systems

## Example Migration

**Before:**
```tsx
const handleAddToCart = () => {
  addToCart(item);
  setShowNotification(true);
};
```

**After:**
```tsx
const handleAddToCart = () => {
  addToCart(item);
  setShowNotification(true); // Keep for backward compatibility
  showAddToCartSuccess(item.name, item.quantity); // Add controller
};
```

**Fully Migrated:**
```tsx
const handleAddToCart = () => {
  addToCart(item);
  // Controller handles notifications automatically
};
```


