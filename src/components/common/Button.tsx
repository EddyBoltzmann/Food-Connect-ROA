import React from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { Text } from './Text';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const ButtonContainer = styled(TouchableOpacity)<{
  variant: string;
  size: string;
  disabled: boolean;
  fullWidth: boolean;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return `${theme.spacing.sm}px ${theme.spacing.md}px`;
      case 'large':
        return `${theme.spacing.lg}px ${theme.spacing.xl}px`;
      default:
        return `${theme.spacing.md}px ${theme.spacing.lg}px`;
    }
  }};
  background-color: ${({ variant, theme, disabled }) => {
    if (disabled) return theme.colors.neutral.lightGray;
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'outline':
        return 'transparent';
      case 'ghost':
        return 'transparent';
      default:
        return theme.colors.primary;
    }
  }};
  border-width: ${({ variant }) => (variant === 'outline' ? 1 : 0)}px;
  border-color: ${({ variant, theme }) => 
    variant === 'outline' ? theme.colors.primary : 'transparent'};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  min-height: 44px;
  ${({ theme }) => theme.shadows.sm};
`;

const ButtonText = styled(Text)<{ variant: string; size: string }>`
  color: ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return theme.colors.neutral.white;
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      default:
        return theme.colors.neutral.white;
    }
  }};
  font-size: ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return theme.typography.fontSize.sm;
      case 'large':
        return theme.typography.fontSize.lg;
      default:
        return theme.typography.fontSize.base;
    }
  }}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-left: ${({ children }) => (children ? 8 : 0)}px;
`;

const LoadingContainer = styled.View`
  margin-right: 8px;
`;

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}) => {
  return (
    <ButtonContainer
      variant={variant}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      onPress={onPress}
      style={style}
      activeOpacity={0.8}
    >
      {loading && (
        <LoadingContainer>
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : '#2ECC71'} 
          />
        </LoadingContainer>
      )}
      {icon && !loading && icon}
      <ButtonText variant={variant} size={size}>
        {title}
      </ButtonText>
    </ButtonContainer>
  );
};