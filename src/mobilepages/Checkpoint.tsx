import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../mobilecomponents/Header";
import { useCart } from "@/mobilecontexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import m1 from "@/assets/m1.png";

export const Checkpoint = (): JSX.Element => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [billingAddress, setBillingAddress] = useState<any>(null);
  const [shippingMode, setShippingMode] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<string>("");

  useEffect(() => {
    // Get shipping cost from localStorage or calculate it
    const savedShipping = localStorage.getItem('lastShippingCost');
    if (savedShipping) {
      setShippingCost(parseFloat(savedShipping));
    }

    // Get billing address and shipping mode from localStorage
    const savedBillingAddress = localStorage.getItem('billingAddress');
    if (savedBillingAddress) {
      setBillingAddress(JSON.parse(savedBillingAddress));
    }

    const savedShippingMode = localStorage.getItem('shippingMode');
    if (savedShippingMode) {
      setShippingMode(savedShippingMode);
    }

    const savedDeliveryTime = localStorage.getItem('deliveryTime');
    if (savedDeliveryTime) {
      setDeliveryTime(savedDeliveryTime);
    }

    // Simulate order processing
    const timer = setTimeout(() => {
      setOrderStatus('success');
      const itemsTotal = getTotalPrice();
      const finalTotal = itemsTotal + shippingCost;
      
      setOrderDetails({
        orderId: `ORD-${Date.now()}`,
        paymentId: `PAY-${Date.now()}`,
        itemsTotal: itemsTotal,
        shippingCost: shippingCost,
        totalAmount: finalTotal,
        timestamp: new Date().toISOString()
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [shippingCost]);

  const handleContinueShopping = () => {
    clearCart();
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const handlePrintOrder = () => {
    if (!orderDetails || !billingAddress) return;
    
    const buyerName = billingAddress.buyerName || 'Customer';
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
    const fileName = `Order Details - ${buyerName} ${formattedDate}`;
    
    // Create a blob with the HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${fileName}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.6;
            color: #333;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #10B981; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          .company-name { 
            font-size: 24px; 
            font-weight: bold; 
            color: #10B981; 
            margin-bottom: 10px;
          }
          .order-title { 
            font-size: 18px; 
            color: #666; 
          }
          .section { 
            margin-bottom: 25px; 
            padding: 15px; 
            border: 1px solid #ddd; 
            border-radius: 8px;
          }
          .section h3 { 
            color: #10B981; 
            margin-bottom: 15px; 
            font-size: 16px;
          }
          .info-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 8px; 
            padding: 5px 0;
          }
          .info-row:not(:last-child) { 
            border-bottom: 1px solid #eee; 
          }
          .label { 
            font-weight: bold; 
            color: #555; 
          }
          .value { 
            color: #333; 
          }
          .items-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px;
          }
          .items-table th, .items-table td { 
            padding: 8px; 
            text-align: left; 
            border-bottom: 1px solid #ddd;
          }
          .items-table th { 
            background-color: #f8f9fa; 
            font-weight: bold;
          }
          .total-section { 
            background-color: #f8f9fa; 
            padding: 15px; 
            border-radius: 8px; 
            margin-top: 20px;
          }
          .total-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 8px; 
            font-size: 14px;
          }
          .final-total { 
            font-size: 18px; 
            font-weight: bold; 
            color: #10B981; 
            border-top: 2px solid #10B981; 
            padding-top: 10px; 
            margin-top: 10px;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #ddd; 
            color: #666; 
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">Milaf Cola Australia & NZ</div>
          <div class="order-title">Order Details - ${buyerName} ${formattedDate}</div>
        </div>

        <div class="section">
          <h3>Order Information</h3>
          <div class="info-row">
            <span class="label">Order ID:</span>
            <span class="value">${orderDetails.orderId}</span>
          </div>
          <div class="info-row">
            <span class="label">Payment ID:</span>
            <span class="value">${orderDetails.paymentId}</span>
          </div>
          <div class="info-row">
            <span class="label">Order Date:</span>
            <span class="value">${new Date(orderDetails.timestamp).toLocaleDateString()}</span>
          </div>
          <div class="info-row">
            <span class="label">Order Time:</span>
            <span class="value">${new Date(orderDetails.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>

        ${billingAddress ? `
        <div class="section">
          <h3>Billing Address</h3>
          ${billingAddress.companyName ? `
          <div class="info-row">
            <span class="label">Company:</span>
            <span class="value">${billingAddress.companyName}</span>
          </div>
          ` : ''}
          <div class="info-row">
            <span class="label">Name:</span>
            <span class="value">${billingAddress.buyerName}</span>
          </div>
          <div class="info-row">
            <span class="label">Contact:</span>
            <span class="value">${billingAddress.contact}</span>
          </div>
          <div class="info-row">
            <span class="label">Street Address:</span>
            <span class="value">${billingAddress.streetAddress}</span>
          </div>
          <div class="info-row">
            <span class="label">Address:</span>
            <span class="value">${billingAddress.address}</span>
          </div>
          <div class="info-row">
            <span class="label">Zip Code:</span>
            <span class="value">${billingAddress.zipcode}</span>
          </div>
        </div>
        ` : ''}

        ${shippingMode ? `
        <div class="section">
          <h3>Shipping Information</h3>
          <div class="info-row">
            <span class="label">Shipping Mode:</span>
            <span class="value">${shippingMode === 'pickup' ? 'Pick up from Warehouse' : 'Australian Post Delivery'}</span>
          </div>
          ${shippingMode === 'pickup' ? `
          <div class="info-row">
            <span class="label">Warehouse Address:</span>
            <span class="value">3/85 Alfred Street, Chipping Norton 2170 NSW Australia</span>
          </div>
          ` : ''}
          ${shippingMode === 'australian-post' && deliveryTime ? `
          <div class="info-row">
            <span class="label">Delivery Time:</span>
            <span class="value">${deliveryTime}</span>
          </div>
          ` : ''}
        </div>
        ` : ''}

        <div class="section">
          <h3>Order Items</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${cartItems.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity} ${item.cases ? 'Cases' : 'Units'}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="total-section">
          <h3>Order Summary</h3>
          <div class="total-row">
            <span>Items Total:</span>
            <span>$${orderDetails.itemsTotal.toFixed(2)}</span>
          </div>
          ${shippingCost > 0 ? `
          <div class="total-row">
            <span>Shipping:</span>
            <span>$${shippingCost.toFixed(2)}</span>
          </div>
          ` : ''}
          <div class="total-row final-total">
            <span>Total Amount:</span>
            <span>$${orderDetails.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for your order with Milaf Cola Australia & NZ</p>
          <p>For any queries, please contact our customer service</p>
        </div>
      </body>
      </html>
    `;

    // Create a blob and download the file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url(${m1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="pt-12 pb-4 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Order Processing</h1>
            <p className="text-white text-sm">Your payment is being processed</p>
          </div>

          {/* Processing Status */}
          {orderStatus === 'processing' && (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Processing Your Order</h2>
              <p className="text-gray-600">Please wait while we confirm your payment...</p>
            </div>
          )}

          {/* Success Status */}
          {orderStatus === 'success' && orderDetails && (
            <div className="space-y-4">
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-green-800 mb-2">Payment Successful!</h2>
                <p className="text-green-700">Your order has been confirmed and is being processed.</p>
              </div>

              {/* Order Details */}
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Order Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-semibold">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-semibold">{orderDetails.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-semibold">{new Date(orderDetails.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold text-green-600">${orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              {billingAddress && (
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Billing Address</h3>
                  <div className="space-y-2">
                    {billingAddress.companyName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company:</span>
                        <span className="font-semibold">{billingAddress.companyName}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-semibold">{billingAddress.buyerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-semibold">{billingAddress.contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Street Address:</span>
                      <span className="font-semibold">{billingAddress.streetAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-semibold">{billingAddress.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Zip Code:</span>
                      <span className="font-semibold">{billingAddress.zipcode}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Information */}
              {shippingMode && (
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Shipping Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping Mode:</span>
                      <span className="font-semibold">
                        {shippingMode === 'pickup' ? 'Pick up from Warehouse' : 'Australian Post Delivery'}
                      </span>
                    </div>
                    {shippingMode === 'pickup' && (
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">Warehouse Address:</p>
                        <p>3/85 Alfred Street</p>
                        <p>Chipping Norton 2170 NSW Australia</p>
                      </div>
                    )}
                    {shippingMode === 'australian-post' && (
                      <div className="text-sm text-gray-600">
                        <p>Standard domestic shipping via Australia Post</p>
                        {deliveryTime && (
                          <p>Delivery time: {deliveryTime}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {item.cases ? 'Cases' : 'Units'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total: ${orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Cases:</span>
                    <span className="font-medium">{cartItems.filter(item => item.cases).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Units:</span>
                    <span className="font-medium">{cartItems.filter(item => !item.cases).length}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handlePrintOrder}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 w-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Print Order Details</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleViewOrders}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
                  >
                    View My Orders
                  </button>
                  <button
                    onClick={handleContinueShopping}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>

              {/* Security Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Payment Secured</h4>
                    <p className="text-sm text-blue-700">Your payment has been processed securely through Razorpay. You will receive a confirmation email shortly.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
