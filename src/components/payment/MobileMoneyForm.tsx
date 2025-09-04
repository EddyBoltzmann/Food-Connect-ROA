import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Input } from '../common/Input';
import { Text } from '../common/Text';
import { Button } from '../common/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface MobileMoneyFormProps {
  onSubmit: (mobileData: {
    provider: string;
    phoneNumber: string;
    amount: number;
  }) => void;
  amount: number;
  isLoading?: boolean;
}

const Container = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const ProviderSelector = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const ProviderCard = styled(TouchableOpacity)<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  border-width: 2px;
  border-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border};
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary + '10' : theme.colors.surface};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const ProviderIcon = styled.View<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${({ color }) => color}20;
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const ProviderInfo = styled.View`
  flex: 1;
`;

const ProviderName = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-bottom: 4px;
`;

const ProviderDescription = styled(Text)`
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

const FormContainer = styled.View`
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

const InfoNote = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.status.info}20;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const InfoText = styled(Text)`
  color: ${({ theme }) => theme.colors.status.info};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
  flex: 1;
`;

const mobileMoneyProviders = [
  {
    id: 'mtn',
    name: 'MTN Mobile Money',
    description: 'Pay with your MTN MoMo account',
    icon: 'phone-android',
    color: '#FFC107',
  },
  {
    id: 'vodafone',
    name: 'Vodafone Cash',
    description: 'Pay with your Vodafone Cash account',
    icon: 'phone-android',
    color: '#E91E63',
  },
  {
    id: 'airteltigo',
    name: 'AirtelTigo Money',
    description: 'Pay with your AirtelTigo Money account',
    icon: 'phone-android',
    color: '#FF5722',
  },
];

const MobileMoneyForm: React.FC<MobileMoneyFormProps> = ({
  onSubmit,
  amount,
  isLoading = false,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return cleaned.slice(0, 10);
    } else if (cleaned.startsWith('233')) {
      return cleaned.slice(0, 12);
    } else {
      return cleaned.slice(0, 10);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedProvider) {
      newErrors.provider = 'Please select a mobile money provider';
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        provider: selectedProvider,
        phoneNumber: phoneNumber,
        amount: amount,
      });
    }
  };

  const getProviderInfo = (providerId: string) => {
    return mobileMoneyProviders.find(p => p.id === providerId);
  };

  return (
    <Container>
      <ProviderSelector>
        <SectionTitle>Select Mobile Money Provider</SectionTitle>
        {mobileMoneyProviders.map((provider) => (
          <ProviderCard
            key={provider.id}
            selected={selectedProvider === provider.id}
            onPress={() => setSelectedProvider(provider.id)}
          >
            <ProviderIcon color={provider.color}>
              <Icon name={provider.icon} size={24} color={provider.color} />
            </ProviderIcon>
            
            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>
              <ProviderDescription>{provider.description}</ProviderDescription>
            </ProviderInfo>
            
            <RadioButton selected={selectedProvider === provider.id}>
              {selectedProvider === provider.id && <RadioInner />}
            </RadioButton>
          </ProviderCard>
        ))}
      </ProviderSelector>

      <AmountDisplay>
        <AmountLabel>Amount to Pay</AmountLabel>
        <AmountValue>GHS {amount.toFixed(2)}</AmountValue>
      </AmountDisplay>

      <FormContainer>
        <Input
          label="Phone Number"
          placeholder="024 123 4567"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
          error={errors.phoneNumber}
          keyboardType="phone-pad"
          maxLength={12}
          leftIcon="phone"
        />
      </FormContainer>

      <InfoNote>
        <Icon name="info" size={20} color="#3B82F6" />
        <InfoText>
          You will receive a prompt on your phone to confirm the payment. 
          Make sure your phone is nearby and has network connection.
        </InfoText>
      </InfoNote>

      <Button
        title={`Pay with ${getProviderInfo(selectedProvider)?.name || 'Mobile Money'}`}
        onPress={handleSubmit}
        loading={isLoading}
        fullWidth
        disabled={!selectedProvider}
      />
    </Container>
  );
};

export default MobileMoneyForm;