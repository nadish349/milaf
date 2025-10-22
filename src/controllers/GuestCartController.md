# Guest Cart Controller

A comprehensive controller for managing guest cart operations without user authentication. This controller handles product addition, quantity management, and seamless merging with user carts after login.

## Features

- **LocalStorage/SessionStorage Support**: Choose between persistent or temporary storage
- **Smart Duplication Handling**: Prevents duplicate items, merges similar products
- **Cart Type Management**: Handles regular, product, and bulk cart types
- **Automatic Merge**: Seamlessly merges guest cart with user cart after login
- **Real-time Updates**: Reactive state management with listeners
- **Error Handling**: Comprehensive error handling and notifications

## Usage

### 1. Using the React Hook (Recommended)

```tsx
import { useGuestCart } from '@/hooks/useGuestCart';

const MyComponent = () => {
  const {
    cartItems,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    mergeWithUserCart,
    getTotalItems,
    getTotalPrice,
    isEmpty,
    hasItem,
    getItemQuantity,
    findItem,
    setStorageType
  } = useGuestCart();

  const handleAddToCart = () => {
    addToCart({
      name: "Milaf Cola",
      price: 4.99,
      quantity: 2,
      payment: false
    }, {
      preventDuplication: true,
      mergeSimilarItems: true,
      showNotification: true,
      cartType: 'regular',
      storageType: 'localStorage'
    });
  };

  return (
    <div>
      <button onClick={handleAddToCart}>Add to Guest Cart</button>
      <div>Items: {getTotalItems()}</div>
      <div>Total: ${getTotalPrice().toFixed(2)}</div>
    </div>
  );
};
```

### 2. Using Direct Controller Functions

```tsx
import { 
  addToGuestCart, 
  updateGuestCartQuantity, 
  removeFromGuestCart,
  clearGuestCart,
  getGuestCartItems,
  getGuestCartTotal,
  getGuestCartItemCount,
  mergeGuestCartWithUser
} from '@/controllers/GuestCartController';

// Add item to guest cart
addToGuestCart({
  name: "Milaf Cola",
  price: 4.99,
  quantity: 2,
  payment: false
}, {
  preventDuplication: true,
  mergeSimilarItems: true,
  showNotification: true,
  cartType: 'regular',
  storageType: 'localStorage'
});

// Update quantity
updateGuestCartQuantity('guest_1234567890_abc123', 3);

// Remove item
removeFromGuestCart('guest_1234567890_abc123');

// Clear cart
clearGuestCart();

// Get cart data
const items = getGuestCartItems();
const total = getGuestCartTotal();
const count = getGuestCartItemCount();
```

### 3. Using the Controller Instance

```tsx
import { guestCartController } from '@/controllers/GuestCartController';

// Set storage type
guestCartController.setStorageType('localStorage');

// Add item with full control
const result = guestCartController.addToCart({
  name: "Milaf Cola",
  price: 4.99,
  quantity: 2,
  payment: false
}, {
  preventDuplication: true,
  mergeSimilarItems: true,
  showNotification: true,
  cartType: 'regular',
  storageType: 'localStorage'
});

// Subscribe to changes
const unsubscribe = guestCartController.subscribe((items) => {
  console.log('Guest cart updated:', items);
});
```

## API Reference

### useGuestCart Hook

Returns an object with the following properties:

#### State
- `cartItems: GuestCartItem[]` - Current guest cart items
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message

#### Actions
- `addToCart(item, options?)` - Add item to guest cart
- `updateQuantity(itemId, quantity)` - Update item quantity
- `removeFromCart(itemId)` - Remove item from cart
- `clearCart()` - Clear entire guest cart
- `mergeWithUserCart()` - Merge with user cart after login

#### Getters
- `getTotalItems()` - Get total items count
- `getTotalPrice()` - Get total price
- `isEmpty()` - Check if cart is empty
- `hasItem(name, type?)` - Check if item exists
- `getItemQuantity(name, type?)` - Get item quantity
- `findItem(name, type?)` - Find item by name and type

#### Utilities
- `setStorageType(type)` - Set storage type
- `setError(error)` - Set error message

### GuestCartController

#### Methods

##### `addToCart(item, options)`
Add item to guest cart with smart duplication handling.

**Parameters:**
- `item: Omit<GuestCartItem, 'id' | 'addedAt'>` - Item to add
- `options: GuestCartOptions` - Configuration options

**Options:**
- `preventDuplication?: boolean` - Prevent duplicate items (default: true)
- `mergeSimilarItems?: boolean` - Merge similar items (default: true)
- `showNotification?: boolean` - Show notifications (default: true)
- `cartType?: 'regular' | 'product' | 'bulk'` - Cart type (default: 'regular')
- `storageType?: 'localStorage' | 'sessionStorage'` - Storage type (default: 'localStorage')

##### `updateQuantity(itemId, quantity)`
Update item quantity in guest cart.

##### `removeFromCart(itemId)`
Remove item from guest cart.

##### `clearCart()`
Clear entire guest cart.

##### `getCartItems()`
Get current guest cart items.

##### `getTotalItems()`
Get total items count.

##### `getTotalPrice()`
Get total price.

##### `isEmpty()`
Check if guest cart is empty.

##### `hasItem(name, type?)`
Check if item exists in guest cart.

##### `getItemQuantity(name, type?)`
Get item quantity.

##### `findItem(name, type?)`
Find item by name and type.

##### `mergeWithUserCart(userId, addToUserCart)`
Merge guest cart with user cart after login.

##### `setStorageType(type)`
Set storage type (localStorage or sessionStorage).

##### `subscribe(listener)`
Subscribe to guest cart changes.

## Storage Types

### localStorage (Default)
- **Persistent**: Survives browser restarts
- **Use Case**: Long-term guest cart storage
- **Key**: `milaf_guest_cart`

### sessionStorage
- **Temporary**: Cleared when browser tab closes
- **Use Case**: Session-only guest cart
- **Key**: `milaf_guest_cart_sessionStorage`

## Cart Types

### Regular Cart
- Standard product cart
- No special flags

### Product Cart
- Regular products with `pieces: true`
- Used for product-specific carts

### Bulk Cart
- Bulk orders with `cases: true`
- Used for wholesale/bulk purchases

## Duplication Handling

The controller provides smart duplication handling:

1. **Prevent Duplication**: If enabled, prevents adding duplicate items
2. **Merge Similar Items**: If enabled, merges similar items by increasing quantity
3. **Cart Type Conflicts**: Automatically clears cart when switching between cart types

## Integration Examples

### In Cart Contexts

The guest cart controller is integrated into cart contexts:

```tsx
// In CartContext.tsx
const {
  cartItems: guestCartItems,
  addToCart: guestAddToCart,
  updateQuantity: guestUpdateQuantity,
  removeFromCart: guestRemoveFromCart,
  clearCart: guestClearCart,
  getTotalItems: guestGetTotalItems,
  getTotalPrice: guestGetTotalPrice,
  isEmpty: guestIsEmpty,
  mergeWithUserCart
} = useGuestCart();

// Use appropriate cart based on user status
const isUserLoggedIn = !!user;
const currentCartItems = isUserLoggedIn ? controllerCartItems : guestCartItems;
```

### In Components

```tsx
import { useGuestCart } from '@/hooks/useGuestCart';

const ProductCard = ({ product }) => {
  const { addToCart, hasItem, getItemQuantity } = useGuestCart();
  
  const handleAddToCart = () => {
    addToCart({
      name: product.name,
      price: product.price,
      quantity: 1,
      payment: false
    });
  };

  const isInCart = hasItem(product.name);
  const quantity = getItemQuantity(product.name);

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      {isInCart ? (
        <p>In cart: {quantity}</p>
      ) : (
        <button onClick={handleAddToCart}>Add to Cart</button>
      )}
    </div>
  );
};
```

## Migration from Old System

The guest cart controller is designed to work alongside existing cart systems:

1. **Backward Compatibility**: Works with existing cart contexts
2. **Gradual Migration**: Can be adopted incrementally
3. **Seamless Integration**: Automatically handles user/guest states

## Example Migration

**Before:**
```tsx
const handleAddToCart = () => {
  if (!user) {
    addToGuestCart(item);
    loadGuestCart();
  } else {
    addToCart(item);
  }
};
```

**After:**
```tsx
const handleAddToCart = () => {
  // Controller automatically handles user/guest state
  addToCart(item);
};
```

## Error Handling

The controller provides comprehensive error handling:

- **Validation Errors**: Invalid item data
- **Storage Errors**: localStorage/sessionStorage issues
- **Merge Errors**: Failed cart merging
- **Network Errors**: API communication issues

## Performance Considerations

- **Efficient Storage**: Minimal localStorage usage
- **Reactive Updates**: Only updates when necessary
- **Memory Management**: Automatic cleanup of listeners
- **Batch Operations**: Efficient bulk operations

## Testing

The controller includes comprehensive testing:

```tsx
// Test guest cart operations
const result = await addToGuestCart({
  name: "Test Product",
  price: 10.00,
  quantity: 1,
  payment: false
});

expect(result.success).toBe(true);
expect(result.cartItems).toHaveLength(1);
```

## Best Practices

1. **Use React Hook**: Prefer `useGuestCart` hook for React components
2. **Handle Errors**: Always check operation results
3. **Storage Type**: Choose appropriate storage type for your use case
4. **Cart Types**: Use correct cart types for different product categories
5. **Merge Strategy**: Implement proper merge logic for user login



