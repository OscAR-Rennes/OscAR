import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

const COLORS = {
  primary: '#F72C25',
  secondary: '#F7B32B',
  tertiary: '#4156C0',
  background: '#FEFEFE',
  textPrimary: '#1f1f1f',
  textSecondary: '#666',
  placeholder: '#A9A9A9',
  border: '#E0E0E0',
  icon: '#393939',
  active: '#F7B32B',
  inactive: '#393939',
  success: '#4BB543',
  error: '#F72C25',
  easy: '#4BB543',
  medium: '#F7B32B',
  hard: '#F72C25',
};

const FONT_SIZES = {
  title: 32,
  subtitle: 22,
  label: 20,
  text: 16,
  smallText: 15,
  tinyText: 14,
};

const SPACING = {
  xsmall: 4,
  small: 8,
  medium: 16,
  large: 24,
  xLarge: 36,
};

const CONTAINER_STYLES: { [key: string]: ViewStyle } = {
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padded: {
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.large,
  },
};

const BUTTON_STYLES: { [key: string]: ViewStyle } = {
  default: {
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const INPUT_STYLES = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.medium,
    backgroundColor: COLORS.background,
  } as ViewStyle,
  text: {
    flex: 1,
    fontSize: FONT_SIZES.text,
    color: COLORS.textPrimary,
  } as TextStyle,
};

export const theme = {
  COLORS,
  FONT_SIZES,
  SPACING,
  CONTAINER_STYLES,
  BUTTON_STYLES,
  INPUT_STYLES,
};

export const globalStyles = StyleSheet.create({
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '900',
    color: COLORS.textPrimary,
  } as TextStyle,
  subtitle: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '700',
    color: COLORS.textPrimary,
  } as TextStyle,
  label: {
    fontSize: FONT_SIZES.label,
    color: COLORS.textPrimary,
  } as TextStyle,
  text: {
    fontSize: FONT_SIZES.text,
    color: COLORS.textPrimary,
  } as TextStyle,
  smallText: {
    fontSize: FONT_SIZES.smallText,
    color: COLORS.textSecondary,
  } as TextStyle,
  tinyText: {
    fontSize: FONT_SIZES.tinyText,
    color: COLORS.textSecondary,
  } as TextStyle,
});