import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const MilafPaymentForm = (): JSX.Element => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("stripe");

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const renderQRCode = (method: string) => {
    const qrColors = {
      paypal: "from-blue-500 to-blue-600",
      razorpay: "from-purple-500 to-purple-600"
    };

    return (
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className={`w-32 h-32 bg-gradient-to-br ${qrColors[method as keyof typeof qrColors]} rounded-lg flex items-center justify-center shadow-lg`}>
            <div className="grid grid-cols-8 gap-0.5 w-24 h-24">
              {/* Generate a fake QR pattern */}
              {Array.from({ length: 64 }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-sm ${
                    Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-800">
            {method === 'paypal' ? 'PayPal QR Code' : 'Razorpay QR Code'}
          </h3>
          <p className="text-sm text-gray-600">
            Scan this QR code with your {method === 'paypal' ? 'PayPal' : 'Razorpay'} app to complete payment
          </p>
          <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
            Amount: $24.99 | Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>
        </div>
        <Button 
          onClick={() => setSelectedPaymentMethod("stripe")}
          variant="outline"
          className="w-full h-10"
        >
          ← Back to Payment Methods
        </Button>
      </div>
    );
  };

  const renderCreditCardForm = () => (
    <>
      {/* Enhanced Separator */}
      <div className="flex items-center text-gray-500">
        <hr className="flex-grow border-t border-gray-300" />
        <div className="mx-3 text-center">
          <div className="text-xs font-medium">or pay using credit card</div>
          <div className="text-xs text-gray-400 mt-0.5">🔒 SSL Encrypted</div>
        </div>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      {/* Credit Card Form */}
      <div className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="cardholder-name" className="text-xs font-semibold text-gray-700">
            Card holder full name
          </Label>
          <Input 
            id="cardholder-name" 
            name="cardholderName" 
            placeholder="Enter your full name"
            className="h-8 border-gray-300 focus:border-green-500 focus:ring-green-500/20 text-sm"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="card-number" className="text-xs font-semibold text-gray-700">
            Card Number
          </Label>
          <div className="relative">
            <Input
              id="card-number"
              name="cardNumber"
              placeholder="0000 0000 0000 0000"
              inputMode="numeric"
              className="h-8 border-gray-300 focus:border-green-500 focus:ring-green-500/20 pr-10 text-sm"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="flex space-x-0.5">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="expiry" className="text-xs font-semibold text-gray-700">
            Expiry Date / CVV
          </Label>
          <div className="flex gap-2">
            <Input
              id="expiry"
              name="expiryDate"
              placeholder="MM/YY"
              className="h-8 border-gray-300 focus:border-green-500 focus:ring-green-500/20 text-sm"
            />
            <Input
              id="cvv"
              name="cvv"
              placeholder="CVV"
              inputMode="numeric"
              type="password"
              className="h-8 border-gray-300 focus:border-green-500 focus:ring-green-500/20 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
        <div className="flex items-start space-x-2">
          <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-xs text-blue-800">
            <div className="font-semibold mb-0.5">Bank-level Security</div>
            <div className="text-blue-700">Your payment is protected by 256-bit SSL encryption and PCI DSS compliance</div>
          </div>
        </div>
      </div>

      {/* Enhanced Checkout Button */}
      <Button className="w-full h-10 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-base rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-0">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Confirm & Pay
      </Button>
    </>
  );

  return (
    <div className="flex items-center justify-center p-2">
      <Card className="max-w-sm w-full rounded-xl shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-4 space-y-3">
          {/* Header with Security Badge */}
          <div className="text-center mb-3">
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-left">
                <h2 className="text-lg font-bold text-gray-800">Secure Checkout</h2>
                <p className="text-xs text-gray-600">Your payment information is encrypted and secure</p>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant={selectedPaymentMethod === "stripe" ? "default" : "outline"}
              onClick={() => handlePaymentMethodSelect("stripe")}
              className={`h-12 p-0 flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                selectedPaymentMethod === "stripe" 
                  ? "bg-green-500 text-white border-green-500" 
                  : "hover:border-green-500 hover:bg-green-50"
              }`}
            >
              <span className="text-xl">💳</span>
              <span className="text-xs font-medium">Stripe</span>
            </Button>
            <Button 
              variant={selectedPaymentMethod === "paypal" ? "default" : "outline"}
              onClick={() => handlePaymentMethodSelect("paypal")}
              className={`h-12 p-0 flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                selectedPaymentMethod === "paypal" 
                  ? "bg-blue-500 text-white border-blue-500" 
                  : "hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              <span className="text-xl">🔵</span>
              <span className="text-xs font-medium">PayPal</span>
            </Button>
            <Button 
              variant={selectedPaymentMethod === "razorpay" ? "default" : "outline"}
              onClick={() => handlePaymentMethodSelect("razorpay")}
              className={`h-12 p-0 flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                selectedPaymentMethod === "razorpay" 
                  ? "bg-purple-500 text-white border-purple-500" 
                  : "hover:border-purple-500 hover:bg-purple-50"
              }`}
            >
              <span className="text-xl">⚡</span>
              <span className="text-xs font-medium">Razorpay</span>
            </Button>
          </div>

          {/* Conditional Content */}
          {selectedPaymentMethod === "stripe" ? (
            renderCreditCardForm()
          ) : (
            renderQRCode(selectedPaymentMethod)
          )}

          {/* Additional Security Info */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>SSL Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>PCI DSS</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span>Encrypted</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
