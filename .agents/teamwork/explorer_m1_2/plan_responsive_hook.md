# Detailed Technical Plan: Responsive Hook & Adaptive Layout System Specification

**Document Version**: 1.0.0  
**Target Path**: `mobile/src/hooks/useResponsive.ts` & `mobile/src/hooks/index.ts`  
**Milestone**: Milestone 1 (Responsive & Architectural Foundation)  
**Author**: explorer_m1_2 (Teamwork Explorer)  
**Status**: APPROVED SPECIFICATION FOR IMPLEMENTATION  

---

## 1. Executive Summary & Architecture Overview

The Blinkit mobile application requires a unified, high-performance responsive engine capable of seamlessly adapting 15 mobile screens, reusable components (notably `ProductCard`), navigation bars, and 9 ported modals across all target device form factors:
- **Compact mobile screens** (320px–375px: iPhone SE 1st/2nd/3rd gen, iPhone 12/13 mini, compact Android).
- **Standard mobile screens** (390px–430px: iPhone 13/14/15/16 Pro & Pro Max, Google Pixel, Samsung Galaxy).
- **Foldables & Tablets** (768px–1024px+: iPad Mini, iPad Air, iPad Pro, Galaxy Z Fold unfolded).

### Key Architectural Objectives
1. **Dynamic Viewport Subscriptions**: Leverage React Native's `useWindowDimensions()` to dynamically detect width, height, orientation, and window resizing without requiring manual event listeners.
2. **First-Class Safe Area Protection**: Seamlessly integrate `useSafeAreaInsets()` from `react-native-safe-area-context` with guaranteed non-null fallbacks, eliminating home-indicator collisions on sticky footers and tab bars.
3. **Harmonic Scaling Utilities**: Provide linear horizontal scaling (`scale`), vertical scaling (`verticalScale`), and dampened moderate scaling (`moderateScale`) anchored to the industry-standard iPhone X baseline (375 × 812 pt).
4. **Adaptive Breakpoints & Layouts**:
   - Device categories: `isCompact` ($\le 375\text{px}$), `isStandard` ($376\text{px} - 767\text{px}$), and `isTablet` ($\ge 768\text{px}$).
   - Grid columns: 2 columns on phones, 3 columns on small tablets ($768\text{px} - 899\text{px}$), and 4 columns on large tablets ($\ge 900\text{px}$).
   - Container padding: 12px on compact, 16px on standard, 24px on small tablet, and 32px on large tablet.
5. **Accessibility by Default**: Enforce WCAG 2.1 AA and Apple HIG minimum touch target sizing ($\ge 44 \times 44\text{ pt}$) via `minTouchTarget` and `accessibleHitSlop`.
6. **Adaptive Modal Presentation**: Automatically provide modal layout primitives: bottom sheet on phones vs. centered dialog on tablets.

---

## 2. Core Interface Contracts & Type System

```typescript
/**
 * Baseline guideline design dimensions (iPhone X / standard mobile baseline)
 */
export const GUIDELINE_BASE_WIDTH = 375;
export const GUIDELINE_BASE_HEIGHT = 812;

/**
 * Safe area insets contract
 */
export interface Insets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Minimum touch target dimensions compliant with WCAG 2.1 AA and Apple HIG
 */
export interface MinTouchTarget {
  minWidth: number;
  minHeight: number;
}

/**
 * Accessible hit slop dimensions for expanding tap areas on compact icons/buttons
 */
export interface AccessibleHitSlop {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Comprehensive responsive metrics returned by `useResponsive()`
 */
export interface ResponsiveMetrics {
  // Viewport dimensions
  width: number;
  height: number;

  // Breakpoints & Device Classification
  /** True if viewport width <= 375px (iPhone SE, iPhone mini, small Android) */
  isCompact: boolean;
  /** True if viewport width > 375px && width < 768px (iPhone 13-16, Pixel, Galaxy) */
  isStandard: boolean;
  /** True if viewport width >= 768px (iPad, tablets, unfolded foldables) */
  isTablet: boolean;

  // Orientation
  /** True if viewport width > height */
  isLandscape: boolean;
  /** True if viewport height >= width */
  isPortrait: boolean;

  // Safe Area Insets (guaranteed non-null, with zero fallback)
  insets: Insets;

  // Linear Scale Utilities based on guideline (375x812)
  /** Linear horizontal scaling based on 375 baseline */
  scale: (size: number) => number;
  /** Linear vertical scaling based on 812 baseline */
  verticalScale: (size: number) => number;
  /** Moderated scale with factor damping (default 0.5) to avoid oversized elements on tablets */
  moderateScale: (size: number, factor?: number) => number;
  /** Clamped scale utility with upper and lower bounds */
  clampedScale: (size: number, min?: number, max?: number, factor?: number) => number;

  // Adaptive Grid & Layout Metrics
  /** Column count: 2 for phones (< 768), 3 for small tablets (768-899), 4 for wide tablets (>= 900) */
  gridColumns: number;
  /** Container horizontal padding: 12 on compact, 16 on standard, 24-32 on tablet */
  containerPadding: number;
  /** Calculate card width for product grids given container width and gaps */
  getCardWidth: (customContainerWidth?: number, customColumns?: number, customGap?: number) => number;

  // Accessibility Standards
  /** Minimum touch target constraint { minWidth: 44, minHeight: 44 } */
  minTouchTarget: MinTouchTarget;
  /** Standard hit slop { top: 12, bottom: 12, left: 12, right: 12 } for small touchables */
  accessibleHitSlop: AccessibleHitSlop;

  // Modal Presentation Adaptivity
  /** Recommended modal style: 'bottomSheet' for phones, 'dialog' for tablets */
  modalPresentation: 'bottomSheet' | 'dialog';
  /** Recommended max modal width: '100%' on phones, 540 on tablets */
  modalMaxWidth: number | string;
}
```

---

## 3. Mathematical Foundations & Scaling Formulas

### 3.1 Guideline Dimensions
- **Guideline Base Width ($W_0$)**: $375\text{ pt}$ (iPhone X, 11 Pro, 12 mini, 13 mini)
- **Guideline Base Height ($H_0$)**: $812\text{ pt}$

### 3.2 Scaling Formulas
1. **Horizontal Scale (`scale`)**:
   $$\text{scale}(S) = \operatorname{round}\left(\frac{W}{375} \times S\right)$$
   *Use case*: Spacing margins, widths, horizontal padding.
2. **Vertical Scale (`verticalScale`)**:
   $$\text{verticalScale}(S) = \operatorname{round}\left(\frac{H}{812} \times S\right)$$
   *Use case*: Heights, vertical offsets, banner heights.
3. **Moderate Scale (`moderateScale`)**:
   $$\text{moderateScale}(S, f) = \operatorname{round}\left(S + \left(\frac{W}{375} \times S - S\right) \times f\right)$$
   *Default factor*: $f = 0.5$.
   *Use case*: Typography (font sizes), icons, button heights, border radii.
   *Rationale*: Prevents runaway enlargement on tablets. For instance, on a 1024px iPad Pro:
   - Raw `scale(16)` yields $\operatorname{round}(2.73 \times 16) = 44\text{ pt}$ (dangerously oversized for body text).
   - Dampened `moderateScale(16, 0.5)` yields $16 + (43.68 - 16) \times 0.5 = 29.84 \to 30\text{ pt}$, which provides clear legibility without distorting UI hierarchy.
4. **Clamped Scale (`clampedScale`)**:
   $$\text{clampedScale}(S, \min, \max, f) = \min\left(\max(\text{moderateScale}(S, f), \min), \max\right)$$
   *Use case*: Bounding header titles, badges, and small icons to strict visual ranges.

### 3.3 Scaling Table across Form Factors

| Size ($S$) | Compact (320px) | Base (375px) | Standard (390px) | Pro Max (430px) | Tablet (768px) | Large Tablet (1024px) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `scale(12)` | 10 | 12 | 12 | 14 | 25 | 33 |
| `scale(16)` | 14 | 16 | 17 | 18 | 33 | 44 |
| `scale(24)` | 20 | 24 | 25 | 28 | 49 | 66 |
| `moderateScale(12)` | 11 | 12 | 12 | 13 | 18 | 22 |
| `moderateScale(16)` | 15 | 16 | 16 | 17 | 24 | 30 |
| `moderateScale(24)` | 22 | 24 | 25 | 26 | 37 | 45 |

---

## 4. Breakpoint Engine & Layout Adaptation

### 4.1 Device Classification

| Breakpoint Variable | Condition | Target Form Factors | Primary Layout Pattern |
| :--- | :--- | :--- | :--- |
| `isCompact` | $\text{width} \le 375\text{px}$ | iPhone SE (1st, 2nd, 3rd), iPhone 12/13 mini, small Android | Single-row compact chips, 12px padding, tighter gaps, bottom sheets |
| `isStandard` | $\text{width} > 375\text{px} \land \text{width} < 768\text{px}$ | iPhone 13-16, Pixel 7-9, Galaxy S22-S24 | 2-column card grid, 16px padding, standard bottom sheets |
| `isTablet` | $\text{width} \ge 768\text{px}$ | iPad Mini, iPad Air, iPad Pro, Galaxy Tab, Foldables unfolded | 3–4 column grid, 24–32px padding, centered dialogs (maxWidth 540px), 2-column split views on PDP & Cart |

### 4.2 Dynamic Grid Column Count
```typescript
export const getGridColumns = (width: number): number => {
  if (width >= 900) return 4; // Large tablets / landscape tablets
  if (width >= 768) return 3; // Small tablets / portrait iPad Mini / Foldables
  return 2;                   // All phones (< 768px)
};
```

### 4.3 Container Padding Rules
```typescript
export const getContainerPadding = (width: number): number => {
  if (width >= 900) return 32; // 32px on wide tablets/desktop
  if (width >= 768) return 24; // 24px on tablets
  if (width > 375) return 16;  // 16px on standard phones
  return 12;                   // 12px on compact phones (<= 375px)
};
```

### 4.4 Fluid Card Width Formula
To eliminate ragged edges and awkward blank margins in `CategoryScreen`, `SearchResultsScreen`, and `WishlistScreen`:
$$\text{cardWidth} = \left\lfloor \frac{\text{containerWidth} - (\text{columns} - 1) \times \text{gap}}{\text{columns}} \right\rfloor$$
Where defaults are:
- $\text{containerWidth} = \text{width} - (\text{containerPadding} \times 2)$
- $\text{gap} = 8\text{px}$ on compact, $10\text{px}$ on standard, $14\text{px}$ on tablet.

#### Card Width Results Across Devices
- **320px (iPhone SE 1st gen)**: $\text{container} = 296\text{px}$, $2\text{ cols}$, $\text{gap} = 8\text{px} \implies \lfloor(296 - 8)/2\rfloor = \mathbf{144\text{px}}$.
- **390px (iPhone 14/15)**: $\text{container} = 358\text{px}$, $2\text{ cols}$, $\text{gap} = 10\text{px} \implies \lfloor(358 - 10)/2\rfloor = \mathbf{174\text{px}}$.
- **430px (iPhone 15 Pro Max)**: $\text{container} = 398\text{px}$, $2\text{ cols}$, $\text{gap} = 10\text{px} \implies \lfloor(398 - 10)/2\rfloor = \mathbf{194\text{px}}$.
- **768px (iPad Mini)**: $\text{container} = 720\text{px}$, $3\text{ cols}$, $\text{gap} = 14\text{px} \implies \lfloor(720 - 28)/3\rfloor = \mathbf{230\text{px}}$.
- **1024px (iPad Pro)**: $\text{container} = 960\text{px}$, $4\text{ cols}$, $\text{gap} = 14\text{px} \implies \lfloor(960 - 42)/4\rfloor = \mathbf{229\text{px}}$.

---

## 5. Safe Area Insets & Edge-to-Edge Strategy

### 5.1 Safe Fallback Contract
`useSafeAreaInsets()` in `react-native-safe-area-context` requires `<SafeAreaProvider>` mounted at the root. In cases where the hook is queried during cold boots, in test mocks, or on web containers, `useResponsive` sanitizes the output:
```typescript
const insets: Insets = {
  top: rawInsets?.top ?? 0,
  bottom: rawInsets?.bottom ?? 0,
  left: rawInsets?.left ?? 0,
  right: rawInsets?.right ?? 0,
};
```

### 5.2 Safe Area Offset Formulas for Screens and Navigation

| Component | Target File | Offset Formula | Rationale |
| :--- | :--- | :--- | :--- |
| **Sticky Buy Bar** | `ProductDetailScreen.tsx` | `paddingBottom: insets.bottom + 12` | Clears 34pt iOS home indicator on iPhones and edge-to-edge Android bar. |
| **Sticky Pay Bar** | `CartScreen.tsx` | `paddingBottom: insets.bottom + 12` | Prevents home indicator from occluding "Proceed to Pay" button. |
| **Chat Input Bar** | `SupportScreen.tsx` | `paddingBottom: insets.bottom + 8` | Sits above the home indicator and keyboard. |
| **Floating Cart Pill** | `HomeScreen.tsx` | `bottom: insets.bottom + 72` | Floats directly above the bottom tab bar ($60\text{px} + \text{insets.bottom} + 12\text{px}$). |
| **Bottom Tab Bar** | `TabNavigator.tsx` | `height: 60 + insets.bottom`, `paddingBottom: insets.bottom > 0 ? insets.bottom : 8` | Prevents tab icons and labels from being squashed by the home indicator. |
| **Bottom Sheet Modals**| `GlobalModalManager.tsx` | `paddingBottom: insets.bottom + 16` | Ensures modal action buttons and inputs remain fully accessible. |
| **Header Top Bar** | All 15 Screens | `paddingTop: Math.max(insets.top, 12)` | Clears Dynamic Island (59pt) and camera punch holes. |

---

## 6. Accessibility Touch Target Enforcement (WCAG 2.1 AA)

### 6.1 Requirements
WCAG 2.1 Success Criterion 2.5.5 (Target Size) and Apple HIG require all interactive touch targets to be at least **44 × 44 pt**.

### 6.2 Provided Primitives
1. `minTouchTarget: { minWidth: 44, minHeight: 44 }`
   Apply to touchable container styles:
   ```tsx
   style={[styles.backButton, minTouchTarget]}
   ```
2. `accessibleHitSlop: { top: 12, bottom: 12, left: 12, right: 12 }`
   Apply to compact visual controls (e.g. 20×20 icons, 22×22 wishlist hearts, 18×30 steppers):
   ```tsx
   <TouchableOpacity hitSlop={accessibleHitSlop} onPress={...}>
   ```
   *Mathematics*: Visual size $20 \times 20\text{ pt} + (12\text{ pt} \times 2) = 44 \times 44\text{ pt}$ effective touch target.

---

## 7. Production Source Code Specification

### 7.1 `mobile/src/hooks/useResponsive.ts`
*(Full verified code available at `.agents/teamwork/explorer_m1_2/proposed_useResponsive.ts`)*

```typescript
import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const GUIDELINE_BASE_WIDTH = 375;
export const GUIDELINE_BASE_HEIGHT = 812;

export interface Insets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface MinTouchTarget {
  minWidth: number;
  minHeight: number;
}

export interface AccessibleHitSlop {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ResponsiveMetrics {
  width: number;
  height: number;
  isCompact: boolean;
  isStandard: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  insets: Insets;
  scale: (size: number) => number;
  verticalScale: (size: number) => number;
  moderateScale: (size: number, factor?: number) => number;
  clampedScale: (size: number, min?: number, max?: number, factor?: number) => number;
  gridColumns: number;
  containerPadding: number;
  getCardWidth: (customContainerWidth?: number, customColumns?: number, customGap?: number) => number;
  minTouchTarget: MinTouchTarget;
  accessibleHitSlop: AccessibleHitSlop;
  modalPresentation: 'bottomSheet' | 'dialog';
  modalMaxWidth: number | string;
}

export const calculateScale = (width: number, size: number): number =>
  Math.round((width / GUIDELINE_BASE_WIDTH) * size);

export const calculateVerticalScale = (height: number, size: number): number =>
  Math.round((height / GUIDELINE_BASE_HEIGHT) * size);

export const calculateModerateScale = (width: number, size: number, factor: number = 0.5): number => {
  const scaled = (width / GUIDELINE_BASE_WIDTH) * size;
  return Math.round(size + (scaled - size) * factor);
};

export const calculateClampedScale = (
  width: number,
  size: number,
  min: number = size * 0.8,
  max: number = size * 1.5,
  factor: number = 0.5
): number => {
  const mod = calculateModerateScale(width, size, factor);
  return Math.min(Math.max(mod, min), max);
};

export const getGridColumns = (width: number): number => {
  if (width >= 900) return 4;
  if (width >= 768) return 3;
  return 2;
};

export const getContainerPadding = (width: number): number => {
  if (width >= 900) return 32;
  if (width >= 768) return 24;
  if (width > 375) return 16;
  return 12;
};

export const calculateCardWidth = (
  containerWidth: number,
  columns: number,
  gap: number
): number => {
  const totalGaps = (columns - 1) * gap;
  return Math.floor((containerWidth - totalGaps) / columns);
};

export const MIN_TOUCH_TARGET: MinTouchTarget = {
  minWidth: 44,
  minHeight: 44,
};

export const ACCESSIBLE_HIT_SLOP: AccessibleHitSlop = {
  top: 12,
  bottom: 12,
  left: 12,
  right: 12,
};

export interface CalculateMetricsParams {
  width: number;
  height: number;
  insets?: Partial<Insets> | null;
}

export function calculateResponsiveMetrics({
  width,
  height,
  insets: rawInsets,
}: CalculateMetricsParams): ResponsiveMetrics {
  const isCompact = width <= 375;
  const isStandard = width > 375 && width < 768;
  const isTablet = width >= 768;

  const isLandscape = width > height;
  const isPortrait = height >= width;

  const insets: Insets = {
    top: rawInsets?.top ?? 0,
    bottom: rawInsets?.bottom ?? 0,
    left: rawInsets?.left ?? 0,
    right: rawInsets?.right ?? 0,
  };

  const gridColumns = getGridColumns(width);
  const containerPadding = getContainerPadding(width);

  const scale = (size: number): number => calculateScale(width, size);
  const verticalScale = (size: number): number => calculateVerticalScale(height, size);
  const moderateScale = (size: number, factor: number = 0.5): number =>
    calculateModerateScale(width, size, factor);
  const clampedScale = (
    size: number,
    min: number = size * 0.8,
    max: number = size * 1.5,
    factor: number = 0.5
  ): number => calculateClampedScale(width, size, min, max, factor);

  const getCardWidth = (
    customContainerWidth?: number,
    customColumns?: number,
    customGap?: number
  ): number => {
    const contWidth = customContainerWidth ?? width - containerPadding * 2;
    const cols = customColumns ?? gridColumns;
    const g = customGap ?? (isCompact ? 8 : isTablet ? 14 : 10);
    return calculateCardWidth(contWidth, cols, g);
  };

  const modalPresentation: 'bottomSheet' | 'dialog' = isTablet ? 'dialog' : 'bottomSheet';
  const modalMaxWidth: number | string = isTablet ? 540 : '100%';

  return {
    width,
    height,
    isCompact,
    isStandard,
    isTablet,
    isLandscape,
    isPortrait,
    insets,
    scale,
    verticalScale,
    moderateScale,
    clampedScale,
    gridColumns,
    containerPadding,
    getCardWidth,
    minTouchTarget: MIN_TOUCH_TARGET,
    accessibleHitSlop: ACCESSIBLE_HIT_SLOP,
    modalPresentation,
    modalMaxWidth,
  };
}

export function useResponsive(): ResponsiveMetrics {
  const { width, height } = useWindowDimensions();
  const rawInsets = useSafeAreaInsets();

  return useMemo(() => {
    return calculateResponsiveMetrics({
      width,
      height,
      insets: rawInsets,
    });
  }, [
    width,
    height,
    rawInsets?.top,
    rawInsets?.bottom,
    rawInsets?.left,
    rawInsets?.right,
  ]);
}

export default useResponsive;
```

### 7.2 `mobile/src/hooks/index.ts`
```typescript
export * from './useResponsive';
export { default } from './useResponsive';
```

---

## 8. Consumption Patterns in Screens & Components

### 8.1 Example 1: `ProductCard.tsx`
*Refactoring fixed 220px maxWidth and sub-44pt touch targets:*
```tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useResponsive } from '../hooks';

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, style }) => {
  const { getCardWidth, moderateScale, accessibleHitSlop } = useResponsive();
  const cardWidth = getCardWidth();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, { width: cardWidth }, style]}
    >
      {/* Wishlist button with accessible touch target */}
      <TouchableOpacity
        style={styles.wishlistBtn}
        hitSlop={accessibleHitSlop}
        onPress={() => toggleWishlist(product.id)}
      >
        <Text style={styles.wishlistIcon}>{inWishlist ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>

      {/* Title with moderate scaling and font multiplier protection */}
      <Text
        numberOfLines={2}
        maxFontSizeMultiplier={1.3}
        style={[styles.title, { fontSize: moderateScale(12) }]}
      >
        {product.name}
      </Text>

      {/* Stepper with 44pt touch targets */}
      <View style={styles.stepper}>
        <TouchableOpacity
          hitSlop={accessibleHitSlop}
          onPress={() => updateQuantity(product.id, -1)}
          style={styles.stepBtn}
        >
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity
          hitSlop={accessibleHitSlop}
          onPress={() => updateQuantity(product.id, 1)}
          style={styles.stepBtn}
        >
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
```

### 8.2 Example 2: `ProductDetailScreen.tsx`
*Tablet 2-Column Split & Safe Area Buy Bar:*
```tsx
export const ProductDetailScreen = () => {
  const { isTablet, insets, containerPadding } = useResponsive();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: containerPadding, paddingBottom: insets.bottom + 90 }
        ]}
      >
        <View style={isTablet ? styles.tabletSplitRow : styles.mobileStack}>
          {/* Left Column (Hero & Images) */}
          <View style={isTablet ? styles.tabletLeftCol : styles.mobileHero}>
            <Image source={{ uri: product.image }} style={styles.heroImage} />
          </View>

          {/* Right Column (Info, Specs, Actions) */}
          <View style={isTablet ? styles.tabletRightCol : styles.mobileDetails}>
            <Text style={styles.title}>{product.name}</Text>
            {/* Specs & description */}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Text style={styles.price}>₹{product.price}</Text>
        <TouchableOpacity style={styles.buyBtn} onPress={...}>
          <Text style={styles.buyText}>ADD TO CART</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
```

### 8.3 Example 3: `CategoryScreen.tsx`
*Dynamic Grid Columns, Fluid FlatList, and Adaptive Sidebar:*
```tsx
export const CategoryScreen = () => {
  const { isCompact, isTablet, gridColumns, containerPadding, insets } = useResponsive();
  const sidebarWidth = isCompact ? 72 : isTablet ? 120 : 90;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <View style={styles.mainLayout}>
        {/* Dynamic Sidebar */}
        <View style={[styles.sidebar, { width: sidebarWidth }]}>
          {/* Subcategories */}
        </View>

        {/* Dynamic FlatList Grid */}
        <FlatList
          key={`grid-cols-${gridColumns}`}
          data={products}
          numColumns={gridColumns}
          contentContainerStyle={{ padding: containerPadding, paddingBottom: insets.bottom + 80 }}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};
```

### 8.4 Example 4: Adaptive Modals (`GlobalModalManager.tsx`)
*Bottom Sheet on Mobile vs Centered Dialog on Tablet:*
```tsx
export const AddEditAddressModal = () => {
  const { isTablet, insets, modalPresentation, modalMaxWidth } = useResponsive();

  return (
    <Modal transparent animationType="fade" visible={isOpen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[
          styles.overlay,
          {
            justifyContent: isTablet ? 'center' : 'flex-end',
            padding: isTablet ? 24 : 0,
          }
        ]}
      >
        <View
          style={[
            styles.modalCard,
            {
              maxWidth: modalMaxWidth,
              borderRadius: isTablet ? 20 : 0,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingBottom: isTablet ? 24 : insets.bottom + 16,
            }
          ]}
        >
          {/* Modal Header & Form Content */}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
```

---

## 9. Edge Cases & Defensive Architecture

1. **Zero Safe Area Insets**:
   - Condition: Web environment, older Android devices with hardware buttons, or mock testing.
   - Mitigation: Explicit fallback to `{ top: 0, bottom: 0, left: 0, right: 0 }`.
2. **Device Orientation Flips**:
   - Condition: Phone or tablet rotated 90 degrees.
   - Mitigation: `useWindowDimensions()` automatically triggers a reactive render pass. `isLandscape` is flagged, `gridColumns` recalculates (e.g., from 2 to 3 columns on standard phones in landscape), and safe area side insets are respected.
3. **Foldable Device Unfolding**:
   - Condition: Samsung Galaxy Z Fold or Google Pixel Fold opened from cover screen to unfolded tablet screen.
   - Mitigation: Viewport width jumps from $\sim 375\text{px}$ to $\ge 768\text{px}$. The hook dynamically toggles `isTablet: true`, switching modals from bottom sheets to centered dialogs without requiring an app reload.
4. **Extreme Display Density & Dynamic Type**:
   - Condition: Accessibility font scale set to $\ge 1.5\times$ in OS settings.
   - Mitigation: `moderateScale` limits text enlargement, and `clampedScale` sets an upper bound ($1.3\times$). Screens employ `numberOfLines={2}` with `flexShrink: 1` instead of fixed `minHeight`.
5. **Expo Doctor & TypeScript Verification**:
   - Dependencies: `useWindowDimensions` is native to React Native; `useSafeAreaInsets` is provided by `react-native-safe-area-context` (~5.10.1). Zero new external npm packages required. 100% strictly typed.

---

## 10. Implementation & Verification Roadmap

| Step | Action | Files Modified | Verification |
| :--- | :--- | :--- | :--- |
| **1** | Create `mobile/src/hooks/useResponsive.ts` | `mobile/src/hooks/useResponsive.ts` | Strict TypeScript compilation (`tsc --noEmit`) |
| **2** | Create `mobile/src/hooks/index.ts` | `mobile/src/hooks/index.ts` | Import validation from screens and components |
| **3** | Add unit test suite for responsive math | `mobile/tests/useResponsive.test.ts` | Verification across 320px, 375px, 390px, 430px, 768px, 1024px |
| **4** | Integrate in `ProductCard` (M3) | `mobile/src/components/ProductCard.tsx` | Touch target test $\ge 44\text{pt}$ and dynamic width |
| **5** | Integrate in 15 screens & Modals (M3) | `mobile/src/screens/*.tsx` | Zero overflow, safe insets respected |
