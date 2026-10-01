export const MASTER_PROMPT_TEXT = `Create a full-stack, production-ready, highly aesthetic modern e-commerce web application for a Bangladeshi Streetwear and Apparel brand called "OSTAD GEAR" specializing in:
1. T-Shirts (180 GSM combed compact cotton)
2. Sports & Club Fan Jerseys (Dry-fit micro-mesh, football & cricket kits)
3. Drop Shoulder T-Shirts (220 GSM heavyweight oversized Japanese streetwear fit)
4. Hoodies (320 GSM French Terry brushed winter fleece)

Key Architectural & Functional Requirements:

1. MODERN & STYLISH DESIGN:
   - High-end dark/light hybrid streetwear visual language (Syne & Plus Jakarta Sans typography, high-contrast palette, zero-pill discipline, smooth motion transitions).
   - Fully responsive for mobile, tablet, and desktop.
   - Clean micro-interactions, sticky navigation, quick-view modals, search drawer, and real-time cart drawer.

2. BANGLADESHI PAYMENT SYSTEM (MFS & COD):
   - Primary & Alternative Payment Numbers: 01572923114 and 01537-506154.
   - bKash Send Money / Agent Payment simulation with interactive copyable merchant/personal numbers (01572923114 / 01537-506154), step-by-step instructions in Bengali and English, and TrxID validation.
   - Nagad payment simulation (01572923114) with TrxID input.
   - Rocket payment simulation (01537-506154) with TrxID input.
   - Cash on Delivery (ক্যাশ অন ডেলিভারি / COD) with delivery verification.
   - Accurate Bangladesh shipping rate calculation: Inside Dhaka (৳60, 24-48 hrs delivery) and Outside Dhaka (৳120, 2-4 days across 64 districts).
   - Official Store Address: 335, Abu Sayeed Market (3rd Floor), Rampura, DIT Road, Dhaka, Bangladesh, 1219.
   - Official Contact Numbers: 01572923114, 01537-506154
   - Official Facebook Page Integration: https://www.facebook.com/profile.php?id=61571997341321

3. ESSENTIAL E-COMMERCE PAGES & CAPABILITIES:
   - Hero Banner with brand slogan, seasonal drops ticker, and trust guarantees (7-day exchange, cash on delivery, 100% combed cotton).
   - Category navigation tabs (All, Drop Shoulder, Jerseys, Hoodies, T-Shirts).
   - Product Catalog with live search, sorting (Featured, Price Low-High, Price High-Low, Best Sellers), and size filtering (S, M, L, XL, XXL).
   - Product Detail Modal / Page: Multi-image gallery, interactive size selector, color selector, interactive Size Chart (Chest & Length in inches), fabric GSM specs, reviews, and direct "Buy Now" (express checkout).
   - Slide-over Cart Drawer: Quantity counter, size indicator, subtotal in ৳ BDT, promo coupon code support (e.g. DISCOUNT10), and checkout trigger.
   - Full Checkout Flow: Customer Name, Phone, Alternative Phone, District/Division selector, Thana/City, Street Address, Delivery notes, Payment Method selection, and TrxID input.
   - Order Confirmation & Printable Invoice / Slip with unique Order ID (e.g. OG-BD-8924), timestamp, items breakdown, payment status, and instant order tracking link.
   - Order Tracking System: Lookup by Phone number or Order ID showing real-time timeline stages (Order Placed -> Verified -> Dispatched via Steadfast/Pathao -> Out for Delivery -> Delivered).
   - Wishlist functionality with local storage persistence.

4. FULLY FUNCTIONAL ADMIN PANEL:
   - Secure Admin Login Modal with exact credentials:
     * Admin ID: FORHAD1
     * Password: 123456
   - Admin Features:
     * Product Management:
       - Add new product with Title (English & Bengali), Category, Price, Original Price, Stock, Sizes selection, Fabric GSM details, and Image URL (with built-in 1-click Pixabay/Unsplash copyright-free photo library selector or custom URL / file upload preview).
       - Edit existing product details (pricing, stock, sizes, imagery).
       - Delete product with safety confirmation.
     * Orders Management:
       - Comprehensive order list showing Order ID, Customer Name, Phone, Delivery Address, Ordered Items, Payment Method, TrxID, and Total BDT (৳).
       - Status updater (Pending -> Confirmed -> Processing -> Shipped -> Delivered -> Cancelled).
       - Filter and search orders by phone or order number.
     * Business Analytics Dashboard:
       - Total revenue in BDT (৳), total orders count, active product count, low stock warnings.

5. COPYRIGHT-FREE IMAGE INTEGRATION:
   - Pre-populate all products with verified, royalty-free, high-resolution apparel imagery from Unsplash / Pixabay CDN.
   - Provide an in-admin image selector with preset royalty-free options so the store owner can easily swap or customize with their own product photos anytime.

6. DATA PERSISTENCE:
   - Use browser local storage with robust seed fallback so that all admin actions (adding new products, modifying prices, deleting items, updating order statuses, placing new orders) persist smoothly across page refreshes.
`;
