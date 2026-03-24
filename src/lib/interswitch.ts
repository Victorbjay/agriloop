/**
 * This utility handles the Interswitch integration.
 * It uses Server Actions to protect sensitive keys while providing 
 * a seamless experience for the client.
 */

'use client';

import { 
  validateBvnBooleanAction, 
  getBvnFullDetailsAction, 
  getCheckoutConfigAction 
} from './interswitch-server';

/**
 * 1. BVN Boolean Match
 * Used in Signup Step 1
 */
export async function checkBvnBoolean(bvn: string) {
  const cleanBvn = bvn.trim();
  return await validateBvnBooleanAction(cleanBvn);
}

/**
 * 2. BVN Full Details
 * Used in Signup Step 2
 */
export async function getBvnFullDetails(bvn: string) {
  const cleanBvn = bvn.trim();
  return await getBvnFullDetailsAction(cleanBvn);
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
  // These are safe to expose as they are required by the client SDK
  REDIRECT_URL: typeof window !== 'undefined' ? `${window.location.origin}/payment/callback` : "",
  CURRENCY_CODE: "566", // NGN
};
