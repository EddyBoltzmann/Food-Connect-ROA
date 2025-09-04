import React from 'react';
import styled from 'styled-components/native';
import { TextProps as RNTextProps } from 'react-native';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'link' | 'error' | 'success' | 'warning';
  weight?: 'normal' | 'medium' | 'semiBold' | 'bold';
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

const StyledText = styled.Text<{
  variant: string;
  color: string;
  weight: string;
  align: string;
}>`
  font-family: ${({ weight, theme }) => {
    switch (weight) {
      case 'medium':
        return theme.typography.fontFamily.medium;
      case 'semiBold':
        return theme.typography.fontFamily.semiBold;
      case 'bold':
        return theme.typography.fontFamily.bold;
      default:
        return theme.typography.fontFamily.regular;
    }
  }};
  font-size: ${({ variant, theme }) => {
    switch (variant) {
      case 'h1':
        return theme.typography.fontSize['4xl'];
      case 'h2':
        return theme.typography.fontSize['3xl'];
      case 'h3':
        return theme.typography.fontSize['2xl'];
      case 'h4':
        return theme.typography.fontSize.xl;
      case 'body':
        return theme.typography.fontSize.base;
      case 'caption':
        return theme.typography.fontSize.sm;
      case 'label':
        return theme.typography.fontSize.sm;
      default:
        return theme.typography.fontSize.base;
    }
  }}px;
  line-height: ${({ variant, theme }) => {
    switch (variant) {
      case 'h1':
        return theme.typography.fontSize['4xl'] * theme.typography.lineHeight.tight;
      case 'h2':
        return theme.typography.fontSize['3xl'] * theme.typography.lineHeight.tight;
      case 'h3':
        return theme.typography.fontSize['2xl'] * theme.typography.lineHeight.tight;
      case 'h4':
        return theme.typography.fontSize.xl * theme.typography.lineHeight.normal;
      case 'body':
        return theme.typography.fontSize.base * theme.typography.lineHeight.normal;
      case 'caption':
        return theme.typography.fontSize.sm * theme.typography.lineHeight.normal;
      case 'label':
        return theme.typography.fontSize.sm * theme.typography.lineHeight.normal;
      default:
        return theme.typography.fontSize.base * theme.typography.lineHeight.normal;
    }
  }}px;
  color: ${({ color, theme }) => {
    switch (color) {
      case 'primary':
        return theme.colors.text.primary;
      case 'secondary':
        return theme.colors.text.secondary;
      case 'tertiary':
        return theme.colors.text.tertiary;
      case 'inverse':
        return theme.colors.text.inverse;
      case 'link':
        return theme.colors.text.link;
      case 'error':
        return theme.colors.status.error;
      case 'success':
        return theme.colors.status.success;
      case 'warning':
        return theme.colors.status.warning;
      default:
        return theme.colors.text.primary;
    }
  }};
  text-align: ${({ align }) => align};
`;

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'primary',
  weight = 'normal',
  align = 'left',
  children,
  ...props
}) => {
  return (
    <StyledText
      variant={variant}
      color={color}
      weight={weight}
      align={align}
      {...props}
    >
      {children}
    </StyledText>
  );
};