# Blinkit 10-Minute Grocery Delivery - React Native Mobile App

This directory contains the production-ready React Native / Expo codebase modeled after the authentic Blinkit quick-commerce mobile app designs.

## Features
- **5-Tab Navigation**: Delivery (Home), Categories, Print, Orders, and Profile.
- **Native Stack Routing**: Home $\to$ Categories $\to$ Product Detail $\to$ Cart $\to$ Checkout $\to$ Live Order Tracking.
- **10-Minute Grocery Delivery Storefront**: Live ETA countdown, micro dark store delivery timeline, courier call button.
- **High-Density Product Cards**: Unit tags, discount badges, instant quantity stepper (`ADD` $\leftrightarrow$ `− 1 +`), and zero-shift layout.
- **Cart & Checkout**: Real-time bill breakdown, handling charge, delivery partner tip selector, and payment options (UPI, Cards, Cash on Delivery).

## How to Run on iOS / Android with Expo

1. **Install dependencies**:
   ```bash
   cd mobile
   npm install
   ```

2. **Start the Expo development server**:
   ```bash
   npx expo start
   ```

3. **Open on your device**:
   - Install **Expo Go** from the App Store (iOS) or Google Play Store (Android).
   - Scan the QR code displayed in your terminal.
   - Or press `a` for Android emulator, or `i` for iOS simulator.
