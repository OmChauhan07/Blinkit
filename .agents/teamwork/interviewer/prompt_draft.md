Re-modify all Blinkit mobile pages and modals for responsiveness across all mobile screen sizes, implement all missing web pages and modals in the mobile application for production deployment, and follow the test-driven principle: create -> test -> modify -> test -> display results.

Working directory: E:\Humbingo\Blinkit
Integrity mode: development

## Requirements

### R1. Responsive Mobile Screens and Modals
Ensure all mobile screens and modal components in the mobile application (`mobile/src/screens/` and `mobile/src/components/`) are fully responsive across compact screens (320px–375px), standard screens (390px–430px), foldables, and tablets (768px–1024px). Layouts, typography, touch targets, and scroll containers must adapt dynamically to varying screen dimensions and safe areas without clipping, text overflow, or visual defects.

### R2. Feature Parity with Web Views and Modals
Audit the web application (`web/src/views/` and `web/src/components/`) against mobile, and implement all missing web modals, drawers, and views into the mobile application (including QuickProductModal, LocationModal, LoginOtpModal, AddEditAddressModal, ApplyCouponModal, CancelOrderModal, RateOrderModal, FilterSortDrawer, and any unported views). All ported mobile components must integrate with the existing navigation, theme system, and state management.

### R3. Test, Modify, and Results Display Cycle
Follow the required execution cycle: create -> test -> modify -> test -> display results. Verify code changes iteratively against TypeScript compilation, Expo diagnostics, and layout behavior, documenting and displaying verification findings across all target form factors.

## Acceptance Criteria

### Responsiveness & Layout
- [ ] All mobile screens and modals render without horizontal overflow, text clipping, or broken layouts across compact (320px–375px), standard (390px–430px), foldable, and tablet (768px–1024px) viewport dimensions.
- [ ] Interactive touch targets meet standard accessibility sizing (minimum 44x44 pt) across all devices.
- [ ] Safe area insets (notches, home indicators, status bars) are respected across all screens and modals.

### Feature Parity
- [ ] All missing web modals and drawers (including QuickProductModal, LocationModal, LoginOtpModal, AddEditAddressModal, ApplyCouponModal, CancelOrderModal, RateOrderModal, and FilterSortDrawer) are implemented as native mobile components in `mobile/`.
- [ ] Ported modals and views integrate with application navigation flows, theme styling, and state management.

### Verification & Test Reporting
- [ ] `npm run test:mobile` (`tsc --noEmit`) passes with 0 type errors in the `mobile/` package.
- [ ] `npm --prefix mobile run doctor` passes with no unresolved issues.
- [ ] A verification report is generated displaying the test results and responsive layout validation across compact, standard, and tablet form factors before and after modifications.
