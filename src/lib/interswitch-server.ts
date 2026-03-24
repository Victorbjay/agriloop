'use server';

/**
 * @fileOverview Server-side actions for Interswitch integration.
 * This file handles secure API calls to Interswitch and protects environment variables.
 */

const ISW_BASE_URL = 'https://qa.interswitchng.com'; // Sandbox URL

/**
 * Mocking the Interswitch Response for Demo if keys are missing
 */
const IS_DEMO_MODE = !process.env.INTERSWITCH_CLIENT_ID;

export async function validateBvnBooleanAction(bvn: string) {
  if (IS_DEMO_MODE) {
    // Simulate network delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Always allow the specific test BVN provided in PRD
    if (bvn === "22222222226") {
      return { valid: true, message: "BVN is valid" };
    }
    return { valid: false, message: "Invalid BVN provided. Use 22222222226 for testing." };
  }

  try {
    // Real implementation would involve OAuth2 token generation and then the BVN call
    // For MVP, we use the provided endpoints as a proxy
    const response = await fetch(`${ISW_BASE_URL}/api/v1/identity/bvn/boolean`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getIswAccessToken()}`,
      },
      body: JSON.stringify({ bvn }),
    });

    const data = await response.json();
    return { 
      valid: data.valid || false, 
      message: data.message || (data.valid ? "BVN is valid" : "Invalid BVN") 
    };
  } catch (error) {
    console.error('Interswitch Boolean Error:', error);
    return { valid: false, message: "Could not reach Interswitch validation service." };
  }
}

export async function getBvnFullDetailsAction(bvn: string) {
  if (IS_DEMO_MODE) {
    await new Promise(resolve => setTimeout(resolve, 1000));
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

  try {
    const response = await fetch(`${ISW_BASE_URL}/api/v1/identity/bvn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getIswAccessToken()}`,
      },
      body: JSON.stringify({ bvn }),
    });

    return await response.json();
  } catch (error) {
    console.error('Interswitch Details Error:', error);
    throw new Error("Identity service unavailable");
  }
}

export async function getCheckoutConfigAction(orderId: string, amount: number, buyerEmail: string, buyerName: string) {
  // Use env variables or fallback to demo merchant codes
  const merchantCode = process.env.INTERSWITCH_MERCHANT_CODE || "MX60956";
  const payItemId = process.env.INTERSWITCH_PAY_ITEM_ID || "101";

  return {
    merchant_code: merchantCode,
    pay_item_id: payItemId,
    txn_ref: `AGR-${orderId}-${Date.now()}`,
    amount: amount * 100, // Conversion to kobo
    currency: "566",
    cust_email: buyerEmail,
    cust_name: buyerName,
    site_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/payment/callback`,
    mode: "TEST",
  };
}

/**
 * Helper to get OAuth2 Access Token from Interswitch
 */
async function getIswAccessToken() {
  // This logic is required for production Interswitch calls
  // It requires ClientID and Secret from .env
  return "MOCK_TOKEN"; 
}
