# AgriLoop User Transaction Flow

This document outlines the precision-organic transaction lifecycle on the AgriLoop platform.

## 1. Identity & Onboarding
*   **Verification**: All sellers undergo NIN verification via Interswitch.
*   **Data Enrichment**: Phone numbers and legal names are to be retrieved from identity records during signup to ensure a trusted marketplace.

## 2. Listing & Discovery
*   **AI Valorization**: Sellers use Genkit AI to generate optimized descriptions and pricing based on Nigerian market trends.
*   **Marketplace**: Buyers use the "Geo-Sourcing" map or grid to find biomass close to their industrial sites.

## 3. Bulk Procurement & Cart
*   **Multi-Seller Cart**: Buyers can aggregate waste listings from multiple verified sellers into a single cart.
*   **Unified Checkout**: One payment is made through Interswitch for the total value of all selected biomass.
*   **Automatic Splitting**: AgriLoop automatically generates separate orders for each seller, maintaining clean escrow tracking for every vendor.

## 4. The Escrow Cycle (Safe Loop)
AgriLoop uses a "Safe Loop" escrow system to protect both parties.

1.  **Payment (Interswitch)**: Buyer pays for the entire cart. The total amount is captured.
2.  **Payment Held**: The status of all related orders becomes `payment_held`. Funds are secured in the AgriLoop neutral account.
3.  **Seller Confirmation**: Each Seller receives an individual notification. They must log in to their "Sales Activity" tab and click **"Confirm Order"**.
4.  **Ready for Pickup**: Once the specific waste lot is packaged/heaped, the Seller clicks **"Mark as Ready"**. The Buyer receives the precise pickup location and seller contact for that specific lot.
5.  **Completion**: The Buyer inspects the waste at the pickup site. If satisfied, they click **"Confirm Receipt"** on their dashboard.
6.  **Settlement**: Only upon Buyer confirmation for a specific order are those specific funds released to that Seller's payout account.

## 5. Dispute Resolution
If the Buyer finds the waste quality doesn't match the listing grade during pickup, they trigger a dispute instead of confirming receipt, initiating the 48-hour mediation window.
