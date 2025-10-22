import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useCart } from "@/contexts/CartContext";
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
            font-size: 20px; 
            color: #666; 
            margin-bottom: 5px;
          }
          .section { 
            margin-bottom: 25px; 
            border: 1px solid #ddd; 
            border-radius: 8px; 
            padding: 15px;
          }
          .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            color: #10B981; 
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          .detail-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 8px;
            padding: 5px 0;
          }
          .detail-label { 
            font-weight: 600; 
            color: #666;
          }
          .detail-value { 
            font-weight: bold;
          }
          .items-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px;
          }
          .items-table th, .items-table td { 
            border: 1px solid #ddd; 
            padding: 10px; 
            text-align: left;
          }
          .items-table th { 
            background-color: #f8f9fa; 
            font-weight: bold;
          }
          .total-section { 
            background-color: #f8f9fa; 
            padding: 15px; 
            border-radius: 5px; 
            margin-top: 15px;
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
            margin-top: 30px; 
            text-align: center; 
            color: #666; 
            font-size: 12px;
            border-top: 1px solid #eee;
            padding-top: 15px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">Milaf Cola Australia & NZ</div>
          <div class="order-title">Order Details - ${buyerName} ${formattedDate}</div>
        </div>

        <div class="section">
          <div class="section-title">Order Information</div>
          <div class="detail-row">
            <span class="detail-label">Order ID:</span>
            <span class="detail-value">${orderDetails.orderId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment ID:</span>
            <span class="detail-value">${orderDetails.paymentId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Order Date:</span>
            <span class="detail-value">${new Date(orderDetails.timestamp).toLocaleDateString()}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value" style="color: #10B981; font-weight: bold;">PAID</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Billing Address</div>
          ${billingAddress.companyName ? `<div class="detail-row"><span class="detail-label">Company:</span><span class="detail-value">${billingAddress.companyName}</span></div>` : ''}
          <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value">${billingAddress.buyerName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Contact:</span>
            <span class="detail-value">${billingAddress.contact}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Street Address:</span>
            <span class="detail-value">${billingAddress.streetAddress}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Address:</span>
            <span class="detail-value">${billingAddress.address}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Zip Code:</span>
            <span class="detail-value">${billingAddress.zipcode}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Shipping Information</div>
          <div class="detail-row">
            <span class="detail-label">Shipping Mode:</span>
            <span class="detail-value">${shippingMode === 'pickup' ? 'Pick up from Warehouse' : 'Australian Post Delivery'}</span>
          </div>
          ${shippingMode === 'pickup' ? `
            <div style="margin-top: 10px; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
              <strong>Warehouse Address:</strong><br>
              3/85 Alfred Street<br>
              Chipping Norton 2170 NSW Australia
            </div>
          ` : `
            <div style="margin-top: 10px; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
              <strong>Delivery Details:</strong><br>
              Standard domestic shipping via Australia Post<br>
              ${deliveryTime ? `Delivery time: ${deliveryTime}` : 'Delivery time: 5-7 business days'}
            </div>
          `}
        </div>

        <div class="section">
          <div class="section-title">Order Items</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity & Type</th>
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
          
          <div class="total-section">
            <div class="detail-row">
              <span class="detail-label">Items Total:</span>
              <span class="detail-value">$${orderDetails.itemsTotal.toFixed(2)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Shipping:</span>
              <span class="detail-value">$${orderDetails.shippingCost.toFixed(2)}</span>
            </div>
            <div class="detail-row final-total">
              <span class="detail-label">Total Amount:</span>
              <span class="detail-value">$${orderDetails.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Order Summary</div>
            <div class="detail-row">
              <span class="detail-label">Total Items:</span>
              <span class="detail-value">${cartItems.length}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Cases:</span>
              <span class="detail-value">${cartItems.filter(item => item.cases).length}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Units:</span>
              <span class="detail-value">${cartItems.filter(item => !item.cases).length}</span>
            </div>
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
      <Header />
      
      <div className="pt-16 pb-4 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/payment')}
            className="mb-4 w-8 h-8 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Checkpoint</h1>
              <p className="text-gray-600">Your payment is being processed</p>
            </div>

            {/* Status Indicator */}
            <div className="flex justify-center mb-8">
              {orderStatus === 'processing' && (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mb-4"></div>
                  <h2 className="text-xl font-semibold text-gray-700">Processing Payment...</h2>
                  <p className="text-gray-500">Please wait while we verify your payment</p>
                </div>
              )}
              
              {orderStatus === 'success' && (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h2>
                  <p className="text-gray-600">Your order has been confirmed</p>
                </div>
              )}
              
              {orderStatus === 'failed' && (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-red-600 mb-2">Payment Failed</h2>
                  <p className="text-gray-600">Please try again or contact support</p>
                </div>
              )}
            </div>

            {/* Order Details */}
            {orderDetails && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-semibold">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-semibold">{orderDetails.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items Total:</span>
                    <span className="font-semibold">${orderDetails.itemsTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-semibold">${orderDetails.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600 font-bold">Total Amount:</span>
                    <span className="font-bold text-lg">${orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-semibold">{new Date(orderDetails.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Address */}
            {billingAddress && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Billing Address</h3>
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

            {/* Shipping Mode */}
            {shippingMode && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Information</h3>
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

            {/* Order Items Summary */}
            {cartItems.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <div className="text-gray-500 text-sm">
                          <span className="mr-2">x{item.quantity}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {item.cases ? 'Cases' : 'Units'}
                          </span>
                        </div>
                      </div>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Order Summary by Type */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">Order Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Total Items:</span>
                      <span className="font-medium">{cartItems.length}</span>
                    </div>
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
              </div>
            )}

            {/* Action Buttons */}
            {orderStatus === 'success' && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handlePrintOrder}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Print Order Details</span>
                </button>
                <button
                  onClick={handleViewOrders}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                >
                  View My Orders
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                >
                  Continue Shopping
                </button>
              </div>
            )}

            {orderStatus === 'failed' && (
              <div className="flex justify-center">
                <button
                  onClick={() => navigate('/payment')}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                >
                  Try Payment Again
                </button>
              </div>
            )}

            {/* Security Notice */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold">Secure Payment</span>
              </div>
              <p className="text-xs text-gray-500">
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
