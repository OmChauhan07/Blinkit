/**
 * @file adversarial-stress-m1.js
 * Adversarial Verification Harness for Milestone 1
 * Written by challenger_m1_2
 */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

// Mock react-native and react-native-safe-area-context for Node runtime execution
const origRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'react-native') {
    return {
      useWindowDimensions: () => ({ width: 375, height: 812 }),
      StyleSheet: { create: (s) => s },
      Platform: { OS: 'ios', select: (obj) => obj.ios || obj.default },
    };
  }
  if (id === 'react-native-safe-area-context') {
    return {
      useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
      SafeAreaProvider: ({ children }) => children,
      SafeAreaView: ({ children }) => children,
    };
  }
  return origRequire.apply(this, arguments);
};

// Load transpiled useResponsive module
const useResponsiveModule = require('../dist/useResponsive.js');
const {
  calculateCardWidth,
  getGridColumns,
  getContainerPadding,
  calculateScale,
  calculateVerticalScale,
  calculateModerateScale,
  calculateClampedScale,
  calculateResponsiveMetrics,
  MIN_TOUCH_TARGET,
  ACCESSIBLE_HIT_SLOP
} = useResponsiveModule;

console.log('================================================================');
console.log('       CHALLENGER M1-2: EMPIRICAL ADVERSARIAL HARNESS           ');
console.log('================================================================');

const findings = [];
let passCount = 0;
let failCount = 0;

function runCheck(id, description, testFn) {
  try {
    const result = testFn();
    passCount++;
    console.log(`[PASS] ${id}: ${description}`);
    return { id, description, status: 'PASS', details: result };
  } catch (err) {
    failCount++;
    console.error(`[FAIL] ${id}: ${description} -> ${err.message}`);
    findings.push({ id, description, status: 'FAIL', error: err.message });
    return { id, description, status: 'FAIL', error: err.message };
  }
}

// -------------------------------------------------------------
// SECTION 1: calculateCardWidth Empirical Stress Testing
// -------------------------------------------------------------
console.log('\n--- SECTION 1: calculateCardWidth Stress Testing ---');

const testWidths = [300, 320, 360, 375, 390, 414, 430, 600, 768, 834, 900, 1024, 1200];
const standardCols = [1, 2, 3, 4];
const edgeCols = [0, -1, -2];
const standardGaps = [0, 8, 10, 12, 16];

// 1.1 Standard matrix: valid container widths and columns 1..4
runCheck('STRESS-1.1', 'calculateCardWidth returns valid positive finite integers for widths 300..1200 and cols 1..4', () => {
  for (const w of testWidths) {
    for (const c of standardCols) {
      for (const g of standardGaps) {
        const cardWidth = calculateCardWidth(w, c, g);
        assert.ok(Number.isFinite(cardWidth), `Expected finite number, got ${cardWidth} (w=${w}, c=${c}, g=${g})`);
        assert.ok(!Number.isNaN(cardWidth), `Expected not NaN (w=${w}, c=${c}, g=${g})`);
        assert.ok(cardWidth > 0, `Expected positive card width, got ${cardWidth} (w=${w}, c=${c}, g=${g})`);
        assert.strictEqual(cardWidth, Math.floor(cardWidth), `Expected integer value, got ${cardWidth}`);
        
        // Mathematical invariant: cardWidth * columns + totalGaps <= containerWidth
        const totalGaps = (c - 1) * g;
        const totalSpan = cardWidth * c + totalGaps;
        assert.ok(totalSpan <= w, `Total grid span (${totalSpan}) exceeds container width (${w}) for c=${c}, g=${g}`);
      }
    }
  }
  return 'All combinations of w in [300..1200], c in [1..4], g in [0..16] satisfied invariants';
});

// 1.2 Adversarial edge cases: columns = 0
runCheck('STRESS-1.2', 'Adversarial check: columns = 0 behavior in calculateCardWidth', () => {
  const anomalies = [];
  for (const w of testWidths) {
    for (const g of standardGaps) {
      const res = calculateCardWidth(w, 0, g);
      if (!Number.isFinite(res) || res <= 0 || Number.isNaN(res)) {
        anomalies.push({ w, c: 0, g, result: res });
      }
    }
  }
  if (anomalies.length > 0) {
    const sample = anomalies[0];
    throw new Error(`Division by zero / Infinity detected when columns=0! Sample: calculateCardWidth(${sample.w}, 0, ${sample.g}) = ${sample.result} (${anomalies.length} occurrences)`);
  }
  return 'Handled gracefully';
});

// 1.3 Adversarial edge cases: columns < 0 (negative columns)
runCheck('STRESS-1.3', 'Adversarial check: negative columns behavior in calculateCardWidth', () => {
  const anomalies = [];
  for (const w of testWidths) {
    for (const c of [-1, -2]) {
      for (const g of standardGaps) {
        const res = calculateCardWidth(w, c, g);
        if (!Number.isFinite(res) || res <= 0 || Number.isNaN(res)) {
          anomalies.push({ w, c, g, result: res });
        }
      }
    }
  }
  if (anomalies.length > 0) {
    const sample = anomalies[0];
    throw new Error(`Negative dimensions detected when columns < 0! Sample: calculateCardWidth(${sample.w}, ${sample.c}, ${sample.g}) = ${sample.result} (${anomalies.length} occurrences)`);
  }
  return 'Handled gracefully';
});

// 1.4 Adversarial edge cases: containerWidth < totalGaps (tiny container or huge gap)
runCheck('STRESS-1.4', 'Adversarial check: containerWidth < totalGaps behavior in calculateCardWidth', () => {
  // e.g. containerWidth = 20, columns = 4, gap = 16 => totalGaps = 3 * 16 = 48 => (20 - 48)/4 = -7
  const res = calculateCardWidth(20, 4, 16);
  if (res < 0) {
    throw new Error(`Negative dimension returned when containerWidth (20) < totalGaps (48): got ${res}`);
  }
  return 'Handled gracefully';
});

// -------------------------------------------------------------
// SECTION 2: getGridColumns Empirical Verification
// -------------------------------------------------------------
console.log('\n--- SECTION 2: getGridColumns Verification ---');

runCheck('GRID-2.1', 'getGridColumns returns 2 columns for widths < 768px (compact & standard)', () => {
  assert.strictEqual(getGridColumns(300), 2);
  assert.strictEqual(getGridColumns(320), 2);
  assert.strictEqual(getGridColumns(360), 2);
  assert.strictEqual(getGridColumns(375), 2);
  assert.strictEqual(getGridColumns(390), 2);
  assert.strictEqual(getGridColumns(430), 2);
  assert.strictEqual(getGridColumns(600), 2);
  assert.strictEqual(getGridColumns(767), 2);
  return 'Verified 2 columns for mobile';
});

runCheck('GRID-2.2', 'getGridColumns returns 3 columns for widths 768px..899px (small tablets)', () => {
  assert.strictEqual(getGridColumns(768), 3);
  assert.strictEqual(getGridColumns(800), 3);
  assert.strictEqual(getGridColumns(834), 3);
  assert.strictEqual(getGridColumns(899), 3);
  return 'Verified 3 columns for small tablets';
});

runCheck('GRID-2.3', 'getGridColumns returns 4 columns for widths >= 900px (large tablets & desktop)', () => {
  assert.strictEqual(getGridColumns(900), 4);
  assert.strictEqual(getGridColumns(1024), 4);
  assert.strictEqual(getGridColumns(1200), 4);
  assert.strictEqual(getGridColumns(1440), 4);
  return 'Verified 4 columns for large tablets';
});

runCheck('GRID-2.4', 'getGridColumns boundary check at exactly 767, 768, 899, 900', () => {
  assert.strictEqual(getGridColumns(767.99), 2);
  assert.strictEqual(getGridColumns(768.0), 3);
  assert.strictEqual(getGridColumns(899.99), 3);
  assert.strictEqual(getGridColumns(900.0), 4);
  return 'Exact boundary transitions verified';
});

runCheck('GRID-2.5', 'Adversarial check: getGridColumns with negative, zero, or extreme inputs', () => {
  assert.strictEqual(getGridColumns(0), 2);
  assert.strictEqual(getGridColumns(-50), 2);
  assert.strictEqual(getGridColumns(100000), 4);
  return 'Non-positive widths default to 2 columns';
});

// -------------------------------------------------------------
// SECTION 3: WCAG 2.1 AA Minimum Touch Target Verification
// -------------------------------------------------------------
console.log('\n--- SECTION 3: WCAG 2.1 AA Touch Target Verification ---');

runCheck('WCAG-3.1', 'MIN_TOUCH_TARGET constant meets WCAG 2.1 AA Success Criterion 2.5.5 / 2.5.8 (min 44x44 pt)', () => {
  assert.ok(MIN_TOUCH_TARGET, 'MIN_TOUCH_TARGET must be defined');
  assert.strictEqual(typeof MIN_TOUCH_TARGET.minWidth, 'number');
  assert.strictEqual(typeof MIN_TOUCH_TARGET.minHeight, 'number');
  assert.ok(MIN_TOUCH_TARGET.minWidth >= 44, `minWidth ${MIN_TOUCH_TARGET.minWidth} is less than 44`);
  assert.ok(MIN_TOUCH_TARGET.minHeight >= 44, `minHeight ${MIN_TOUCH_TARGET.minHeight} is less than 44`);
  assert.strictEqual(MIN_TOUCH_TARGET.minWidth, 44);
  assert.strictEqual(MIN_TOUCH_TARGET.minHeight, 44);
  return 'Strictly 44x44 pt';
});

runCheck('WCAG-3.2', 'calculateResponsiveMetrics produces minTouchTarget adhering to WCAG 2.1 AA', () => {
  const metricsPhone = calculateResponsiveMetrics({ width: 375, height: 812 });
  const metricsTablet = calculateResponsiveMetrics({ width: 1024, height: 768 });
  
  assert.strictEqual(metricsPhone.minTouchTarget.minWidth, 44);
  assert.strictEqual(metricsPhone.minTouchTarget.minHeight, 44);
  assert.strictEqual(metricsTablet.minTouchTarget.minWidth, 44);
  assert.strictEqual(metricsTablet.minTouchTarget.minHeight, 44);
  return 'Adheres across phone and tablet metrics';
});

runCheck('WCAG-3.3', 'ACCESSIBLE_HIT_SLOP expands compact tap targets symmetrically by at least 12pt', () => {
  assert.ok(ACCESSIBLE_HIT_SLOP);
  assert.strictEqual(ACCESSIBLE_HIT_SLOP.top, 12);
  assert.strictEqual(ACCESSIBLE_HIT_SLOP.bottom, 12);
  assert.strictEqual(ACCESSIBLE_HIT_SLOP.left, 12);
  assert.strictEqual(ACCESSIBLE_HIT_SLOP.right, 12);
  // An element of 20x20 with hit slop 12 expands to (20 + 24) = 44 x (20 + 24) = 44 pt!
  const effectiveWidth = 20 + ACCESSIBLE_HIT_SLOP.left + ACCESSIBLE_HIT_SLOP.right;
  const effectiveHeight = 20 + ACCESSIBLE_HIT_SLOP.top + ACCESSIBLE_HIT_SLOP.bottom;
  assert.strictEqual(effectiveWidth, 44);
  assert.strictEqual(effectiveHeight, 44);
  return '20pt icon + 12pt hit slop achieves exact 44x44pt WCAG threshold';
});

// -------------------------------------------------------------
// SECTION 4: Navigation Route Registration & Resolution (15 Screens)
// -------------------------------------------------------------
console.log('\n--- SECTION 4: Navigation & Route Registration Verification ---');

const expectedScreens = [
  'HomeScreen',
  'CategoryScreen',
  'ProductDetailScreen',
  'CartScreen',
  'CheckoutScreen',
  'OrderTrackingScreen',
  'SearchResultsScreen',
  'OrdersHistoryScreen',
  'ProfileScreen',
  'SavedAddressesScreen',
  'WishlistScreen',
  'OffersCouponsScreen',
  'SupportScreen',
  'FAQScreen',
  'AboutUsScreen'
];

runCheck('NAV-4.1', 'All 15 screen component files exist on disk in mobile/src/screens/', () => {
  const screensDir = path.resolve(__dirname, '../src/screens');
  const files = fs.readdirSync(screensDir);
  for (const screenName of expectedScreens) {
    const filename = `${screenName}.tsx`;
    assert.ok(files.includes(filename), `Missing screen file: ${filename}`);
  }
  assert.strictEqual(files.filter(f => f.endsWith('.tsx')).length, 15);
  return '15/15 screen files physically present';
});

runCheck('NAV-4.2', 'RootNavigator registers stack routes and imports corresponding screens', () => {
  const rootNavPath = path.resolve(__dirname, '../src/navigation/RootNavigator.tsx');
  const content = fs.readFileSync(rootNavPath, 'utf8');

  // Verify TabNavigator mount
  assert.ok(content.includes('<Stack.Screen name="MainTabs" component={TabNavigator}'), 'MainTabs missing');

  // Check registration of stack screens
  const requiredStackRoutes = [
    'Category',
    'ProductDetail',
    'Cart',
    'Checkout',
    'OrderTracking',
    'Search',
    'SearchResults',
    'OrdersHistory',
    'Profile',
    'SavedAddresses',
    'Wishlist',
    'OffersCoupons',
    'Support',
    'FAQ',
    'AboutUs'
  ];

  for (const route of requiredStackRoutes) {
    assert.ok(content.includes(`name="${route}"`), `Stack.Screen missing route name: ${route}`);
  }
  return 'All required stack screens declared in RootNavigator.tsx';
});

runCheck('NAV-4.3', 'TabNavigator registers 5 tabs with SafeAreaInsets dynamic padding', () => {
  const tabNavPath = path.resolve(__dirname, '../src/navigation/TabNavigator.tsx');
  const content = fs.readFileSync(tabNavPath, 'utf8');

  const requiredTabs = ['HomeTab', 'CategoriesTab', 'PrintTab', 'OrdersTab', 'ProfileTab'];
  for (const tab of requiredTabs) {
    assert.ok(content.includes(`name="${tab}"`), `Tab.Screen missing tab: ${tab}`);
  }

  // Safe area integration check
  assert.ok(content.includes('height: 60 + insets.bottom'), 'Tab bar height does not include insets.bottom');
  assert.ok(content.includes('paddingBottom: insets.bottom > 0 ? insets.bottom : 8'), 'Tab bar paddingBottom does not dynamically adapt to insets.bottom');
  return 'TabNavigator has 5 tabs and dynamic safe area padding';
});

runCheck('NAV-4.4', 'RootStackParamList declares types for all 15 screens + shortcuts', () => {
  const typesPath = path.resolve(__dirname, '../src/navigation/types.ts');
  const content = fs.readFileSync(typesPath, 'utf8');

  // Check RootStackParamList contains all screens
  const paramListChecks = [
    'MainTabs:',
    'Category:',
    'ProductDetail:',
    'Cart:',
    'Checkout:',
    'OrderTracking:',
    'Search:',
    'SearchResults:',
    'OrdersHistory:',
    'Profile:',
    'SavedAddresses:',
    'Wishlist:',
    'OffersCoupons:',
    'Support:',
    'FAQ:',
    'AboutUs:',
    'HomeTab:',
    'CategoriesTab:',
    'PrintTab:',
    'OrdersTab:',
    'ProfileTab:'
  ];

  for (const p of paramListChecks) {
    assert.ok(content.includes(p), `RootStackParamList missing: ${p}`);
  }

  // Check Screen Prop Type Helpers
  assert.ok(content.includes('export type HomeScreenProps = MainTabScreenProps<\'HomeTab\'>;'));
  assert.ok(content.includes('export type CategoryScreenProps = RootStackScreenProps<\'Category\'>;'));
  assert.ok(content.includes('export type ProductDetailScreenProps = RootStackScreenProps<\'ProductDetail\'>;'));
  assert.ok(content.includes('declare global'));
  assert.ok(content.includes('interface RootParamList extends RootStackParamList'));

  return 'RootStackParamList is complete and strongly typed';
});

// -------------------------------------------------------------
// SECTION 5: Clamped Scale & Moderate Scale Adversarial Tests
// -------------------------------------------------------------
console.log('\n--- SECTION 5: Scale Utilities Stress Testing ---');

runCheck('SCALE-5.1', 'calculateClampedScale never exceeds [min, max] bounds across any viewport width', () => {
  const extremeWidths = [100, 200, 320, 375, 500, 768, 1024, 2000, 5000];
  const size = 16;
  const min = 12;
  const max = 24;

  for (const w of extremeWidths) {
    const val = calculateClampedScale(w, size, min, max);
    assert.ok(val >= min, `Clamped scale ${val} below min ${min} at width ${w}`);
    assert.ok(val <= max, `Clamped scale ${val} above max ${max} at width ${w}`);
  }
  return 'Strict adherence to [min, max] boundary across 100px..5000px';
});

// Summary
console.log('\n================================================================');
console.log(`TOTAL CHECKS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('================================================================');

if (findings.length > 0) {
  console.log('\nEMPIRICAL ANOMALIES / DEFECTS DETECTED:');
  findings.forEach((f, idx) => {
    console.log(`${idx + 1}. [${f.id}] ${f.description}\n   Error: ${f.error}`);
  });
}
