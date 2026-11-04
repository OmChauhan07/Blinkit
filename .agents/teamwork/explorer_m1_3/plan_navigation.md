# Milestone 1: Navigation Modularization & SafeArea Architecture Specification

**Author**: explorer_m1_3 (Teamwork Explorer)  
**Target Module**: `mobile/src/navigation/` & `mobile/App.tsx`  
**Date**: 2026-11-03  
**Status**: SPECIFICATION COMPLETE (Ready for Implementation)  

---

## 1. Executive Summary & Objective

In the current codebase, the entire navigation structure, screen registrations, tab bar definitions, inline components, and styles are lumped into a single 173-line `mobile/App.tsx` file. Crucially:
1. `react-native-safe-area-context` is installed in `package.json` (`~5.10.1`), but `<SafeAreaProvider>` was **omitted** at the app root, preventing safe area insets from being read reliably across screens and navigation bars.
2. The tab bar has hardcoded sizing (`height: 60`, `paddingBottom: 8`), causing tab items and labels to collide with gesture navigation bars / home indicator bars on modern iOS and Android devices (where bottom insets are 34px).
3. All 15 mobile screens receive untyped `{ navigation: any }` or `{ route: any, navigation: any }`, with no centralized `RootStackParamList` or `BottomTabParamList` type contracts.

This specification details the complete modularization of navigation into `mobile/src/navigation/` (`types.ts`, `TabNavigator.tsx`, `RootNavigator.tsx`, `index.ts`), dynamic safe area bottom inset padding, and the refactor of `mobile/App.tsx` into a clean root provider hierarchy (`<StoreProvider>` -> `<SafeAreaProvider>` -> `<NavigationContainer>` -> `<RootNavigator />`).

---

## 2. Codebase Audit: Current State vs Target Architecture

### 2.1 Current `mobile/App.tsx` Deficiencies
- **Line Count**: 173 lines containing `CategoriesTab`, `PrintTab`, `MainTabNavigator`, `App`, and `styles`.
- **Missing Root Provider**: `<NavigationContainer>` is rendered directly inside `<StoreProvider>` without `<SafeAreaProvider>`.
- **Bottom Tab Sizing**:
  ```typescript
  tabBarStyle: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#ECEFF1',
    height: 60,
    paddingBottom: 8,
    paddingTop: 6
  }
  ```
  On devices with `insets.bottom === 34` (e.g. iPhone 12/13/14/15/16, gesture Android), the bottom 34px overlap directly with tab label text and icons.
- **Untyped Navigation**: Navigators and screen components use `any`. Route parameters (`slug`, `productId`, `orderId`, `query`) are passed without compile-time contract enforcement.

### 2.2 Screen Navigation & Route Parameter Audit (All 15 Screens)

| Screen File | Current Props | Route Parameters Used | Navigation Actions Executed |
| :--- | :--- | :--- | :--- |
| `HomeScreen.tsx` | `{ navigation: any }` | None (`undefined`) | `navigate('SavedAddresses')`, `navigate('Profile')`, `navigate('Search')`, `navigate('Category', { slug })`, `navigate('CategoriesTab')`, `navigate('ProductDetail', { productId })`, `navigate('Cart')` |
| `CategoryScreen.tsx` | `{ route: any, navigation: any }` | `slug?: string` (defaults to `'dairy-bread-eggs'`) | `goBack()`, `navigate('HomeTab')`, `navigate('Search')`, `navigate('ProductDetail', { productId })` |
| `ProductDetailScreen.tsx` | `{ route: any, navigation: any }` | `productId: string` (falls back to `PRODUCTS[0].id`) | `goBack()`, `navigate('HomeTab')`, `navigate('Cart')` |
| `CartScreen.tsx` | `{ navigation: any }` | None (`undefined`) | `goBack()`, `navigate('HomeTab')`, `navigate('OffersCoupons')`, `navigate('Checkout')` |
| `CheckoutScreen.tsx` | `{ navigation: any }` | None (`undefined`) | `goBack()`, `replace('OrderTracking', { orderId })` |
| `OrderTrackingScreen.tsx` | `{ route: any, navigation: any }` | `orderId?: string` (defaults to `'ord-101'`) | `navigate('HomeTab')` |
| `SearchResultsScreen.tsx` | `{ navigation: any }` | `query?: string` (search state in StoreContext) | `goBack()`, `navigate('ProductDetail', { productId })`, `navigate('CategoriesTab')` |
| `OrdersHistoryScreen.tsx` | `{ navigation: any }` | None (`undefined`) | `goBack()`, `navigate('Cart')`, `navigate('HomeTab')`, `navigate('OrderTracking', { orderId })` |
| `ProfileScreen.tsx` | `{ navigation: any }` | None (`undefined`) | `navigate('OrdersHistory')`, `navigate('SavedAddresses')`, `navigate('Wishlist')`, `navigate('OffersCoupons')`, `navigate('Support')`, `navigate('FAQ')`, `navigate('AboutUs')` |
| `SavedAddressesScreen.tsx` | `{ navigation: any }` | None (`undefined`) | `goBack()` |
| `WishlistScreen.tsx` | `{ navigation: any }` | None (`undefined`) | `goBack()`, `navigate('HomeTab')`, `navigate('ProductDetail', { productId })` |
| `OffersCouponsScreen.tsx` | `{ navigation: any }` | None (`undefined`) | `goBack()`, `navigate('Cart')` |
| `SupportScreen.tsx` | `{ navigation: any }` | None (`undefined`) | `goBack()` |
| `FAQScreen.tsx` | `{ navigation: any }` | None (`undefined`) | `goBack()`, `navigate('Support')` |
| `AboutUsScreen.tsx` | `{ navigation: any }` | None (`undefined`) | `goBack()` |

---

## 3. Modular Architecture Specification

The navigation system is structured into four dedicated files under `mobile/src/navigation/`:

```
mobile/src/navigation/
├── types.ts          # Complete TypeScript types: RootStackParamList, MainTabParamList, ScreenProps
├── TabNavigator.tsx  # Dynamic safe-area inset bottom tab bar with 5 primary tabs
├── RootNavigator.tsx # Native stack navigator configuring all 15 screens with smooth transitions
└── index.ts          # Barrel export for navigators and types
```

---

## 4. File-by-File Technical Specification

### 4.1 `mobile/src/navigation/types.ts`

#### Design Decisions:
1. Define `MainTabParamList` for the 5 bottom tabs: `HomeTab`, `CategoriesTab`, `PrintTab`, `OrdersTab`, `ProfileTab`.
2. Define `RootStackParamList` for all 15 stack screens. Notice both `'Search'` and `'SearchResults'` are supported to ensure backwards compatibility with existing screen references and parity with new specifications.
3. Include tab screen names in `RootStackParamList` as shortcuts so direct navigation calls from any screen (such as `navigation.navigate('HomeTab')` or `navigation.navigate('CategoriesTab')`) compile with 0 TypeScript errors.
4. Export helper types `RootStackScreenProps<T>` and `MainTabScreenProps<T>`.
5. Augment the global namespace `ReactNavigation` so `useNavigation()` hook is strictly typed throughout the application.

#### Proposed Code:
```typescript
import type { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

/**
 * Route parameter contract for Bottom Tab Navigator
 */
export type MainTabParamList = {
  HomeTab: undefined;
  CategoriesTab: { slug?: string } | undefined;
  PrintTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};

/**
 * Route parameter contract for Root Native Stack Navigator
 * Encompasses all 15 mobile screens + MainTabs + direct Tab shortcuts
 */
export type RootStackParamList = {
  // Main Tab container
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;

  // Primary Stack Screens (15 screens total)
  Category: { slug?: string } | undefined;
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderTracking: { orderId?: string } | undefined;
  Search: { query?: string } | undefined;
  SearchResults: { query?: string } | undefined; // Compatibility alias
  OrdersHistory: undefined;
  Profile: undefined;
  SavedAddresses: undefined;
  Wishlist: undefined;
  OffersCoupons: undefined;
  Support: undefined;
  FAQ: undefined;
  AboutUs: undefined;

  // Direct tab screen shortcuts (enables navigation.navigate('HomeTab') from any screen)
  HomeTab: undefined;
  CategoriesTab: { slug?: string } | undefined;
  PrintTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};

/**
 * Navigation Prop Types
 */
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Screen Props Type Helpers
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

/**
 * Individual Screen Prop Signatures for Clean Consumption
 */
export type HomeScreenProps = MainTabScreenProps<'HomeTab'>;
export type CategoriesTabScreenProps = MainTabScreenProps<'CategoriesTab'>;
export type PrintTabScreenProps = MainTabScreenProps<'PrintTab'>;
export type CategoryScreenProps = RootStackScreenProps<'Category'>;
export type ProductDetailScreenProps = RootStackScreenProps<'ProductDetail'>;
export type CartScreenProps = RootStackScreenProps<'Cart'>;
export type CheckoutScreenProps = RootStackScreenProps<'Checkout'>;
export type OrderTrackingScreenProps = RootStackScreenProps<'OrderTracking'>;
export type SearchResultsScreenProps = RootStackScreenProps<'Search'>;
export type OrdersHistoryScreenProps = RootStackScreenProps<'OrdersHistory'>;
export type ProfileScreenProps = RootStackScreenProps<'Profile'>;
export type SavedAddressesScreenProps = RootStackScreenProps<'SavedAddresses'>;
export type WishlistScreenProps = RootStackScreenProps<'Wishlist'>;
export type OffersCouponsScreenProps = RootStackScreenProps<'OffersCoupons'>;
export type SupportScreenProps = RootStackScreenProps<'Support'>;
export type FAQScreenProps = RootStackScreenProps<'FAQ'>;
export type AboutUsScreenProps = RootStackScreenProps<'AboutUs'>;

/**
 * Global React Navigation Type Augmentation
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

---

### 4.2 `mobile/src/navigation/TabNavigator.tsx`

#### Design Decisions:
1. **Dynamic Safe Area Bottom Inset**:
   Use `useSafeAreaInsets()` from `react-native-safe-area-context`.
   Formula specified:
   - `height: 60 + insets.bottom`
   - `paddingBottom: insets.bottom > 0 ? insets.bottom : 8`
   - `paddingTop: 6`
   
   Behavior:
   - **Compact / No-Inset Devices** (`insets.bottom === 0` e.g., iPhone SE, 3-button Android):
     Height = `60 + 0 = 60`
     Padding bottom = `8`
     Matches existing style 100%.
   - **Modern Notched / Gesture Devices** (`insets.bottom === 34` e.g., iPhone 13-16, gesture Android):
     Height = `60 + 34 = 94`
     Padding bottom = `34`
     The content (icon + label) is positioned in the top 60px; the 34px bottom padding pushes icons safely above the home indicator gesture line.
   - **Tablets** (`insets.bottom === 20` e.g., iPad):
     Height = `60 + 20 = 80`
     Padding bottom = `20`.

2. **Inline Component Porting**:
   - `CategoriesTab`: Wraps `CategoryScreen` providing default params `{ slug: 'dairy-bread-eggs' }`.
   - `PrintTab`: Preserves the 10-Minute Dark Store Document Printing screen with responsive styling.

3. **Tab Configuration**:
   - Active tint: `#0C831F` (Blinkit Green)
   - Inactive tint: `#828282`
   - Background: `#FFFFFF`
   - Border top: `#ECEFF1` with `borderTopWidth: 1`
   - Label style: `fontSize: 10, fontWeight: '700'`

#### Proposed Code:
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MainTabParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { CategoryScreen } from '../screens/CategoryScreen';
import { OrdersHistoryScreen } from '../screens/OrdersHistoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Categories Tab default view with initial slug
 */
const CategoriesTab: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => (
  <CategoryScreen
    route={{
      key: 'CategoriesTab',
      name: 'Category',
      params: { slug: route?.params?.slug || 'dairy-bread-eggs' }
    }}
    navigation={navigation}
  />
);

/**
 * Blinkit 10-Minute Dark Store Print Delivery Tab
 */
const PrintTab: React.FC = () => (
  <View style={styles.centerContainer}>
    <Text style={styles.iconBig}>🖨️</Text>
    <Text style={styles.tabTitle}>Blinkit Print Delivery</Text>
    <Text style={styles.tabSubtitle}>
      Upload documents & get color or B/W prints delivered to your doorstep in 10 minutes.
    </Text>
    <View style={styles.printBadge}>
      <Text style={styles.printBadgeText}>⚡ 10-Minute Dark Store Printing</Text>
    </View>
  </View>
);

export const TabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0C831F',
        tabBarInactiveTintColor: '#828282',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#ECEFF1',
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700'
        }
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Delivery',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>⚡</Text>
        }}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesTab}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🍱</Text>
        }}
      />
      <Tab.Screen
        name="PrintTab"
        component={PrintTab}
        options={{
          tabBarLabel: 'Print',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🖨️</Text>
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersHistoryScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🧾</Text>
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text>
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  iconBig: {
    fontSize: 48,
    marginBottom: 12
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1C1C',
    marginBottom: 6
  },
  tabSubtitle: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16
  },
  printBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  printBadgeText: {
    color: '#0C831F',
    fontWeight: '800',
    fontSize: 12
  }
});
```

---

### 4.3 `mobile/src/navigation/RootNavigator.tsx`

#### Design Decisions:
1. Built with `createNativeStackNavigator<RootStackParamList>()` from `@react-navigation/native-stack`.
2. `screenOptions={{ headerShown: false, animation: 'slide_from_right' }}` provides clean, native transition animations across iOS and Android without header flickering.
3. Configures `MainTabs` plus all 14 individual screens (registering both `Search` and `SearchResults` aliases for `SearchResultsScreen`).

#### Proposed Code:
```typescript
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';

import { CategoryScreen } from '../screens/CategoryScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrderTrackingScreen } from '../screens/OrderTrackingScreen';
import { SearchResultsScreen } from '../screens/SearchResultsScreen';
import { OrdersHistoryScreen } from '../screens/OrdersHistoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SavedAddressesScreen } from '../screens/SavedAddressesScreen';
import { WishlistScreen } from '../screens/WishlistScreen';
import { OffersCouponsScreen } from '../screens/OffersCouponsScreen';
import { SupportScreen } from '../screens/SupportScreen';
import { FAQScreen } from '../screens/FAQScreen';
import { AboutUsScreen } from '../screens/AboutUsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="Search" component={SearchResultsScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="OrdersHistory" component={OrdersHistoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="OffersCoupons" component={OffersCouponsScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="FAQ" component={FAQScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
    </Stack.Navigator>
  );
};
```

---

### 4.4 `mobile/src/navigation/index.ts`

#### Proposed Code:
```typescript
export * from './types';
export * from './TabNavigator';
export * from './RootNavigator';
```

---

### 4.5 Refactored `mobile/App.tsx`

#### Design Decisions:
1. Strict container hierarchy conforming to `PROJECT.md`:
   `<StoreProvider>` -> `<SafeAreaProvider>` -> `<NavigationContainer>` -> `<RootNavigator />`
2. Preserves `<StatusBar style="dark" />` from `expo-status-bar`.
3. Strips away all local styles and screen imports, leaving a clean, 18-line entry file.
4. Leaves space for `<GlobalModalManager />` (planned for Milestone 2) to mount directly inside `<SafeAreaProvider>` alongside `<RootNavigator />`.

#### Proposed Code:
```typescript
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { StoreProvider } from './src/context/StoreContext';
import { RootNavigator } from './src/navigation';

export default function App() {
  return (
    <StoreProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </StoreProvider>
  );
}
```

---

## 5. SafeArea Architecture & Multi-Device Responsive Analysis

### 5.1 Safe Area Lifecycle Flow
```
┌────────────────────────────────────────────────────────┐
│ App.tsx: <SafeAreaProvider>                            │
│ (Reads physical device window, status bar, home inset) │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────────────┐ ┌───────────────────────────────┐
│ TabNavigator.tsx              │ │ Screens & Modals              │
│ useSafeAreaInsets()           │ │ useResponsive()               │
│ -> height: 60 + insets.bottom │ │ -> insets.top, bottom, padding│
│ -> paddingBottom: insets.btm  │ │ -> avoid notch & home bar     │
└───────────────────────────────┘ └───────────────────────────────┘
```

### 5.2 Device Form Factor Comparison

| Device Category | Example Device | Dimensions | Bottom Inset (`insets.bottom`) | Computed `tabBarStyle.height` | Computed `paddingBottom` | Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Compact (Small Phone)** | iPhone SE (2nd/3rd gen) | 375 × 667 | `0 px` | `60 px` | `8 px` | Full touch target without wasted bottom space |
| **Compact Android** | Small Android (3-button) | 360 × 640 | `0 px` | `60 px` | `8 px` | No conflict with hardware/OS 3 buttons |
| **Standard Phone** | iPhone 13/14/15/16 | 390-393 × 844-852 | `34 px` | `94 px` | `34 px` | Tab labels 100% elevated above gesture line |
| **Standard Android** | Pixel 7/8 / Galaxy S23 | 412 × 915 | `24 px` | `84 px` | `24 px` | Perfect elevation above swipe pill |
| **Foldable (Unfolded)** | Galaxy Z Fold 5 | 768 × 960 | `20 px` | `80 px` | `20 px` | Clean landscape & tablet proportion |
| **Tablet** | iPad (10th gen) / Air | 820 × 1180 | `20 px` | `80 px` | `20 px` | Ample tap area; no collision |

---

## 6. Implementation & Verification Plan

### 6.1 Verification Commands
Once the files are created and `mobile/App.tsx` is updated:

1. **TypeScript Compilation Check**:
   ```powershell
   npm run typecheck --prefix mobile
   ```
   **Pass Criteria**: Zero errors (`tsc --noEmit` exits with code 0).

2. **Expo Diagnostics**:
   ```powershell
   npm --prefix mobile run doctor
   ```
   **Pass Criteria**: 20/20 checks pass with no missing or conflicting dependencies.

3. **Workspace Integrated Test**:
   ```powershell
   npm run test:mobile
   ```
   **Pass Criteria**: Monorepo test script succeeds with code 0.

---

## 7. Downstream Milestones Integration Points

- **Milestone 2 (State & Web Modals Parity)**:
  `mobile/App.tsx` will receive `<GlobalModalManager />` adjacent to `<RootNavigator />` inside `<SafeAreaProvider>`.
- **Milestone 3 (Mobile Screens Overhaul)**:
  Screens will import strongly-typed props (`HomeScreenProps`, `CategoryScreenProps`, etc.) from `'../navigation/types'`, replacing `navigation: any` and `route: any`.
