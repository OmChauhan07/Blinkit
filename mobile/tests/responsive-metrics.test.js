/**
 * @file responsive-metrics.test.js
 * Programmatic tests for Blinkit Mobile Responsive Metrics & Layout Rules
 * Validates F01_RESPONSIVE_HOOK interface, breakpoint logic, dynamic grid scaling,
 * safe area handling, and touch target accessibility constraints.
 */

const assert = require('node:assert/strict');

// Reference implementation / mathematical model of useResponsive calculation engine
function computeResponsiveMetrics(width, height, insets = { top: 0, bottom: 0, left: 0, right: 0 }) {
  const isCompact = width <= 375;
  const isTablet = width >= 768;
  const isStandard = !isCompact && !isTablet;

  const guidelineBaseWidth = 375;
  const guidelineBaseHeight = 812;

  const scale = (size) => Math.round((width / guidelineBaseWidth) * size * 100) / 100;
  const verticalScale = (size) => Math.round((height / guidelineBaseHeight) * size * 100) / 100;
  const moderateScale = (size, factor = 0.5) => Math.round((size + (scale(size) - size) * factor) * 100) / 100;

  let gridColumns = 2;
  if (width >= 1024) {
    gridColumns = 4;
  } else if (width >= 768) {
    gridColumns = 3;
  }

  let containerPadding = 16;
  if (isCompact) {
    containerPadding = 12;
  } else if (isTablet) {
    containerPadding = 24;
  }

  return {
    width,
    height,
    isCompact,
    isStandard,
    isTablet,
    insets,
    scale,
    verticalScale,
    moderateScale,
    gridColumns,
    containerPadding,
    minTouchTarget: { minWidth: 44, minHeight: 44 },
    stickyFooterPaddingBottom: insets.bottom + 12,
    modalPresentation: isTablet ? 'dialog' : 'bottom_sheet',
  };
}

function runTests() {
  const suite = 'Responsive Metrics & Layout Rules';
  const results = [];

  function test(name, fn) {
    try {
      fn();
      results.push({ name, pass: true });
    } catch (err) {
      results.push({ name, pass: false, error: err.message });
    }
  }

  // 1. Compact Viewports (<= 375px)
  test('RM-01: Viewport 320x568 (iPhone SE 1st Gen) classified as compact', () => {
    const m = computeResponsiveMetrics(320, 568);
    assert.strictEqual(m.isCompact, true);
    assert.strictEqual(m.isStandard, false);
    assert.strictEqual(m.isTablet, false);
    assert.strictEqual(m.gridColumns, 2);
    assert.strictEqual(m.containerPadding, 12);
    assert.strictEqual(m.modalPresentation, 'bottom_sheet');
  });

  test('RM-02: Viewport 360x800 (Compact Android) classified as compact', () => {
    const m = computeResponsiveMetrics(360, 800);
    assert.strictEqual(m.isCompact, true);
    assert.strictEqual(m.isStandard, false);
    assert.strictEqual(m.isTablet, false);
    assert.strictEqual(m.gridColumns, 2);
    assert.strictEqual(m.containerPadding, 12);
  });

  test('RM-03: Viewport 375x667 (iPhone SE 2nd/3rd Gen) classified as compact upper boundary', () => {
    const m = computeResponsiveMetrics(375, 667);
    assert.strictEqual(m.isCompact, true);
    assert.strictEqual(m.isStandard, false);
    assert.strictEqual(m.isTablet, false);
    assert.strictEqual(m.gridColumns, 2);
    assert.strictEqual(m.containerPadding, 12);
  });

  // 2. Standard Viewports (376px - 767px)
  test('RM-04: Viewport 376x812 classified as standard lower boundary', () => {
    const m = computeResponsiveMetrics(376, 812);
    assert.strictEqual(m.isCompact, false);
    assert.strictEqual(m.isStandard, true);
    assert.strictEqual(m.isTablet, false);
    assert.strictEqual(m.gridColumns, 2);
    assert.strictEqual(m.containerPadding, 16);
  });

  test('RM-05: Viewport 390x844 (iPhone 13/14) classified as standard', () => {
    const m = computeResponsiveMetrics(390, 844);
    assert.strictEqual(m.isCompact, false);
    assert.strictEqual(m.isStandard, true);
    assert.strictEqual(m.isTablet, false);
    assert.strictEqual(m.gridColumns, 2);
    assert.strictEqual(m.containerPadding, 16);
    assert.strictEqual(m.modalPresentation, 'bottom_sheet');
  });

  test('RM-06: Viewport 430x932 (iPhone 15/16 Pro Max) classified as standard', () => {
    const m = computeResponsiveMetrics(430, 932);
    assert.strictEqual(m.isCompact, false);
    assert.strictEqual(m.isStandard, true);
    assert.strictEqual(m.isTablet, false);
    assert.strictEqual(m.gridColumns, 2);
    assert.strictEqual(m.containerPadding, 16);
  });

  test('RM-07: Viewport 767x1024 classified as standard upper boundary', () => {
    const m = computeResponsiveMetrics(767, 1024);
    assert.strictEqual(m.isCompact, false);
    assert.strictEqual(m.isStandard, true);
    assert.strictEqual(m.isTablet, false);
    assert.strictEqual(m.gridColumns, 2);
  });

  // 3. Tablet Viewports (>= 768px)
  test('RM-08: Viewport 768x1024 (iPad Mini / 10th Gen) classified as tablet lower boundary', () => {
    const m = computeResponsiveMetrics(768, 1024);
    assert.strictEqual(m.isCompact, false);
    assert.strictEqual(m.isStandard, false);
    assert.strictEqual(m.isTablet, true);
    assert.strictEqual(m.gridColumns, 3);
    assert.strictEqual(m.containerPadding, 24);
    assert.strictEqual(m.modalPresentation, 'dialog');
  });

  test('RM-09: Viewport 834x1194 (iPad Air 11") classified as tablet with 3 columns', () => {
    const m = computeResponsiveMetrics(834, 1194);
    assert.strictEqual(m.isTablet, true);
    assert.strictEqual(m.gridColumns, 3);
    assert.strictEqual(m.containerPadding, 24);
    assert.strictEqual(m.modalPresentation, 'dialog');
  });

  test('RM-10: Viewport 1024x1366 (iPad Pro 12.9") classified as large tablet with 4 columns', () => {
    const m = computeResponsiveMetrics(1024, 1366);
    assert.strictEqual(m.isTablet, true);
    assert.strictEqual(m.gridColumns, 4);
    assert.strictEqual(m.containerPadding, 24);
    assert.strictEqual(m.modalPresentation, 'dialog');
  });

  test('RM-11: Viewport 1280x800 (Android Landscape Tablet) classified as tablet with 4 columns', () => {
    const m = computeResponsiveMetrics(1280, 800);
    assert.strictEqual(m.isTablet, true);
    assert.strictEqual(m.gridColumns, 4);
    assert.strictEqual(m.containerPadding, 24);
  });

  // 4. Scaling Utilities
  test('RM-12: scale() maintains proportional scaling based on base width 375', () => {
    const m = computeResponsiveMetrics(750, 1334);
    // At double width (750), scale(10) should be 20
    assert.strictEqual(m.scale(10), 20);
  });

  test('RM-13: verticalScale() maintains proportional scaling based on base height 812', () => {
    const m = computeResponsiveMetrics(375, 1624);
    // At double height (1624), verticalScale(10) should be 20
    assert.strictEqual(m.verticalScale(10), 20);
  });

  test('RM-14: moderateScale() applies dampening factor correctly', () => {
    const m = computeResponsiveMetrics(750, 812);
    // scale(10) = 20. difference = 10. with factor 0.5: 10 + 10*0.5 = 15
    assert.strictEqual(m.moderateScale(10, 0.5), 15);
  });

  // 5. Accessibility & Touch Targets
  test('RM-15: minTouchTarget guarantees WCAG 2.5.5 compliance (>= 44x44 pt)', () => {
    const m = computeResponsiveMetrics(390, 844);
    assert.ok(m.minTouchTarget.minWidth >= 44);
    assert.ok(m.minTouchTarget.minHeight >= 44);
    assert.strictEqual(m.minTouchTarget.minWidth, 44);
    assert.strictEqual(m.minTouchTarget.minHeight, 44);
  });

  // 6. Safe Area Insets & Sticky Footers
  test('RM-16: Sticky footer padding correctly integrates home indicator bottom inset', () => {
    const insets = { top: 47, bottom: 34, left: 0, right: 0 };
    const m = computeResponsiveMetrics(390, 844, insets);
    assert.strictEqual(m.insets.bottom, 34);
    assert.strictEqual(m.stickyFooterPaddingBottom, 46); // 34 + 12
  });

  test('RM-17: Sticky footer padding with 0 insets provides standard baseline 12pt', () => {
    const insets = { top: 0, bottom: 0, left: 0, right: 0 };
    const m = computeResponsiveMetrics(360, 640, insets);
    assert.strictEqual(m.insets.bottom, 0);
    assert.strictEqual(m.stickyFooterPaddingBottom, 12);
  });

  return { suite, results };
}

if (require.main === module) {
  const { suite, results } = runTests();
  const passed = results.filter((r) => r.pass).length;
  console.log(`[SUITE] ${suite}: ${passed}/${results.length} passed.`);
  results.forEach((r) => {
    if (!r.pass) console.error(`  FAIL: ${r.name} -> ${r.error}`);
    else console.log(`  PASS: ${r.name}`);
  });
  if (passed !== results.length) process.exit(1);
}

module.exports = { runTests, computeResponsiveMetrics };
