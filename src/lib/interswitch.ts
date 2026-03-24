/**
 * This utility simulates the Interswitch sandbox integration logic 
 * using the 3 specified APIs for the MVP.
 */

export const INTERSWITCH_CONFIG = {
  MERCHANT_CODE: "MX60956",
  PAY_ITEM_ID: "101",
  REDIRECT_URL: typeof window !== 'undefined' ? `${window.location.origin}/payment/callback` : "",
  CURRENCY_CODE: "566", // NGN
};

/**
 * 1. BVN Boolean Match API (Mock)
 * Endpoint: POST /api/v1/identity/bvn/boolean
 */
export async function checkBvnBoolean(bvn: string): Promise<{ valid: boolean; message: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (bvn === "22222222226") {
    return { valid: true, message: "BVN is valid" };
  }
  return { valid: false, message: "Invalid BVN provided" };
}

/**
 * 2. BVN Full Details API (Mock)
 * Endpoint: POST /api/v1/identity/bvn
 */
export async function getBvnFullDetails(bvn: string) {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  if (bvn === "22222222226") {
    return {
      firstName: "JOHN",
      lastName: "DOE",
      phone: "08012345678",
      photo: "https://picsum.photos/seed/john/200/200",
      valid: true
    };
  }
  throw new Error("Could not retrieve BVN details");
}

/**
 * 3. Inline Web Checkout Configuration
 * Prepares the request object for Interswitch Inline Checkout
 */
export function getCheckoutConfig(orderId: string, amount: number, buyerEmail: string, buyerName: string) {
  return {
    merchant_code: INTERSWITCH_CONFIG.MERCHANT_CODE,
    pay_item_id: INTERSWITCH_CONFIG.PAY_ITEM_ID,
    txn_ref: `AGR-${orderId}-${Date.now()}`,
    amount: amount * 100, // Conversion to kobo
    currency: INTERSWITCH_CONFIG.CURRENCY_CODE,
    cust_email: buyerEmail,
    cust_name: buyerName,
    site_redirect_url: INTERSWITCH_CONFIG.REDIRECT_URL,
    mode: "TEST",
  };
}

/**
 * Server-side verification simulation
 */
export async function verifyTransaction(reference: string) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    status: 'success',
    reference,
    amount: 0, // Should be actual amount in real scenario
    paidAt: new Date().toISOString(),
  };
}
