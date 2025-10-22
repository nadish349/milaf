import React, { useState } from 'react';
import { useCartController } from '@/hooks/useCartController';

/**
 * Example component demonstrating how to use the CartController
 * This shows how to integrate the controller into any component
 */
export const CartControllerExample: React.FC = () => {
  const {
    cartItems,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isEmpty,
    hasItem,
    getItemQuantity,
    findItem
  } = useCartController();

  const [productName, setProductName] = useState('Milaf Cola');
  const [productPrice, setProductPrice] = useState(4.99);
  const [productQuantity, setProductQuantity] = useState(1);
  const [cartType, setCartType] = useState<'regular' | 'product' | 'bulk'>('regular');

  const handleAddToCart = async () => {
    const item = {
      name: productName,
      price: productPrice,
      quantity: productQuantity,
      payment: false,
      ...(cartType === 'bulk' ? { cases: true } : cartType === 'product' ? { pieces: true } : {})
    };

    const result = await addToCart(item, {
      preventDuplication: true,
      mergeSimilarItems: true,
      showNotification: true,
      cartType
    });

    if (result.success) {
      console.log('✅ Item added successfully:', result.message);
    } else {
      console.error('❌ Failed to add item:', result.message);
    }
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    const result = await updateQuantity(itemId, newQuantity);
    if (result.success) {
      console.log('✅ Quantity updated:', result.message);
    } else {
      console.error('❌ Failed to update quantity:', result.message);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    const result = await removeFromCart(itemId);
    if (result.success) {
      console.log('✅ Item removed:', result.message);
    } else {
      console.error('❌ Failed to remove item:', result.message);
    }
  };

  const handleClearCart = async () => {
    const result = await clearCart();
    if (result.success) {
      console.log('✅ Cart cleared:', result.message);
    } else {
      console.error('❌ Failed to clear cart:', result.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Cart Controller Example</h1>
      
      {/* Add Product Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Add Product to Cart</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              value={productPrice}
              onChange={(e) => setProductPrice(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={productQuantity}
              onChange={(e) => setProductQuantity(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cart Type
            </label>
            <select
              value={cartType}
              onChange={(e) => setCartType(e.target.value as 'regular' | 'product' | 'bulk')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="regular">Regular</option>
              <option value="product">Product</option>
              <option value="bulk">Bulk</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Cart Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Cart Summary</h2>
          <div className="text-lg font-bold text-green-600">
            Total: ${getTotalPrice().toFixed(2)} ({getTotalItems()} items)
          </div>
        </div>
        
        {isEmpty() ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🛒</div>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)} each
                    {item.cases && ' (Bulk)'}
                    {item.pieces && ' (Product)'}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                  >
                    -
                  </button>
                  
                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-right ml-4">
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
        
        {!isEmpty() && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleClearCart}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>

      {/* Cart State Debug */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Cart State Debug</h3>
        <div className="text-sm space-y-1">
          <p><strong>Total Items:</strong> {getTotalItems()}</p>
          <p><strong>Total Price:</strong> ${getTotalPrice().toFixed(2)}</p>
          <p><strong>Is Empty:</strong> {isEmpty() ? 'Yes' : 'No'}</p>
          <p><strong>Has Milaf Cola:</strong> {hasItem('Milaf Cola') ? 'Yes' : 'No'}</p>
          <p><strong>Milaf Cola Quantity:</strong> {getItemQuantity('Milaf Cola')}</p>
        </div>
      </div>
    </div>
  );
};



