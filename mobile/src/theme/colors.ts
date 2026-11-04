/**
 * Blinkit Mobile Design System - Color Tokens
 */

export const colors = {
  // Brand Flagship
  primary: '#0C831F',
  primaryDark: '#0A6D1A',
  primaryLight: '#F7FCF8',
  primarySubtle: '#E8F5E9',
  primaryBorder: '#C8E6C9',

  // Secondary Brand (Yellow)
  secondary: '#F8CB46',
  secondaryDark: '#EAB308',
  secondaryLight: '#FEF9C3',
  secondarySubtle: '#FFFBEB',
  secondaryGradientEnd: '#FFE08F',

  // Semantic Status Badges & Alerts
  success: '#0C831F',
  successLight: '#E8F5E9',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorDark: '#E23744',
  errorLight: '#FEE2E2',
  info: '#2563EB',
  infoLight: '#EFF6FF',

  // Text Hierarchy
  text: {
    primary: '#1C1C1C',
    secondary: '#666666',
    tertiary: '#828282',
    muted: '#9E9E9E',
    body: '#333333',
    bodyLight: '#555555',
    inverse: '#FFFFFF',
    brand: '#0C831F',
    warning: '#F59E0B',
    error: '#EF4444',
  },

  // Surfaces & Backgrounds
  background: {
    app: '#F4F6FB',
    card: '#FFFFFF',
    surface: '#FFFFFF',
    subdued: '#F8F9FA',
    modal: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.6)',
    overlaySubtle: 'rgba(0, 0, 0, 0.4)',
  },

  // Borders & Hairline Dividers
  border: {
    subtle: '#F4F6FB',
    light: '#ECEFF1',
    divider: '#F0EDED',
    medium: '#CFD8DC',
    dark: '#B0BEC5',
    active: '#0C831F',
    error: '#FEE2E2',
    brandLight: '#C8E6C9',
  },

  // Base Neutrals
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type Colors = typeof colors;
