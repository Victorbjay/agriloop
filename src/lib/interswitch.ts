/**
 * This utility simulates the Interswitch sandbox integration logic 
 * as requested in the prompt.
 */

export const INTERSWITCH_CONFIG = {
  MERCHANT_CODE: "MX60956",
  PAY_ITEM_ID: "101",
  REDIRECT_URL: "http://localhost:9002/payment/callback",
  CURRENCY_CODE: "566", // NGN
};

export async function initiateInterswitchPayment(orderId: string, amount: number, customerEmail: string) {
  // In a real app, this would be a server-side call to get a redirect URL.
  // Here we simulate the URL generation for the Interswitch Web Checkout.
  const amountInKobo = amount * 100;
  const transactionRef = `AGR-${orderId}-${Date.now()}`;
  
  // Simulated redirect URL construction
  const params = new URLSearchParams({
    merchantCode: INTERSWITCH_CONFIG.MERCHANT_CODE,
    payItemId: INTERSWITCH_CONFIG.PAY_ITEM_ID,
    customerId: "buyer_123",
    customerEmail,
    amount: amountInKobo.toString(),
    currencyCode: INTERSWITCH_CONFIG.CURRENCY_CODE,
    transactionReference: transactionRef,
    redirectUrl: INTERSWITCH_CONFIG.REDIRECT_URL,
  });

  return `https://webpay.interswitchng.com/pay?${params.toString()}`;
}

export async function verifyTransaction(reference: string) {
  // Mock verification result
  return {
    status: 'success',
    reference,
    amount: 100000,
    paidAt: new Date().toISOString(),
  };
}