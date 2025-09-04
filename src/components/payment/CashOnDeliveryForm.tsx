import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Text } from '../common/Text';
import { Button } from '../common/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CashOnDeliveryFormProps {
  onSubmit: () => void;
  amount: number;
  isLoading?: boolean;
}

const Container = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const CashIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${({ theme }) => theme.colors.primary.orange}20;
  justify-content: center;
  align-items: center;
  align-self: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const AmountDisplay = styled.View`
  background-color: ${({ theme }) => theme.colors.primary}10;
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  align-items: center;
`;

const AmountLabel = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  margin-bottom: 4px;
`;

const AmountValue = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const InfoSection = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const InfoItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const InfoIcon = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.status.success}20;
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const InfoText = styled(Text)`
  flex: 1;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const WarningNote = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.status.warning}20;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const WarningText = styled(Text)`
  color: ${({ theme }) => theme.colors.status.warning};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
  flex: 1;
`;

const CashOnDeliveryForm: React.FC<CashOnDeliveryFormProps> = ({
  onSubmit,
  amount,
  isLoading = false,
}) => {
  return (
    <Container>
      <CashIcon>
        <Icon name="money" size={40} color="#9B59B6" />
      </CashIcon>

      <AmountDisplay>
        <AmountLabel>Amount to Pay</AmountLabel>
        <AmountValue>GHS {amount.toFixed(2)}</AmountValue>
      </AmountDisplay>

      <InfoSection>
        <InfoItem>
          <InfoIcon>
            <Icon name="delivery-dining" size={16} color="#10B981" />
          </InfoIcon>
          <InfoText>
            Pay with cash when your order is delivered
          </InfoText>
        </InfoItem>

        <InfoItem>
          <InfoIcon>
            <Icon name="schedule" size={16} color="#10B981" />
          </InfoIcon>
          <InfoText>
            Delivery time: 25-35 minutes
          </InfoText>
        </InfoItem>

        <InfoItem>
          <InfoIcon>
            <Icon name="security" size={16} color="#10B981" />
          </InfoIcon>
          <InfoText>
            No payment required upfront
          </InfoText>
        </InfoItem>

        <InfoItem>
          <InfoIcon>
            <Icon name="receipt" size={16} color="#10B981" />
          </InfoIcon>
          <InfoText>
            Receive a receipt with your order
          </InfoText>
        </InfoItem>
      </InfoSection>

      <WarningNote>
        <Icon name="warning" size={20} color="#F59E0B" />
        <WarningText>
          Please have the exact amount ready. Our delivery person may not have change.
        </WarningText>
      </WarningNote>

      <Button
        title="Place Order (Cash on Delivery)"
        onPress={onSubmit}
        loading={isLoading}
        fullWidth
      />
    </Container>
  );
};

export default CashOnDeliveryForm;