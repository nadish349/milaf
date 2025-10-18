import fetch from "node-fetch";

/**
 * Australian Post API Service
 * Handles all interactions with the Australian Post API
 */

const AUSPOST_BASE_URL = "https://digitalapi.auspost.com.au";

/**
 * Create Basic Auth header for Australian Post API
 * @param {string} apiKey - Australian Post API key
 * @returns {string} Base64 encoded auth string
 */
const createAuthHeader = (apiKey) => {
  return Buffer.from(`${apiKey}:`).toString('base64');
};

/**
 * Make authenticated request to Australian Post API
 * @param {string} url - Full API URL
 * @param {string} apiKey - Australian Post API key
 * @returns {Promise<Object>} API response data
 */
const makeAusPostRequest = async (url, apiKey) => {
  const authString = createAuthHeader(apiKey);
  
  const response = await fetch(url, {
    headers: { 
      "Authorization": `Basic ${authString}`,
      "Accept": "application/json"
    },
  });

  if (!response.ok) {
    throw new Error(`Australian Post API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Get available Australian Post parcel services
 * @param {string} apiKey - Australian Post API key
 * @returns {Promise<Object>} Available services
 */
export const getAvailableServices = async (apiKey) => {
  const url = `${AUSPOST_BASE_URL}/postage/parcel/domestic/service.json`;
  return await makeAusPostRequest(url, apiKey);
};

/**
 * Calculate shipping cost for a package
 * @param {Object} params - Package parameters
 * @param {string} params.from - Origin postcode
 * @param {string} params.to - Destination postcode
 * @param {number} params.length - Package length (cm)
 * @param {number} params.width - Package width (cm)
 * @param {number} params.height - Package height (cm)
 * @param {number} params.weight - Package weight (kg)
 * @param {string} apiKey - Australian Post API key
 * @returns {Promise<Object>} Shipping cost data
 */
export const calculateShippingCost = async (params, apiKey) => {
  const { from, to, length, width, height, weight } = params;
  const url = `${AUSPOST_BASE_URL}/postage/parcel/domestic/calculate.json?from_postcode=${from}&to_postcode=${to}&length=${length}&width=${width}&height=${height}&weight=${weight}`;
  return await makeAusPostRequest(url, apiKey);
};

/**
 * Calculate shipping cost for a specific service
 * @param {Object} params - Package parameters
 * @param {string} params.from - Origin postcode
 * @param {string} params.to - Destination postcode
 * @param {number} params.length - Package length (cm)
 * @param {number} params.width - Package width (cm)
 * @param {number} params.height - Package height (cm)
 * @param {number} params.weight - Package weight (kg)
 * @param {string} serviceCode - Specific service code
 * @param {string} apiKey - Australian Post API key
 * @returns {Promise<Object>} Shipping cost data for specific service
 */
export const calculateShippingCostForService = async (params, serviceCode, apiKey) => {
  const { from, to, length, width, height, weight } = params;
  const url = `${AUSPOST_BASE_URL}/postage/parcel/domestic/calculate.json?from_postcode=${from}&to_postcode=${to}&length=${length}&width=${width}&height=${height}&weight=${weight}&service_code=${serviceCode}`;
  return await makeAusPostRequest(url, apiKey);
};

/**
 * Validate package parameters
 * @param {Object} params - Package parameters to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validatePackageParams = (params) => {
  const { from, to, length, width, height, weight } = params;
  const errors = [];

  // Check required parameters
  if (!from) errors.push("from postcode is required");
  if (!to) errors.push("to postcode is required");
  if (!length) errors.push("length is required");
  if (!width) errors.push("width is required");
  if (!height) errors.push("height is required");
  if (!weight) errors.push("weight is required");

  // Check numeric parameters
  const numericParams = { length, width, height, weight };
  for (const [key, value] of Object.entries(numericParams)) {
    if (value && isNaN(parseFloat(value))) {
      errors.push(`${key} must be a number`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Create standardized API response
 * @param {boolean} success - Whether the operation was successful
 * @param {Object} data - Response data
 * @param {string} error - Error message (if any)
 * @param {Object} additional - Additional response properties
 * @returns {Object} Standardized response
 */
export const createApiResponse = (success, data = null, error = null, additional = {}) => {
  const response = {
    success,
    timestamp: new Date().toISOString(),
    ...additional
  };

  if (success) {
    response.data = data;
  } else {
    response.error = error;
  }

  return response;
};







