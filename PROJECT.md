# Project: Blinkit Mobile Responsive & Feature Parity Overhaul

## Architecture
- **Root Container**: `mobile/App.tsx` wraps `<StoreProvider>` -> `<SafeAreaProvider>` -> `<NavigationContainer>` -> `<RootNavigator>` -> `<GlobalModalManager>`.
- **Theme & Design Tokens**: `mobile/src/theme/` provides centralized design constants (`colors`, `typography`, `spacing`, `borderRadius`, `shadows`).
- **Responsive Hook**: `mobile/src/hooks/useResponsive.ts` dynamically provides viewport dimensions, device categories (`isCompact <= 375`, `isStandard 376-767`, `isTablet >= 768`), dynamic grid columns, safe area insets, scaling utilities, and standard WCAG `minTouchTarget` (44×44 pt).
- **Navigation**: `mobile/src/navigation/` (`types.ts`, `RootNavigator.tsx`, `TabNavigator.tsx`) cleanly encapsulates typed navigation parameters and safe-area-padded bottom tab bar.
- **State Management**: `mobile/src/context/StoreContext.tsx` manages cart, addresses, orders, user auth, and global modal visibility states (`isLocationModalOpen`, `isLoginModalOpen`, `quickViewProduct`, `isAddAddressModalOpen`, `isApplyCouponModalOpen`, `cancelOrderModalOrderId`, `rateOrderModalOrderId`, `isFilterDrawerOpen`, `isCartDrawerOpen`).
- **Global Modals**: `mobile/src/components/GlobalModalManager.tsx` mounts ported web modals (`QuickProductModal`, `LocationModal`, `LoginOtpModal`, `AddEditAddressModal`, `ApplyCouponModal`, `CancelOrderModal`, `RateOrderModal`, `FilterSortDrawer`, `CartDrawer`) as responsive overlays adapting between bottom sheets on phones and centered dialogs on tablets.
- **Screens**: 15 mobile screens consume `useResponsive` and `SafeAreaView` from `'react-native-safe-area-context'`, eliminating fixed clipping, keyboard occlusion, and home-indicator collisions.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | `F01_RESPONSIVE_HOOK` | `useResponsive` hook with breakpoints (`isCompact`, `isStandard`, `isTablet`), scaling, safe insets, dynamic grid columns, `minTouchTarget` | M1 | Survey |
| 2 | `F02_THEME_SYSTEM` | Centralized design tokens in `mobile/src/theme/` (colors, typography, spacing, borderRadius, shadows) | M1 | Survey |
| 3 | `F03_NAVIGATION_MODULARIZATION` | Modular typed navigation in `mobile/src/navigation/` with `RootNavigator`, `TabNavigator`, and root `App.tsx` with `SafeAreaProvider` | M1 | Survey |
| 4 | `F04_STORE_CONTEXT_EXPANSION` | Extend `mobile/src/context/StoreContext.tsx` with 12 modal states, `editAddress`, `verifyOtp`, `sortBy`, `billSummary` | M2 | Survey |
| 5 | `F05_QUICK_PRODUCT_MODAL` | `mobile/src/components/QuickProductModal.tsx` for fast product view, pack weight chips, stepper, and detail redirect | M2 | Survey |
| 6 | `F06_LOCATION_MODAL` | `mobile/src/components/LocationModal.tsx` with GPS detect, saved addresses radio list, city chips, and add address trigger | M2 | Survey |
| 7 | `F07_LOGIN_OTP_MODAL` | `mobile/src/components/LoginOtpModal.tsx` with phone input, 4-digit OTP boxes, 30s resend timer, and 1-tap auto fill | M2 | Survey |
| 8 | `F08_ADD_EDIT_ADDRESS_MODAL` | `mobile/src/components/AddEditAddressModal.tsx` with tag selector, `KeyboardAvoidingView`, and add/edit address handler | M2 | Survey |
| 9 | `F09_APPLY_COUPON_MODAL` | `mobile/src/components/ApplyCouponModal.tsx` with promo code input, active coupon display, and 1-tap apply coupon cards | M2 | Survey |
| 10 | `F10_CANCEL_ORDER_MODAL` | `mobile/src/components/CancelOrderModal.tsx` with refund notice, cancellation reason radios, and cancel confirmation | M2 | Survey |
| 11 | `F11_RATE_ORDER_MODAL` | `mobile/src/components/RateOrderModal.tsx` with 1-5 star selector, dynamic label, review input, and submit action | M2 | Survey |
| 12 | `F12_FILTER_SORT_DRAWER` | `mobile/src/components/FilterSortDrawer.tsx` with sort radios, brand checkboxes, reset and apply filters | M2 | Survey |
| 13 | `F13_CART_DRAWER` | `mobile/src/components/CartDrawer.tsx` fast-access bottom drawer with item steppers, free delivery bar, tip selector, and checkout trigger | M2 | Survey |
| 14 | `F14_GLOBAL_MODAL_MANAGER` | `mobile/src/components/GlobalModalManager.tsx` centralized overlay container rendered at app root | M2 | Survey |
| 15 | `F15_PRODUCT_CARD_RESPONSIVENESS` | Overhaul `ProductCard.tsx` with `useResponsive`, 44×44 pt touch targets, quick view trigger, and fluid grid sizing | M3 | Survey |
| 16 | `F16_SCREENS_HOME_CATEGORY_SEARCH` | Overhaul `HomeScreen`, `CategoryScreen`, `SearchResultsScreen`: horizontal scroll filters, responsive sidebar, location modal trigger, 44×44 pt touch targets | M3 | Survey |
| 17 | `F17_SCREENS_PRODUCT_CART_CHECKOUT` | Overhaul `ProductDetailScreen`, `CartScreen`, `CheckoutScreen`: sticky bottom bars with `insets.bottom + 12`, tipping, 44×44 pt touch targets, tablet two-column layout | M3 | Survey |
| 18 | `F18_SCREENS_ORDERS_TRACKING` | Overhaul `OrdersHistoryScreen`, `OrderTrackingScreen`: connect CancelOrderModal and RateOrderModal, responsive header wrapping on 320px, 44×44 pt touch targets | M3 | Survey |
| 19 | `F19_SCREENS_ACCOUNT_SETTINGS` | Overhaul `ProfileScreen`, `SavedAddressesScreen`, `WishlistScreen`, `OffersCouponsScreen`: connect login modal trigger, replace inline address modal, tablet grid adaptivity | M3 | Survey |
| 20 | `F20_SCREENS_SUPPORT_FAQ_ABOUT` | Overhaul `SupportScreen`, `FAQScreen`, `AboutUsScreen`: `KeyboardAvoidingView` on chat, safe area insets on input bar, 44×44 pt touch targets, responsive text and tablet pillar grids | M3 | Survey |
| 21 | `F21_TEST_SUITE_AND_DIAGNOSTICS` | Automated verification test suite across 3 viewports (compact 320-375px, standard 390-430px, tablet 768-1024px), TypeScript compile, Expo doctor, and comprehensive verification report | M4 | Survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Responsive & Architectural Foundation | `mobile/src/theme/`, `mobile/src/hooks/useResponsive.ts`, `mobile/src/navigation/`, root `mobile/App.tsx` with `SafeAreaProvider` | none | PLANNED |
| M2 | State Context & Web Modals Parity | `mobile/src/context/StoreContext.tsx` + 9 modals/drawers in `mobile/src/components/` + `GlobalModalManager.tsx` | M1 | PLANNED |
| M3 | Mobile Screens Overhaul & Integration | 15 mobile screens + `ProductCard.tsx` responsive layout, 44×44 pt touch targets, safe area insets, keyboard handling, and modal triggers | M1, M2 | PLANNED |
| M4 | Final E2E / Diagnostics Verification & Report | Execute full E2E test suite (Tiers 1-4), verify 0 TypeScript errors, 20/20 Expo doctor checks, viewport layout tests across compact, standard, tablet, and produce before/after verification report | M1, M2, M3 | PLANNED |

## Interface Contracts

### `useResponsive` Hook (`mobile/src/hooks/useResponsive.ts`)
```typescript
export interface ResponsiveMetrics {
  width: number;
  height: number;
  isCompact: boolean;   // <= 375px (iPhone SE, mini, small Android)
  isStandard: boolean;  // 376px - 767px (iPhone 13-16, Pixel, Galaxy)
  isTablet: boolean;    // >= 768px (iPad, Android tablet, Foldables)
  insets: { top: number; bottom: number; left: number; right: number };
  scale: (size: number) => number;
  verticalScale: (size: number) => number;
  moderateScale: (size: number, factor?: number) => number;
  gridColumns: number;  // 2 for mobile, 3 for small tablet, 4 for large tablet
  containerPadding: number;
  minTouchTarget: { minWidth: 44; minHeight: 44 };
}
```

### `StoreContext` Modal Extensions (`mobile/src/context/StoreContext.tsx`)
```typescript
export interface StoreContextType {
  // Existing state fields preserved...
  // Modal visibility & payloads:
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isAddAddressModalOpen: boolean;
  setIsAddAddressModalOpen: (open: boolean) => void;
  isApplyCouponModalOpen: boolean;
  setIsApplyCouponModalOpen: (open: boolean) => void;
  cancelOrderModalOrderId: string | null;
  setCancelOrderModalOrderId: (orderId: string | null) => void;
  rateOrderModalOrderId: string | null;
  setRateOrderModalOrderId: (orderId: string | null) => void;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  
  // Handlers & helpers:
  editAddress: (address: Address) => void;
  verifyOtp: (otp: string) => boolean;
  sortBy: string;
  setSortBy: (sort: string) => void;
  billSummary: {
    itemTotal: number;
    deliveryFee: number;
    handlingFee: number;
    tip: number;
    discount: number;
    grandTotal: number;
    totalSavings: number;
  };
}
```

### Modal Components Interface
Every modal in `mobile/src/components/` must support:
- Visibility controlled via `StoreContext` or props
- Standard back-drop dismiss
- Safe area inset padding for bottom sheets
- Adaptive presentation: bottom sheet on phone, centered modal dialog on tablet
- Full accessibility touch targets (>= 44×44 pt)
- TypeScript strict typing (no `any`)

## Code Layout
- `mobile/App.tsx`: Root wrapper with `StoreProvider`, `SafeAreaProvider`, `NavigationContainer`, `RootNavigator`, `GlobalModalManager`.
- `mobile/src/theme/`: Centralized theme tokens (`colors.ts`, `typography.ts`, `spacing.ts`, `borderRadius.ts`, `shadows.ts`, `index.ts`).
- `mobile/src/hooks/`: Reusable hooks (`useResponsive.ts`, `index.ts`).
- `mobile/src/navigation/`: Typed navigation definitions (`types.ts`, `RootNavigator.tsx`, `TabNavigator.tsx`, `index.ts`).
- `mobile/src/context/StoreContext.tsx`: App store & state management.
- `mobile/src/components/`: Reusable UI & modal overlays (`ProductCard.tsx`, `GlobalModalManager.tsx`, `QuickProductModal.tsx`, `LocationModal.tsx`, `LoginOtpModal.tsx`, `AddEditAddressModal.tsx`, `ApplyCouponModal.tsx`, `CancelOrderModal.tsx`, `RateOrderModal.tsx`, `FilterSortDrawer.tsx`, `CartDrawer.tsx`).
- `mobile/src/screens/`: 15 mobile screen components.
- `mobile/tests/`: Responsive layout test suite, viewport checks, and verification runner.
