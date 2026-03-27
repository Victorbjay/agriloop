# **App Name**: AgriLoop

## Core Features:

- Secure Authentication & Verification: Enable user registration and login via email/password, facilitate role selection (seller/buyer), and perform BVN verification using the Interswitch API. Manage and display user verification statuses and badges within the platform.
- AI Waste Valorization Tool: An intelligent tool that suggests optimal pricing strategies and potential value-added uses for specific waste types based on market trends and listing characteristics, helping sellers maximize their listings' value.
- Geolocation-Powered Marketplace: Allow buyers to browse available agricultural waste listings, apply filters including location radius (using geohashing), visualize listings on an interactive Google Map, and view distance to seller locations for efficient sourcing.
- Effortless Listing Management: Sellers can easily create, publish, and manage their agricultural waste listings. Features include specifying waste type, condition, quantity, pricing, availability dates, location selection, and supporting image uploads.
- Interswitch Integrated Purchase Flow: Facilitate secure fixed-price transactions for buyers, incorporating quantity validation against minimum order quantities (MOQ), and integrating Interswitch Web Checkout for payment processing with webhook-driven verification and an order state machine.
- Personalized Dual Dashboards: Provide tailored user experiences with dedicated dashboards for sellers (displaying listings, active orders, and earnings summaries) and buyers (tracking their orders, saved listings, and purchase history), complete with real-time updates and contextual actions.
- Transparent Order Tracking: Implement a comprehensive order management system featuring a visual timeline of order statuses, automated notifications for state changes, and mechanisms to facilitate contact between buyer and seller post-payment, along with dispute flagging functionality.

## Style Guidelines:

- Primary color: A robust green, HSL(145, 75%, 36%) or #16a34a, symbolizing agriculture, growth, and sustainability, used for key branding elements and interactive components.
- Background color: A subtle, desaturated green, HSL(145, 15%, 95%) or #ecf8ef, providing a fresh and clean canvas that maintains visual harmony with the primary theme.
- Accent color: A vibrant amber, HSL(39, 93%, 50%) or #f59e0b, signifying energy, innovation, and value from waste, prominently used for calls-to-action, highlights, and urgent notifications.
- Body and headline font: 'Inter' (Nunito), chosen for its excellent readability, modern aesthetic, and versatility across various content types on a B2B platform. Note: currently only Google Fonts are supported.
- Leverage icons from Lucide React, opting for a clean, outline-based, and contemporary style to ensure clarity and aesthetic consistency throughout the application.
- Implement a responsive, mobile-first layout. Key interface patterns include a clean split-screen design for authentication flows, a sticky filter sidebar for an efficient marketplace browsing experience, and a tabbed interface for dashboards to manage complex information logically.
- Incorporate subtle and meaningful animations, such as smooth page transitions, clear loading indicators for asynchronous operations (e.g., verification, payment processing), and dynamic visual cues for real-time status updates (e.g., order timelines), enhancing user engagement and feedback.