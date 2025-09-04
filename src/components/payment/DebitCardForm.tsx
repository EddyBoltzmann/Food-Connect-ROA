import React, { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Input } from '../common/Input';
import { Text } from '../common/Text';
import { Button } from '../common/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface DebitCardFormProps {
  onSubmit: (cardData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  }) => void;
  isLoading?: boolean;
}

const Container = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const CardPreview = styled.View`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  height: 200px;
  justify-content: space-between;
`;

const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CardType = styled(Text)`
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const CardNumber = styled(Text)`
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  letter-spacing: 2px;
  margin: ${({ theme }) => theme.spacing.md}px 0;
`;

const CardFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CardholderName = styled(Text)`
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: ${({ theme }) => theme.typography.fontSize.base}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ExpiryDate = styled(Text)`
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: ${({ theme }) => theme.typography.fontSize.base}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const FormContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const HalfWidth = styled.View`
  flex: 0.48;
`;

const SecurityNote = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.status.info}20;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SecurityText = styled(Text)`
  color: ${({ theme }) => theme.colors.status.info};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
  flex: 1;
`;

const DebitCardForm: React.FC<DebitCardFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const getCardType = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'VISA';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'MASTERCARD';
    return 'CARD';
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (formData.expiryDate.length < 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date';
    }

    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    if (!formData.cardholderName) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        cardholderName: formData.cardholderName,
      });
    }
  };

  const maskedCardNumber = formData.cardNumber
    ? formData.cardNumber.slice(0, -4).replace(/\d/g, '•') + formData.cardNumber.slice(-4)
    : '•••• •••• •••• ••••';

  return (
    <Container>
      <CardPreview>
        <CardHeader>
          <CardType>{getCardType(formData.cardNumber)}</CardType>
          <Icon name="credit-card" size={24} color="#FFFFFF" />
        </CardHeader>
        
        <CardNumber>{maskedCardNumber}</CardNumber>
        
        <CardFooter>
          <CardholderName>
            {formData.cardholderName || 'CARDHOLDER NAME'}
          </CardholderName>
          <ExpiryDate>
            {formData.expiryDate || 'MM/YY'}
          </ExpiryDate>
        </CardFooter>
      </CardPreview>

      <FormContainer>
        <Input
          label="Card Number"
          placeholder="1234 5678 9012 3456"
          value={formData.cardNumber}
          onChangeText={(text) => setFormData({ ...formData, cardNumber: formatCardNumber(text) })}
          error={errors.cardNumber}
          keyboardType="numeric"
          maxLength={19}
          leftIcon="credit-card"
        />

        <Input
          label="Cardholder Name"
          placeholder="John Doe"
          value={formData.cardholderName}
          onChangeText={(text) => setFormData({ ...formData, cardholderName: text.toUpperCase() })}
          error={errors.cardholderName}
          autoCapitalize="characters"
          leftIcon="person"
        />

        <Row>
          <HalfWidth>
            <Input
              label="Expiry Date"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChangeText={(text) => setFormData({ ...formData, expiryDate: formatExpiryDate(text) })}
              error={errors.expiryDate}
              keyboardType="numeric"
              maxLength={5}
              leftIcon="calendar-today"
            />
          </HalfWidth>
          
          <HalfWidth>
            <Input
              label="CVV"
              placeholder="123"
              value={formData.cvv}
              onChangeText={(text) => setFormData({ ...formData, cvv: text.replace(/\D/g, '').slice(0, 3) })}
              error={errors.cvv}
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
              leftIcon="lock"
            />
          </HalfWidth>
        </Row>
      </FormContainer>

      <SecurityNote>
        <Icon name="security" size={20} color="#3B82F6" />
        <SecurityText>
          Your payment information is encrypted and secure. We never store your card details.
        </SecurityText>
      </SecurityNote>

      <Button
        title="Pay with Debit Card"
        onPress={handleSubmit}
        loading={isLoading}
        fullWidth
      />
    </Container>
  );
};

export default DebitCardForm;