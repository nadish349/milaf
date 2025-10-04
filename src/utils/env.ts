/**
 * Environment variables utility
 * Provides type-safe access to environment variables
 */

export const env = {
  // Australian Post API
  AUSTRALIAN_POST_API_KEY: import.meta.env.VITE_AUSTRALIAN_POST_API_KEY,
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Milaf Arabia',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
} as const;

/**
 * Validate that required environment variables are present
 */
export const validateEnv = (): void => {
  const requiredVars = [
    'VITE_AUSTRALIAN_POST_API_KEY'
  ];

  const missing = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};

/**
 * Get Australian Post API configuration
 */
export const getAustralianPostConfig = () => ({
  apiKey: env.AUSTRALIAN_POST_API_KEY,
  baseUrl: 'https://digitalapi.auspost.com.au', // Default AusPost API URL
  timeout: 10000, // 10 seconds
});















