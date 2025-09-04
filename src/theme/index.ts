import { DefaultTheme } from 'styled-components/native';

// Color Palette
export const colors = {
  // Primary Colors
  primary: {
    green: '#2ECC71',
    greenLight: '#58D68D',
    greenDark: '#27AE60',
    orange: '#FF8C42',
    orangeLight: '#FFA366',
    orangeDark: '#E67E22',
  },
  
  // Secondary Colors
  secondary: {
    gray: '#6B7280',
    grayLight: '#9CA3AF',
    grayDark: '#374151',
    grayLighter: '#F3F4F6',
    grayDarker: '#1F2937',
  },
  
  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    offWhite: '#FAFAFA',
    lightGray: '#E5E7EB',
    mediumGray: '#D1D5DB',
    darkGray: '#4B5563',
  },
  
  // Status Colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // Background Colors
  background: {
    light: '#FFFFFF',
    dark: '#111827',
    card: '#FFFFFF',
    cardDark: '#1F2937',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
    link: '#3B82F6',
  },
  
  // Border Colors
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
};

// Typography
export const typography = {
  fontFamily: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
};

// Border Radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Light Theme
export const lightTheme: DefaultTheme = {
  colors: {
    ...colors,
    background: colors.background.light,
    surface: colors.neutral.white,
    text: colors.text.primary,
    textSecondary: colors.text.secondary,
    border: colors.border.light,
    primary: colors.primary.green,
    secondary: colors.primary.orange,
    accent: colors.status.info,
    error: colors.status.error,
    warning: colors.status.warning,
    success: colors.status.success,
  },
  typography,
  spacing,
  borderRadius,
  shadows,
  isDark: false,
};

// Dark Theme
export const darkTheme: DefaultTheme = {
  colors: {
    ...colors,
    background: colors.background.dark,
    surface: colors.background.cardDark,
    text: colors.text.inverse,
    textSecondary: colors.secondary.grayLight,
    border: colors.secondary.grayDark,
    primary: colors.primary.greenLight,
    secondary: colors.primary.orangeLight,
    accent: colors.status.info,
    error: colors.status.error,
    warning: colors.status.warning,
    success: colors.status.success,
  },
  typography,
  spacing,
  borderRadius,
  shadows,
  isDark: true,
};

// Animation Durations
export const animation = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Breakpoints (for responsive design)
export const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

// Z-Index Scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

export default lightTheme;