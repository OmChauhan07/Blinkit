import {
  calculateResponsiveMetrics,
  calculateScale,
  calculateVerticalScale,
  calculateModerateScale,
  calculateClampedScale,
  getGridColumns,
  getContainerPadding,
  calculateCardWidth,
  MIN_TOUCH_TARGET,
  ACCESSIBLE_HIT_SLOP,
  GUIDELINE_BASE_WIDTH,
  GUIDELINE_BASE_HEIGHT,
} from './proposed_useResponsive';

describe('useResponsive Specification & Unit Verification', () => {
  describe('Constants and Accessibility Standards', () => {
    test('baseline guideline dimensions match iPhone X baseline (375x812)', () => {
      expect(GUIDELINE_BASE_WIDTH).toBe(375);
      expect(GUIDELINE_BASE_HEIGHT).toBe(812);
    });

    test('WCAG 2.1 AA minimum touch target matches 44x44 pt', () => {
      expect(MIN_TOUCH_TARGET).toEqual({ minWidth: 44, minHeight: 44 });
    });

    test('accessible hit slop extends touch area by 12pt on all edges', () => {
      expect(ACCESSIBLE_HIT_SLOP).toEqual({ top: 12, bottom: 12, left: 12, right: 12 });
    });
  });

  describe('Device Breakpoint Classification', () => {
    test('iPhone SE (320px) is classified as compact', () => {
      const metrics = calculateResponsiveMetrics({ width: 320, height: 568 });
      expect(metrics.isCompact).toBe(true);
      expect(metrics.isStandard).toBe(false);
      expect(metrics.isTablet).toBe(false);
      expect(metrics.gridColumns).toBe(2);
      expect(metrics.containerPadding).toBe(12);
      expect(metrics.modalPresentation).toBe('bottomSheet');
    });

    test('iPhone SE 2nd/3rd gen (375px) is classified as compact', () => {
      const metrics = calculateResponsiveMetrics({ width: 375, height: 667 });
      expect(metrics.isCompact).toBe(true);
      expect(metrics.isStandard).toBe(false);
      expect(metrics.isTablet).toBe(false);
      expect(metrics.gridColumns).toBe(2);
      expect(metrics.containerPadding).toBe(12);
      expect(metrics.modalPresentation).toBe('bottomSheet');
    });

    test('iPhone 14/15 (390px) is classified as standard', () => {
      const metrics = calculateResponsiveMetrics({ width: 390, height: 844 });
      expect(metrics.isCompact).toBe(false);
      expect(metrics.isStandard).toBe(true);
      expect(metrics.isTablet).toBe(false);
      expect(metrics.gridColumns).toBe(2);
      expect(metrics.containerPadding).toBe(16);
      expect(metrics.modalPresentation).toBe('bottomSheet');
    });

    test('iPhone 15 Pro Max (430px) is classified as standard', () => {
      const metrics = calculateResponsiveMetrics({ width: 430, height: 932 });
      expect(metrics.isCompact).toBe(false);
      expect(metrics.isStandard).toBe(true);
      expect(metrics.isTablet).toBe(false);
      expect(metrics.gridColumns).toBe(2);
      expect(metrics.containerPadding).toBe(16);
      expect(metrics.modalPresentation).toBe('bottomSheet');
    });

    test('iPad Mini / Foldable unfolded (768px) is classified as tablet with 3 columns', () => {
      const metrics = calculateResponsiveMetrics({ width: 768, height: 1024 });
      expect(metrics.isCompact).toBe(false);
      expect(metrics.isStandard).toBe(false);
      expect(metrics.isTablet).toBe(true);
      expect(metrics.gridColumns).toBe(3);
      expect(metrics.containerPadding).toBe(24);
      expect(metrics.modalPresentation).toBe('dialog');
      expect(metrics.modalMaxWidth).toBe(540);
    });

    test('iPad Pro / Large Tablet (1024px) is classified as tablet with 4 columns', () => {
      const metrics = calculateResponsiveMetrics({ width: 1024, height: 1366 });
      expect(metrics.isCompact).toBe(false);
      expect(metrics.isStandard).toBe(false);
      expect(metrics.isTablet).toBe(true);
      expect(metrics.gridColumns).toBe(4);
      expect(metrics.containerPadding).toBe(32);
      expect(metrics.modalPresentation).toBe('dialog');
      expect(metrics.modalMaxWidth).toBe(540);
    });
  });

  describe('Orientation Handling', () => {
    test('Portrait viewport (height >= width)', () => {
      const metrics = calculateResponsiveMetrics({ width: 390, height: 844 });
      expect(metrics.isPortrait).toBe(true);
      expect(metrics.isLandscape).toBe(false);
    });

    test('Landscape viewport (width > height)', () => {
      const metrics = calculateResponsiveMetrics({ width: 844, height: 390 });
      expect(metrics.isPortrait).toBe(false);
      expect(metrics.isLandscape).toBe(true);
      // Width 844px in landscape falls into 768-899px tablet range
      expect(metrics.gridColumns).toBe(3);
    });
  });

  describe('Linear Scale Utilities (Baseline 375x812)', () => {
    test('scale() returns exact value at baseline width (375)', () => {
      expect(calculateScale(375, 16)).toBe(16);
      expect(calculateScale(375, 24)).toBe(24);
    });

    test('scale() scales down on compact screens (320px)', () => {
      // (320 / 375) * 16 = 13.65 -> 14
      expect(calculateScale(320, 16)).toBe(14);
    });

    test('scale() scales up on wide screens (430px)', () => {
      // (430 / 375) * 16 = 18.35 -> 18
      expect(calculateScale(430, 16)).toBe(18);
    });

    test('verticalScale() returns exact value at baseline height (812)', () => {
      expect(calculateVerticalScale(812, 20)).toBe(20);
    });

    test('verticalScale() scales down on shorter screens (568px)', () => {
      // (568 / 812) * 20 = 13.99 -> 14
      expect(calculateVerticalScale(568, 20)).toBe(14);
    });

    test('moderateScale() dampens scale factor to prevent ballooning on tablet', () => {
      // At width 768: scale(16) = (768/375)*16 = 32.77 -> 33
      // moderateScale(16, 0.5) = 16 + (32.77 - 16)*0.5 = 24.38 -> 24
      const unmoderated = calculateScale(768, 16);
      const moderated = calculateModerateScale(768, 16, 0.5);
      expect(unmoderated).toBe(33);
      expect(moderated).toBe(24);
    });

    test('clampedScale() enforces minimum and maximum boundaries', () => {
      const clamped = calculateClampedScale(1024, 16, 14, 22);
      expect(clamped).toBe(22); // Capped at max 22
    });
  });

  describe('Safe Area Insets Handling & Fallbacks', () => {
    test('handles valid insets on iPhone 14/15', () => {
      const metrics = calculateResponsiveMetrics({
        width: 390,
        height: 844,
        insets: { top: 47, bottom: 34, left: 0, right: 0 },
      });
      expect(metrics.insets).toEqual({ top: 47, bottom: 34, left: 0, right: 0 });
    });

    test('handles missing or null insets with zero fallback', () => {
      const metrics = calculateResponsiveMetrics({
        width: 375,
        height: 667,
        insets: null,
      });
      expect(metrics.insets).toEqual({ top: 0, bottom: 0, left: 0, right: 0 });
    });
  });

  describe('Card Width and Grid Layout Calculation', () => {
    test('compact screen (320px) with 12px padding and 8px gap calculates 2 columns', () => {
      const metrics = calculateResponsiveMetrics({ width: 320, height: 568 });
      // container width = 320 - 24 = 296
      // (296 - 8) / 2 = 144
      expect(metrics.getCardWidth()).toBe(144);
    });

    test('standard screen (390px) with 16px padding and 10px gap calculates 2 columns', () => {
      const metrics = calculateResponsiveMetrics({ width: 390, height: 844 });
      // container width = 390 - 32 = 358
      // (358 - 10) / 2 = 174
      expect(metrics.getCardWidth()).toBe(174);
    });

    test('tablet screen (768px) with 24px padding and 14px gap calculates 3 columns', () => {
      const metrics = calculateResponsiveMetrics({ width: 768, height: 1024 });
      // container width = 768 - 48 = 720
      // 3 cols, 2 gaps of 14 = 28 -> (720 - 28) / 3 = 230
      expect(metrics.getCardWidth()).toBe(230);
    });

    test('large tablet screen (1024px) with 32px padding and 14px gap calculates 4 columns', () => {
      const metrics = calculateResponsiveMetrics({ width: 1024, height: 1366 });
      // container width = 1024 - 64 = 960
      // 4 cols, 3 gaps of 14 = 42 -> (960 - 42) / 4 = 229
      expect(metrics.getCardWidth()).toBe(229);
    });
  });
});
