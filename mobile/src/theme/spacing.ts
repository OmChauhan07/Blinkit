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
