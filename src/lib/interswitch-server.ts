
'use server';

/**
 * @fileOverview Server-side actions for Interswitch integration.
 * This file handles secure API calls to Interswitch and protects environment variables.
 */

const ISW_BASE_URL = 'https://qa.interswitchng.com'; // Sandbox URL
const ISW_PASSPORT_URL = 'https://passport.qa.interswitchng.com'; // Sandbox Auth URL

/**
 * Helper to get OAuth2 Access Token from Interswitch
 */
async function getIswAccessToken(): Promise<string> {
  const clientId = process.env.INTERSWITCH_CLIENT_ID;
  const secret = process.env.INTERSWITCH_SECRET_KEY;

  if (!clientId || !secret) {
    console.error('Interswitch credentials missing in .env');
    return "DEMO_TOKEN";
  }

  const authHeader = Buffer.from(`${clientId}:${secret}`).toString('base64');

  try {
    const response = await fetch(`${ISW_PASSPORT_URL}/passport/config/v2/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authHeader}`,
      },
      body: new URLSearchParams({ grant_type: 'client_credentials', scope: 'profile' }),
    });

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Interswitch Auth Error:', error);
    return "FALLBACK_TOKEN";
  }
}

export async function validateBvnBooleanAction(bvn: string) {
  const cleanBvn = bvn.trim();
  
  // Test BVN for demo continuity
  if (cleanBvn === "22222222226") {
    return { valid: true, message: "BVN validated (Hackathon Demo Mode)" };
  }

  try {
    const token = await getIswAccessToken();
    if (token === "DEMO_TOKEN" || token === "FALLBACK_TOKEN") {
      return { valid: false, message: "Identity service configuration error. Use 22222222226 for testing." };
    }

    const response = await fetch(`${ISW_BASE_URL}/api/v1/identity/bvn/boolean`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bvn: cleanBvn }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        valid: false, 
        message: errorData.message || "Identity service unavailable. Check your credentials or try test BVN 22222222226." 
      };
    }

    const data = await response.json();
    return { 
      valid: data.valid || false, 
      message: data.message || (data.valid ? "BVN is valid" : "Invalid BVN") 
    };
  } catch (error) {
    console.error('Interswitch Boolean Error:', error);
    return { valid: false, message: "Could not reach Interswitch. Please use the test BVN 22222222226." };
  }
}

export async function getBvnFullDetailsAction(bvn: string) {
  const cleanBvn = bvn.trim();

  if (cleanBvn === "22222222226") {
    return {
      firstName: "HACKATHON",
      lastName: "PARTNER",
      phone: "08000000000",
      photo: "https://picsum.photos/seed/hackathon/200/200",
      valid: true
    };
  }

  try {
    const token = await getIswAccessToken();
    const response = await fetch(`${ISW_BASE_URL}/api/v1/identity/bvn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bvn: cleanBvn }),
    });

    if (!response.ok) {
      throw new Error("Identity record not found.");
    }

    return await response.json();
  } catch (error) {
    console.error('Interswitch Details Error:', error);
    // Fallback for demo continuity if sandbox is unstable
    return {
      firstName: "DEMO",
      lastName: "USER",
      phone: "08012345678",
      photo: "https://picsum.photos/seed/demo/200/200",
      valid: true
    };
  }
}

export async function getCheckoutConfigAction(orderId: string, amount: number, buyerEmail: string, buyerName: string) {
  const merchantCode = process.env.INTERSWITCH_MERCHANT_CODE || "MX275936";
  const payItemId = process.env.INTERSWITCH_PAY_ITEM_ID || "Default_Payable_MX275936";

  return {
    merchant_code: merchantCode,
    pay_item_id: payItemId,
    txn_ref: `AGR-${orderId}-${Date.now()}`,
    amount: Math.round(amount * 100), // Amount in Kobo
    currency: "566", // NGN
    cust_email: buyerEmail,
    cust_name: buyerName,
    site_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/payment/callback`,
    mode: "TEST",
  };
}
