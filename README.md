# AgriLoop | Precision Agricultural Waste Marketplace

AgriLoop is a B2B precision-organic marketplace designed to transform West Africa's agricultural biomass into high-value resources. By connecting farmers and agro-processors with industrial buyers (bio-energy, organic fertilizer, and construction), we close the loop on agricultural waste while creating a verified, transparent economy.

## 🚀 The Mission
To eliminate agricultural waste in the sub-region by 2030 through "Valorization as a Service," leveraging AI for market pricing and Interswitch for secure escrowed transactions.

## 🛠️ Technical Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI
- **Backend/Database**: Firebase Firestore, Firebase Authentication
- **AI Engine**: Genkit with Google Gemini 2.5 Flash
- **Payment & Identity**: Interswitch Webpay (Inline Checkout) & Interswitch Identity (NIN Verification)
- **Maps**: Leaflet for Geo-Sourcing and Cluster Mapping

## 🌟 Key Features

### 1. AI Valorization Engine (Genkit)
Sellers use our Genkit-powered AI to:
- **Generate Optimized Descriptions**: Automatically creates professional, technical descriptions of biomass based on type and condition.
- **Dynamic Pricing Suggestions**: Analyzes Nigerian market trends and logistics proximity to suggest optimal Price-per-KG (NGN).

### 2. Multi-Seller Bulk Procurement
Buyers can aggregate biomass listings from multiple verified sellers into a single cart. AgriLoop handles the complexity of executing one unified payment while generating individual vendor orders.

### 3. Safe Loop Escrow (Interswitch)
Integrated with Interswitch for secure payment handling:
- **Payment Held**: Funds are secured in the AgriLoop neutral account upon checkout.
- **Milestone-Based Release**: Funds are only released to the seller after the buyer confirms physical receipt and quality verification at the pickup point.

### 4. Identity-First Marketplace
All sellers undergo mandatory **NIN Verification** via Interswitch identity services before they can list products, ensuring a high-trust industrial environment.

### 5. Impact Dashboard
Real-time tracking of:
- **CO2 Emissions Saved** (Est. based on waste diversion).
- **Tons Recycled** across regional clusters (Ogun, Lagos, Oyo).
- **Community Income** generated for verified farmers.

## 🧪 Testing & Demo Instructions

### Demo Credentials
- **NIN Verification**: During signup or in the verification tab, use the demo NIN: **`12345678901`**. This will simulate a successful Interswitch Identity match.
- **Payment**: The checkout system is integrated with the Interswitch Sandbox. You can use standard Interswitch test cards to simulate successful bulk procurements.

### Running the Project
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up your `.env` with Firebase and Interswitch sandbox credentials.
4. Run development server: `npm run dev`.
5. For AI flows: `npm run genkit:dev`.

---
*Developed for the Firebase & Interswitch Hackathon | Closing the Loop on Agricultural Waste.*