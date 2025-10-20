import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { MilafPaymentForm } from "../components/MilafPaymentForm";
import { AddressAutocomplete } from "../components/AddressAutocomplete";
import { useCart } from "@/contexts/CartContext";
import { getProductImage } from "@/utils/productImages";
import m1 from "@/assets/m1.png";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { PostalCodeSuggestion } from "@/utils/postalCodeService";
import { getAusPostServicesUrl, getAusPostCalcUrl, API_CONFIG, isBackendAvailable } from "../config/api";

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
}

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  address: string;
  zipcode: string;
  profileComplete: boolean;
}

export const Payment = (): JSX.Element => {
  const { cartItems, getTotalPrice, getTotalItems } = useCart();
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<string>("");
  const [billingInfo, setBillingInfo] = useState({
    companyName: "",
    buyerName: "",
    contact: "",
    streetAddress: "",
    address: "",
    zipcode: ""
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string>("");
  const [auspostServices, setAuspostServices] = useState<any[]>([]);
  const [auspostQuote, setAuspostQuote] = useState<any | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string>("");

  const navigate = useNavigate();

  // Load user data on component mount
  useEffect(() => {
    if (auth.currentUser) {
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser!.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        setBillingInfo(prev => ({
          ...prev,
          buyerName: userData.displayName || "",
          contact: userData.phone || "",
          streetAddress: userData.streetAddress || "",
          address: userData.address || "",
          zipcode: userData.zipcode || ""
        }));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleInputChange = (field: string, value: string) => {
    setBillingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Auto-fetch Australia Post services and quote when selected and zipcode is available
  useEffect(() => {
    const fetchShipping = async () => {
      if (selectedDeliveryOption !== 'australian-post') {
        setAuspostServices([]);
        setAuspostQuote(null);
        setShippingError("");
        return;
      }
      if (!billingInfo.zipcode) return;

      try {
        setIsLoadingShipping(true);
        setShippingError("");

        // Check if backend is available
        if (!isBackendAvailable()) {
          setShippingError("Backend service is not available. Please contact support or try again later.");
          return;
        }

        // Fetch services using user's zipcode as to_postcode; server uses 2170 as from_postcode and fixed parcel dims
        const servicesRes = await fetch(getAusPostServicesUrl(billingInfo.zipcode));
        const servicesJson = await servicesRes.json();
        const services = servicesJson?.services?.service || [];
        setAuspostServices(services);

        if (!Array.isArray(services) || services.length === 0) {
          setAuspostQuote(null);
          setShippingError('No Australia Post services available for this postcode.');
          return;
        }

        // Pick cheapest service by price
        let cheapest = services[0];
        for (const s of services) {
          const p = Number(s.price);
          const pc = Number(cheapest.price);
          if (!isNaN(p) && (isNaN(pc) || p < pc)) cheapest = s;
        }

        // Calculate quote for selected service
        const calcRes = await fetch(getAusPostCalcUrl(billingInfo.zipcode, cheapest.code));
        const calcJson = await calcRes.json();
        if (calcJson?.error) {
          setAuspostQuote(null);
          setShippingError(calcJson.error);
        } else {
          setAuspostQuote(calcJson?.postage_result || null);
          // Save shipping cost and delivery time to localStorage for use in Checkpoint page
          if (calcJson?.postage_result?.total_cost) {
            localStorage.setItem('lastShippingCost', calcJson.postage_result.total_cost);
          }
          if (calcJson?.postage_result?.delivery_time) {
            localStorage.setItem('deliveryTime', calcJson.postage_result.delivery_time);
          }
        }
      } catch (e: any) {
        setShippingError(e?.message || 'Failed to fetch Australia Post quote.');
        setAuspostQuote(null);
      } finally {
        setIsLoadingShipping(false);
      }
    };

    fetchShipping();
  }, [selectedDeliveryOption, billingInfo.zipcode]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoadingLocation(true);
    
    // Try multiple positioning methods for maximum accuracy
    const positionOptions = {
      enableHighAccuracy: true,    // Use GPS, Wi-Fi, cellular, and other sensors
      timeout: 20000,              // 20 seconds for comprehensive positioning
      maximumAge: 0                // Don't use cached position
    };

    // First try with high accuracy and multiple sensors
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy, altitude, heading, speed } = position.coords;
          
          console.log(`Multi-Sensor Location: ${latitude}, ${longitude}`);
          console.log(`Accuracy: ${accuracy}m, Altitude: ${altitude}m`);
          console.log(`Heading: ${heading}°, Speed: ${speed}m/s`);
          
          // Use enhanced geocoding with multiple services for maximum accuracy
          let address = "";
          let bestAddress = "";
          
          try {
            // Primary: OpenStreetMap with maximum detail
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18&extratags=1&namedetails=1&accept-language=en`
            );
            
            if (response.ok) {
              const data = await response.json();
              address = data.display_name;
              bestAddress = address;
              
              // If we have altitude data, try to get even more precise address
              if (altitude !== null && altitude !== undefined) {
                console.log(`Using altitude data for enhanced precision`);
                const altitudeResponse = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=19&extratags=1&namedetails=1&accept-language=en`
                );
                
                if (altitudeResponse.ok) {
                  const altitudeData = await altitudeResponse.json();
                  if (altitudeData.display_name && altitudeData.display_name.length > address.length) {
                    bestAddress = altitudeData.display_name;
                  }
                }
              }
            }
          } catch (error) {
            console.error("Error with primary geocoding service:", error);
          }
          
          if (bestAddress) {
            setBillingInfo(prev => ({
              ...prev,
              address: bestAddress
            }));
            
            // Enhanced accuracy feedback with multi-sensor information
            let accuracyMessage = "";
            let sensorInfo = "";
            
            if (accuracy <= 5) {
              accuracyMessage = "Ultra-High Accuracy Multi-Sensor";
              sensorInfo = "GPS + Wi-Fi + Cellular + Sensors";
            } else if (accuracy <= 10) {
              accuracyMessage = "High Accuracy Multi-Sensor";
              sensorInfo = "GPS + Wi-Fi + Cellular";
            } else if (accuracy <= 25) {
              accuracyMessage = "Good Accuracy Multi-Sensor";
              sensorInfo = "GPS + Wi-Fi";
            } else if (accuracy <= 50) {
              accuracyMessage = "Moderate Accuracy Multi-Sensor";
              sensorInfo = "GPS + Cellular";
            } else {
              accuracyMessage = "Basic GPS Accuracy";
              sensorInfo = "GPS Only";
            }
            
            // Show comprehensive location information
            const locationInfo = `Location Retrieved Successfully!\n\n` +
                               `Accuracy: ${accuracyMessage}\n` +
                               `Precision: ${Math.round(accuracy)}m\n` +
                               `Sensors Used: ${sensorInfo}\n` +
                               `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\n` +
                               `Address: ${bestAddress.substring(0, 120)}${bestAddress.length > 120 ? '...' : ''}`;
            
            alert(locationInfo);
          } else {
            alert("Could not retrieve address from coordinates. Please enter manually.");
          }
        } catch (error) {
          console.error("Error getting address:", error);
          alert("Error retrieving address. Please enter manually.");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Multi-sensor geolocation error:", error);
        
        // Enhanced error messages with positioning method guidance
        let errorMessage = "Could not get your precise location. ";
        let suggestion = "";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Location permission denied.";
            suggestion = "\n\nTo enable precise location:\n" +
                       "1. Click the location icon in your browser\n" +
                       "2. Select 'Allow' for location access\n" +
                       "3. Enable GPS, Wi-Fi, and cellular location services";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information unavailable.";
            suggestion = "\n\nTry:\n" +
                       "1. Moving to an open area\n" +
                       "2. Enabling Wi-Fi and cellular data\n" +
                       "3. Waiting a few seconds for GPS lock";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            suggestion = "\n\nThis usually means:\n" +
                       "1. GPS is still acquiring satellites\n" +
                       "2. Wi-Fi positioning is slow\n" +
                       "3. Try again in a few seconds";
            break;
          default:
            errorMessage += "Unknown positioning error.";
            suggestion = "\n\nPlease try:\n" +
                       "1. Refreshing the page\n" +
                       "2. Checking your device location settings\n" +
                       "3. Entering address manually";
        }
        
        alert(errorMessage + suggestion);
        setIsLoadingLocation(false);
      },
      positionOptions
    );
  };

  const deliveryOptions: DeliveryOption[] = [
    {
      id: "pickup",
      name: "Pick up from Warehouse",
      description: "Collect your order from our warehouse",
      estimatedDays: "Same day"
    },
    {
      id: "australian-post",
      name: "Australian Post",
      description: "Standard domestic shipping",
      estimatedDays: ""
    }
  ];

  const handleProceedToPayment = async () => {
    try {
      setIsPaying(true);
      setPaymentError("");
      
      // Check if backend is available
      if (!isBackendAvailable()) {
        setPaymentError("Payment service is not available. Please contact support or try again later.");
        return;
      }
      
      const baseUrl = API_CONFIG.BASE_URL;
      // Get Firebase auth token
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        setPaymentError('Please log in to continue with payment');
        return;
      }

      // Save billing address and shipping mode to localStorage
      localStorage.setItem('billingAddress', JSON.stringify(billingInfo));
      localStorage.setItem('shippingMode', selectedDeliveryOption);

      // Load public key and create order on backend (server recomputes totals)
      const { loadRazorpay, getPublicKey, createOrder, verifyPayment } = await import('../services/paymentService');
      await loadRazorpay();
      const key = await getPublicKey(baseUrl);
      const order = await createOrder(baseUrl, token, { cartItems, zipcode: billingInfo.zipcode });

      // @ts-ignore
      const rzp = new window.Razorpay({
        key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Milaf Cola Australia & NZ',
        description: 'Order Payment',
        handler: async function (response: any) {
          try {
            await verifyPayment(baseUrl, token, response);
            alert('Payment successful!');
            // Navigate to checkpoint/confirmation page
            navigate('/checkpoint');
          } catch (e: any) {
            setPaymentError(e?.message || 'Verification failed');
          }
        },
        prefill: {
          name: billingInfo.buyerName,
          contact: billingInfo.contact,
        },
        notes: { zipcode: billingInfo.zipcode },
        theme: { color: '#10B981' },
      });
      rzp.open();
    } catch (e: any) {
      setPaymentError(e?.message || 'Payment initialization failed');
    } finally {
      setIsPaying(false);
    }
  };

  const handleBackToForm = () => {
    setShowPaymentForm(false);
  };


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
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={billingInfo.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter company name (optional)"
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
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={billingInfo.contact}
                    onChange={(e) => handleInputChange("contact", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter contact number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={billingInfo.streetAddress}
                    onChange={(e) => handleInputChange("streetAddress", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter street address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Address *
                  </label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={isLoadingLocation}
                      className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      {isLoadingLocation ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Getting Multi-Sensor Location...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Get Current Location</span>
                        </>
                      )}
                    </button>
                    <AddressAutocomplete
                      value={billingInfo.address}
                      onChange={(value) => handleInputChange("address", value)}
                      placeholder="Enter address, suburb, or city name"
                      fieldType="address"
                      required
                      onSuggestionSelect={(suggestion: PostalCodeSuggestion) => {
                        // Auto-fill zipcode when address is selected
                        setBillingInfo(prev => ({
                          ...prev,
                          zipcode: suggestion.postcode.toString()
                        }));
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Zip Code *
                  </label>
                  <AddressAutocomplete
                    value={billingInfo.zipcode}
                    onChange={(value) => handleInputChange("zipcode", value)}
                    placeholder="Enter zip code or suburb name"
                    fieldType="zipcode"
                    required
                    onSuggestionSelect={(suggestion: PostalCodeSuggestion) => {
                      // Auto-fill address when zipcode is selected
                      setBillingInfo(prev => ({
                        ...prev,
                        address: `${suggestion.suburb}, ${suggestion.state}`
                      }));
                    }}
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
                            {option.estimatedDays && (
                              <p className="text-xs text-green-600 font-medium">Estimated: {option.estimatedDays}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {option.id === 'australian-post' && selectedDeliveryOption === 'australian-post' && (
                      <div className="mt-2 p-2 rounded bg-white border border-dashed border-gray-300">
                        {isLoadingShipping ? (
                          <p className="text-xs text-gray-600">Fetching Australia Post rates…</p>
                        ) : shippingError ? (
                          <p className="text-xs text-red-600">{shippingError}</p>
                        ) : auspostQuote ? (
                          <div className="text-xs text-gray-700">
                            <div className="flex justify-between">
                              <span>Service</span>
                              <span className="font-semibold">{auspostQuote.service}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping</span>
                              <span className="font-semibold">${auspostQuote.total_cost}</span>
                            </div>
                            {auspostQuote.delivery_time && (
                              <div className="flex justify-between">
                                <span>Delivery Time</span>
                                <span className="font-semibold">{auspostQuote.delivery_time}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500">Enter your zip code to see shipping rates.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Factory Warehouse Location */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Warehouse Address</h3>
                <p className="text-xs text-gray-600 mb-2">Beverages will be dispatched from here</p>
                <div className="text-xs text-gray-600">
                  <p className="font-medium">Factory Warehouse Location</p>
                  <p>3/85 Alfred Street</p>
                  <p>Chipping Norton 2170 NSW Australia</p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>
                
                {cartItems.length === 0 ? (
                  <p className="text-xs text-gray-500">No items in cart</p>
                ) : (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Items</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    {selectedDeliveryOption === 'australian-post' && auspostQuote && (
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>Shipping</span>
                        <span>${auspostQuote.total_cost}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-2">
                      <span>Total</span>
                      <span>${(
                        getTotalPrice() + (selectedDeliveryOption === 'australian-post' && auspostQuote ? Number(auspostQuote.total_cost) || 0 : 0)
                      ).toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      * Final amount will be calculated with shipping at checkout
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Proceed to Payment Button */}
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={handleProceedToPayment}
              disabled={!billingInfo.buyerName || !billingInfo.contact || !billingInfo.streetAddress || !billingInfo.address || !billingInfo.zipcode || !selectedDeliveryOption || isPaying}
              className="bg-green-400 hover:bg-green-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-black font-bold text-base py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg w-full lg:w-auto"
            >
              {isPaying ? 'Processing Payment...' : 'Pay with Razorpay'}
            </button>
            {paymentError && (
              <div className="text-sm text-red-600 text-right">{paymentError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
