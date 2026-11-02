# Quick Grocery Kinetic: Blinkit Storefront & Customer Experience Suite

An authentic, ultra-fast 10-minute grocery delivery web application faithfully modeled after the modern Blinkit quick-commerce platform. It provides seamless client-side navigation across all 23 views, category shelves, product details, interactive cart drawers, simulated 4-digit OTP login, live order tracking with animated delivery progress, and customer account portals.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were aligned during Phase 1 clarification:
> - **In-App Navigation & Overlays**: Full client-side routing paired with smooth modal overlays and slide-in drawers (Cart Drawer, Filter/Sort Drawer, Location Picker Modal, Quick View Modal, Add Address Modal, Apply Coupon Modal, Cancel Order Modal, and Rate Order Modal).
> - **Pre-Populated Initial State**: App launches with sample cart items (milk, bread, eggs, curd), saved addresses (Home, Office), and recent order tracking data so all screens look authentic and immediately testable out of the box.
> - **Simulated OTP Verification**: Instant phone login with pre-filled test numbers, one-click auto-fill "1234" OTP button, or acceptance of any 4-digit code to simulate realistic user authentication without requiring backend servers.
> - **Asset Strategy**: Uses the verified high-fidelity product photography, promotional banner art, and category icons hotlinked directly from the provided Figma HTML references.

---

## 1. Overview & Core Concept

- **What It Does**: A complete, high-density quick-commerce web app for ordering groceries, fresh produce, dairy, bakery, snacks, and household essentials with an instantaneous 10–12 minute delivery promise.
- **Target Audience / Persona**: Busy urban consumers who prioritize rapid product scan-ability, immediate cart interactions, clear transparent pricing with FMCG unit weights, and quick frictionless checkout.
- **Key Value**: Delivers the signature Blinkit desktop & responsive experience: instant inline `ADD` $\leftrightarrow$ `− 1 +` quantity steppers, dynamic location changer, instant omni-search with auto-suggestions, rich category aisles with left subcategory rails, sticky cart summary, live order timeline, and user management.

---

## 2. User Experience & Visual Design

### A. Key User Flows

1. **Storefront & Browse**:
   - Sticky top bar with dual-color wordmark (**Blinkit** yellow & green), lightning ETA indicator (`BBD: Delivery in 10 minutes`), location dropdown, omni-search input with cycling placeholders, Login trigger, and floating cart counter.
   - Category navigation ribbon (Vegetables & Fruits, Dairy & Breakfast, Cold Drinks, Snacks, Atta & Dal, etc.).
   - Auto-cycling hero campaign banners (Pharmacy, Farm Harvest, Late Night Munchies).
   - High-density product shelves categorized into "Dairy, Bread & Eggs", "Snacks & Munchies", "Fresh Fruits & Vegetables", etc.
2. **Search & Discovery**:
   - Focusing the search bar opens the **Search Suggestions Dropdown** with trending queries (`Amul Milk`, `Curd`, `Brown Bread`, `Atta`) and recent searches.
   - Submitting search leads to the **Search Results Page** (`/search?q=amul+milk`) with product grids, brand filters, and sorting.
3. **Category Aisles & Subcategories**:
   - Navigating to `/category/dairy-bread-eggs` shows the 2-column aisle layout: left sidebar for subcategories (`Milk`, `Bread & Pav`, `Butter & More`, `Cheese`, `Eggs`) and right grid for products with density controls.
4. **Product Detail Page (PDP) & Quick View**:
   - Clicking any item opens either the dedicated PDP (`/product/amul-taaza-milk`) or the Quick Product View modal with image gallery, unit selector (500ml vs 1L), nutritional info, brand details, and contiguous buy module.
5. **Cart, Checkout & Payment**:
   - Clicking "My Cart" opens the Level 3 slide-over cart drawer with 4 items, bill breakdown (Item Total, Handling Fee, Delivery Partner Tip, GST), and coupon trigger.
   - "Proceed to Pay" navigates to `/checkout` with address selection and payment options (UPI, Credit/Debit Cards, NetBanking, Cash on Delivery).
6. **Order Placement & Live Tracking**:
   - Confirming order transitions directly to `/order-tracking` with live ETA (`Arriving in 9 mins`), animated progress stepper (`Order Placed` $\to$ `Packed` $\to$ `On the way` $\to$ `Delivered`), delivery partner details with call button, and interactive cancel/rating modal triggers.
7. **Customer Account & Support**:
   - Access to `/profile`, `/orders` (order history with reorder actions), `/addresses` (saved locations with add/edit modal), `/wishlist`, `/coupons`, `/faq`, `/support`, and `/about`.

### B. Visual Identity & Design System: Quick Grocery Kinetic

- **Color Palette (60-30-10 Rule)**:
  - **Dominant Neutral Canvas (60%)**: Pure White (`#FFFFFF`) for crisp product isolation and Soft Slate (`#F4F6FB` / `#F8F9FA`) for category rails, shelves, and backgrounds.
  - **Structural Surfaces (30%)**: Hairline borders (`rgba(0, 0, 0, 0.08)` / `#ECEFF1`), dark typography (`#1C1C1C`), and muted weights/MRPs (`#666666`).
  - **Action Accents (10%)**:
    - **Primary Quick Yellow (`#F8CB46`)**: Brand identity, delivery badges, active search focus, promo highlights.
    - **Secondary Forest/Kelly Green (`#0C831F`)**: Action triggers (`ADD` buttons, quantity steppers, cart CTA, in-stock signals, `⚡ 10 MINS` badges).
    - **Tertiary Crimson (`#E23744`)**: Discount callouts (`15% OFF`), price drops, and alert states.
- **Typography**: Standardized on **Plus Jakarta Sans** with tabular numerals (`tabular-nums`) for currency and weight figures.
- **Elevation Hierarchy**:
  - `Level 0`: Flat bordered product card (`border: 1px solid rgba(0,0,0,0.08)`).
  - `Level 1`: Hover lift with subtle green glow border.
  - `Level 2`: Sticky header (`box-shadow: 0 2px 8px rgba(0,0,0,0.04)`).
  - `Level 3`: Slide-over Cart Drawer, Location Modal, OTP Modal, Quick View Modal (`box-shadow: -8px 0 24px rgba(0,0,0,0.15)`).

---

## 3. Key Product Decisions & Trade-Offs

- **Client-Side State Store vs Backend DB**:
  - *Chosen*: Single unified React context (`StoreContext`) backed by `localStorage` persistence.
  - *Why*: User explicitly requested frontend-only without backend logic. Storing cart items, saved addresses, wishlist, and recent orders in `localStorage` ensures state persists across page refreshes and modal interactions.
- **Modal vs Full-Page Overlays**:
  - *Chosen*: Modals (Location Selector, Quick View, Add Address, Apply Coupon, Cancel Order, Rating, Login OTP) render as high-fidelity overlays that can be triggered contextually from any page or via URL hash/state, matching real Blinkit behavior.
- **Zero Layout-Shift Quantity Steppers**:
  - *Chosen*: The `ADD` button and the active `− count +` stepper maintain identical 72px $\times$ 32px footprints with instant reactivity.

---

## 4. Technical Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              App.tsx                                   │
│            ┌──────────────────────────────────────────────┐            │
│            │   StoreContext (Cart, User, Location, Orders)│            │
│            └──────────────────────────────────────────────┘            │
│                                   │                                    │
│  ┌────────────────────────────────┴─────────────────────────────────┐  │
│  │                     Sticky Header & Nav                          │  │
│  │   [Logo]  [Delivery ETA & Location]  [Omni-Search]  [Login] [Cart]│  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                   │                                    │
│  ┌──────────────────────── ROUTED SCREENS ──────────────────────────┐  │
│  │  1. StorefrontView (`/`)                                         │  │
│  │  2. CategoryView (`/category/:slug`)                             │  │
│  │  3. SearchResultsView (`/search?q=...`)                          │  │
│  │  4. ProductDetailView (`/product/:id`)                           │  │
│  │  5. CheckoutView (`/checkout`)                                   │  │
│  │  6. OrderTrackingView (`/order-tracking/:orderId`)               │  │
│  │  7. ProfileView (`/profile`)                                     │  │
│  │  8. OrdersHistoryView (`/orders`)                                │  │
│  │  9. SavedAddressesView (`/addresses`)                            │  │
│  │ 10. WishlistView (`/wishlist`)                                   │  │
│  │ 11. OffersCouponsView (`/offers`)                                │  │
│  │ 12. SupportView (`/support`)                                     │  │
│  │ 13. FAQView (`/faq`)                                             │  │
│  │ 14. AboutUsView (`/about`)                                       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                   │                                    │
│  ┌────────────────────── INTERACTIVE MODALS ────────────────────────┐  │
│  │  • CartDrawer (Slide-over with tip, bill, checkout trigger)       │  │
│  │  • LocationModal (Detect location, select Delhi/Gurgaon/Mumbai)  │  │
│  │  • SearchDropdown (Trending tags, recent history)                │  │
│  │  • FilterSortDrawer (Price range, discount, brand, sort)         │  │
│  │  • QuickProductModal (Preview, pack variant, add to cart)        │  │
│  │  • LoginOtpModal (Mobile number input + auto-fill 4-digit OTP)   │  │
│  │  • AddEditAddressModal (Flat, street, landmark, label tags)      │  │
│  │  • ApplyCouponModal (PROMO20, BLINKIT50, FREE_DELIVERY)          │  │
│  │  • CancelOrderModal (Reason selection, confirmation dialog)      │  │
│  │  • RateOrderModal (Star rating, delivery feedback)               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Stores & Key Entities

- **`Product`**: ID, title, pack weight (e.g. `500 ml`, `1 kg`), price, original MRP, discount %, image URL, category, subcategory, brand, ETA (`10 MINS`), description, shelf life.
- **`CartItem`**: Product, quantity, selected unit/pack.
- **`Address`**: ID, type (`Home`, `Work`, `Other`), address line, pincode, receiver name, phone.
- **`Order`**: ID, items, delivery address, bill summary, status (`placed` $\to$ `packing` $\to$ `on_the_way` $\to$ `delivered` $\to$ `cancelled`), ETA time, driver name/phone.
- **`User`**: Name, phone, email, isVerified, defaultAddressId.
