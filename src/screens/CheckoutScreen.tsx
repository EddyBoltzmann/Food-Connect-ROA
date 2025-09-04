import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, Animated, Easing, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { Text } from '../components/common/Text';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import DebitCardForm from '../components/payment/DebitCardForm';
import MobileMoneyForm from '../components/payment/MobileMoneyForm';
import CashOnDeliveryForm from '../components/payment/CashOnDeliveryForm';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled(ScrollView)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const Section = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const OrderItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const ItemName = styled(Text)`
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const ItemPrice = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const TotalSection = styled.View`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  border-top-width: 2px;
  border-top-color: ${({ theme }) => theme.colors.primary};
`;

const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const TotalLabel = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TotalValue = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const GrandTotal = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const GrandTotalLabel = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const GrandTotalValue = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const CheckoutScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, subtotal, deliveryFee, tax, total } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleDebitCardSubmit = async (cardData: any) => {
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      Alert.alert(
        'Payment Successful',
        'Your order has been placed successfully!',
        [{ text: 'OK', onPress: () => {} }]
      );
    }, 3000);
  };

  const handleMobileMoneySubmit = async (mobileData: any) => {
    setIsProcessingPayment(true);
    
    // Simulate mobile money payment
    setTimeout(() => {
      setIsProcessingPayment(false);
      Alert.alert(
        'Payment Successful',
        'Your mobile money payment has been processed successfully!',
        [{ text: 'OK', onPress: () => {} }]
      );
    }, 3000);
  };

  const handleCashOnDeliverySubmit = async () => {
    setIsProcessingPayment(true);
    
    // Simulate order placement
    setTimeout(() => {
      setIsProcessingPayment(false);
      Alert.alert(
        'Order Placed',
        'Your order has been placed successfully! You will pay with cash upon delivery.',
        [{ text: 'OK', onPress: () => {} }]
      );
    }, 2000);
  };

  const renderPaymentForm = () => {
    if (!selectedPaymentMethod) return null;

    switch (selectedPaymentMethod) {
      case 'debit_card':
        return (
          <DebitCardForm
            onSubmit={handleDebitCardSubmit}
            isLoading={isProcessingPayment}
          />
        );
      case 'mobile_money':
        return (
          <MobileMoneyForm
            onSubmit={handleMobileMoneySubmit}
            amount={total}
            isLoading={isProcessingPayment}
          />
        );
      case 'cash':
        return (
          <CashOnDeliveryForm
            onSubmit={handleCashOnDeliverySubmit}
            amount={total}
            isLoading={isProcessingPayment}
          />
        );
      default:
        return null;
    }
  };

  if (items.length === 0) {
    return (
      <Container>
        <Content>
          <Animated.View style={{ opacity: fadeAnimation }}>
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Text variant="h3" color="secondary" style={{ marginBottom: 16 }}>
                Your cart is empty
              </Text>
              <Text variant="body" color="secondary" align="center">
                Add some items to your cart to proceed with checkout
              </Text>
            </View>
          </Animated.View>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnimation }}>
          {/* Order Summary */}
          <Section>
            <SectionHeader>
              <Icon name="receipt" size={24} color="#2ECC71" />
              <SectionTitle>Order Summary</SectionTitle>
            </SectionHeader>
            
            {items.map((item) => (
              <OrderItem key={item.id}>
                <ItemName>{item.menuItem.name} x {item.quantity}</ItemName>
                <ItemPrice>GHS {item.total.toFixed(2)}</ItemPrice>
              </OrderItem>
            ))}
            
            <TotalSection>
              <TotalRow>
                <TotalLabel>Subtotal</TotalLabel>
                <TotalValue>GHS {subtotal.toFixed(2)}</TotalValue>
              </TotalRow>
              <TotalRow>
                <TotalLabel>Delivery Fee</TotalLabel>
                <TotalValue>GHS {deliveryFee.toFixed(2)}</TotalValue>
              </TotalRow>
              <TotalRow>
                <TotalLabel>Tax</TotalLabel>
                <TotalValue>GHS {tax.toFixed(2)}</TotalValue>
              </TotalRow>
              <GrandTotal>
                <GrandTotalLabel>Total</GrandTotalLabel>
                <GrandTotalValue>GHS {total.toFixed(2)}</GrandTotalValue>
              </GrandTotal>
            </TotalSection>
          </Section>

          {/* Delivery Address */}
          <Section>
            <SectionHeader>
              <Icon name="location-on" size={24} color="#2ECC71" />
              <SectionTitle>Delivery Address</SectionTitle>
            </SectionHeader>
            <Text variant="body">
              {user?.addresses?.find(addr => addr.isDefault)?.street || 'No address set'}
            </Text>
            <Button
              title="Change Address"
              variant="outline"
              onPress={() => {}}
              style={{ marginTop: 12 }}
            />
          </Section>

          {/* Payment Method Selection */}
          <Section>
            <SectionHeader>
              <Icon name="payment" size={24} color="#2ECC71" />
              <SectionTitle>Payment Method</SectionTitle>
            </SectionHeader>
            
            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onMethodSelect={handlePaymentMethodSelect}
              showCashOption={true}
            />
          </Section>

          {/* Payment Form */}
          {renderPaymentForm()}
        </Animated.View>
      </Content>
    </Container>
  );
};

export default CheckoutScreen;