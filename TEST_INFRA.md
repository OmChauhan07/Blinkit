# Blinkit Mobile: End-to-End & Responsive Test Infrastructure (TEST_INFRA.md)

## 1. Test Philosophy & Architecture

### 1.1 Guiding Principles
The Blinkit Mobile verification strategy operates on three fundamental pillars:
1. **Opaque-Box & Requirement-Driven**: Tests are derived strictly from documented requirements in `ORIGINAL_REQUEST.md` and architecture contracts in `PROJECT.md`. Tests do not rely on transient internal implementation details; they validate observable interfaces, state transitions, layout constraints, and accessibility contracts.
2. **Multi-Form-Factor Responsive Validation**: Mobile UI must behave predictably and adaptively across all physical form factors. Viewport dimensions are tested systematically across three core tiers:
   - **Compact Viewport (320px – 375px)**: iPhone SE 1st/2nd/3rd Gen, iPhone 12/13 Mini, compact Android devices (e.g., Galaxy A-series).
   - **Standard Viewport (390px – 430px)**: iPhone 13/14/15/16 Pro, Google Pixel 7/8, Samsung Galaxy S23/S24.
   - **Tablet / Large Viewport (768px – 1024px+)**: iPad Mini, iPad Air/Pro, Android tablets, unfolded foldable devices.
3. **Progressive Testability & Zero-Degradation Gate**: All tests are runnable programmatically in headless and CI/CD environments. Tests validate TypeScript compilation (`npm run test:mobile`), Expo diagnostics (`npm --prefix mobile run doctor`), and UI metrics (touch targets >= 44×44 pt, zero horizontal overflow, safe-area inset accounting).

### 1.2 Viewport & Device Matrix
| Category | Width Range | Height Range | Reference Device | Layout Expectations |
|---|---|---|---|---|
| **Compact** | 320px – 375px | 568px – 812px | iPhone SE, 13 Mini | 2 columns grid, 12pt padding, compact fonts, wrapped badge headers, no horizontal overflow |
| **Standard** | 376px – 767px | 800px – 932px | iPhone 15 Pro, Pixel 8 | 2 columns grid, 16pt padding, standard typography, bottom sheets for overlays |
| **Tablet** | 768px – 1024px+ | 1024px – 1366px | iPad 10th Gen, iPad Pro | 3–4 columns grid, 24pt padding, centered modal dialogs (max-width 560px), multi-column carts |

---

## 2. Complete 21-Feature Inventory & Coverage Checklist

| # | Feature Key | Feature Name | Tier 1 (Coverage >=5) | Tier 2 (Boundary >=5) | Tier 3 (Pairwise) | Tier 4 (Workloads) | Status |
|---|---|---|:---:|:---:|:---:|:---:|:---:|
| 1 | `F01_RESPONSIVE_HOOK` | Responsive Hook (`useResponsive`) | 5 cases | 5 cases | 3 pairs | Scenario 1, 2, 5 | Covered |
| 2 | `F02_THEME_SYSTEM` | Centralized Theme System | 5 cases | 5 cases | 2 pairs | Scenario 1, 2 | Covered |
| 3 | `F03_NAVIGATION_MODULARIZATION` | Modular Typed Navigation | 5 cases | 5 cases | 4 pairs | Scenario 1, 2, 3 | Covered |
| 4 | `F04_STORE_CONTEXT_EXPANSION` | StoreContext State & Actions | 5 cases | 5 cases | 5 pairs | Scenario 1, 2, 3, 4 | Covered |
| 5 | `F05_QUICK_PRODUCT_MODAL` | Quick Product View Modal | 5 cases | 5 cases | 3 pairs | Scenario 1 | Covered |
| 6 | `F06_LOCATION_MODAL` | Location Selection Modal | 5 cases | 5 cases | 3 pairs | Scenario 1 | Covered |
| 7 | `F07_LOGIN_OTP_MODAL` | Login OTP Modal | 5 cases | 5 cases | 3 pairs | Scenario 1, 4 | Covered |
| 8 | `F08_ADD_EDIT_ADDRESS_MODAL` | Add/Edit Address Modal | 5 cases | 5 cases | 3 pairs | Scenario 2 | Covered |
| 9 | `F09_APPLY_COUPON_MODAL` | Apply Coupon Modal | 5 cases | 5 cases | 3 pairs | Scenario 2 | Covered |
| 10 | `F10_CANCEL_ORDER_MODAL` | Cancel Order Modal | 5 cases | 5 cases | 3 pairs | Scenario 3 | Covered |
| 11 | `F11_RATE_ORDER_MODAL` | Rate Order Modal | 5 cases | 5 cases | 3 pairs | Scenario 4 | Covered |
| 12 | `F12_FILTER_SORT_DRAWER` | Filter & Sort Drawer | 5 cases | 5 cases | 3 pairs | Scenario 1 | Covered |
| 13 | `F13_CART_DRAWER` | Cart Drawer | 5 cases | 5 cases | 4 pairs | Scenario 2 | Covered |
| 14 | `F14_GLOBAL_MODAL_MANAGER` | Global Modal Manager | 5 cases | 5 cases | 4 pairs | Scenario 1, 2, 3, 4 | Covered |
| 15 | `F15_PRODUCT_CARD_RESPONSIVENESS` | Product Card Component | 5 cases | 5 cases | 3 pairs | Scenario 1 | Covered |
| 16 | `F16_SCREENS_HOME_CATEGORY_SEARCH` | Home, Category & Search Screens | 5 cases | 5 cases | 3 pairs | Scenario 1 | Covered |
| 17 | `F17_SCREENS_PRODUCT_CART_CHECKOUT` | Detail, Cart & Checkout Screens | 5 cases | 5 cases | 4 pairs | Scenario 2 | Covered |
| 18 | `F18_SCREENS_ORDERS_TRACKING` | Order History & Tracking Screens | 5 cases | 5 cases | 3 pairs | Scenario 3, 4 | Covered |
| 19 | `F19_SCREENS_ACCOUNT_SETTINGS` | Profile, Addresses, Wishlist, Offers | 5 cases | 5 cases | 3 pairs | Scenario 4 | Covered |
| 20 | `F20_SCREENS_SUPPORT_FAQ_ABOUT` | Support, FAQ & About Us Screens | 5 cases | 5 cases | 2 pairs | Scenario 5 | Covered |
| 21 | `F21_TEST_SUITE_AND_DIAGNOSTICS` | Automated Test Suite & Diagnostics | 5 cases | 5 cases | 3 pairs | All Scenarios | Covered |
| **Total** | | | **105 cases** | **105 cases** | **Pairwise** | **5 Journeys** | **Complete** |

---

## 3. Four-Tier Test Methodology

### Tier 1: Feature Coverage (>=5 Test Cases per Feature = 105 Test Cases)

#### F01: `useResponsive` Hook
- `T1.1.1`: Validates `isCompact === true` for viewport widths <= 375px (320px, 360px, 375px).
- `T1.1.2`: Validates `isStandard === true` for viewport widths 376px to 767px (390px, 412px, 430px).
- `T1.1.3`: Validates `isTablet === true` for viewport widths >= 768px (768px, 834px, 1024px).
- `T1.1.4`: Validates grid column mapping: 2 columns (<768px), 3 columns (768px–1023px), 4 columns (>=1024px).
- `T1.1.5`: Validates `minTouchTarget` contract returns `{ minWidth: 44, minHeight: 44 }`.

#### F02: Theme System
- `T1.2.1`: Centralized color tokens export required keys (`primary`, `primaryDark`, `background`, `surface`, `textPrimary`, `textSecondary`, `border`, `error`, `success`, `warning`).
- `T1.2.2`: Centralized spacing tokens export numeric scale (`xs: 4`, `sm: 8`, `md: 12`, `lg: 16`, `xl: 20`, `xxl: 24`, `xxxl: 32`).
- `T1.2.3`: Centralized typography tokens export required variants (`h1`, `h2`, `h3`, `body`, `caption`, `bold`).
- `T1.2.4`: Border radius tokens define standard corner curves (`sm: 6`, `md: 10`, `lg: 14`, `full: 9999`).
- `T1.2.5`: Elevation/shadow tokens provide platform-compatible shadow definitions.

#### F03: Navigation Modularization
- `T1.3.1`: `RootNavigator` defines typed stack navigation with all standard screens.
- `T1.3.2`: `TabNavigator` defines bottom tabs (`Home`, `Categories`, `Search`, `Orders`, `Profile`).
- `T1.3.3`: Tab bar bottom padding respects safe area insets (`insets.bottom`).
- `T1.3.4`: Root `App.tsx` wraps tree in `<SafeAreaProvider>` and `<NavigationContainer>`.
- `T1.3.5`: Navigation parameter list adheres to strict TypeScript contracts.

#### F04: StoreContext Expansion
- `T1.4.1`: Exposes all 9 modal visibility state booleans and dispatchers (`isLocationModalOpen`, `isLoginModalOpen`, `isAddAddressModalOpen`, `isApplyCouponModalOpen`, `isFilterDrawerOpen`, `isCartDrawerOpen`, etc.).
- `T1.4.2`: Manages `quickViewProduct` state (null or `Product` object).
- `T1.4.3`: Manages `cancelOrderModalOrderId` and `rateOrderModalOrderId` IDs.
- `T1.4.4`: Exposes `editAddress(address)` handler updating address collection.
- `T1.4.5`: Exposes `verifyOtp(otp)` verifying 4-digit token and returning boolean.

#### F05: QuickProductModal
- `T1.5.1`: Mounts when `quickViewProduct` is populated; dismisses on backdrop press.
- `T1.5.2`: Renders product image, title, price, and discount badge.
- `T1.5.3`: Renders pack size/weight selection chips with >=44×44 pt touch targets.
- `T1.5.4`: Integrates quantity stepper (increment/decrement) updating cart count.
- `T1.5.5`: Provides "View Details" button navigating to `ProductDetailScreen`.

#### F06: LocationModal
- `T1.6.1`: Mounts when `isLocationModalOpen === true`.
- `T1.6.2`: Renders GPS "Detect Current Location" action with >=44×44 pt touch target.
- `T1.6.3`: Renders saved addresses radio selector with active selection highlight.
- `T1.6.4`: Renders popular delivery city chips for quick location switching.
- `T1.6.5`: Provides "Add New Address" trigger opening `AddEditAddressModal`.

#### F07: LoginOtpModal
- `T1.7.1`: Mounts when `isLoginModalOpen === true`.
- `T1.7.2`: Step 1: 10-digit phone number input with Indian phone validation (+91).
- `T1.7.3`: Step 2: 4-digit OTP box inputs with automatic focus advancement.
- `T1.7.4`: 30-second countdown resend timer with disabled state before timeout.
- `T1.7.5`: Quick test auto-fill button bypassing SMS delay during development.

#### F08: AddEditAddressModal
- `T1.8.1`: Mounts when `isAddAddressModalOpen === true`.
- `T1.8.2`: Supports both Create (new address) and Edit mode (pre-filled address).
- `T1.8.3`: Tag selector for address classification (`Home`, `Work`, `Other`).
- `T1.8.4`: Form fields (Receiver Name, Flat/House No, Floor, Street, Landmark, Pin).
- `T1.8.5`: Wrapped in `KeyboardAvoidingView` with safe area inset accounting.

#### F09: ApplyCouponModal
- `T1.9.1`: Mounts when `isApplyCouponModalOpen === true`.
- `T1.9.2`: Promo code text input with "Apply" button action.
- `T1.9.3`: List of available coupons (`BLINKIT50`, `WELCOME100`, `SUPER20`, etc.).
- `T1.9.4`: Minimum order requirement validation and feedback banner.
- `T1.9.5`: 1-tap apply coupon action updates cart discount and bill summary.

#### F10: CancelOrderModal
- `T1.10.1`: Mounts when `cancelOrderModalOrderId` is non-null.
- `T1.10.2`: Displays order ID, cancellation refund policy notice.
- `T1.10.3`: Radio list of cancellation reasons ("Ordered by mistake", "Delayed", etc.).
- `T1.10.4`: Confirmation button triggers order status update to `CANCELLED`.
- `T1.10.5`: Backdrop dismiss leaves order active without mutating state.

#### F11: RateOrderModal
- `T1.11.1`: Mounts when `rateOrderModalOrderId` is non-null.
- `T1.11.2`: 1 to 5 star interactive rating selector with >=44×44 pt touch targets.
- `T1.11.3`: Dynamic descriptive label updating per star count (Terrible -> Excellent).
- `T1.11.4`: Multi-line text feedback input with placeholder and character count.
- `T1.11.5`: Submit action persists rating and closes modal.

#### F12: FilterSortDrawer
- `T1.12.1`: Mounts when `isFilterDrawerOpen === true`.
- `T1.12.2`: Sort options radio list (Popularity, Price Low to High, Price High to Low, Rating).
- `T1.12.3`: Brand filter checkboxes with toggle state.
- `T1.12.4`: "Reset All" action clears active filters to default.
- `T1.12.5`: "Apply Filters" button updates active category/search filter results.

#### F13: CartDrawer
- `T1.13.1`: Mounts when `isCartDrawerOpen === true`.
- `T1.13.2`: Free delivery threshold progress bar dynamically calculating remaining amount.
- `T1.13.3`: Scrollable list of cart items with quantity stepper controls.
- `T1.13.4`: Delivery partner tipping selector (Rs 20, 30, 50, custom).
- `T1.13.5`: Sticky bottom bar with grand total and checkout navigation trigger.

#### F14: GlobalModalManager
- `T1.14.1`: Centralized component mounted at root level of `App.tsx`.
- `T1.14.2`: Manages simultaneous modal exclusivity or z-index stacking.
- `T1.14.3`: Adapts presentation: bottom sheet on phones (<768px), centered dialog on tablets (>=768px).
- `T1.14.4`: Back-handler interception on Android to close open modals before exiting.
- `T1.14.5`: Smooth transition animations without layout shifts.

#### F15: ProductCard Responsiveness
- `T1.15.1`: Touch targets for Add button, Stepper (+/-), and Card click satisfy >=44×44 pt.
- `T1.15.2`: Responsive width adapts to 2-column (phone), 3-column (tablet), or 4-column (desktop).
- `T1.15.3`: Long product titles truncate cleanly without breaking card height.
- `T1.15.4`: Discount tag and veg/non-veg indicator badges render without clipping on 320px.
- `T1.15.5`: Quick view eye icon triggers `quickViewProduct` modal opening.

#### F16: HomeScreen, CategoryScreen, SearchResultsScreen
- `T1.16.1`: `HomeScreen`: Location header click opens `LocationModal`.
- `T1.16.2`: `HomeScreen`: Horizontal category bar scrolls smoothly with touch target padding.
- `T1.16.3`: `CategoryScreen`: Two-column layout adapts to sidebar + grid on tablet.
- `T1.16.4`: `SearchResultsScreen`: Filter button triggers `FilterSortDrawer`.
- `T1.16.5`: All 3 screens maintain min 44×44 pt touch targets and zero horizontal overflow.

#### F17: ProductDetailScreen, CartScreen, CheckoutScreen
- `T1.17.1`: `ProductDetailScreen`: Sticky bottom Add-to-Cart bar includes `insets.bottom + 12` padding.
- `T1.17.2`: `CartScreen`: Empty cart state renders clear call-to-action button.
- `T1.17.3`: `CartScreen`: Apply coupon button triggers `ApplyCouponModal`.
- `T1.17.4`: `CheckoutScreen`: Address selection radio list and payment method selector.
- `T1.17.5`: Tablet presentation: 2-column layout (items left, bill summary right).

#### F18: OrdersHistoryScreen, OrderTrackingScreen
- `T1.18.1`: `OrdersHistoryScreen`: "Cancel Order" button triggers `CancelOrderModal`.
- `T1.18.2`: `OrdersHistoryScreen`: "Rate Order" button triggers `RateOrderModal`.
- `T1.18.3`: `OrderTrackingScreen`: Real-time order progress timeline with active step badge.
- `T1.18.4`: Header badge layout wraps cleanly on 320px compact screens.
- `T1.18.5`: Delivery partner call button provides >=44×44 pt touch target.

#### F19: ProfileScreen, SavedAddressesScreen, WishlistScreen, OffersCouponsScreen
- `T1.19.1`: `ProfileScreen`: Unauthenticated state renders login prompt triggering `LoginOtpModal`.
- `T1.19.2`: `SavedAddressesScreen`: "Add New Address" opens `AddEditAddressModal`.
- `T1.19.3`: `SavedAddressesScreen`: Address edit button loads address into `AddEditAddressModal`.
- `T1.19.4`: `WishlistScreen`: 1-tap "Move to Cart" button with stepper integration.
- `T1.19.5`: `OffersCouponsScreen`: 1-tap "Copy Code" action with toast/snackbar feedback.

#### F20: SupportScreen, FAQScreen, AboutUsScreen
- `T1.20.1`: `SupportScreen`: Chat input bar wrapped in `KeyboardAvoidingView`.
- `T1.20.2`: `SupportScreen`: Input send button satisfies >=44×44 pt touch target.
- `T1.20.3`: `FAQScreen`: Accordion items expand/collapse smoothly without layout jumping.
- `T1.20.4`: `AboutUsScreen`: Responsive feature highlights grid adapts from 1 to 3 columns on tablet.
- `T1.20.5`: Text containers use max-width and fluid padding preventing horizontal overflow.

#### F21: Test Suite & Diagnostics
- `T1.21.1`: Automated test runner executes with exit code 0.
- `T1.21.2`: TypeScript compiler check (`npm run test:mobile`) exits code 0 with 0 errors.
- `T1.21.3`: Expo doctor check (`npm --prefix mobile run doctor`) passes 20/20 diagnostics.
- `T1.21.4`: Layout audit checks static assets for touch targets and safe area insets.
- `T1.21.5`: Verification reporting generates markdown and structured summary metrics.

---

### Tier 2: Boundary & Corner Cases (>=5 Test Cases per Feature = 105 Test Cases)

Each feature is evaluated against strict edge boundaries:
1. **Compact Viewport (320px – 375px)**: Minimum physical width constraint.
2. **Standard Viewport (390px – 430px)**: Baseline density and safe area inset constraint.
3. **Tablet Viewport (768px – 1024px)**: Maximum width constraint, dialog bounds, and column expansion.
4. **Zero & Extremum Values**: 0 price, 0 quantity, 0 tip, 0 items in cart, 100+ items.
5. **Empty & Corrupt State**: Missing addresses, empty search query, invalid OTP, special character strings.

#### Detailed Matrix (Sample Highlights):
- `T2.1.1`: `useResponsive` at exactly 320px (compact lower bound) computes positive scale and `isCompact=true`.
- `T2.1.2`: `useResponsive` at boundary transition 375px/376px switches `isCompact` to `isStandard` cleanly.
- `T2.1.3`: `useResponsive` at boundary transition 767px/768px switches `isStandard` to `isTablet` cleanly.
- `T2.1.4`: `useResponsive` with zero safe-area insets (`{top:0, bottom:0, left:0, right:0}`) provides default padding.
- `T2.1.5`: `useResponsive` at extreme 1280px width caps container width to prevent over-stretching.
- `T2.4.1`: `StoreContext` bill summary with 0 items: `itemTotal=0`, `grandTotal=0`, `deliveryFee=0`.
- `T2.4.2`: `StoreContext` bill summary with cart value < Rs 199 adds delivery fee (Rs 25); >= Rs 199 waives delivery fee.
- `T2.4.3`: `StoreContext` coupon discount exceeding cart total caps discount to avoid negative balance.
- `T2.4.4`: `StoreContext` quantity decrement on item with quantity 1 removes item from cart cleanly.
- `T2.4.5`: `StoreContext` tip selector supports 0, custom values, and prevents negative tips.
- `T2.7.1`: `LoginOtpModal` handles invalid phone number (<10 digits or non-numeric) by disabling submit.
- `T2.7.2`: `LoginOtpModal` OTP entry with incomplete digits (1, 2, or 3 digits) prevents verification trigger.
- `T2.7.3`: `LoginOtpModal` verifies wrong OTP and returns false with error shake animation.
- `T2.7.4`: `LoginOtpModal` resend OTP button disabled until 30s timer reaches 0.
- `T2.7.5`: `LoginOtpModal` handles rapid double-click on verify without duplicate sessions.
- `T2.10.1`: `CancelOrderModal` handles cancellation with no reason selected (disables confirm button).
- `T2.10.2`: `CancelOrderModal` handles cancellation of already dispatched or delivered order gracefully.
- `T2.15.1`: `ProductCard` with 80-character product title wraps without overlapping price or stepper.
- `T2.15.2`: `ProductCard` with 0% discount omits discount badge without blank layout gap.
- `T2.15.3`: `ProductCard` rendered at 320px viewport maintains >=44×44 pt touch targets.
- `T2.17.1`: `CartScreen` with empty cart displays shopping CTA without NaN or undefined totals.
- `T2.17.2`: `CheckoutScreen` on tablet (1024px) centers layout with 560px max width or dual-column split.
- `T2.20.1`: `SupportScreen` with 500-word chat message renders bubble without horizontal expansion offscreen.

---

### Tier 3: Cross-Feature Interactions & Navigation / State Combinations

Validates pairwise interactions where state changes in one module impact another:
1. **Search -> Filter -> Quick View -> Cart Drawer**:
   - User types query in `SearchResultsScreen` (`F16`), applies price filter in `FilterSortDrawer` (`F12`), opens `QuickProductModal` (`F05`), adjusts weight chip, clicks Add to Cart (`F15`), and opens `CartDrawer` (`F13`).
2. **Location Switch -> Address Pre-selection -> Store Context**:
   - Clicking location in `HomeScreen` (`F16`) opens `LocationModal` (`F06`), user selects saved address or creates new via `AddEditAddressModal` (`F08`), which updates active delivery address in `StoreContext` (`F04`) and refreshes estimated delivery time.
3. **Coupon Application -> Bill Summary -> Checkout Navigation**:
   - In `CartScreen` (`F17`), user opens `ApplyCouponModal` (`F09`), selects `WELCOME100`, modal updates `StoreContext.billSummary` (`F04`), updates total savings, and navigates to `CheckoutScreen` (`F17`) with coupon pre-applied.
4. **Order Placement -> Real-time Tracking -> Order Cancellation**:
   - From `CheckoutScreen` (`F17`), order is confirmed and added to `StoreContext.orders` (`F04`), redirects to `OrderTrackingScreen` (`F18`), user clicks Cancel Order opening `CancelOrderModal` (`F10`), confirms cancellation, and tracking status updates to `CANCELLED`.
5. **Delivered Order -> Order History -> Rate Order Modal**:
   - From `OrdersHistoryScreen` (`F18`), user finds delivered order, clicks "Rate Order" opening `RateOrderModal` (`F11`), selects 5 stars, enters review, submits, and order updates to rated in state.
6. **Authentication Gate -> Profile / Saved Addresses**:
   - Unauthenticated user navigating to `SavedAddressesScreen` (`F19`) or attempting checkout triggers `LoginOtpModal` (`F07`), user completes verification, and active screen resumes with authenticated user data.
7. **Orientation / Viewport Resize -> Modal Layout Adaptivity**:
   - Active modal (`QuickProductModal`, `CartDrawer`, `LocationModal`) dynamically switches between bottom-sheet presentation (<768px) and centered dialog (>=768px) when viewport changes.

---

### Tier 4: Real-World Workload Scenarios

#### Scenario 1: New User Onboarding & Fast Discovery
- **User Journey**: App starts -> User sees location prompt -> Opens `LocationModal` -> Selects Delhi NCR -> Browses `HomeScreen` categories -> Searches for "Milk" -> Opens `QuickProductModal` for "Amul Taaza Milk 500ml" -> Changes variant to 1L -> Adds 2 units to cart -> Verifies bottom cart preview appears.
- **Form Factors**: Tested at 320px (Compact) and 390px (Standard).

#### Scenario 2: Shopping Cart, Coupon Optimization & Checkout
- **User Journey**: User opens `CartScreen` -> Sees free delivery progress bar -> Adds suggested item to cross Rs 199 -> Clicks "Apply Coupon" -> Selects `BLINKIT50` in `ApplyCouponModal` -> Observes Rs 50 discount reflected in `billSummary` -> Selects delivery tip Rs 30 -> Clicks "Proceed to Pay" -> Enters `CheckoutScreen` -> Adds new delivery address via `AddEditAddressModal` -> Selects UPI payment -> Places order.
- **Form Factors**: Tested at 390px (Standard) and 768px (Tablet split view).

#### Scenario 3: Real-Time Tracking & Emergency Order Cancellation
- **User Journey**: Post-checkout redirect to `OrderTrackingScreen` -> Observes simulated status ("Order Placed" -> "Partner Assigned") -> Decides to cancel -> Clicks "Cancel Order" -> `CancelOrderModal` appears -> Selects reason "Placed order by mistake" -> Confirms cancellation -> Tracking screen immediately updates badge to "Cancelled" with refund notice -> Navigation returns safely to Home.
- **Form Factors**: Tested at 360px and 412px.

#### Scenario 4: Historical Orders & Rating Submission
- **User Journey**: User navigates to bottom tab "Orders" (`OrdersHistoryScreen`) -> Filters by past delivered orders -> Clicks "Rate Order" -> `RateOrderModal` mounts as bottom sheet -> Selects 5 stars -> Dynamic label shows "Excellent!" -> Writes review "Fast delivery within 9 mins!" -> Clicks Submit -> Modal closes and order card reflects rated badge.
- **Form Factors**: Tested at 375px and 834px (Tablet dialog).

#### Scenario 5: Customer Support & FAQ Inquiry
- **User Journey**: User navigates to Profile -> Clicks "Customer Support" -> Opens `SupportScreen` -> Taps FAQ link opening `FAQScreen` -> Expands "What is the return policy for fresh items?" -> Returns to `SupportScreen` -> Types question in chat input -> Verifies `KeyboardAvoidingView` prevents keyboard occlusion -> Verifies send button touch target is >=44×44 pt.
- **Form Factors**: Tested at 320px, 390px, and 1024px.

---

## 4. Test Execution & Reporting Protocol

### 4.1 Automated Test Runner Commands
```bash
# Execute full mobile test suite & layout verification
npm --prefix mobile test

# Execute responsive viewport layout suite
npm --prefix mobile run test:responsive

# Execute TypeScript typecheck
npm run test:mobile

# Execute Expo doctor diagnostics
npm --prefix mobile run doctor
```

### 4.2 Pass/Fail Semantics & Gates
- **TypeScript Gate**: Zero (0) type errors permitted under strict mode (`tsc --noEmit`).
- **Expo Doctor Gate**: 20/20 diagnostics must pass cleanly.
- **Touch Target Gate**: 100% of tested interactive elements must meet or exceed 44×44 pt bounding box or hitSlop.
- **Horizontal Overflow Gate**: 0 uncontained fixed widths exceeding 320px width on compact viewport.
- **Safe Area Inset Gate**: All sticky footers, floating action bars, and modal sheets must include bottom inset padding (`insets.bottom`).
- **Tier Quota Gate**: Minimum 105 Tier 1 cases, 105 Tier 2 cases, complete Tier 3 pairwise, and 5 Tier 4 journeys must exit with code 0.
