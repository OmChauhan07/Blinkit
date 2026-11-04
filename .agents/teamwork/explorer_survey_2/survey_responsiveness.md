# Comprehensive Responsive Layout & Accessibility Audit Report

**Date**: 2026-11-03  
**Auditor**: explorer_survey_2 (Teamwork Explorer)  
**Target Codebase**: `mobile/src/screens/`, `mobile/src/components/`, `mobile/App.tsx`, and `web/src/components/`  
**Compliance Standards**: WCAG 2.1 AA (Touch Targets ≥ 44×44 pt), Apple Human Interface Guidelines, Android Material Design 3, React Native Safe Area Specification.

---

## 1. Executive Summary

A comprehensive architectural and layout audit of the Blinkit mobile application was executed across all **15 mobile screens**, the shared **ProductCard** component, the **App navigation container**, and the **web reference modals**.

### Key Findings
1. **Critical Safe Area Vulnerability**: The root `mobile/App.tsx` completely lacks `<SafeAreaProvider>` from `react-native-safe-area-context`. Additionally, all 15 screens import the deprecated `SafeAreaView` from `'react-native'`, which fails on Android edge-to-edge / notches and fails to provide dynamic bottom insets on iOS.
2. **Bottom Home Indicator Occlusion**: 4 major screens (`ProductDetailScreen`, `CartScreen`, `SupportScreen`, `HomeScreen`) feature sticky or floating bottom bars hardcoded to `bottom: 0` or `bottom: 12` with 0 safe area inset padding. On all modern iPhones (390px–430px) and gesture-navigation Android devices, the 34pt bottom home indicator directly collides with action buttons, prices, and inputs.
3. **Pervasive Touch Target Violations (< 44×44 pt)**: Over **35 interactive elements** across all screens (notably stepper buttons at 18×30 pt, wishlist heart buttons at 22×22 pt, back buttons at 28×28 pt, and profile buttons at 32×32 pt) fail the standard 44×44 pt minimum touch target accessibility requirement.
4. **Horizontal Overflow on Compact Screens (320px–375px)**: In `SearchResultsScreen.tsx`, filter chips are laid out in a raw `flexDirection: 'row'` with 366px+ total width without a scroll container, causing hard clipping on compact screens (iPhone SE, Galaxy A-series). In `CategoryScreen.tsx`, the 90px fixed sidebar starves the product feed on 320px devices down to 206px, preventing 2-column layout and creating an awkward 41px dead zone on 375px screens due to `maxWidth: 220`.
5. **Keyboard Occlusion Defects**: Both `SupportScreen.tsx` (chat) and `SavedAddressesScreen.tsx` (address form modal) lack `KeyboardAvoidingView`. Focusing input fields hides them beneath the virtual keyboard.
6. **Tablet / Foldable (768px–1024px) Under-Optimization**: The grid in `CategoryScreen`, `SearchResultsScreen`, and `WishlistScreen` relies on unconstrained `flexWrap: 'wrap'` with `maxWidth: 220` cards, creating ragged margins and random column counts on tablets. `SavedAddressesScreen` hardcodes modal presentation to a bottom sheet rather than a centered modal dialog.

---

## 2. Target Device Viewport Specification Matrix

| Form Factor | Viewport Width | Typical Devices | Primary Risks |
| :--- | :--- | :--- | :--- |
| **Compact Mobile** | 320px – 375px | iPhone SE (1st, 2nd, 3rd gen), iPhone 12/13 mini, small Android devices (360×640) | Horizontal overflow, text clipping in headers, stepper button crowding, single-column product squeeze. |
| **Standard Mobile** | 390px – 430px | iPhone 13/14/15/16 Pro & Pro Max, Pixel 7/8/9, Galaxy S23/S24 | Bottom home indicator (34pt) occlusion, dynamic island top inset clipping, tab bar crowding. |
| **Foldables & Tablets** | 768px – 1024px | iPad Mini, iPad Air/Pro (10-11"), Galaxy Z Fold (unfolded 768px), Android Tablets | Stretched single-column layouts, awkward blank spaces around fixed 220px cards, oversized bottom sheets. |

---

## 3. Dimension 1: Hardcoded Dimensions, Margins, and Horizontal Overflow

### Exact Codebase Observations

| File Path | Line Range | Offending Code | Responsive Defect & Impact |
| :--- | :--- | :--- | :--- |
| `mobile/src/screens/SearchResultsScreen.tsx` | 168–176 | `filtersBar: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, gap: 8 }` | **Horizontal Overflow**: 5 filter chips ('All', 'Dairy', 'Snacks', 'Drinks', 'Sweets') total 366px min width. On 320px and 360px viewports, 'Sweets' clips off-screen because there is no horizontal scroll container or wrapping. |
| `mobile/src/screens/CategoryScreen.tsx` | 110 | `sidebar: { width: 90, ... }` | **Grid Starvation**: On 320px screen: 320px - 90px (sidebar) - 24px (feed padding) = 206px for product grid. Two cards require 280px min, so only 1 column renders. On 375px screen: 261px available; card has `maxWidth: 220`, leaving a 41px dead margin on the right. |
| `mobile/src/components/ProductCard.tsx` | 88–90 | `minWidth: 140, maxWidth: 220, margin: 4` | **Inflexible Grid Sizing**: `maxWidth: 220` prevents fluid 2-column or 3-column scaling. On tablets (768px–1024px), cards cap out at 220px leaving uneven gaps on rows with fewer than 4 items. |
| `mobile/App.tsx` | 52–58 | `tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 }` | **Fixed Height Tab Bar**: Fixed 60px height ignores device bottom insets. On devices with a 34pt bottom home indicator, tabs are squashed and labels collide with the bar. |
| `mobile/src/screens/HomeScreen.tsx` | 367–372 | `categoryItem: { width: 68 }, categoryIconCircle: { width: 60, height: 60 }` | **Tight Horizontal Scrolling**: Category titles like "Vegetables & Fruits" or "Cold Drinks & Juices" truncate prematurely in 68px column width. |
| `mobile/src/screens/OrdersHistoryScreen.tsx` | 214–225 | `cardHeader: { flexDirection: 'row', justifyContent: 'space-between' }`, `statusBadge: { paddingHorizontal: 10 }` | **Header Wrap Overflow**: "Order #BLK-98214" (~120px) + "Out for Delivery (ETA 8m)" (~180px) = 300px > 288px available card width on 320px devices. Causes badge to wrap awkwardly or push down. |
| `mobile/src/screens/ProfileScreen.tsx` | 186–197 | `statsRow: { flexDirection: 'row', justifyContent: 'space-around' }, statBox: { flex: 1 }` | **Label Wrapping**: 4 columns in 264px net width gives 66px per item. "Addresses" (9 chars) breaks across 2 lines or truncates on compact screens. |
| `mobile/src/screens/CartScreen.tsx` | 193–198 | `footerInner: { flexDirection: 'row', justifyContent: 'space-between' }` | **Action Bar Collision**: On 320px viewports, the delivery address text, total price, and "Proceed to Pay →" button (~140px) compete for 288px, leaving only ~140px for address and price combined. |

---

## 4. Dimension 2: Missing or Constrained Scroll Containers & Virtualization

### Exact Codebase Observations

| File Path | Component / Section | Current Pattern | Defect & Remediation |
| :--- | :--- | :--- | :--- |
| `mobile/src/screens/SearchResultsScreen.tsx` | Filter Chips (Lines 66–78) | `<View style={styles.filtersBar}>` (Static View) | **Missing Scroll Container**: Wrap in `<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>` to allow smooth horizontal swipe on all phone widths. |
| `mobile/src/screens/CategoryScreen.tsx` | Product Grid (Lines 65–80) | `<ScrollView><View style={styles.grid}>{filtered.map(...)}</View></ScrollView>` | **Unvirtualized List**: Rendering 50+ items in a mapped View causes memory bloat and scroll jank. Replace with `<FlatList data={filtered} numColumns={columnCount} keyExtractor={...} renderItem={...} />` where `columnCount` adapts dynamically (2 on mobile, 3–4 on tablet). |
| `mobile/src/screens/HomeScreen.tsx` | Shelf Products (Lines 121–129, 142–150, 163–171) | FlexWrap `<View style={styles.productsGrid}>` inside vertical ScrollView | **Unvirtualized Shelf Grid**: Shelves render cards in a mapped View. Should use responsive column grid or horizontal carousel per shelf for high performance. |
| `mobile/src/screens/SupportScreen.tsx` | Chat Message View & Input (Lines 94–154) | `<SafeAreaView><ScrollView>{messages}</ScrollView><View style={styles.inputBar}></View></SafeAreaView>` | **Missing KeyboardAvoidingView**: When user focuses the text input on iOS or Android, the soft keyboard pops up over the input bar, completely hiding what the user is typing. Must wrap with `<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>`. |
| `mobile/src/screens/SavedAddressesScreen.tsx` | Address Modal Form (Lines 120–180) | `<Modal><View style={styles.modalOverlay}><View style={styles.modalContent}><ScrollView>...</ScrollView></View></View></Modal>` | **Missing KeyboardAvoidingView in Modal**: When typing into "House No" or "Apartment Road" inputs, keyboard covers the bottom inputs and the "Save & Deliver Here" button. Must wrap inside `KeyboardAvoidingView`. |
| `mobile/src/screens/CheckoutScreen.tsx` | Payment Screen (Lines 39–79) | `<ScrollView contentContainerStyle={styles.content}>` | **Missing Bottom Content Padding**: Scroll content ends with `confirmBtn` without extra bottom padding for the safe area home indicator. |

---

## 5. Dimension 3: Text Truncation, Font Scaling & Dynamic Type Defects

### Exact Codebase Observations

| File Path | Line Range | Elements / Styles | Defect & Impact |
| :--- | :--- | :--- | :--- |
| `mobile/src/components/ProductCard.tsx` | 41–43, 154–160 | `title: { fontSize: 12, lineHeight: 16, minHeight: 32 }`, `numberOfLines={2}` | **Font Scaling Clipping**: With system accessibility font scale > 1.2, two lines of 12pt text will exceed the hardcoded `minHeight: 32`, causing the second line to be clipped or truncated prematurely. Remove fixed `minHeight` or use `maxFontSizeMultiplier={1.3}`. |
| `mobile/src/screens/HomeScreen.tsx` | 44–46 | `addressText: { fontSize: 11, ... }`, `numberOfLines={1}` | **Premature Ellipsis**: On 320px devices, the address block truncates after ~10 characters (e.g. "Flat 302, G... ▼"), making it impossible for the user to confirm their active delivery destination. Add `flexShrink: 1` and responsive abbreviation. |
| `mobile/src/screens/CartScreen.tsx` | 58, 163 | `itemName: { fontSize: 12, fontWeight: '700' }`, `numberOfLines={1}` | **Loss of Product Clarity**: On compact screens, 1-line truncation truncates essential product variants (e.g. "Amul Taaza Toned Homogenized Milk 500ml" becomes "Amul Taaza T..."). Expand to `numberOfLines={2}` with `flexShrink: 1`. |
| `mobile/src/screens/CategoryScreen.tsx` | 113–114 | `sidebarText: { fontSize: 11, textAlign: 'center' }` | **Subcategory Label Breakage**: Multi-word subcategories like "Fresh Vegetables" or "Curd & Yogurt" wrap awkwardly into 3 tiny lines in the 90px rail. |
| `mobile/src/screens/ProductDetailScreen.tsx` | 29, 132 | `topBarTitle: { flex: 1, fontSize: 14, marginHorizontal: 12 }`, `numberOfLines={1}` | **Header Squeeze**: When product title is long, header icons (heart + cart) push the title into severe truncation. `flexShrink: 1` needed. |
| `mobile/src/screens/OrdersHistoryScreen.tsx` | 98–99, 224–225 | `statusBadge: { paddingHorizontal: 10, paddingVertical: 4 }`, `statusText: { fontSize: 11 }` | **Status Badge Overflow**: On compact screens, status badges with lengthy labels ("Out for Delivery (ETA 8m)") collide with the order number. Missing `flexShrink: 1`. |

---

## 6. Dimension 4: Touch Target Sizes (< 44×44 pt Accessibility Violations)

WCAG 2.1 Success Criterion 2.5.5 (Target Size) and Apple HIG / Android guidelines require all interactive touch targets to be at least **44×44 pt** (or minimum 48×48 dp on Android) to avoid mis-taps.

### Complete Inventory of Failed Touch Targets

| File Path | Element | Line | Current Rendered Size | Required Fix |
| :--- | :--- | :--- | :--- | :--- |
| `ProductCard.tsx` | `wishlistBtn` | 26–31, 127–133 | **22×22 pt** (`padding: 4`, 14pt icon) | Add `hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}` or set `minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center'`. |
| `ProductCard.tsx` | `addButton` | 56–62, 185–194 | **64×30 pt** (height 30 pt) | Increase height to 36–40 pt or add `hitSlop={{ top: 8, bottom: 8 }}`. |
| `ProductCard.tsx` | `stepper` (`stepBtn`) | 65–71, 210–215 | **18×30 pt** (`width: 18, height: '100%'`) | Severe mis-tap hazard! Expand `stepBtn` width to 28 pt and add vertical hitSlop. |
| `HomeScreen.tsx` | `profileButton` | 49–54, 261–268 | **32×32 pt** (`width: 32, height: 32`) | Increase to 44×44 pt or wrap in 44×44 touchable container. |
| `HomeScreen.tsx` | `seeAllText` | 91, 117, 137, 159 | **~24×16 pt** (unpadded text) | Add `paddingVertical: 10, paddingHorizontal: 8` or `hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}`. |
| `HomeScreen.tsx` | `bannerCta` | 79–84, 333–339 | **~80×32 pt** (`paddingVertical: 8`) | Increase `paddingVertical: 12` (minimum 44 pt total height). |
| `CategoryScreen.tsx` | `backBtn` | 32–34, 103 | **~28×28 pt** (`padding: 4`) | Set `minWidth: 44, minHeight: 44, justifyContent: 'center'`. |
| `CategoryScreen.tsx` | `searchIcon` | 39–41 | **~20×20 pt** (unpadded touchable) | Wrap with `minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center'`. |
| `ProductDetailScreen.tsx` | `backBtn` | 26–28, 130 | **~28×28 pt** (`padding: 4`) | Set `minWidth: 44, minHeight: 44`. |
| `ProductDetailScreen.tsx` | `wishlistBtn` & `cartIcon` | 31–36 | **~26×26 pt** (`padding: 4`) | Add `hitSlop` or set 44×44 container. |
| `ProductDetailScreen.tsx` | `stepBtn` | 111–117, 162 | **~25×42 pt** (`padding: 4`) | Expand touch area to 44×44 pt. |
| `CartScreen.tsx` | `backBtn` | 36–38, 152 | **~28×28 pt** (`padding: 4`) | Set `minWidth: 44, minHeight: 44`. |
| `CartScreen.tsx` | `stepBtn` | 65–71, 167 | **20×30 pt** (`width: 20`) | Expand touch area to minimum 36×44 pt with `hitSlop`. |
| `CheckoutScreen.tsx` | `backBtn` | 32–34, 88 | **~28×28 pt** (`padding: 4`) | Set `minWidth: 44, minHeight: 44`. |
| `OrderTrackingScreen.tsx` | `backBtn` | 22–24, 117 | **~28×28 pt** (`padding: 4`) | Set `minWidth: 44, minHeight: 44`. |
| `OrderTrackingScreen.tsx` | `callBtn` | 96–98, 142 | **~60×32 pt** (`paddingVertical: 8`) | Increase `paddingVertical: 12` to meet 44 pt height. |
| `SearchResultsScreen.tsx` | `backBtn` | 43–45, 153 | **~34×34 pt** (`padding: 6`) | Set `minWidth: 44, minHeight: 44`. |
| `SearchResultsScreen.tsx` | `clearBtn` | 58–60, 166 | **~22×22 pt** (`padding: 4`) | Add `hitSlop` of 12 pt all around. |
| `OrdersHistoryScreen.tsx` | `backBtn` | 61–63, 191 | **~28×28 pt** (`padding: 4`) | Set `minWidth: 44, minHeight: 44`. |
| `OrdersHistoryScreen.tsx` | `cancelBtn` & `detailsBtn` | 141, 158 | **~70×36 pt** (`paddingVertical: 10`) | Increase `paddingVertical: 12` (minimum 44 pt). |
| `SavedAddressesScreen.tsx` | `backBtn` | 54–56, 200 | **~28×28 pt** (`padding: 4`) | Set `minWidth: 44, minHeight: 44`. |
| `SavedAddressesScreen.tsx` | `closeBtn` (modal) | 125–127, 257 | **~24×24 pt** (`padding: 4`) | Set `minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center'`. |
| `SavedAddressesScreen.tsx` | `selectBtn` & `deleteBtn` | 93, 106 | **~80×32 pt** (`paddingVertical: 8`) | Increase `paddingVertical: 12`. |
| `WishlistScreen.tsx` | `backBtn` | 23–25, 70 | **~28×28 pt** (`padding: 4`) | Set `minWidth: 44, minHeight: 44`. |
| `OffersCouponsScreen.tsx` | `backBtn` | 33–35, 118 | **~28×28 pt** (`padding: 4`) | Set `minWidth: 44, minHeight: 44`. |
| `OffersCouponsScreen.tsx` | `applyBtn` & `removeBtn` | 62, 67, 152, 154 | **~60×28 pt** (`paddingVertical: 6`) | Increase `paddingVertical: 10` and add `hitSlop={{ top: 8, bottom: 8 }}`. |
| `SupportScreen.tsx` | `backBtn` | 83–85, 173 | **~28×28 pt** (`padding: 4`) | Set `minWidth: 44, minHeight: 44`. |
| `SupportScreen.tsx` | `sendBtn` | 149–151, 246 | **38×38 pt** (`width: 38, height: 38`) | Increase to `width: 44, height: 44, borderRadius: 22`. |
| `FAQScreen.tsx` | `backBtn` | 28–30, 105 | **~28×28 pt** (`padding: 4`) | Set `minWidth: 44, minHeight: 44`. |
| `FAQScreen.tsx` | `chatBtn` | 78–83, 158 | **~160×38 pt** (`paddingVertical: 10`) | Increase `paddingVertical: 12`. |
| `AboutUsScreen.tsx` | `backBtn` | 40–42, 103 | **~28×28 pt** (`padding: 4`) | Set `minWidth: 44, minHeight: 44`. |

---

## 7. Dimension 5: Safe Area Insets Audit

### Root Provider Vulnerability
- In `mobile/App.tsx`, lines 109–134:
  ```tsx
  export default function App() {
    return (
      <StoreProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
  ```
  **Critical Defect**: `<SafeAreaProvider>` from `react-native-safe-area-context` is **NOT** wrapping the component tree! Any call to `useSafeAreaInsets()` or `<SafeAreaView>` from `react-native-safe-area-context` inside child components either fails or returns fallback zero insets.

### Built-in React Native `SafeAreaView` Deprecation
All 15 screens import `SafeAreaView` from `'react-native'`:
- `import { SafeAreaView } from 'react-native';`
- Built-in `SafeAreaView` only supports iOS and only handles basic status bars on older iPhones. It does not handle:
  1. Android camera cutouts / punch holes / notches.
  2. Android 13+ edge-to-edge system navigation bars.
  3. Dynamic Island insets on iPhone 14/15/16 Pro.
  4. Orientation changes and foldable crease insets.
- **Remediation**: Replace all occurrences with `SafeAreaView` from `'react-native-safe-area-context'` or use the `useSafeAreaInsets()` hook.

### Bottom Home Indicator Collision Points

| Screen File | Component | Line Numbers | Current Styling | Impact & Remediation |
| :--- | :--- | :--- | :--- | :--- |
| `mobile/src/screens/ProductDetailScreen.tsx` | Sticky Buy Bar | 95–121, 155–156 | `bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0 }`, `bottomBarInner: { padding: 16 }` | **Severe Home Bar Collision**: On modern iPhones, the 34pt bottom home indicator directly covers the bottom half of the "ADD TO CART" button and price. Must add `paddingBottom: insets.bottom + 12`. |
| `mobile/src/screens/CartScreen.tsx` | Sticky Pay Bar | 129–143, 193–194 | `footer: { position: 'absolute', bottom: 0, left: 0, right: 0 }`, `footerInner: { padding: 16 }` | **Severe Collision**: "Proceed to Pay →" button and delivery address line sit flush at bottom: 0, occluded by iOS home indicator. Must add `paddingBottom: insets.bottom + 12`. |
| `mobile/src/screens/SupportScreen.tsx` | Message Input Bar | 139–153, 222–236 | `inputBar: { borderTopWidth: 1 }`, `inputBarInner: { paddingVertical: 10 }` | **Keyboard & Home Bar Collision**: Sits directly against bottom screen edge. Must add `paddingBottom: insets.bottom + 8`. |
| `mobile/src/screens/HomeScreen.tsx` | Floating Cart Pill | 177–195, 413–422 | `floatingCartContainer: { position: 'absolute', bottom: 12, ... }` | **Tab Bar Overlap**: HomeScreen is embedded inside `MainTabNavigator`! Tab bar has `height: 60`. A floating pill at `bottom: 12` will render directly on top of the tab bar, blocking tabs! Must calculate offset based on tab bar height or dock above tab bar with `bottom: insets.bottom + 68`. |
| `mobile/App.tsx` | Bottom Tab Navigator | 52–58 | `tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 }` | **Tab Bar Cramping**: Without `useSafeAreaInsets().bottom`, the fixed 60px height leaves tab titles buried under the iOS home indicator. |

---

## 8. Dimension 6: Tablet & Foldable (768px–1024px) Adaptations

### 1. Dynamic Column Calculation vs Fixed Max-Width
Currently, screens render cards with `minWidth: 140, maxWidth: 220` inside `flexDirection: 'row', flexWrap: 'wrap'`.
- On a 390px phone: 2 columns fit cleanly.
- On a 768px iPad Mini: 3 cards take 660px, leaving 108px empty whitespace on the right.
- On a 1024px iPad Pro: 4 cards take 880px, leaving 144px empty whitespace on the right.
- **Architectural Solution**: Calculate dynamic column count based on available container width:
  ```ts
  // Helper: getColumnCount(width)
  // width < 600: 2 columns
  // 600 <= width < 900: 3 columns
  // width >= 900: 4 columns
  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;
  ```

### 2. Multi-Column Split on Product Details & Cart
- **ProductDetailScreen**:
  * *Mobile*: Vertically stacked (Image on top, Details below, Specs at bottom, Sticky bar).
  * *Tablet/Foldable*: 2-column side-by-side layout:
    - Left Column (45% width): Large product hero image box, discount tag, thumbnail selector.
    - Right Column (55% width): Brand, Title, Pack weight, Price breakdown, Specs table, Add to Cart action block.
- **CartScreen**:
  * *Mobile*: Single column stack (Delivery ETA, Cart items, Coupons, Bill details, Sticky footer).
  * *Tablet/Foldable*: 2-column side-by-side layout:
    - Left Column (58% width): Cart items list with steppers.
    - Right Column (42% width): Delivery ETA card, Applied coupon banner, Bill breakdown card, and Proceed to Pay button.

### 3. Responsive Modal Presentation (Bottom Sheet vs Centered Dialog)
- Currently, `SavedAddressesScreen`'s modal is hardcoded with:
  ```tsx
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%', maxWidth: 600, width: '100%', alignSelf: 'center' }
  ```
- **Tablet / Foldable Flaw**: On a 1024px tablet, a bottom sheet with `maxWidth: 600` anchors to the bottom with rounded top corners and sharp bottom corners, looking like an awkward detached floating tray.
- **Standard Responsive Modal Pattern**:
  ```tsx
  const isTablet = width >= 600;
  // Overlay:
  justifyContent: isTablet ? 'center' : 'flex-end',
  alignItems: 'center',
  padding: isTablet ? 24 : 0,

  // Content:
  borderRadius: isTablet ? 20 : 0,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  maxWidth: isTablet ? 480 : '100%',
  width: '100%',
  maxHeight: isTablet ? '80%' : '88%'
  ```

---

## 9. Comprehensive Screen-by-Screen Audit Matrix

| Screen | Dimensions & Overflow | Scroll & Virtualization | Typography & Scaling | Touch Targets (<44pt) | Safe Area Handling | Tablet / Foldable Adaptivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HomeScreen** | Address pill squeezes on 320px; banner text fits. | Shelves use flexWrap View instead of virtualized list. | `addressText` truncates too early; category labels wrap in 68px. | `profileButton` (32×32 pt), `seeAllText` (~24pt), `bannerCta` (32pt). | Built-in `SafeAreaView`; `floatingCart` at `bottom: 12` collides with tab bar. | Content constrained to `maxWidth: 960`; shelves need 3–4 columns on tablet. |
| **CategoryScreen** | 90px fixed sidebar starves product feed on 320px down to 206px. | Mapped View inside ScrollView; missing FlatList. | Subcategory titles wrap into 3 tiny lines in 90px rail. | `backBtn` (28pt), `searchIcon` (20pt), `sidebarItem` (40pt). | Built-in `SafeAreaView`; header needs insets. | Sidebar remains 90px on 1024px tablet; grid needs 3–4 columns. |
| **ProductDetailScreen** | Content capped at 800px; image box height 260px fixed. | OK (ScrollView with padding). | Title truncates with ellipsis in top bar on compact screens. | `backBtn` (28pt), `wishlistBtn` (26pt), `cartIcon` (20pt), `stepBtn` (25pt). | Sticky bottom bar at `bottom: 0` collides directly with 34pt iOS home indicator! | Single column on tablet wastes width; should be 2-column split (image left, info right). |
| **CartScreen** | Footer inner row squeezes on 320px; item row stepper takes 68px. | OK (ScrollView with items list). | Item name 1-line truncation loses vital product weight info. | `backBtn` (28pt), `stepBtn` (20×30 pt). | Footer at `bottom: 0` occluded by iOS home indicator. | Stacks vertically on tablet; should be 2-column (items left, bill right). |
| **CheckoutScreen** | OK (single column card layout). | Content lacks bottom inset spacer for confirm button. | OK (clear typography). | `backBtn` (28pt). | Built-in `SafeAreaView`; confirm button sits against bottom edge on iPhone. | Centered at `maxWidth: 700`. Could split address + payment on wide screens. |
| **OrderTrackingScreen** | OK (timeline stepper layout). | Content lacks bottom inset spacer for "Continue Shopping". | OK. | `backBtn` (28pt), `callBtn` (32pt). | Built-in `SafeAreaView`; bottom button needs safe area padding. | Centered at `maxWidth: 700`. |
| **SearchResultsScreen** | **CRITICAL**: `filtersBar` (366px min) overflows/clips on 320px/360px phones. | Missing horizontal ScrollView on filters bar; grid unvirtualized. | Results count and ETA row can collide on 320px screen. | `backBtn` (34pt), `clearBtn` (22pt). | Built-in `SafeAreaView`. | `content` has no `maxWidth`, stretches unconstrained on 1024px tablets. |
| **OrdersHistoryScreen** | Card header wraps or overflows on 320px (order# + status badge). | OK (ScrollView). | `statusBadge` text has no `flexShrink: 1`. | `backBtn` (28pt), `cancelBtn` / `detailsBtn` (36pt), `primaryBtn` (38pt). | Built-in `SafeAreaView`. | Centered at `maxWidth: 760`. |
| **ProfileScreen** | `statsRow` (4 boxes) squeezes on 320px, causing label breaks. | OK. | "Addresses" stat label breaks onto 2 lines on compact screens. | `statBox` (42pt). Missing back button when opened from Stack. | Built-in `SafeAreaView`. Missing header back button when navigated from Stack. | Centered at `maxWidth: 700`. |
| **SavedAddressesScreen** | Modal bottom sheet overflows keyboard when typing. | Missing `KeyboardAvoidingView` in modal. | OK. | `backBtn` (28pt), `closeBtn` (24pt), `selectBtn` (32pt), `deleteBtn` (32pt). | Built-in `SafeAreaView`; modal lacks bottom safe area padding. | Modal is bottom sheet on tablets; must be centered modal dialog on tablets. |
| **WishlistScreen** | Grid margin -4 with unconstrained cards on wide screens. | OK. | OK. | `backBtn` (28pt). | Built-in `SafeAreaView`. | Missing `maxWidth: 960` constraint; stretches unconstrained on tablets. |
| **OffersCouponsScreen** | Coupon header buttons squeeze on 320px. | OK. | Coupon code and discount value fit cleanly. | `backBtn` (28pt), `applyBtn` (28pt), `removeBtn` (28pt). | Built-in `SafeAreaView`. | Centered at `maxWidth: 700`. |
| **SupportScreen** | Chat input bar covered by soft keyboard. | **CRITICAL**: Missing `KeyboardAvoidingView`! Chat input disappears behind keyboard. | Bubble text lines wrap cleanly. | `backBtn` (28pt), `sendBtn` (38×38 pt). | Built-in `SafeAreaView`; input bar collides with bottom home indicator. | Centered at `maxWidth: 700`. |
| **FAQScreen** | OK. | OK. | Accordion questions wrap cleanly. | `backBtn` (28pt), `chatBtn` (38pt). | Built-in `SafeAreaView`. | Centered at `maxWidth: 700`. |
| **AboutUsScreen** | OK. | OK. | Pillar text wraps cleanly. | `backBtn` (28pt). | Built-in `SafeAreaView`. | Centered at `maxWidth: 700`. |
| **ProductCard** | Fixed `imageContainer: 120` and `image: 100`. | N/A (component). | `title` minHeight 32 clips on dynamic font scaling > 1.2. | **CRITICAL**: `wishlistBtn` (22×22 pt), `addButton` (30pt height), `stepper` (18×30 pt). | N/A. | `maxWidth: 220` causes dead gaps on tablet grids; needs fluid column width. |
| **Tab Navigator (App.tsx)** | Hardcoded `height: 60` crushes tab items on modern iPhones. | N/A. | Tab label font size 10 is very small; needs max font scale limit. | Tab items unpadded against 34pt bottom home indicator. | Missing `SafeAreaProvider` at root! Tab bar ignores `insets.bottom`. | Tab bar stretches full width on tablet; could center or use sidebar on iPad. |

---

## 10. Web-to-Mobile Modal Responsive Design Specification

Requirement R2 mandates porting the 8 web modals/drawers into mobile native components:
1. `QuickProductModal`
2. `LocationModal`
3. `LoginOtpModal`
4. `AddEditAddressModal`
5. `ApplyCouponModal`
6. `CancelOrderModal`
7. `RateOrderModal`
8. `FilterSortDrawer`

### Mobile Adaptation Rules for All Ported Modals

| Feature / Dimension | Compact Screens (320px–375px) | Standard Screens (390px–430px) | Foldables & Tablets (768px–1024px) |
| :--- | :--- | :--- | :--- |
| **Presentation Style** | Bottom Sheet (`justifyContent: 'flex-end'`) with top pull handle (`width: 36, height: 4, borderRadius: 2`) | Bottom Sheet (`justifyContent: 'flex-end'`) with top pull handle | Centered Dialog Card (`justifyContent: 'center', alignItems: 'center'`) with `borderRadius: 20` and `maxWidth: 500` |
| **Height Constraints** | `maxHeight: '85%'`, internal `ScrollView` enabled | `maxHeight: '80%'`, internal `ScrollView` enabled | `maxHeight: '75%'`, fixed max-width 480–540px |
| **Bottom Insets** | `paddingBottom: insets.bottom + 16` | `paddingBottom: insets.bottom + 16` | Standard dialog `padding: 24` (no bottom bar collision) |
| **Keyboard Handling** | `KeyboardAvoidingView` enabled (`behavior={Platform.OS === 'ios' ? 'padding' : undefined}`) | `KeyboardAvoidingView` enabled | `KeyboardAvoidingView` enabled |
| **Touch Targets** | Close button: `minWidth: 44, minHeight: 44`, action buttons `minHeight: 44` | All touch targets ≥ 44×44 pt | All touch targets ≥ 44×44 pt |

### Specific Modal Design Guidelines

1. **QuickProductModal**:
   - *Phone*: Bottom sheet with product image (140×140 pt), title, price row, variant selector pill row (horizontal ScrollView), and full-width "Add to Cart" button.
   - *Tablet*: 2-column centered modal (Left: 200×200 image, Right: Info, variants, and Add button).
2. **LocationModal**:
   - Search input, GPS button ("Use current location" with icon), saved addresses list with radio selection, and horizontal city chip pills.
   - City chips must be inside `<ScrollView horizontal showsHorizontalScrollIndicator={false}>` so they never wrap or clip.
3. **LoginOtpModal**:
   - Mobile number input with `+91` badge and clear formatting.
   - 4-digit OTP inputs: 4 square boxes (`width: 48, height: 52`) with `autoFocus` and auto-advance. Must include demo auto-fill button.
4. **FilterSortDrawer**:
   - *Phone*: Right-side slide-over drawer or bottom sheet with Sort Options (radio list) and Brand Checkboxes.
   - *Tablet*: Centered filter dialog or docked side panel.
5. **CancelOrderModal**:
   - Order summary warning pill ("Refund of ₹XYZ will be initiated"), radio list of cancellation reasons, and side-by-side action buttons ("Don't Cancel" vs "Cancel Order", each `minHeight: 44`).
6. **RateOrderModal**:
   - 5 interactive star rating buttons with minimum 44×44 pt touch targets (`p-2`, 32pt star icon), feedback text, and multi-line review input inside `KeyboardAvoidingView`.
7. **ApplyCouponModal**:
   - Coupon code input with "Apply" button (`minHeight: 44`), active coupon indicator with "Remove" action, and available coupons list.
8. **AddEditAddressModal**:
   - Type selector ('Home' | 'Work' | 'Other'), Form inputs (`houseNo`, `apartmentRoad`, `landmark`, `city`, `pincode`, `name`, `phone`) inside `KeyboardAvoidingView` with full scrolling support.

---

## 11. Recommended Responsive Utility Architecture

To guarantee layout consistency and prevent regression, the implementer should introduce a lightweight responsive utility module:

### Proposed Utility: `mobile/src/utils/responsive.ts`
```ts
import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const isCompactScreen = SCREEN_WIDTH <= 375;
export const isStandardScreen = SCREEN_WIDTH > 375 && SCREEN_WIDTH < 768;
export const isTablet = SCREEN_WIDTH >= 768;

export const getResponsiveColumnCount = (containerWidth: number = SCREEN_WIDTH): number => {
  if (containerWidth >= 900) return 4;
  if (containerWidth >= 600) return 3;
  return 2;
};

export const getCardWidth = (containerWidth: number = SCREEN_WIDTH, padding: number = 32, gap: number = 10): number => {
  const columns = getResponsiveColumnCount(containerWidth);
  const totalGaps = (columns - 1) * gap;
  return Math.floor((containerWidth - padding - totalGaps) / columns);
};

export const HIT_SLOP_ACCESSIBLE = { top: 12, bottom: 12, left: 12, right: 12 };
export const MIN_TOUCH_SIZE = 44;
```

---

## 12. Implementation & Remediation Action Plan

### Phase 1: Global Foundation & Safe Areas
1. **Wrap Root in `SafeAreaProvider`**:
   - Update `mobile/App.tsx` to wrap `<NavigationContainer>` inside `<SafeAreaProvider>`.
   - Update `tabBarStyle` in `App.tsx` to dynamically incorporate `insets.bottom`:
     ```tsx
     const insets = useSafeAreaInsets();
     tabBarStyle: {
       height: 60 + insets.bottom,
       paddingBottom: insets.bottom + 6,
       paddingTop: 6
     }
     ```
2. **Migrate all screens from `react-native`'s `SafeAreaView`** to `react-native-safe-area-context`'s `SafeAreaView` with `edges={['top', 'left', 'right']}`.

### Phase 2: Fix Bottom Home Indicator Occlusions
1. `ProductDetailScreen.tsx`: Add `paddingBottom: insets.bottom + 12` to `bottomBarInner`.
2. `CartScreen.tsx`: Add `paddingBottom: insets.bottom + 12` to `footerInner`.
3. `SupportScreen.tsx`: Add `paddingBottom: insets.bottom + 8` to `inputBarInner` and wrap in `<KeyboardAvoidingView>`.
4. `HomeScreen.tsx`: Adjust `floatingCartContainer` to float above the bottom tab bar (`bottom: insets.bottom + 72`).

### Phase 3: Accessibility & Touch Target Remediation
1. `ProductCard.tsx`:
   - Increase `addButton` height to 36pt + hitSlop.
   - Expand `stepper` button widths from 18pt to 28pt with hitSlop.
   - Enlarge `wishlistBtn` touch area to 44×44 pt using `hitSlop={HIT_SLOP_ACCESSIBLE}`.
2. Across all 15 screens:
   - Enlarge all `backBtn` touchables to minimum 44×44 pt.
   - Enlarge `profileButton` on HomeScreen from 32×32 to 44×44 pt.
   - Ensure all modal close buttons and form action buttons meet 44 pt minimum height.

### Phase 4: Compact Screen Overflow & Squeeze Fixes
1. `SearchResultsScreen.tsx`: Wrap filter chips in `<ScrollView horizontal showsHorizontalScrollIndicator={false}>`.
2. `CategoryScreen.tsx`: Make sidebar width adaptive (75px on compact 320px, 90px on standard, 120px on tablet), and switch product feed to dynamic 2-column layout.
3. `OrdersHistoryScreen.tsx`: Add `flexShrink: 1` to `orderNumber` and `statusBadge` to prevent horizontal clipping.
4. `ProfileScreen.tsx`: Allow stats row to wrap or dynamically adjust font size on compact viewports.

### Phase 5: Tablet & Foldable Multi-Column Adaptations
1. `CategoryScreen.tsx`, `SearchResultsScreen.tsx`, `WishlistScreen.tsx`: Replace fixed `maxWidth: 220` with column-calculated card width (2 columns on mobile, 3–4 columns on tablet).
2. `ProductDetailScreen.tsx`: Implement responsive 2-column layout when `width >= 768`.
3. `CartScreen.tsx`: Implement responsive 2-column layout on tablets (items left, bill right).
4. `SavedAddressesScreen.tsx` & New Modals: Implement adaptive presentation (Bottom sheet on phones <600px, centered dialog on tablets ≥600px).

---

## 13. Verification Criteria
- [ ] TypeScript check (`npm --prefix mobile run typecheck`) compiles with 0 errors.
- [ ] Expo diagnostics (`npm --prefix mobile run doctor`) passes with 20/20 checks clean.
- [ ] Visual verification across 320px (iPhone SE 1st gen), 390px (iPhone 14/15), 430px (iPhone 15 Pro Max), and 768px/1024px (iPad) displays no text truncation, no horizontal overflow, and fully accessible touch targets.
