import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key_here';

// Only load Stripe if we have a valid key
export const stripePromise = stripePublishableKey && stripePublishableKey !== 'pk_test_your_stripe_publishable_key_here' 
  ? loadStripe(stripePublishableKey)
  : null;
