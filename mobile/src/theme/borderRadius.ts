/**
 * Blinkit Mobile Design System - Border Radius Scale
 */

export const borderRadius = {
  // Standard Scale
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,

  // Extended Semantic Scale
  xs: 4,
  badge: 4,
  tag: 6,
  button: 8,
  input: 10,
  card: 14,
  banner: 16,
  modal: 20,
  sheet: 24,
  pill: 9999,
  round: 9999,
} as const;

export type BorderRadius = typeof borderRadius;
