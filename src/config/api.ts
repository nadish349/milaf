/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Get the base URL for API calls
// In production, this should be your deployed backend URL
// For development, use localhost
const getApiBaseUrl = (): string => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    return 'http://localhost:4000';
  }
  
  // In production, use the deployed backend URL
  // This is your deployed Vercel backend URL
  const productionUrl = import.meta.env.VITE_API_BASE_URL || 'https://milaf-backend.vercel.app';
  
  return productionUrl;
};

/**
 * Check if the backend is available
 * This will help show appropriate error messages
 */
export const isBackendAvailable = (): boolean => {
  const baseUrl = getApiBaseUrl();
  // Backend is available if we have a valid baseUrl
  return baseUrl && baseUrl.length > 0;
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    // Australia Post API endpoints
    PARCEL_SERVICES: '/api/parcel/services',
    PARCEL_CALC: '/api/parcel/calc',
    
    // Payment API endpoints
    PAYMENT_KEY: '/api/payment/key',
    PAYMENT_CREATE_ORDER: '/api/payment/create-order',
    PAYMENT_VERIFY: '/api/payment/verify',
  }
} as const;

/**
 * Helper function to build full API URLs
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Helper function to get Australia Post services URL
 */
export const getAusPostServicesUrl = (toPostcode: string): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PARCEL_SERVICES}?to_postcode=${encodeURIComponent(toPostcode)}`;
};

/**
 * Helper function to get Australia Post calculation URL
 */
export const getAusPostCalcUrl = (toPostcode: string, serviceCode: string): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PARCEL_CALC}?to_postcode=${encodeURIComponent(toPostcode)}&service_code=${encodeURIComponent(serviceCode)}`;
};
