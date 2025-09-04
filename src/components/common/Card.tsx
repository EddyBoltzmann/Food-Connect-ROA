import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'extra';
}

const CardContainer = styled.View<{
  padding: string;
  margin: string;
  shadow: string;
  borderRadius: string;
}>`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ padding, theme }) => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return theme.spacing.sm;
      case 'large':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  }}px;
  margin: ${({ margin, theme }) => {
    switch (margin) {
      case 'none':
        return 0;
      case 'small':
        return theme.spacing.sm;
      case 'large':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  }}px;
  border-radius: ${({ borderRadius, theme }) => {
    switch (borderRadius) {
      case 'none':
        return 0;
      case 'small':
        return theme.borderRadius.sm;
      case 'large':
        return theme.borderRadius.xl;
      case 'extra':
        return theme.borderRadius['2xl'];
      default:
        return theme.borderRadius.lg;
    }
  }}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  ${({ shadow, theme }) => {
    switch (shadow) {
      case 'small':
        return theme.shadows.sm;
      case 'large':
        return theme.shadows.lg;
      default:
        return theme.shadows.md;
    }
  }};
`;

const TouchableCard = styled(TouchableOpacity)<{
  padding: string;
  margin: string;
  shadow: string;
  borderRadius: string;
}>`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ padding, theme }) => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return theme.spacing.sm;
      case 'large':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  }}px;
  margin: ${({ margin, theme }) => {
    switch (margin) {
      case 'none':
        return 0;
      case 'small':
        return theme.spacing.sm;
      case 'large':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  }}px;
  border-radius: ${({ borderRadius, theme }) => {
    switch (borderRadius) {
      case 'none':
        return 0;
      case 'small':
        return theme.borderRadius.sm;
      case 'large':
        return theme.borderRadius.xl;
      case 'extra':
        return theme.borderRadius['2xl'];
      default:
        return theme.borderRadius.lg;
    }
  }}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  ${({ shadow, theme }) => {
    switch (shadow) {
      case 'small':
        return theme.shadows.sm;
      case 'large':
        return theme.shadows.lg;
      default:
        return theme.shadows.md;
    }
  }};
`;

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  padding = 'medium',
  margin = 'none',
  shadow = 'medium',
  borderRadius = 'medium',
}) => {
  if (onPress) {
    return (
      <TouchableCard
        padding={padding}
        margin={margin}
        shadow={shadow}
        borderRadius={borderRadius}
        onPress={onPress}
        style={style}
        activeOpacity={0.8}
      >
        {children}
      </TouchableCard>
    );
  }

  return (
    <CardContainer
      padding={padding}
      margin={margin}
      shadow={shadow}
      borderRadius={borderRadius}
      style={style}
    >
      {children}
    </CardContainer>
  );
};