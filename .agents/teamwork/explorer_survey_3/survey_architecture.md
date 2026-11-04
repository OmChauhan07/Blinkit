# Comprehensive Mobile Architecture, Toolchain, Navigation & State Audit Report

**Date**: 2026-11-03  
**Auditor**: explorer_survey_3 (Teamwork Explorer)  
**Target Codebase**: `mobile/` (`App.tsx`, `package.json`, `tsconfig.json`, `src/screens/`, `src/components/`, `src/context/`, `src/types/`, `src/data/`) and `web/` (`src/components/`, `src/views/`, `src/context/`)  
**Objective**: Comprehensive Mobile Architecture, Toolchain, Navigation & State Audit to guide responsive overhaul and complete web-to-mobile feature parity.

---

## 1. Toolchain & Baseline Checks

### 1.1 Baseline Command Execution Results

Two baseline health checks were executed in the workspace:

#### Check 1: TypeScript Compilation (`npm run test:mobile`)
```powershell
> blinkit-workspace@1.0.0 test:mobile
> npm run typecheck --prefix mobile

> blinkit-mobile-app@1.0.0 typecheck
> tsc --noEmit
```
* **Exit Code**: `0`
* **Errors**: `0` type errors.
* **Duration**: ~3.5 seconds.
* **Assessment**: Baseline TypeScript compilation is completely clean. The current codebase has no missing imports or broken type contracts.

#### Check 2: Expo Project Diagnostics (`npm --prefix mobile run doctor`)
```powershell
> blinkit-mobile-app@1.0.0 doctor
> npx expo-doctor

npm warn Unknown project config "allow-scripts". This will stop working in the next major version of npm.
npm warn Unknown user config "allow-scripts". This will stop working in the next major version of npm.
Running 20 checks on your project...
20/20 checks passed. No issues detected!
```
* **Exit Code**: `0`
* **Checks Passed**: `20/20 checks passed`.
* **Warnings**: Minor npm warnings regarding `allow-scripts` configuration (non-blocking). No SDK or package dependency mismatches detected.

---

### 1.2 Package & Configuration Inspection

#### Root `package.json`
* **Type**: Monorepo/Multi-project workspace without yarn/npm workspaces array.
* **Orchestration**: Uses `--prefix` commands (`npm run dev --prefix web`, `npm start --prefix mobile`, `npm run typecheck --prefix mobile`).
* **Test script**: `"test": "npm run test:web && npm run test:mobile"`. `"test:mobile"` maps directly to `"npm run typecheck --prefix mobile"`.

#### Mobile `mobile/package.json`
* **Name**: `blinkit-mobile-app` (v1.0.0)
* **Core Framework Versions**:
  - `expo`: `^58.0.0` (Expo SDK 58 - latest current version)
  - `react`: `19.3.0`
  - `react-dom`: `19.3.0`
  - `react-native`: `0.88.1`
  - `typescript`: `~6.0.3` (devDependencies)
* **Navigation Dependencies**:
  - `@react-navigation/native`: `^6.1.17`
  - `@react-navigation/native-stack`: `^6.9.26`
  - `@react-navigation/bottom-tabs`: `^6.5.20`
* **UI & Device Support Dependencies**:
  - `react-native-safe-area-context`: `~5.10.1` (Present in package.json, but **critically omitted from root App.tsx**!)
  - `react-native-screens`: `~4.30.1` (Present and configured)
  - `react-native-svg`: `15.16.0`
  - `lucide-react-native`: `^0.378.0`
  - `expo-linear-gradient`: `~58.0.3`
  - `expo-status-bar`: `~58.0.4`
  - `@react-native-async-storage/async-storage`: `2.2.0` (Installed, ready for persistent cache)

#### Mobile `mobile/tsconfig.json`
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```
* Strict mode enabled.
* Clean baseline compilation.

---

## 2. Navigation Architecture Audit & Integration Blueprint

### 2.1 Current Navigation State

#### File Location & Layout
* **Current Location**: `mobile/App.tsx` (173 lines).
* **Missing Structure**: There is **no** `mobile/src/navigation/` directory. All navigators, inline tab components, and screen stacks are defined directly in the root `App.tsx`.
* **Navigator Types**:
  1. `Tab.Navigator` (`createBottomTabNavigator`):
     - `HomeTab` -> `HomeScreen`
     - `CategoriesTab` -> Inline component: `<CategoryScreen route={{ params: { slug: 'dairy-bread-eggs' } }} navigation={navigation} />`
     - `PrintTab` -> Inline dummy component: Dark store document printing placeholder.
     - `OrdersTab` -> `OrdersHistoryScreen`
     - `ProfileTab` -> `ProfileScreen`
  2. `Stack.Navigator` (`createNativeStackNavigator`):
     - `MainTabs` -> `MainTabNavigator`
     - 14 individual screens: `Category`, `ProductDetail`, `Cart`, `Checkout`, `OrderTracking`, `Search`, `OrdersHistory`, `Profile`, `SavedAddresses`, `Wishlist`, `OffersCoupons`, `Support`, `FAQ`, `AboutUs`.

#### Critical Navigation Architectural Deficiencies
1. **Zero TypeScript Navigation Typing**:
   - Neither `RootStackParamList` nor `BottomTabParamList` are defined.
   - All 15 screens receive untyped `{ navigation: any }` or `{ route: any, navigation: any }`.
   - Parameter mismatches (e.g., passing `{ orderId }` vs `{ id }`) cannot be caught by `tsc --noEmit`.
2. **Missing `SafeAreaProvider` at App Root**:
   - `mobile/App.tsx` renders `<NavigationContainer>` directly without `<SafeAreaProvider>`.
   - `react-native-safe-area-context` hooks fail or return 0 insets unless wrapped in `SafeAreaProvider`.
3. **No Centralized Modal Registration / Architecture**:
   - In `web/`, 8 distinct modal/drawer components (`QuickProductModal`, `LocationModal`, `LoginOtpModal`, `AddEditAddressModal`, `ApplyCouponModal`, `CancelOrderModal`, `RateOrderModal`, `FilterSortDrawer`) are available everywhere.
   - In `mobile/`, none of these exist as standalone modal components or registered modal screens. Instead, when a user taps "Location" on `HomeScreen`, it forces a heavy screen push to `SavedAddressesScreen` (`navigation.navigate('SavedAddresses')`). When tapping "Cancel Order" on `OrdersHistoryScreen`, it cancels without confirmation dialog.
4. **Hardcoded Tab Bar Sizing**:
   - `tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 }` is hardcoded. On devices with home indicator gestures (iPhone 12-16, gesture Android), the bottom indicator overlaps tab labels and icons.

---

### 2.2 Proposed Navigation Architecture

To establish clean separation of concerns and production robustness, navigation should be refactored into a dedicated module:

```
mobile/src/navigation/
├── types.ts              # Strongly typed RootStackParamList, BottomTabParamList, ScreenProps
├── RootNavigator.tsx     # Root Native Stack Navigator with SafeAreaProvider & NavigationContainer
├── TabNavigator.tsx      # 5-Tab Bottom Navigator with dynamic safe-area insets
└── index.ts              # Clean export
```

#### Typed Navigation Schema (`mobile/src/navigation/types.ts`)
```typescript
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: undefined;
  Category: { slug: string };
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderTracking: { orderId: string };
  Search: { query?: string };
  OrdersHistory: undefined;
  Profile: undefined;
  SavedAddresses: undefined;
  Wishlist: undefined;
  OffersCoupons: undefined;
  Support: undefined;
  FAQ: undefined;
  AboutUs: undefined;
};

export type BottomTabParamList = {
  HomeTab: undefined;
  CategoriesTab: { slug?: string };
  PrintTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
```

---

### 2.3 Modal & Drawer Integration Strategy: Global Modal Manager vs Stack Modals

There are two primary paradigms to integrate the missing web modals into React Native:

| Criteria | Paradigm A: Native Stack Modals (`presentation: 'modal'`) | Paradigm B: Global Modal Manager via Store Context (Recommended) |
| :--- | :--- | :--- |
| **Parity with Web** | Medium (Requires navigating to routes like `/modal/location`) | **100% Exact Parity** (`isLocationModalOpen`, `quickViewProduct`, etc.) |
| **Cross-Screen Invocability** | Complex (Must pass route params, dismiss callbacks, navigation listeners) | **Instant & Frictionless** (Any component calls `setIsLocationModalOpen(true)`) |
| **Tab Bar Preservation** | Dismisses tabs or renders full modal above tabs | **Preserves underlying screen state and context** |
| **Animation & Overlay** | Native OS card sheet transition | **Native translucent backdrop, BottomSheet slide-up, or centered scale dialog** |
| **Backdrop Dismissal** | iOS pull-down only; Android back button | **Tap outside backdrop to dismiss, hardware back button support, close button** |

#### Recommended Hybrid Pattern
1. **Overlay Modals & Drawers** (`QuickProductModal`, `LocationModal`, `LoginOtpModal`, `AddEditAddressModal`, `ApplyCouponModal`, `CancelOrderModal`, `RateOrderModal`, `FilterSortDrawer`):
   - Managed via state in `StoreContext` (`mobile/src/context/StoreContext.tsx`).
   - Grouped and mounted in `mobile/src/components/GlobalModalManager.tsx` directly inside the root `StoreProvider` and `SafeAreaProvider`.
   - Each modal renders via React Native's `<Modal transparent animationType="fade" visible={...}>` with an animated backdrop (`rgba(0,0,0,0.6)`), keyboard avoidance, and accessible touch targets.
2. **Full Screens**:
   - Remain first-class citizens in `RootNavigator.tsx` stack.
   - Modals and screens can seamlessly trigger each other (e.g., `LocationModal` can trigger `+ Add New` -> `AddEditAddressModal`, or `QuickProductModal` can trigger `View Full Details` -> `navigation.navigate('ProductDetail', { productId })`).

---

## 3. State Management & Theme System Audit

### 3.1 State Management: Mobile vs Web Comparison

A comprehensive comparison between `mobile/src/context/StoreContext.tsx` (293 lines) and `web/src/context/StoreContext.tsx` (487 lines) reveals the exact feature and state gaps:

| Feature / State Domain | `web/src/context/StoreContext.tsx` | `mobile/src/context/StoreContext.tsx` | Status in Mobile | Action Required |
| :--- | :--- | :--- | :--- | :--- |
| **Cart Items & Pricing** | `cart`, `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, `getItemQuantity` | `cart`, `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, `getItemQuantity` | ✅ Fully Aligned | None |
| **Bill Breakdown** | Grouped `billSummary: BillSummary` (`itemTotal`, `handlingFee`, `deliveryFee`, `tip`, `discount`, `grandTotal`, `totalSavings`) | Flat primitives (`itemTotal`, `handlingFee`, `deliveryFee`, `tipAmount`, `discountAmount`, `grandTotal`) | ⚠️ Partial (Missing `totalSavings` and grouped `billSummary`) | Expose `billSummary` alongside existing primitives for backwards compatibility |
| **Addresses** | `addresses`, `selectedAddress`, `setSelectedAddress`, `addAddress`, `editAddress`, `deleteAddress` | `addresses`, `selectedAddress`, `setSelectedAddress`, `addAddress`, `deleteAddress` | ❌ **Missing `editAddress`** | Add `editAddress: (addr: Address) => void` |
| **Orders** | `orders`, `placeOrder`, `cancelOrder`, `rateOrder`, `getOrderById` | `orders`, `placeOrder`, `cancelOrder`, `rateOrder`, `getOrderById` | ✅ Present | None |
| **Wishlist** | `wishlistIds`, `toggleWishlist`, `isInWishlist` | `wishlistIds`, `toggleWishlist`, `isInWishlist` | ✅ Fully Aligned | None |
| **Coupons** | `coupons`, `appliedCoupon`, `applyCoupon`, `removeCoupon` | `coupons`, `appliedCoupon`, `applyCoupon`, `removeCoupon` | ✅ Fully Aligned | None |
| **Search & Sort** | `searchQuery`, `setSearchQuery`, `sortBy`, `setSortBy` | `searchQuery`, `setSearchQuery` | ❌ **Missing `sortBy` & `setSortBy`** | Add `sortBy: string` and `setSortBy` to store |
| **User & Authentication** | `user`, `loginWithPhone`, `verifyOtp`, `logout` | `user`, `loginWithPhone`, `logout` | ❌ **Missing `verifyOtp`** | Add `verifyOtp: (otp: string) => boolean` |
| **Location Modal State** | `isLocationModalOpen`, `setIsLocationModalOpen` | **None** | ❌ **Missing** | Add to `StoreContext` |
| **Login OTP Modal State** | `isLoginModalOpen`, `setIsLoginModalOpen` | **None** | ❌ **Missing** | Add to `StoreContext` |
| **Quick Product View State** | `quickViewProduct: Product \| null`, `setQuickViewProduct` | **None** | ❌ **Missing** | Add to `StoreContext` |
| **Add/Edit Address Modal State** | `isAddAddressModalOpen`, `setIsAddAddressModalOpen` | **None** | ❌ **Missing** | Add to `StoreContext` + `editingAddress: Address \| null` |
| **Apply Coupon Modal State** | `isApplyCouponModalOpen`, `setIsApplyCouponModalOpen` | **None** | ❌ **Missing** | Add to `StoreContext` |
| **Cancel Order Modal State** | `cancelOrderModalOrderId: string \| null`, `setCancelOrderModalOrderId` | **None** | ❌ **Missing** | Add to `StoreContext` |
| **Rate Order Modal State** | `rateOrderModalOrderId: string \| null`, `setRateOrderModalOrderId` | **None** | ❌ **Missing** | Add to `StoreContext` |
| **Filter & Sort Drawer State** | `isFilterDrawerOpen`, `setIsFilterDrawerOpen` | **None** | ❌ **Missing** | Add to `StoreContext` |
| **Cart Drawer State** | `isCartDrawerOpen`, `setIsCartDrawerOpen` | **None** | ❌ **Missing** | Add to `StoreContext` |

#### Enhanced Mobile `StoreContextType` Extension
```typescript
export interface BillSummary {
  itemTotal: number;
  handlingFee: number;
  deliveryFee: number;
  tip: number;
  discount: number;
  grandTotal: number;
  totalSavings: number;
}

// In addition to existing StoreContextType properties:
export interface StoreContextModalExtensions {
  // Sorting
  sortBy: string;
  setSortBy: (sort: string) => void;

  // Bill Summary
  billSummary: BillSummary;

  // Address editing
  editAddress: (addr: Address) => void;
  editingAddress: Address | null;
  setEditingAddress: (addr: Address | null) => void;

  // Auth OTP verification
  verifyOtp: (otp: string) => boolean;

  // Modal & Drawer visibility
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;
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
}
```

---

### 3.2 Theme System Audit & Proposed Architecture

#### Current State
* Currently, **no theme directory or theme tokens exist** in `mobile/src/`.
* Colors, font sizes, margins, paddings, and shadow elevations are hardcoded inline inside `StyleSheet.create` across all 15 screens and `ProductCard`.
* Color hex values repeated throughout the codebase:
  - Primary Green: `#0C831F`, hover/dark: `#0a6d1a`, surface tint: `#F7FCF8`, `#E8F5E9`, `#0C831F15`
  - Accent Gold/Yellow: `#F8CB46`, light tint: `#FFE08F`, text gold: `#6e5600`, `#936F00`
  - Red / Danger / Sale: `#E23744`, hover: `#c92431`
  - Canvas Background: `#F4F6FB`, Secondary Canvas: `#F8F9FA`, Card Surface: `#FFFFFF`
  - Border Grays: `#ECEFF1`, `#F0EDED`, `#E0E0E0`, `#CFD8DC`
  - Text Primary: `#1C1C1C`, Secondary: `#555555` / `#666666`, Muted/Tertiary: `#828282` / `#9E9E9E`

#### Proposed Theme Structure (`mobile/src/theme/`)

```
mobile/src/theme/
├── colors.ts        # Palette & Semantic Tokens
├── typography.ts    # Font Sizes, Weights, Line Heights
├── spacing.ts       # 4pt/8pt Spacing Grid
├── borderRadius.ts  # Corner Radii Tokens
├── shadows.ts       # Cross-platform iOS Shadow & Android Elevation Tokens
└── index.ts         # Unified Theme Export
```

#### Detailed Theme Tokens Specification

##### 1. `colors.ts`
```typescript
export const colors = {
  primary: {
    main: '#0C831F',
    dark: '#0a6d1a',
    light: '#E8F5E9',
    subtle: '#F7FCF8',
    transparent15: 'rgba(12, 131, 31, 0.15)',
    transparent10: 'rgba(12, 131, 31, 0.10)'
  },
  accent: {
    main: '#F8CB46',
    light: '#FFE08F',
    darkText: '#6e5600',
    gold: '#936F00',
    transparent20: 'rgba(248, 203, 70, 0.20)'
  },
  danger: {
    main: '#E23744',
    dark: '#c92431',
    light: '#FDECEE',
    transparent15: 'rgba(226, 55, 68, 0.15)'
  },
  neutral: {
    background: '#F4F6FB',
    card: '#FFFFFF',
    surface: '#F8F9FA',
    border: '#ECEFF1',
    borderLight: '#F0EDED',
    borderMuted: '#CFD8DC',
    backdrop: 'rgba(0, 0, 0, 0.60)'
  },
  text: {
    primary: '#1C1C1C',
    secondary: '#555555',
    subtle: '#666666',
    muted: '#828282',
    disabled: '#B0BEC5',
    white: '#FFFFFF'
  },
  status: {
    placed: '#2196F3',
    packing: '#F8CB46',
    onTheWay: '#0C831F',
    delivered: '#4CAF50',
    cancelled: '#E23744'
  }
} as const;
```

##### 2. `typography.ts`
```typescript
export const typography = {
  fontSize: {
    micro: 9,
    caption: 11,
    bodySm: 12,
    body: 13,
    bodyLg: 14,
    titleSm: 15,
    title: 16,
    titleLg: 18,
    headingSm: 20,
    heading: 24,
    display: 28,
    displayLg: 34
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },
  lineHeight: {
    tight: 14,
    normal: 18,
    relaxed: 22,
    title: 24,
    display: 34
  }
} as const;
```

##### 3. `spacing.ts` & `borderRadius.ts`
```typescript
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  base: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  giant: 48
} as const;

export const borderRadius = {
  xs: 4,
  sm: 6,
  md: 8,
  base: 10,
  lg: 12,
  xl: 14,
  xxl: 16,
  round: 9999
} as const;
```

##### 4. `shadows.ts`
```typescript
import { Platform } from 'react-native';

export const shadows = {
  subtle: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3
    },
    android: { elevation: 1 },
    default: {}
  }),
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6
    },
    android: { elevation: 2 },
    default: {}
  }),
  dialog: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 20
    },
    android: { elevation: 8 },
    default: {}
  })
};
```

---

## 4. Responsive System & Utilities Audit & Design

### 4.1 Audit of Existing Utilities
* **Current Responsive Code in `mobile/src/`**: Zero.
* `useWindowDimensions`: 0 occurrences.
* `Dimensions`: 0 occurrences.
* `PixelRatio`: 0 occurrences.
* `Platform`: imported in only 1 file (`App.tsx` has no OS branch, only `SupportScreen` or `ProfileScreen` alert).
* `react-native-safe-area-context`: imported in 0 screens; all 15 screens import `SafeAreaView` from `'react-native'`, which fails on Android and fails to support dynamic bottom safe insets.
* Minimum touch target (< 44×44 pt) violations: 35+ buttons across all screens (stepper buttons `18×30pt`, wishlist heart `22×22pt`, back button `28×28pt`, profile icon `32×32pt`).

---

### 4.2 Unified Responsive System Specification

A unified responsive hook & utility library should be established at `mobile/src/hooks/useResponsive.ts` and `mobile/src/utils/responsive.ts`.

#### Design Requirements:
1. **Adaptive Breakpoints**:
   - `isCompact`: `width <= 375` (iPhone SE 1/2/3, compact Android phones 320px–360px)
   - `isStandard`: `width > 375 && width < 768` (Standard iPhones 390px–430px, standard Android 380px–412px)
   - `isTablet`: `width >= 768` (iPad Mini, iPad Air/Pro 768px–1024px, Galaxy Fold unfolded)
2. **Dynamic Insets Integration**:
   - Consumes `useSafeAreaInsets()` from `react-native-safe-area-context`.
   - Exposes safe padding for top status bars, notches, dynamic islands, and bottom gesture indicators.
3. **Proportional Scaling Functions**:
   - Base guideline viewport: `width = 375`, `height = 812`.
   - `scale(size)`: linear scaling proportional to window width.
   - `verticalScale(size)`: linear scaling proportional to window height.
   - `moderateScale(size, factor = 0.5)`: clamped scale preventing grotesque over-scaling on tablets while providing appropriate enlargement on larger phones.
4. **Touch Target Accessibility Utility (`minTouchTarget`)**:
   - Ensures any interactive element meets the WCAG 2.1 AA and iOS Human Interface Guidelines minimum dimension of **44×44 pt**.
   - Provides `hitSlop` helper `{ top: 12, bottom: 12, left: 12, right: 12 }` for visually compact icons.
5. **Grid Column Calculation Utility**:
   - Dynamically calculates the optimal number of columns and exact card pixel width:
     - Compact (320px–375px): 2 columns (or 1 column if sidebar takes 80px)
     - Standard (376px–767px): 2 columns
     - Tablet (768px–1024px): 3 to 4 columns
     - Eliminates ragged margins and hard-clipped 220px cards.

#### Concrete Implementation: `mobile/src/hooks/useResponsive.ts`
```typescript
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';

const GUIDELINE_BASE_WIDTH = 375;
const GUIDELINE_BASE_HEIGHT = 812;

export interface ResponsiveContext {
  // Dimensions
  width: number;
  height: number;
  
  // Breakpoints
  isCompact: boolean;   // <= 375px
  isStandard: boolean;  // 376px - 767px
  isTablet: boolean;    // >= 768px
  isLandscape: boolean;

  // Safe area
  insets: EdgeInsets;
  bottomSafeHeight: number;
  topSafeHeight: number;

  // Scaling helpers
  scale: (size: number) => number;
  verticalScale: (size: number) => number;
  moderateScale: (size: number, factor?: number) => number;

  // Layout & Grid helpers
  contentMaxWidth: number;
  gridColumns: number;
  getCardWidth: (gap?: number, horizontalPadding?: number) => number;

  // Accessibility
  minTouchTarget: {
    minWidth: number;
    minHeight: number;
    justifyContent: 'center';
    alignItems: 'center';
  };
  hitSlop: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export function useResponsive(): ResponsiveContext {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isCompact = width <= 375;
  const isTablet = width >= 768;
  const isStandard = !isCompact && !isTablet;
  const isLandscape = width > height;

  const scale = (size: number) => (width / GUIDELINE_BASE_WIDTH) * size;
  const verticalScale = (size: number) => (height / GUIDELINE_BASE_HEIGHT) * size;
  const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

  const contentMaxWidth = isTablet ? 960 : isCompact ? width : Math.min(width, 680);
  const gridColumns = isTablet ? 4 : (isCompact && width < 340 ? 1 : 2);

  const getCardWidth = (gap = 8, horizontalPadding = 16) => {
    const totalGaps = (gridColumns - 1) * gap;
    const availableWidth = Math.min(width, contentMaxWidth) - horizontalPadding * 2 - totalGaps;
    return Math.floor(availableWidth / gridColumns);
  };

  const minTouchTarget = {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center' as const,
    alignItems: 'center' as const
  };

  const hitSlop = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10
  };

  return {
    width,
    height,
    isCompact,
    isStandard,
    isTablet,
    isLandscape,
    insets,
    bottomSafeHeight: insets.bottom > 0 ? insets.bottom : 12,
    topSafeHeight: insets.top > 0 ? insets.top : 16,
    scale,
    verticalScale,
    moderateScale,
    contentMaxWidth,
    gridColumns,
    getCardWidth,
    minTouchTarget,
    hitSlop
  };
}
```

---

## 5. Web-to-Mobile Component Audit: Missing Modals & Views

### 5.1 Missing Modals & Drawers Inventory

The following 9 components exist in `web/src/components/` and are completely absent in `mobile/src/components/`:

| Component Name | Web Location | Target Mobile Location | Key Features & Responsiveness Requirements |
| :--- | :--- | :--- | :--- |
| **1. `QuickProductModal`** | `web/src/components/QuickProductModal.tsx` | `mobile/src/components/QuickProductModal.tsx` | Centered modal (or bottom sheet on compact mobile), product image, discount badge, wishlist toggle, pack weight variant chips, ETA pill, unit price & MRP, Add to Cart / Stepper, "View Full Details →" link. |
| **2. `LocationModal`** | `web/src/components/LocationModal.tsx` | `mobile/src/components/LocationModal.tsx` | Delivery location selector, GPS detect action ("Detecting current GPS location..."), saved addresses list with radio selection, quick city chips (Gurugram, New Delhi, Bengaluru, etc.), "+ Add New" trigger. |
| **3. `LoginOtpModal`** | `web/src/components/LoginOtpModal.tsx` | `mobile/src/components/LoginOtpModal.tsx` | Dual-step modal: Phone number entry (+91) with demo quick-fill -> 4-digit OTP box inputs with 30s resend countdown and simulated 1-tap "Auto Fill (1234) & Login". |
| **4. `AddEditAddressModal`** | `web/src/components/AddEditAddressModal.tsx` | `mobile/src/components/AddEditAddressModal.tsx` | Address tag selector (Home, Work, Other), House/Flat No, Area/Road, Landmark, Pincode, Receiver Name, Phone number. Supports adding and editing existing addresses. `KeyboardAvoidingView` required. |
| **5. `ApplyCouponModal`** | `web/src/components/ApplyCouponModal.tsx` | `mobile/src/components/ApplyCouponModal.tsx` | Coupon code text input + Apply button, feedback message, active applied coupon box with savings and "Remove", list of available coupons with min order threshold and 1-tap apply. |
| **6. `CancelOrderModal`** | `web/src/components/CancelOrderModal.tsx` | `mobile/src/components/CancelOrderModal.tsx` | Refund warning card (Order #, grand total refund), cancellation reason radio options, "Don't Cancel" vs "Cancel Order" buttons. |
| **7. `RateOrderModal`** | `web/src/components/RateOrderModal.tsx` | `mobile/src/components/RateOrderModal.tsx` | Delivered order rating dialog: 1-5 star interactive selector with dynamic rating label ("Excellent • 5 Stars", etc.), review text area, "Submit Feedback" button. |
| **8. `FilterSortDrawer`** | `web/src/components/FilterSortDrawer.tsx` | `mobile/src/components/FilterSortDrawer.tsx` | Right slide-out drawer or bottom sheet for Category and Search screens: Sort radio options (Relevance, Price Low/High, Rating, Discount), brand multi-select checkboxes, Reset and Apply actions. |
| **9. `CartDrawer`** | `web/src/components/CartDrawer.tsx` | `mobile/src/components/CartDrawer.tsx` | Fast-access cart bottom drawer / modal containing item stepper list, free delivery progress bar, coupon trigger, partner tip selection (₹0, ₹10, ₹20, ₹30), itemized bill breakdown, and "Proceed to Pay" button. |

---

### 5.2 Mobile Screen Inventory & Defect Remediations

All 15 mobile screens audited for responsiveness, safe areas, and integration points:

| Screen File | Current Issues | Remediation Strategy |
| :--- | :--- | :--- |
| **`HomeScreen.tsx`** | Top header location selector navigates to full `SavedAddressesScreen` instead of opening `LocationModal`; search bar not flexible on 320px; hardcoded product grids; touch targets < 44pt; deprecated `SafeAreaView`. | Replace location trigger with `setIsLocationModalOpen(true)`; wrap in `useResponsive`; add product card quick view trigger; use `SafeAreaView` from `react-native-safe-area-context`. |
| **`CategoryScreen.tsx`** | Fixed 90px sidebar leaves 206px on 320px screens causing 1-column product squeeze; no filter/sort drawer; unvirtualized list; card minWidth 140 creates awkward margins. | Make sidebar responsive (75px on compact, 90px on standard, 120px on tablet); add Filter/Sort button invoking `setIsFilterDrawerOpen(true)`; implement dynamic grid width. |
| **`ProductDetailScreen.tsx`** | Sticky bottom buy bar (`position: absolute, bottom: 0`) occludes iPhone bottom gesture indicator; back button padding 4; image container fixed 260px; stepper buttons 18×30pt. | Add `paddingBottom: insets.bottom + 12` to bottom bar; scale image height with `moderateScale`; expand touch targets to 44×44pt; integrate `useResponsive`. |
| **`CartScreen.tsx`** | Coupon banner navigates to full screen `OffersCoupons` instead of `ApplyCouponModal`; lacks partner tip selection; sticky footer occludes home indicator; touch targets in stepper < 44pt. | Add tip selection (₹0, ₹10, ₹20, ₹30); trigger `setIsApplyCouponModalOpen(true)`; add bottom safe inset padding to footer; ensure 44×44pt touch targets. |
| **`CheckoutScreen.tsx`** | Missing itemized bill summary card (items, handling, tip, discount); back button padding 4; radio button 18×18pt. | Port complete bill breakdown card; expand payment option hit slop and radio size to 44×44pt touch target; dynamic content width for tablet. |
| **`OrderTrackingScreen.tsx`** | No Cancel Order button for placed orders; no Rate Order button for delivered orders; no call modal confirmation. | Connect `CancelOrderModal` for active orders; connect `RateOrderModal` for delivered orders; add receipt bill summary. |
| **`SearchResultsScreen.tsx`** | Raw horizontal `flexDirection: 'row'` for 5 filter chips causes severe horizontal clipping on 320px–360px devices; missing Filter/Sort drawer button. | Wrap filter chips in horizontal `ScrollView`; add Sort/Filter button linking to `FilterSortDrawer`; responsive grid column scaling. |
| **`OrdersHistoryScreen.tsx`** | "Cancel" button instantly executes cancellation with no confirmation or reason modal; no "Rate Experience" button on delivered orders; header text wraps awkwardly on 320px. | Trigger `setCancelOrderModalOrderId(order.id)` for cancellation modal; trigger `setRateOrderModalOrderId(order.id)` for rating modal; responsive header layout. |
| **`ProfileScreen.tsx`** | No login flow if user is logged out (cannot trigger `LoginOtpModal`); 4-stat boxes crowd labels ("Addresses") on 320px screens; logout button touch target. | When `!user.isLoggedIn`, display prominent "Log In / Sign Up" banner triggering `setIsLoginModalOpen(true)`; responsive 2×2 stat grid on compact viewports. |
| **`SavedAddressesScreen.tsx`** | Inline modal lacks `KeyboardAvoidingView` (inputs hidden beneath keyboard); modal presentation is rigid; no edit address capability. | Replace inline modal with `AddEditAddressModal`; add `KeyboardAvoidingView`; enable editing existing addresses via `editAddress`. |
| **`WishlistScreen.tsx`** | Fixed 220px card grid leaves random whitespace on tablet viewports; empty state button lacks standard touch height. | Integrate `useResponsive` grid column calculation (2 on mobile, 3–4 on tablet); full touch targets. |
| **`OffersCouponsScreen.tsx`** | Hardcoded coupon cards; alert dialogs instead of responsive modal feedback. | Responsive coupon cards; integrate with `applyCoupon` and `useResponsive`. |
| **`SupportScreen.tsx`** | Lacks `KeyboardAvoidingView` (chat input occluded when keyboard opens on iOS/Android); back button padding 4. | Wrap chat with `<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>`; ensure bottom safe inset on input bar. |
| **`FAQScreen.tsx`** | Search input lacks touch target padding; accordion chevron small touch target. | Accessible touch targets on search clear and accordion toggles; responsive padding. |
| **`AboutUsScreen.tsx`** | Fixed text line heights; lack of tablet multi-column layout for the 4 pillar cards. | Responsive 2-column pillar grid on tablet viewports; responsive typography. |

---

## 6. Target Directory & File Structure Blueprint

```
mobile/
├── App.tsx                           # Clean entry: StoreProvider -> SafeAreaProvider -> NavigationContainer -> RootNavigator -> GlobalModalManager
├── src/
│   ├── theme/                       # Centralized Design Tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── borderRadius.ts
│   │   ├── shadows.ts
│   │   └── index.ts
│   ├── hooks/                       # Shared Hooks
│   │   ├── useResponsive.ts         # Breakpoints, insets, scaling, minTouchTarget, grid
│   │   └── index.ts
│   ├── navigation/                  # Dedicated Navigation Module
│   │   ├── types.ts                 # RootStackParamList & navigation prop contracts
│   │   ├── RootNavigator.tsx        # Native Stack Navigator (15 screens)
│   │   ├── TabNavigator.tsx         # 5-Tab Navigator with dynamic insets
│   │   └── index.ts
│   ├── context/
│   │   └── StoreContext.tsx         # Extended with modal visibility, billSummary, sortBy, verifyOtp, editAddress
│   ├── components/
│   │   ├── ProductCard.tsx          # Responsive card with WCAG 44×44pt touch targets & quick view trigger
│   │   ├── GlobalModalManager.tsx   # Centralized overlay manager rendering all active modals
│   │   ├── QuickProductModal.tsx    # Ported from web
│   │   ├── LocationModal.tsx        # Ported from web
│   │   ├── LoginOtpModal.tsx        # Ported from web
│   │   ├── AddEditAddressModal.tsx  # Ported from web (with KeyboardAvoidingView)
│   │   ├── ApplyCouponModal.tsx     # Ported from web
│   │   ├── CancelOrderModal.tsx     # Ported from web
│   │   ├── RateOrderModal.tsx       # Ported from web
│   │   ├── FilterSortDrawer.tsx     # Ported from web
│   │   └── CartDrawer.tsx           # Ported from web
│   ├── screens/                     # 15 screens overhauled with useResponsive & SafeAreaView (react-native-safe-area-context)
│   └── types/
│       └── index.ts
```

---

## 7. Verification & Invalidation Standards

To ensure zero regressions across implementation phases, every phase must satisfy:

1. **Static Typing Verification**:
   ```bash
   npm run test:mobile
   ```
   Must compile with **0 type errors**.

2. **Expo Diagnostics**:
   ```bash
   npm --prefix mobile run doctor
   ```
   Must pass **20/20 checks**.

3. **Responsive Verification**:
   - Compact viewport (320px–375px): No horizontal overflow, no clipped text, no squashed stepper buttons.
   - Standard viewport (390px–430px): No bottom home indicator (34pt) occlusion on sticky action bars.
   - Tablet viewport (768px–1024px): Multi-column grids (3–4 columns), centered modal dialogs, no stretched full-width buttons.
   - Accessibility: All interactive touch targets ≥ 44×44 pt or protected by `hitSlop`.
