# Milestone 1: Theme & Design Tokens Specification (`mobile/src/theme/`)

## Executive Summary
This document provides the exhaustive technical specification and architectural plan for centralizing all visual styling constants into `mobile/src/theme/`. Across the 15 mobile screens, `ProductCard.tsx`, and web modal reference views, over 390 hardcoded hex color values, fragmented font sizes (ranging from 9pt to 28pt), custom border radiuses (4pt to 26pt), and ad-hoc shadows were inventoried. 

This specification establishes a robust design system that eliminates styling drift, unifies brand identity with Blinkit's signature green (`#0C831F`) and yellow (`#F8CB46`), and ensures 100% strict TypeScript typing without runtime overhead.

---

## 1. Inventory & Extraction Analysis

### 1.1 Color Inventory
| Category | Hardcoded Values Observed | Semantic Token Mapping | Usage Context |
|---|---|---|---|
| **Primary Brand** | `#0C831F` | `colors.primary` | CTAs, active tabs, brand logo "it", success states |
| **Primary Dark** | `#0A6D1A` | `colors.primaryDark` | Button pressed state, hover in web views |
| **Primary Light / Tint** | `#F7FCF8`, `#F8FFF9`, `#E8F5E9` | `colors.primaryLight`, `colors.primarySubtle` | Active address cards, tag backgrounds, coupon applied card |
| **Primary Border Tint** | `#C8E6C9`, `rgba(12, 131, 31, 0.2)` | `colors.primaryBorder` | Dashed promo code border, active selection border |
| **Secondary Brand** | `#F8CB46` | `colors.secondary` | Brand logo "blink", promo banner hero, active tracking dot, profile badge |
| **Secondary Accent** | `#EAB308`, `#F59E0B` | `colors.secondaryDark`, `colors.warning` | Star ratings, out-for-delivery status, expiry dates |
| **Secondary Light** | `#FFE08F`, `#FEF9C3`, `#FFFBEB` | `colors.secondaryLight`, `colors.secondarySubtle` | Gradient banners, warning alerts |
| **Danger / Red** | `#E23744`, `#EF4444`, `#DC2626` | `colors.error`, `colors.errorDark` | Discount badge, cancel order button, wishlist heart, delete address |
| **Danger Light / Tint** | `#FEE2E2`, `rgba(226, 55, 68, 0.1)` | `colors.errorLight` | Cancel button background, error banners |
| **Info / Blue** | `#2563EB`, `#3B82F6` | `colors.info` | Order placed & packing status badge |
| **Info Light / Tint** | `#EFF6FF`, `#DBEAFE` | `colors.infoLight` | Order status background pill |
| **Text Primary** | `#1C1C1C` | `colors.text.primary` | Headlines, product titles, prices, active modal text |
| **Text Secondary** | `#333333`, `#555555`, `#666666` | `colors.text.secondary`, `colors.text.body` | Descriptions, specs, bill summary labels, addresses |
| **Text Tertiary / Muted** | `#828282`, `#9E9E9E`, `#94A3B8` | `colors.text.tertiary`, `colors.text.muted` | Placeholder text, MRP strikethrough, timestamps, footer notes |
| **Text Inverse** | `#FFFFFF` | `colors.text.inverse` | Text on green/yellow buttons, badge text |
| **Scaffold Background** | `#F4F6FB` | `colors.background.app` | Base screen container background on all 15 mobile screens |
| **Card / Surface** | `#FFFFFF` | `colors.background.card` | Cards, modal content sheets, top headers, sticky footers |
| **Subdued Surface** | `#F8F9FA` | `colors.background.subdued` | Subcategory sidebar rail, product specification table box |
| **Border Default** | `#ECEFF1` | `colors.border.light` | Card borders, header bottom border, search input border |
| **Border Subtle** | `#F4F6FB` | `colors.border.subtle` | Item list dividers, inner card separators |
| **Border Medium** | `#CFD8DC`, `#B0BEC5` | `colors.border.medium` | Radio buttons, stepper inactive borders |
| **Modal Backdrop** | `rgba(0, 0, 0, 0.5)`, `rgba(0, 0, 0, 0.6)` | `colors.background.overlay` | Bottom sheet overlays, modal backdrops |

### 1.2 Typography Inventory
| Token | Size | Line Height | Typical Weight | Typical Screen Usage |
|---|---|---|---|---|
| `typography.fontSize.xxs` | 9pt | 12pt | `800` | Discount pill badge, ETA micro badge |
| `typography.fontSize.xs` | 10pt | 14pt | `700`, `800` | Bottom tab label, driver role tag, MRP strikethrough, category badge |
| `typography.fontSize.sm` | 11pt | 16pt | `600`, `700`, `800` | Pack weight, section headers, bill items, footer notes, see all text |
| `typography.fontSize.bodySm`| 12pt | 18pt | `500`, `600`, `700` | Product title, bill label, address details, spec label, FAQ answers |
| `typography.fontSize.md` | 13pt | 18pt | `700`, `800` | Product card price, coupon code, step title, bank offer title |
| `typography.fontSize.base` | 14pt | 20pt | `700`, `800` | Search input, button labels, card titles, order numbers |
| `typography.fontSize.lg` | 16pt | 22pt | `800`, `900` | Screen top header titles, hero subheadings, bill grand total |
| `typography.fontSize.xl` | 18pt | 24pt | `800`, `900` | Profile screen title, empty state title, promo banner title |
| `typography.fontSize.xxl` | 20pt | 26pt | `800`, `900` | Back button arrow symbol, bottom bar checkout price |
| `typography.fontSize.displaySm` | 24pt | 30pt | `900` | Profile avatar initial, large icon badges |
| `typography.fontSize.displayMd` | 28pt | 34pt | `900` | Brand logo "blinkit", live order tracking ETA large minutes |
| `typography.fontSize.displayLg` | 48pt-56pt | 56pt | `normal` | Empty cart / empty wishlist illustration emoji |

### 1.3 Spacing Scale Inventory
| Token Value | Semantic Alias | Measured Usage in Codebase |
|---|---|---|
| `2` | `spacing.xxs` | Badge vertical padding (`paddingVertical: 2`) |
| `4` | `spacing.xs` | Icon gap, wishlist button padding, micro margins (`gap: 4`, `padding: 4`) |
| `8` | `spacing.sm` | Small button padding, tag gap, horizontal badge padding (`gap: 8`, `padding: 8`) |
| `12` | `spacing.md` | Card inner padding, section headers margin bottom, search bar padding |
| `14` | `spacing.cardGap` | Card margin bottom, pill padding, drawer gap |
| `16` | `spacing.lg` / `gutter` | Screen container horizontal & vertical padding, card padding, modal body |
| `20` | `spacing.xl` | Section separation margin bottom, modal internal padding, hero padding |
| `24` | `spacing.xxl` | Empty state vertical spacing, save button margin top |
| `32` | `spacing.xxxl` | Empty container padding, wide spacing |
| `40` | `spacing.huge` | Large empty container vertical spacing |

### 1.4 Border Radius Inventory
| Token | Value | Applied UI Elements |
|---|---|---|
| `borderRadius.xs` | 4pt | Discount badge, chat bubble tail anchor (`borderBottomLeftRadius: 4`) |
| `borderRadius.sm` | 6pt | Small thumbnails, promo tag pills, category image corners |
| `borderRadius.md` | 8pt | Add to cart button, stepper container, coupon code badge |
| `borderRadius.input` | 10pt | Search inputs, payment option items, stepper pill |
| `borderRadius.lg` | 12pt | Category icon circle, eta card, pay button, coupon action cards |
| `borderRadius.card` | 14pt | Product card, items card, order history card, bank offer card |
| `borderRadius.xl` | 16pt | Hero promo banner, user profile card, image container box |
| `borderRadius.modal` | 20pt | Floating cart bar, filter chip rounded pill, chat input bar |
| `borderRadius.sheet` | 24pt | Bottom sheet modal top corners (`borderTopLeftRadius: 24`) |
| `borderRadius.full` | 9999pt | Circular avatar, close button, wishlist circular toggle, radio button |

### 1.5 Shadow Scale Inventory
1. **`shadows.none`**: Reset for flat surfaces (`elevation: 0`).
2. **`shadows.card`**: Subtle elevation for `ProductCard` and `OrderCard`:
   - `shadowColor: '#000000'`, `offset: { width: 0, height: 2 }`, `opacity: 0.05`, `radius: 6`, `elevation: 2`.
3. **`shadows.md`**: Medium elevation for popovers and dropdowns:
   - `shadowColor: '#000000'`, `offset: { width: 0, height: 4 }`, `opacity: 0.08`, `radius: 8`, `elevation: 4`.
4. **`shadows.modal`**: Deep elevation for centered dialogs and modals:
   - `shadowColor: '#000000'`, `offset: { width: 0, height: 8 }`, `opacity: 0.16`, `radius: 20`, `elevation: 10`.
5. **`shadows.bottomSheet`**: Upward shadow for bottom sheets and sticky footers:
   - `shadowColor: '#000000'`, `offset: { width: 0, height: -4 }`, `opacity: 0.10`, `radius: 12`, `elevation: 10`.
6. **`shadows.primaryGlow`**: Signature brand glow for the floating cart bar:
   - `shadowColor: '#0C831F'`, `offset: { width: 0, height: 4 }`, `opacity: 0.35`, `radius: 10`, `elevation: 6`.

---

## 2. Target Module Architecture (`mobile/src/theme/`)

```
mobile/src/theme/
├── colors.ts        # Primary, secondary, status, text, background, border tokens
├── typography.ts    # Cross-platform fonts, size, lineHeight, weight scale
├── spacing.ts       # Strict 2, 4, 8, 12, 16, 20, 24, 32, 40 scale & layout helpers
├── borderRadius.ts  # Standard sm, md, lg, xl, full scale with semantic aliases
├── shadows.ts       # Typed ViewStyle elevations for iOS & Android
└── index.ts         # Consolidated export 'theme' and individual token re-exports
```

---

## 3. Concrete Code Specifications

### 3.1 `mobile/src/theme/colors.ts`
```typescript
/**
 * Blinkit Mobile Design System - Color Tokens
 */

export const colors = {
  // Brand Flagship
  primary: '#0C831F',
  primaryDark: '#0A6D1A',
  primaryLight: '#F7FCF8',
  primarySubtle: '#E8F5E9',
  primaryBorder: '#C8E6C9',

  // Secondary Brand (Yellow)
  secondary: '#F8CB46',
  secondaryDark: '#EAB308',
  secondaryLight: '#FEF9C3',
  secondarySubtle: '#FFFBEB',
  secondaryGradientEnd: '#FFE08F',

  // Semantic Status Badges & Alerts
  success: '#0C831F',
  successLight: '#E8F5E9',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorDark: '#E23744',
  errorLight: '#FEE2E2',
  info: '#2563EB',
  infoLight: '#EFF6FF',

  // Text Hierarchy
  text: {
    primary: '#1C1C1C',
    secondary: '#666666',
    tertiary: '#828282',
    muted: '#9E9E9E',
    body: '#333333',
    bodyLight: '#555555',
    inverse: '#FFFFFF',
    brand: '#0C831F',
    warning: '#F59E0B',
    error: '#EF4444',
  },

  // Surfaces & Backgrounds
  background: {
    app: '#F4F6FB',
    card: '#FFFFFF',
    surface: '#FFFFFF',
    subdued: '#F8F9FA',
    modal: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.6)',
    overlaySubtle: 'rgba(0, 0, 0, 0.4)',
  },

  // Borders & Hairline Dividers
  border: {
    subtle: '#F4F6FB',
    light: '#ECEFF1',
    divider: '#F0EDED',
    medium: '#CFD8DC',
    dark: '#B0BEC5',
    active: '#0C831F',
    error: '#FEE2E2',
    brandLight: '#C8E6C9',
  },

  // Base Neutrals
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type Colors = typeof colors;
```

### 3.2 `mobile/src/theme/typography.ts`
```typescript
import { Platform, TextStyle } from 'react-native';

/**
 * Blinkit Mobile Design System - Typography Tokens
 */

export const typography = {
  fontFamily: {
    regular: Platform.select({ ios: 'System', android: 'Roboto', default: 'sans-serif' }),
    medium: Platform.select({ ios: 'System', android: 'Roboto-Medium', default: 'sans-serif' }),
    bold: Platform.select({ ios: 'System', android: 'Roboto-Bold', default: 'sans-serif' }),
  },
  fontSize: {
    xxs: 9,
    xs: 10,
    sm: 11,
    bodySm: 12,
    md: 13,
    base: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    displaySm: 24,
    displayMd: 28,
    displayLg: 48,
  },
  lineHeight: {
    xxs: 12,
    xs: 14,
    sm: 16,
    bodySm: 18,
    md: 18,
    base: 20,
    lg: 22,
    xl: 24,
    xxl: 26,
    displaySm: 30,
    displayMd: 34,
    displayLg: 56,
  },
  fontWeight: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semiBold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    extraBold: '800' as TextStyle['fontWeight'],
    black: '900' as TextStyle['fontWeight'],
  },
} as const;

export type Typography = typeof typography;
```

### 3.3 `mobile/src/theme/spacing.ts`
```typescript
/**
 * Blinkit Mobile Design System - Spacing Scale
 * Standardized scale: 2, 4, 8, 12, 16, 20, 24, 32, 40
 */

export const spacing = {
  // Direct numeric scale
  0: 0,
  2: 2,
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,

  // Named semantic tokens
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  cardGap: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,

  // Common Layout Dimensions
  gutter: 16,
  cardPadding: 12,
  screenPadding: 16,
  sectionGap: 20,
  headerHeight: 60,
  tabBarHeight: 60,
  minTouchTarget: 44, // WCAG accessibility standard
} as const;

export type Spacing = typeof spacing;
```

### 3.4 `mobile/src/theme/borderRadius.ts`
```typescript
/**
 * Blinkit Mobile Design System - Border Radius Scale
 */

export const borderRadius = {
  // Standard Scale
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,

  // Extended Semantic Scale
  xs: 4,
  badge: 4,
  tag: 6,
  button: 8,
  input: 10,
  card: 14,
  banner: 16,
  modal: 20,
  sheet: 24,
  pill: 9999,
  round: 9999,
} as const;

export type BorderRadius = typeof borderRadius;
```

### 3.5 `mobile/src/theme/shadows.ts`
```typescript
import { ViewStyle } from 'react-native';

/**
 * Blinkit Mobile Design System - Elevation & Shadows
 * Fully cross-platform: shadow* properties for iOS/web, elevation for Android.
 */

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,

  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  } as ViewStyle,

  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  } as ViewStyle,

  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,

  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  } as ViewStyle,

  modal: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
  } as ViewStyle,

  bottomSheet: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 10,
  } as ViewStyle,

  primaryGlow: {
    shadowColor: '#0C831F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  } as ViewStyle,
} as const;

export type Shadows = typeof shadows;
```

### 3.6 `mobile/src/theme/index.ts`
```typescript
/**
 * Blinkit Mobile Theme - Central Barrel Export
 */

import { colors, Colors } from './colors';
import { typography, Typography } from './typography';
import { spacing, Spacing } from './spacing';
import { borderRadius, BorderRadius } from './borderRadius';
import { shadows, Shadows } from './shadows';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} as const;

export type Theme = typeof theme;

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './borderRadius';
export * from './shadows';

export default theme;
```

---

## 4. Migration Plan for Components & Screens

When the builder agent begins Milestone 1 implementation and refactoring in Milestone 3, the following drop-in replacement patterns will be used across all components:

### 4.1 ProductCard Example Refactoring
```typescript
// Before:
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#F7FCF8',
    borderColor: '#0C831F',
    borderRadius: 8,
  },
  addText: {
    color: '#0C831F',
    fontSize: 12,
    fontWeight: '800',
  }
});

// After:
import { theme } from '../theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.card,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    padding: 10,
    ...theme.shadows.card,
  },
  addButton: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.button,
  },
  addText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.bodySm,
    fontWeight: theme.typography.fontWeight.extraBold,
  }
});
```

### 4.2 Status Badge Example Refactoring
```typescript
// Before:
const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': return '#0C831F';
    case 'on_the_way': return '#F59E0B';
    case 'placed':
    case 'packing': return '#2563EB';
    case 'cancelled': return '#EF4444';
    default: return '#666666';
  }
};

// After:
import { colors } from '../theme';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': return colors.success;
    case 'on_the_way': return colors.warning;
    case 'placed':
    case 'packing': return colors.info;
    case 'cancelled': return colors.error;
    default: return colors.text.secondary;
  }
};
```

---

## 5. TypeScript Verification & Test Strategy
1. **Compilation Guarantee**: Strict typecheck using `npm run test:mobile` (`tsc --noEmit`).
2. **Zero Any Policy**: All theme keys are strongly typed literals with `as const` or explicit React Native style typing (`TextStyle['fontWeight']`, `ViewStyle`).
3. **Immutability**: `as const` assertion guarantees token values cannot be mutated at runtime.
4. **Co-existence with `useResponsive`**: The theme tokens supply the static base metrics, while `useResponsive` scales dimensions (`scale(theme.spacing.lg)`) or supplies responsive columns and safe-area insets dynamically.
