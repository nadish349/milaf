import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { MilafPaymentForm } from "../components/MilafPaymentForm";
import m1 from "@/assets/m1.png";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

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
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<string>("");
  const [billingInfo, setBillingInfo] = useState({
    companyName: "",
    buyerName: "",
    contact: "",
    address: "",
    zipcode: ""
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

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
                    <textarea
                      value={billingInfo.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Enter complete address or use multi-sensor location above"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    value={billingInfo.zipcode}
                    onChange={(e) => handleInputChange("zipcode", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter zip code"
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
              disabled={!billingInfo.companyName || !billingInfo.buyerName || !billingInfo.contact || !billingInfo.address || !billingInfo.zipcode || !selectedDeliveryOption}
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
