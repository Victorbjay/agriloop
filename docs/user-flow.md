# AgriLoop User Transaction Flow

This document outlines the precision-organic transaction lifecycle on the AgriLoop platform.

## 1. Identity & Onboarding
*   **Verification**: All sellers must undergo NIN verification via Interswitch.
*   **Data Enrichment**: Phone numbers and legal names are retrieved from identity records during signup to ensure a trusted marketplace.

## 2. Listing & Discovery
*   **AI Valorization**: Sellers use Genkit AI to generate optimized descriptions and pricing based on Nigerian market trends.
*   **Marketplace**: Buyers use the "Geo-Sourcing" map or grid to find biomass close to their industrial sites.

## 3. The Escrow Cycle (Payment Held)
AgriLoop uses a "Safe Loop" escrow system to protect both parties.

1.  **Payment (Interswitch)**: Buyer pays for the listing. The amount is charged to their card.
2.  **Payment Held**: The status becomes `payment_held`. Funds are secured in the AgriLoop neutral account.
3.  **Seller Confirmation**: The Seller receives a notification. They must log in to the "Sales Activity" tab and click **"Confirm Order"**.
4.  **Ready for Pickup**: Once the waste is packaged/heaped, the Seller clicks **"Mark as Ready"**. The Buyer receives the precise pickup location and seller contact.
5.  **Completion**: The Buyer inspects the waste at the pickup site. If satisfied, they click **"Confirm Receipt"** on their dashboard.
6.  **Settlement**: Only upon Buyer confirmation are the funds released to the Seller's payout account.

## 4. Dispute Resolution
If the Buyer finds the waste quality doesn't match the listing grade during pickup, they trigger a dispute instead of confirming receipt, initiating the 48-hour mediation window.