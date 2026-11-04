# Blinkit 10-Minute Grocery Delivery - React Native Mobile App

This directory contains the production-ready React Native / Expo codebase modeled after the authentic Blinkit quick-commerce mobile app, now featuring complete parity with all pages from the web application.

## Screens & Features

### 5-Tab Bottom Navigation
1. **Delivery (Home)**: Top 10-minute delivery pill, active address picker, categories carousels, curated grocery sections.
2. **Categories**: Multi-subcategory split-pane catalogue with real-time category switching.
3. **Print**: Blinkit Print dark store document printing service.
4. **Orders (History)**: Full list of past & active orders, live status tags, repeat order, cancel order, and receipt views.
5. **Profile**: User info, quick metric counters (Orders, Addresses, Coupons, Wishlist), and navigation to all account settings.

### Native Stack Screens
6. **Search (`SearchResultsScreen`)**: Real-time keyword search, trending tags, filter chips, and instant product grid.
7. **Product Details (`ProductDetailScreen`)**: High-res images, nutrition specs, shelf life, origin, and wishlist toggle.
8. **Cart (`CartScreen`)**: Live bill breakdown, coupon discount code integration, and free delivery progress.
9. **Checkout (`CheckoutScreen`)**: Multi-payment gateway (Google Pay, PhonePe, Cards, Cash on Delivery).
10. **Order Tracking (`OrderTrackingScreen`)**: Micro dark-store picking, EV partner dispatch timeline, and courier call.
11. **Saved Addresses (`SavedAddressesScreen`)**: Add, edit, select, and delete delivery locations (Home, Work, Other).
12. **Wishlist (`WishlistScreen`)**: Saved items list with one-tap add to cart.
13. **Offers & Coupons (`OffersCouponsScreen`)**: Promo codes (`BLINKIT50`, `FREEDEL`, `SUPER20`) and bank offers.
14. **24x7 Support (`SupportScreen`)**: Interactive simulated live customer support chat assistant with quick topic chips.
15. **FAQs (`FAQScreen`)**: Searchable accordion answers for delivery, payments, refunds, and cancellations.
16. **About Us (`AboutUsScreen`)**: Blinkit 10-minute dark store model, cold chain quality, EV logistics pledge, and office info.

---

## How to Run

1. **Start with Tunnel (Recommended for physical devices)**:
   ```bash
   cd mobile
   npm run tunnel
   ```
   Scan the terminal QR code in **Expo Go**.

2. **Start on Mobile Web**:
   ```bash
   npm run web
   ```
   Preview at [http://localhost:8081](http://localhost:8081).

3. **Start on Emulator**:
   * Android: `npm run android`
   * iOS: `npm run ios`
