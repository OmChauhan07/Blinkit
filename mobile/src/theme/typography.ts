import { Platform, TextStyle } from 'react-native';

/**
 * Blinkit Mobile Design System - Typography Tokens
 */

export const typography = {
  fontFamily: {
    regular: Platform.select({ ios: 'System', android: 'Roboto', default: 'sans-serif' }),
    medium: Platform.select({ ios: 'System', android: 'Roboto-Medium', default: 'sans-serif' }),
    bold: Platform.select({ ios: 'System', android: 'Roboto-Bold', default: 'sans-serif' }),
  },
  fontSize: {
    xxs: 9,
    xs: 10,
    sm: 11,
    bodySm: 12,
    md: 13,
    base: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    displaySm: 24,
    displayMd: 28,
    displayLg: 48,
  },
  lineHeight: {
    xxs: 12,
    xs: 14,
    sm: 16,
    bodySm: 18,
    md: 18,
    base: 20,
    lg: 22,
    xl: 24,
    xxl: 26,
    displaySm: 30,
    displayMd: 34,
    displayLg: 56,
  },
  fontWeight: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semiBold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    extraBold: '800' as TextStyle['fontWeight'],
    black: '900' as TextStyle['fontWeight'],
  },
} as const;

export type Typography = typeof typography;
