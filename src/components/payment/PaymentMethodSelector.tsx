import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PaymentMethod } from '../../types';
import { Text } from '../common/Text';
import { Card } from '../common/Card';

interface PaymentMethodSelectorProps {
  selectedMethod: string | null;
  onMethodSelect: (method: string) => void;
  showCashOption?: boolean;
}

const Container = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const PaymentMethodCard = styled(Card)<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-width: 2px;
  border-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border};
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary + '10' : theme.colors.surface};
`;

const IconContainer = styled.View<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${({ color }) => color}20;
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const MethodInfo = styled.View`
  flex: 1;
`;

const MethodName = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-bottom: 4px;
`;

const MethodDescription = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RadioButton = styled.View<{ selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 2px;
  border-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border};
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : 'transparent'};
  justify-content: center;
  align-items: center;
`;

const RadioInner = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.neutral.white};
`;

const paymentMethods = [
  {
    id: 'debit_card',
    name: 'Debit Card',
    description: 'Pay with your debit card',
    icon: 'credit-card',
    color: '#2ECC71',
    providers: ['visa', 'mastercard'],
  },
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    description: 'Pay with MTN, Vodafone, or AirtelTigo',
    icon: 'phone-android',
    color: '#FF8C42',
    providers: ['mtn', 'vodafone', 'airteltigo'],
  },
  {
    id: 'cash',
    name: 'Cash on Delivery',
    description: 'Pay with cash when your order arrives',
    icon: 'money',
    color: '#9B59B6',
    providers: [],
  },
];

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodSelect,
  showCashOption = true,
}) => {
  const methods = showCashOption ? paymentMethods : paymentMethods.filter(m => m.id !== 'cash');

  return (
    <Container>
      <SectionTitle>Payment Method</SectionTitle>
      {methods.map((method) => (
        <PaymentMethodCard
          key={method.id}
          selected={selectedMethod === method.id}
          onPress={() => onMethodSelect(method.id)}
          style={{ marginBottom: 12 }}
        >
          <IconContainer color={method.color}>
            <Icon name={method.icon} size={24} color={method.color} />
          </IconContainer>
          
          <MethodInfo>
            <MethodName>{method.name}</MethodName>
            <MethodDescription>{method.description}</MethodDescription>
          </MethodInfo>
          
          <RadioButton selected={selectedMethod === method.id}>
            {selectedMethod === method.id && <RadioInner />}
          </RadioButton>
        </PaymentMethodCard>
      ))}
    </Container>
  );
};

export default PaymentMethodSelector;