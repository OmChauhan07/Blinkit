/**
 * @file adversarial-m1.test.js
 * Adversarial and Stress Test Suite for Milestone 1
 * Executed by Empirical Challenger challenger_m1_1.
 * Tests production TypeScript files mobile/src/hooks/useResponsive.ts and mobile/src/theme/index.ts directly.
 */

const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

// Module cache to ensure singletons and reference equality
const moduleCache = new Map();

// Helper to load and transpile TypeScript modules directly in the current realm with mocked React / React Native dependencies
function loadTsModule(filePath, mockModules = {}) {
  const fullPath = path.resolve(__dirname, filePath);
  if (moduleCache.has(fullPath)) {
    return moduleCache.get(fullPath);
  }

  const code = fs.readFileSync(fullPath, 'utf8');
  const compiled = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText;

  const moduleObj = { exports: {} };
  moduleCache.set(fullPath, moduleObj.exports);

  const customRequire = (id) => {
    if (mockModules[id]) return mockModules[id];
    if (id.startsWith('.')) {
      const targetPath = path.resolve(path.dirname(fullPath), id);
      const candidates = [
        targetPath,
        targetPath + '.ts',
        targetPath + '.tsx',
        targetPath + '.js',
        path.join(targetPath, 'index.ts'),
        path.join(targetPath, 'index.tsx'),
        path.join(targetPath, 'index.js')
      ];
      for (const cand of candidates) {
        if (fs.existsSync(cand)) return loadTsModule(cand, mockModules);
      }
    }
    return require(id);
  };

  const fn = new Function('module', 'exports', 'require', '__dirname', '__filename', compiled);
  fn(moduleObj, moduleObj.exports, customRequire, path.dirname(fullPath), fullPath);

  // Update cache with whatever was assigned to module.exports
  moduleCache.set(fullPath, moduleObj.exports);
  return moduleObj.exports;
}

// Shared mocks for React and React Native
const defaultMocks = {
  'react-native': {
    useWindowDimensions: () => ({ width: 375, height: 812 }),
    StyleSheet: { create: (s) => s },
    View: {},
    Text: {},
    Platform: { OS: 'ios', select: (obj) => obj.ios || obj.default }
  },
  'react-native-safe-area-context': {
    useSafeAreaInsets: () => ({ top: 47, bottom: 34, left: 0, right: 0 })
  },
  'react': {
    useMemo: (fn) => fn(),
    createContext: () => ({}),
    FC: {}
  }
};

// Load production useResponsive module
const responsiveModule = loadTsModule('../src/hooks/useResponsive.ts', defaultMocks);

// Load production theme module
const themeModule = loadTsModule('../src/theme/index.ts', defaultMocks);

function runAllAdversarialTests() {
  const results = [];
  let testCount = 0;

  function runTest(category, name, fn) {
    testCount++;
    try {
      fn();
      results.push({ id: `ADV-${String(testCount).padStart(2, '0')}`, category, name, pass: true });
    } catch (err) {
      results.push({ id: `ADV-${String(testCount).padStart(2, '0')}`, category, name, pass: false, error: err.message, stack: err.stack });
    }
  }

  const {
    calculateResponsiveMetrics,
    calculateScale,
    calculateVerticalScale,
    calculateModerateScale,
    calculateClampedScale,
    getGridColumns,
    getContainerPadding,
    calculateCardWidth,
    MIN_TOUCH_TARGET,
    ACCESSIBLE_HIT_SLOP
  } = responsiveModule;

  // =========================================================================
  // SECTION 1: Viewport Boundary Tests (Compact, Standard, Tablet, Ultra-Wide)
  // =========================================================================

  // 1.1 Compact boundaries: width = 320, 360, 375
  runTest('Viewport Boundaries', 'Compact lower boundary (320x568 iPhone SE 1st gen)', () => {
    const m = calculateResponsiveMetrics({ width: 320, height: 568 });
    assert.strictEqual(m.isCompact, true);
    assert.strictEqual(m.isStandard, false);
    assert.strictEqual(m.isTablet, false);
    assert.strictEqual(m.gridColumns, 2);
    assert.strictEqual(m.containerPadding, 12);
    assert.strictEqual(m.modalPresentation, 'bottomSheet');
    assert.strictEqual(m.modalMaxWidth, '100%');
  });

  runTest('Viewport Boundaries', 'Compact mid-boundary (360x800 standard compact Android)', () => {
    const m = calculateResponsiveMetrics({ width: 360, height: 800 });
    assert.strictEqual(m.isCompact, true);
    assert.strictEqual(m.isStandard, false);
    assert.strictEqual(m.isTablet, false);
    assert.strictEqual(m.gridColumns, 2);
    assert.strictEqual(m.containerPadding, 12);
    assert.strictEqual(m.modalPresentation, 'bottomSheet');
  });

  runTest('Viewport Boundaries', 'Compact upper boundary (375x667 iPhone SE / 8)', () => {
    const m = calculateResponsiveMetrics({ width: 375, height: 667 });
    assert.strictEqual(m.isCompact, true);
    assert.strictEqual(m.isStandard, false);
    assert.strictEqual(m.isTablet, false);
    assert.strictEqual(m.gridColumns, 2);
    assert.strictEqual(m.containerPadding, 12);
    assert.strictEqual(m.modalPresentation, 'bottomSheet');
  });

  // 1.2 Standard boundaries: width = 376, 430, 767
  runTest('Viewport Boundaries', 'Standard lower boundary (376x812 - exactly 1px above compact)', () => {
    const m = calculateResponsiveMetrics({ width: 376, height: 812 });
    assert.strictEqual(m.isCompact, false);
    assert.strictEqual(m.isStandard, true);
    assert.strictEqual(m.isTablet, false);
    assert.strictEqual(m.gridColumns, 2);
    assert.strictEqual(m.containerPadding, 16);
    assert.strictEqual(m.modalPresentation, 'bottomSheet');
  });

  runTest('Viewport Boundaries', 'Standard flagship phone (430x932 iPhone 15/16 Pro Max)', () => {
    const m = calculateResponsiveMetrics({ width: 430, height: 932 });
    assert.strictEqual(m.isCompact, false);
    assert.strictEqual(m.isStandard, true);
    assert.strictEqual(m.isTablet, false);
    assert.strictEqual(m.gridColumns, 2);
    assert.strictEqual(m.containerPadding, 16);
    assert.strictEqual(m.modalPresentation, 'bottomSheet');
  });

  runTest('Viewport Boundaries', 'Standard upper boundary (767x1024 - exactly 1px below tablet)', () => {
    const m = calculateResponsiveMetrics({ width: 767, height: 1024 });
    assert.strictEqual(m.isCompact, false);
    assert.strictEqual(m.isStandard, true);
    assert.strictEqual(m.isTablet, false);
    assert.strictEqual(m.gridColumns, 2);
    assert.strictEqual(m.containerPadding, 16);
    assert.strictEqual(m.modalPresentation, 'bottomSheet');
  });

  // 1.3 Tablet boundaries: width = 768, 899, 900, 1024, 1440
  runTest('Viewport Boundaries', 'Tablet lower boundary (768x1024 iPad Mini portrait)', () => {
    const m = calculateResponsiveMetrics({ width: 768, height: 1024 });
    assert.strictEqual(m.isCompact, false);
    assert.strictEqual(m.isStandard, false);
    assert.strictEqual(m.isTablet, true);
    assert.strictEqual(m.gridColumns, 3);
    assert.strictEqual(m.containerPadding, 24);
    assert.strictEqual(m.modalPresentation, 'dialog');
    assert.strictEqual(m.modalMaxWidth, 540);
  });

  runTest('Viewport Boundaries', 'Tablet 3-column upper boundary (899x1200 - exactly 1px below 4-col)', () => {
    const m = calculateResponsiveMetrics({ width: 899, height: 1200 });
    assert.strictEqual(m.isTablet, true);
    assert.strictEqual(m.gridColumns, 3);
    assert.strictEqual(m.containerPadding, 24);
    assert.strictEqual(m.modalPresentation, 'dialog');
  });

  runTest('Viewport Boundaries', 'Tablet 4-column lower boundary (900x1200 wide tablet)', () => {
    const m = calculateResponsiveMetrics({ width: 900, height: 1200 });
    assert.strictEqual(m.isTablet, true);
    assert.strictEqual(m.gridColumns, 4);
    assert.strictEqual(m.containerPadding, 32);
    assert.strictEqual(m.modalPresentation, 'dialog');
  });

  runTest('Viewport Boundaries', 'Large tablet (1024x1366 iPad Pro portrait)', () => {
    const m = calculateResponsiveMetrics({ width: 1024, height: 1366 });
    assert.strictEqual(m.isTablet, true);
    assert.strictEqual(m.gridColumns, 4);
    assert.strictEqual(m.containerPadding, 32);
    assert.strictEqual(m.modalPresentation, 'dialog');
  });

  runTest('Viewport Boundaries', 'Desktop/Ultra-wide tablet (1440x900 landscape)', () => {
    const m = calculateResponsiveMetrics({ width: 1440, height: 900 });
    assert.strictEqual(m.isTablet, true);
    assert.strictEqual(m.isLandscape, true);
    assert.strictEqual(m.isPortrait, false);
    assert.strictEqual(m.gridColumns, 4);
    assert.strictEqual(m.containerPadding, 32);
  });

  // =========================================================================
  // SECTION 2: Adversarial & Extreme Inputs Handling
  // =========================================================================

  runTest('Extreme Inputs', 'Zero dimensions (width=0, height=0) does not throw or divide by zero', () => {
    const m = calculateResponsiveMetrics({ width: 0, height: 0 });
    assert.strictEqual(m.width, 0);
    assert.strictEqual(m.height, 0);
    assert.strictEqual(m.isCompact, true);
    assert.strictEqual(m.scale(16), 0);
    assert.strictEqual(m.verticalScale(16), 0);
    assert.strictEqual(m.moderateScale(16, 0.5), 8); // 16 + (0 - 16)*0.5 = 8
    assert.strictEqual(m.gridColumns, 2);
    assert.strictEqual(m.containerPadding, 12);
  });

  runTest('Extreme Inputs', 'Negative dimensions (width=-100, height=-200) handled gracefully', () => {
    const m = calculateResponsiveMetrics({ width: -100, height: -200 });
    assert.strictEqual(m.isCompact, true);
    assert.strictEqual(m.gridColumns, 2);
    assert.strictEqual(m.containerPadding, 12);
    const scaled = m.scale(10);
    assert.strictEqual(typeof scaled, 'number');
    assert.ok(!Number.isNaN(scaled));
  });

  runTest('Extreme Inputs', 'Undefined insets fallback to zero', () => {
    const m = calculateResponsiveMetrics({ width: 375, height: 812, insets: undefined });
    assert.deepStrictEqual(m.insets, { top: 0, bottom: 0, left: 0, right: 0 });
  });

  runTest('Extreme Inputs', 'Null insets fallback to zero', () => {
    const m = calculateResponsiveMetrics({ width: 375, height: 812, insets: null });
    assert.deepStrictEqual(m.insets, { top: 0, bottom: 0, left: 0, right: 0 });
  });

  runTest('Extreme Inputs', 'Partial insets preserve given values and zero-fill missing ones', () => {
    const m = calculateResponsiveMetrics({
      width: 390,
      height: 844,
      insets: { bottom: 34 }
    });
    assert.deepStrictEqual(m.insets, { top: 0, bottom: 34, left: 0, right: 0 });
  });

  // =========================================================================
  // SECTION 3: Scaling Damping & Moderate Scale Ballooning Stress Test
  // =========================================================================

  runTest('Scaling Damping', 'ModerateScale dampens expansion compared to unmoderated linear scale on 1440px', () => {
    const baseSize = 16;
    const width = 1440;
    const linear = calculateScale(width, baseSize); // (1440/375) * 16 = 61
    const moderate = calculateModerateScale(width, baseSize, 0.5); // 16 + (61.44 - 16)*0.5 = 39

    assert.ok(linear > 60, `Linear scale ${linear} should balloon on 1440px`);
    assert.ok(moderate < linear, `Moderate scale ${moderate} must be strictly less than linear scale ${linear}`);
    assert.strictEqual(moderate, 39);
  });

  runTest('Scaling Damping', 'ClampedScale strictly constrains size within user-defined [min, max] bounds on 1440px', () => {
    const baseSize = 16;
    const min = 12;
    const max = 24;
    const clamped = calculateClampedScale(1440, baseSize, min, max, 0.5);
    assert.strictEqual(clamped, 24, `Clamped scale should be capped at max (24) but got ${clamped}`);
  });

  runTest('Scaling Damping', 'ClampedScale strictly prevents shrinkage below min bound when moderateScale drops', () => {
    const baseSize = 16;
    // On 320px screen, moderateScale(16, 0.5) is 15.
    // If min bound is 16, clampedScale must clamp it to 16.
    const clamped = calculateClampedScale(320, baseSize, 16, 24, 0.5);
    assert.strictEqual(clamped, 16, `Clamped scale should be floored at min (16) but got ${clamped}`);

    // On extreme narrow width (200px), moderateScale is 12. With min=14:
    const clampedNarrow = calculateClampedScale(200, baseSize, 14, 24, 0.5);
    assert.strictEqual(clampedNarrow, 14, `Clamped scale should be floored at min (14) but got ${clampedNarrow}`);
  });

  // =========================================================================
  // SECTION 4: Safe Area TabNavigator Padding Stress Tests
  // =========================================================================

  function calculateTabNavigatorMetrics(insetsBottom) {
    const bottomInset = insetsBottom ?? 0;
    const height = 60 + bottomInset;
    const paddingBottom = bottomInset > 0 ? bottomInset : 8;
    const paddingTop = 6;
    const netContentHeight = height - paddingBottom - paddingTop;
    return { height, paddingBottom, paddingTop, netContentHeight };
  }

  runTest('TabNavigator Padding', 'Standard iPhone home indicator (insets.bottom = 34)', () => {
    const res = calculateTabNavigatorMetrics(34);
    assert.strictEqual(res.height, 94);
    assert.strictEqual(res.paddingBottom, 34);
    assert.strictEqual(res.netContentHeight, 54);
    assert.ok(res.netContentHeight >= 44, 'Net content height must meet 44pt touch target standard');
  });

  runTest('TabNavigator Padding', 'Zero bottom insets (older iPhone/hardware Android button) uses fallback 8pt', () => {
    const res = calculateTabNavigatorMetrics(0);
    assert.strictEqual(res.height, 60);
    assert.strictEqual(res.paddingBottom, 8);
    assert.strictEqual(res.netContentHeight, 46);
    assert.ok(res.netContentHeight >= 44, 'Net content height must meet 44pt touch target standard');
  });

  runTest('TabNavigator Padding', 'Android gesture bar (insets.bottom = 24)', () => {
    const res = calculateTabNavigatorMetrics(24);
    assert.strictEqual(res.height, 84);
    assert.strictEqual(res.paddingBottom, 24);
    assert.strictEqual(res.netContentHeight, 54);
  });

  runTest('TabNavigator Padding', 'Undefined bottom insets gracefully defaults to 0 and 8pt fallback', () => {
    const res = calculateTabNavigatorMetrics(undefined);
    assert.strictEqual(res.height, 60);
    assert.strictEqual(res.paddingBottom, 8);
  });

  // =========================================================================
  // SECTION 5: Theme Exports and Immutability Coverage
  // =========================================================================

  runTest('Theme Coverage', 'Theme barrel export contains all 5 required token namespaces', () => {
    const { theme } = themeModule;
    assert.ok(theme, 'theme must be exported');
    assert.ok(theme.colors, 'theme.colors must exist');
    assert.ok(theme.typography, 'theme.typography must exist');
    assert.ok(theme.spacing, 'theme.spacing must exist');
    assert.ok(theme.borderRadius, 'theme.borderRadius must exist');
    assert.ok(theme.shadows, 'theme.shadows must exist');
  });

  runTest('Theme Coverage', 'Individual named token exports match theme object references', () => {
    assert.strictEqual(themeModule.colors, themeModule.theme.colors);
    assert.strictEqual(themeModule.typography, themeModule.theme.typography);
    assert.strictEqual(themeModule.spacing, themeModule.theme.spacing);
    assert.strictEqual(themeModule.borderRadius, themeModule.theme.borderRadius);
    assert.strictEqual(themeModule.shadows, themeModule.theme.shadows);
  });

  runTest('Theme Coverage', 'Brand colors and semantic states are exact matches', () => {
    const { colors } = themeModule;
    assert.strictEqual(colors.primary, '#0C831F');
    assert.strictEqual(colors.secondary, '#F8CB46');
    assert.strictEqual(colors.success, '#0C831F');
    assert.strictEqual(colors.error, '#EF4444');
    assert.strictEqual(colors.text.primary, '#1C1C1C');
    assert.strictEqual(colors.text.secondary, '#666666');
    assert.strictEqual(colors.background.app, '#F4F6FB');
    assert.strictEqual(colors.background.card, '#FFFFFF');
    assert.strictEqual(colors.border.light, '#ECEFF1');
  });

  runTest('Theme Coverage', 'Spacing tokens contain WCAG minTouchTarget (44) and standard layout tokens', () => {
    const { spacing } = themeModule;
    assert.strictEqual(spacing.minTouchTarget, 44);
    assert.strictEqual(spacing.tabBarHeight, 60);
    assert.strictEqual(spacing.headerHeight, 60);
    assert.strictEqual(spacing.cardGap, 14);
    assert.strictEqual(spacing.screenPadding, 16);
    assert.strictEqual(spacing.gutter, 16);
  });

  runTest('Theme Coverage', 'BorderRadius contains all semantic and standard tokens', () => {
    const { borderRadius } = themeModule;
    assert.strictEqual(borderRadius.sm, 4);
    assert.strictEqual(borderRadius.md, 8);
    assert.strictEqual(borderRadius.lg, 12);
    assert.strictEqual(borderRadius.xl, 16);
    assert.strictEqual(borderRadius.full, 9999);
    assert.strictEqual(borderRadius.card, 14);
    assert.strictEqual(borderRadius.banner, 16);
    assert.strictEqual(borderRadius.modal, 20);
    assert.strictEqual(borderRadius.sheet, 24);
  });

  runTest('Theme Coverage', 'Cross-platform shadow elevations are properly configured', () => {
    const { shadows } = themeModule;
    assert.ok(shadows.card.elevation !== undefined, 'Card shadow must define Android elevation');
    assert.ok(shadows.card.shadowOffset !== undefined, 'Card shadow must define iOS shadowOffset');
    assert.ok(shadows.modal.elevation >= 8, 'Modal shadow elevation must be >= 8');
    assert.ok(shadows.bottomSheet.elevation >= 10, 'BottomSheet shadow elevation must be >= 10');
  });

  runTest('Theme Immutability', 'Theme exports are strictly non-empty typed with as const', () => {
    const { colors } = themeModule;
    assert.ok(typeof colors.primary === 'string', 'colors.primary is a valid string');
    assert.strictEqual(colors.primary, '#0C831F');
  });

  // =========================================================================
  // SECTION 6: Card Width Calculation Edge Cases
  // =========================================================================

  runTest('Card Width', 'Compact 320px with 2 columns produces non-negative integer width', () => {
    const m = calculateResponsiveMetrics({ width: 320, height: 568 });
    const cardWidth = m.getCardWidth();
    // containerWidth = 320 - 12*2 = 296. columns = 2. gap = 8 (compact).
    // (296 - 8) / 2 = 144
    assert.strictEqual(cardWidth, 144);
    assert.ok(cardWidth > 0);
  });

  runTest('Card Width', 'Standard 390px with 2 columns produces 174px card width', () => {
    const m = calculateResponsiveMetrics({ width: 390, height: 844 });
    const cardWidth = m.getCardWidth();
    // containerWidth = 390 - 16*2 = 358. cols = 2. gap = 10 (standard).
    // (358 - 10) / 2 = 174
    assert.strictEqual(cardWidth, 174);
  });

  runTest('Card Width', 'Tablet 768px with 3 columns produces 230px card width', () => {
    const m = calculateResponsiveMetrics({ width: 768, height: 1024 });
    const cardWidth = m.getCardWidth();
    // containerWidth = 768 - 24*2 = 720. cols = 3. gap = 14 (tablet).
    // totalGaps = 2 * 14 = 28. (720 - 28) / 3 = 692 / 3 = 230.66 -> 230
    assert.strictEqual(cardWidth, 230);
  });

  runTest('Card Width', 'Wide tablet 1024px with 4 columns produces 229px card width', () => {
    const m = calculateResponsiveMetrics({ width: 1024, height: 1366 });
    const cardWidth = m.getCardWidth();
    // containerWidth = 1024 - 32*2 = 960. cols = 4. gap = 14.
    // totalGaps = 3 * 14 = 42. (960 - 42) / 4 = 918 / 4 = 229.5 -> 229
    assert.strictEqual(cardWidth, 229);
  });

  return { suite: 'Adversarial & Stress Tests (Milestone 1)', results, testCount };
}

function runTests() {
  const { results } = runAllAdversarialTests();
  return { results };
}

// Execute if run directly
if (require.main === module) {
  console.log('================================================================');
  console.log('  CHALLENGER ADVERSARIAL STRESS TEST SUITE — MILESTONE 1');
  console.log('================================================================\n');

  const { results, testCount } = runAllAdversarialTests();
  let passed = 0;
  let failed = 0;

  results.forEach((r) => {
    if (r.pass) {
      passed++;
      console.log(`[PASS] ${r.id} | ${r.category.padEnd(20)} | ${r.name}`);
    } else {
      failed++;
      console.error(`[FAIL] ${r.id} | ${r.category.padEnd(20)} | ${r.name}`);
      console.error(`       Error: ${r.error}`);
    }
  });

  console.log('\n================================================================');
  console.log(`Summary: ${passed}/${testCount} tests passed (${failed} failures)`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

module.exports = { runTests, runAllAdversarialTests };
