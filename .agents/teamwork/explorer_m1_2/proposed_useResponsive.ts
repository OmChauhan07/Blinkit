import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

/**
 * Pure calculation functions for standalone or test usage
 */

export const calculateScale = (width: number, size: number): number => {
  return Math.round((width / GUIDELINE_BASE_WIDTH) * size);
};

export const calculateVerticalScale = (height: number, size: number): number => {
  return Math.round((height / GUIDELINE_BASE_HEIGHT) * size);
};

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
  return 12; // compact (width <= 375)
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

/**
 * Pure deterministic metrics generator from viewport dimensions and safe area insets.
 * Can be tested directly without React rendering context.
 */
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

/**
 * Production React hook for responsive mobile layouts.
 * Subscribes to window dimensions and safe area insets with memoized metric calculations.
 */
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
