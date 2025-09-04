import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Text } from '../common/Text';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MenuItem } from '../../types';

interface InventoryStatusBadgeProps {
  menuItem: MenuItem;
}

const StatusContainer = styled.View<{ status: 'available' | 'low-stock' | 'unavailable' }>`
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'available':
        return theme.colors.status.success + '20';
      case 'low-stock':
        return theme.colors.status.warning + '20';
      case 'unavailable':
        return theme.colors.status.error + '20';
      default:
        return theme.colors.neutral.lightGray;
    }
  }};
  margin-top: 4px;
`;

const StatusText = styled(Text)<{ status: 'available' | 'low-stock' | 'unavailable' }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ status, theme }) => {
    switch (status) {
      case 'available':
        return theme.colors.status.success;
      case 'low-stock':
        return theme.colors.status.warning;
      case 'unavailable':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  }};
  margin-left: 4px;
`;

const InventoryStatusBadge: React.FC<InventoryStatusBadgeProps> = ({ menuItem }) => {
  const getStatus = (): 'available' | 'low-stock' | 'unavailable' => {
    if (!menuItem.isAvailable) {
      return 'unavailable';
    }
    
    if (menuItem.isLowStock) {
      return 'low-stock';
    }
    
    return 'available';
  };

  const getStatusText = (status: 'available' | 'low-stock' | 'unavailable'): string => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'low-stock':
        return 'Limited Stock';
      case 'unavailable':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status: 'available' | 'low-stock' | 'unavailable'): string => {
    switch (status) {
      case 'available':
        return 'check-circle';
      case 'low-stock':
        return 'warning';
      case 'unavailable':
        return 'cancel';
      default:
        return 'help';
    }
  };

  const status = getStatus();

  return (
    <StatusContainer status={status}>
      <Icon 
        name={getStatusIcon(status)} 
        size={12} 
        color={
          status === 'available' ? '#10B981' :
          status === 'low-stock' ? '#F59E0B' : '#EF4444'
        } 
      />
      <StatusText status={status}>
        {getStatusText(status)}
      </StatusText>
    </StatusContainer>
  );
};

export default InventoryStatusBadge;