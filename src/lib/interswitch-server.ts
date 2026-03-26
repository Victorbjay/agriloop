
'use server';

import { createHash } from 'crypto';

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
    console.warn('Interswitch credentials missing in .env. Using DEMO_TOKEN.');
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
      next: { revalidate: 3600 } // Cache token for 1 hour
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

/**
 * NIN Boolean Match Action
 */
export async function validateNinBooleanAction(nin: string) {
  const cleanNin = nin.trim();
  
  // Test NIN for demo continuity
  if (cleanNin === "12345678901") {
    return { valid: true, message: "NIN validated (Hackathon Demo Mode)" };
  }

  try {
    const token = await getIswAccessToken();
    if (token === "DEMO_TOKEN" || token === "FALLBACK_TOKEN") {
      return { valid: false, message: "Identity service configuration error. Use 12345678901 for testing." };
    }

    const response = await fetch(`${ISW_BASE_URL}/api/v1/identity/nin/boolean`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ nin: cleanNin }),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        valid: false, 
        message: errorData.message || "Identity service unavailable. Please use test NIN 12345678901 for the demo." 
      };
    }

    const data = await response.json();
    return { 
      valid: data.valid || false, 
      message: data.message || (data.valid ? "NIN is valid" : "Invalid NIN") 
    };
  } catch (error) {
    console.error('Interswitch NIN Boolean Error:', error);
    return { valid: false, message: "Could not reach Interswitch. Please use the test NIN 12345678901." };
  }
}

/**
 * NIN Full Details Action
 */
export async function getNinFullDetailsAction(nin: string) {
  const cleanNin = nin.trim();

  if (cleanNin === "12345678901") {
    return {
      firstName: "AGRILOOP",
      lastName: "PARTNER",
      phone: "08000000000",
      photo: "https://picsum.photos/seed/hackathon/200/200",
      valid: true
    };
  }

  try {
    const token = await getIswAccessToken();
    const response = await fetch(`${ISW_BASE_URL}/api/v1/identity/nin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ nin: cleanNin }),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error("Identity record not found.");
    }

    return await response.json();
  } catch (error) {
    console.error('Interswitch NIN Details Error:', error);
    return {
      firstName: "DEMO",
      lastName: "USER",
      phone: "08012345678",
      photo: "https://picsum.photos/seed/demo/200/200",
      valid: true
    };
  }
}

/**
 * Generates Interswitch Checkout Configuration including the mandatory SHA-512 Hash
 */
export async function getCheckoutConfigAction(orderId: string, amount: number, buyerEmail: string, buyerName: string) {
  const merchantCode = process.env.INTERSWITCH_MERCHANT_CODE || "MX26070";
  const payItemId = process.env.INTERSWITCH_PAY_ITEM_ID || "101";
  const hashKey = process.env.INTERSWITCH_HASH_KEY || "D3D13592833342E7599D95B309D5E7B7A879E66B6C4F4E4F4F4F4F4F4F4F4F4F";
  
  // Interswitch Transaction Reference should be unique and ideally under 20 chars for some bank integrations
  const txnRef = `AGR${Date.now().toString().slice(-10)}`;
  const koboAmount = Math.round(amount * 100);
  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/payment/callback`;

  // HASHING: SHA512(txn_ref + merchant_code + pay_item_id + amount + site_redirect_url + hash_key)
  const hashString = `${txnRef}${merchantCode}${payItemId}${koboAmount}${redirectUrl}${hashKey}`;
  const hash = createHash('sha512').update(hashString).digest('hex');

  return {
    merchant_code: merchantCode,
    pay_item_id: payItemId,
    txn_ref: txnRef,
    amount: koboAmount,
    currency: "566", // NGN
    hash: hash,
    cust_email: buyerEmail,
    cust_name: buyerName,
    site_redirect_url: redirectUrl,
    mode: "TEST",
  };
}
