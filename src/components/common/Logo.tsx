import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LogoContainer = styled(View)<{ size: string }>`
  align-items: center;
  justify-content: center;
  width: ${({ size }) => {
    switch (size) {
      case 'small':
        return 40;
      case 'large':
        return 120;
      default:
        return 80;
    }
  }}px;
  height: ${({ size }) => {
    switch (size) {
      case 'small':
        return 40;
      case 'large':
        return 120;
      default:
        return 80;
    }
  }}px;
`;

const LogoIcon = styled(Icon)<{ size: string; color: string }>`
  font-size: ${({ size }) => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 72;
      default:
        return 48;
    }
  }}px;
  color: ${({ color }) => color};
`;

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  color = '#2ECC71' 
}) => {
  return (
    <LogoContainer size={size}>
      <LogoIcon 
        name="restaurant" 
        size={size} 
        color={color}
      />
    </LogoContainer>
  );
};

export default Logo;