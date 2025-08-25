import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { MilafPaymentForm } from "../components/MilafPaymentForm";
import m1 from "@/assets/m1.png";

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
}

export const Payment = (): JSX.Element => {
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<string>("");
  const [billingInfo, setBillingInfo] = useState({
    companyName: "",
    buyerName: "",
    address: ""
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const navigate = useNavigate();

  const handleGoBack = () => {
    window.history.back();
  };

  const handleInputChange = (field: string, value: string) => {
    setBillingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const deliveryOptions: DeliveryOption[] = [
    {
      id: "pickup",
      name: "Pick up from Warehouse",
      description: "Collect your order from our warehouse",
      estimatedDays: "Same day"
    },
    {
      id: "dhl",
      name: "DHL",
      description: "Express international shipping",
      estimatedDays: "2-3 business days"
    },
    {
      id: "mainfreight",
      name: "Mainfreight Logistics",
      description: "Reliable freight and logistics",
      estimatedDays: "3-5 business days"
    },
    {
      id: "australian-post",
      name: "Australian Post",
      description: "Standard domestic shipping",
      estimatedDays: "5-7 business days"
    }
  ];

  const handleProceedToPayment = () => {
    setShowPaymentForm(true);
  };

  const handleBackToForm = () => {
    setShowPaymentForm(false);
  };

  // If showing payment form, display only the payment form
  if (showPaymentForm) {
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
        
        <div className="pt-12 pb-4 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <button
              onClick={handleBackToForm}
              className="mb-2 w-8 h-8 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page Title */}
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-white mb-1">Payment Method</h1>
              <p className="text-white text-sm">Choose your preferred payment option</p>
            </div>

            {/* Payment Form */}
            <MilafPaymentForm />
          </div>
        </div>
      </div>
    );
  }

  // Show the billing and delivery form
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
          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="mb-2 w-8 h-8 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page Title */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-white mb-1">Payment Details</h1>
            <p className="text-white text-sm">Complete your order with billing and delivery information</p>
          </div>

          {/* 2-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            
            {/* Left Column - Billing Address Card */}
            <div className="bg-white rounded-xl shadow-lg p-3">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Billing Address</h2>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={billingInfo.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter company name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Buyer Name *
                  </label>
                  <input
                    type="text"
                    value={billingInfo.buyerName}
                    onChange={(e) => handleInputChange("buyerName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter buyer name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    value={billingInfo.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Enter complete address"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Delivery Options Card */}
            <div className="bg-white rounded-xl shadow-lg p-3">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Delivery Options</h2>
              
              <div className="space-y-2">
                {deliveryOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setSelectedDeliveryOption(option.id)}
                    className={`p-2 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedDeliveryOption === option.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedDeliveryOption === option.id
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300"
                          }`}>
                            {selectedDeliveryOption === option.id && (
                              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm">{option.name}</h3>
                            <p className="text-xs text-gray-600">{option.description}</p>
                            <p className="text-xs text-green-600 font-medium">Estimated: {option.estimatedDays}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Proceed to Payment Button */}
          <div className="flex justify-end">
            <button
              onClick={handleProceedToPayment}
              disabled={!billingInfo.companyName || !billingInfo.buyerName || !billingInfo.address || !selectedDeliveryOption}
              className="bg-green-400 hover:bg-green-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-black font-bold text-base py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg w-full lg:w-auto"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
