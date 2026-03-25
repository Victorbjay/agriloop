
/**
 * This utility handles the Interswitch integration.
 * It uses Server Actions to protect sensitive keys while providing 
 * a seamless experience for the client.
 */

'use client';

import { 
  validateNinBooleanAction, 
  getNinFullDetailsAction, 
  getCheckoutConfigAction 
} from './interswitch-server';

/**
 * 1. NIN Boolean Match
 * Used in Signup Step
 */
export async function checkNinBoolean(nin: string) {
  const cleanNin = nin.trim();
  return await validateNinBooleanAction(cleanNin);
}

/**
 * 2. NIN Full Details
 */
export async function getNinFullDetails(nin: string) {
  const cleanNin = nin.trim();
  return await getNinFullDetailsAction(cleanNin);
}

/**
 * 3. Inline Web Checkout Configuration
 * Prepares the request object for Interswitch Inline Checkout
 */
export async function getCheckoutConfig(orderId: string, amount: number, buyerEmail: string, buyerName: string) {
  return await getCheckoutConfigAction(orderId, amount, buyerEmail, buyerName);
}

/**
 * Client-side constants for Interswitch
 */
export const INTERSWITCH_CLIENT_CONFIG = {
  REDIRECT_URL: typeof window !== 'undefined' ? `${window.location.origin}/payment/callback` : "",
  CURRENCY_CODE: "566", // NGN
};
