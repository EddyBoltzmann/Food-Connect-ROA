import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, Animated, Easing } from 'react-native';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Text } from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { OrderStatus } from '../types';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled(ScrollView)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const OrderCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const OrderHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const OrderInfo = styled.View`
  flex: 1;
`;

const OrderNumber = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: 4px;
`;

const OrderTime = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StatusBadge = styled.View<{ status: OrderStatus }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'placed':
        return theme.colors.status.info + '20';
      case 'confirmed':
        return theme.colors.status.warning + '20';
      case 'preparing':
        return theme.colors.primary.orange + '20';
      case 'ready':
        return theme.colors.status.success + '20';
      case 'out_for_delivery':
        return theme.colors.primary + '20';
      case 'delivered':
        return theme.colors.status.success + '20';
      case 'cancelled':
        return theme.colors.status.error + '20';
      default:
        return theme.colors.neutral.lightGray;
    }
  }};
`;

const StatusText = styled(Text)<{ status: OrderStatus }>`
  color: ${({ status, theme }) => {
    switch (status) {
      case 'placed':
        return theme.colors.status.info;
      case 'confirmed':
        return theme.colors.status.warning;
      case 'preparing':
        return theme.colors.primary.orange;
      case 'ready':
        return theme.colors.status.success;
      case 'out_for_delivery':
        return theme.colors.primary;
      case 'delivered':
        return theme.colors.status.success;
      case 'cancelled':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  }};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const TrackingSection = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const TrackingTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const TrackingStep = styled.View<{ completed: boolean; current: boolean }>`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StepIcon = styled.View<{ completed: boolean; current: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ completed, current, theme }) => {
    if (completed) return theme.colors.status.success;
    if (current) return theme.colors.primary;
    return theme.colors.neutral.lightGray;
  }};
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const StepContent = styled.View`
  flex: 1;
`;

const StepTitle = styled(Text)<{ completed: boolean; current: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.base}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ completed, current, theme }) => {
    if (completed || current) return theme.colors.text.primary;
    return theme.colors.text.secondary;
  }};
  margin-bottom: 4px;
`;

const StepDescription = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StepLine = styled.View<{ completed: boolean }>`
  position: absolute;
  left: 19px;
  top: 40px;
  width: 2px;
  height: 40px;
  background-color: ${({ completed, theme }) => 
    completed ? theme.colors.status.success : theme.colors.neutral.lightGray};
`;

const OrderItems = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
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

const DeliveryInfo = styled.View`
  background-color: ${({ theme }) => theme.colors.primary}10;
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const DeliveryRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const DeliveryLabel = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  min-width: 80px;
`;

const DeliveryValue = styled(Text)`
  flex: 1;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ActionButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const OrderTrackingScreen: React.FC = () => {
  const { currentOrder } = useSelector((state: RootState) => state.orders);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  // Mock order data for demonstration
  const mockOrder = {
    id: 'ORD-001',
    status: 'preparing' as OrderStatus,
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 16.99 },
      { name: 'Caesar Salad', quantity: 2, price: 12.99 },
    ],
    total: 42.97,
    estimatedDelivery: '25-35 min',
    deliveryAddress: '123 Main Street, Accra',
    placedAt: '2024-01-15T14:30:00Z',
  };

  const trackingSteps = [
    {
      id: 'placed',
      title: 'Order Placed',
      description: 'Your order has been received',
      icon: 'receipt',
      completed: true,
    },
    {
      id: 'confirmed',
      title: 'Order Confirmed',
      description: 'Restaurant has confirmed your order',
      icon: 'check-circle',
      completed: true,
    },
    {
      id: 'preparing',
      title: 'Preparing',
      description: 'Your food is being prepared',
      icon: 'restaurant',
      completed: false,
      current: true,
    },
    {
      id: 'ready',
      title: 'Ready for Pickup',
      description: 'Your order is ready',
      icon: 'done',
      completed: false,
    },
    {
      id: 'out_for_delivery',
      title: 'Out for Delivery',
      description: 'Your order is on the way',
      icon: 'delivery-dining',
      completed: false,
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Order delivered successfully',
      icon: 'home',
      completed: false,
    },
  ];

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const getCurrentStepIndex = () => {
    return trackingSteps.findIndex(step => step.current);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Container>
      <Content showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnimation }}>
          {/* Order Summary */}
          <OrderCard>
            <OrderHeader>
              <OrderInfo>
                <OrderNumber>Order #{mockOrder.id}</OrderNumber>
                <OrderTime>Placed at {formatTime(mockOrder.placedAt)}</OrderTime>
              </OrderInfo>
              <StatusBadge status={mockOrder.status}>
                <StatusText status={mockOrder.status}>
                  {mockOrder.status.replace('_', ' ').toUpperCase()}
                </StatusText>
              </StatusBadge>
            </OrderHeader>

            <OrderItems>
              <Text variant="body" weight="semiBold" style={{ marginBottom: 12 }}>
                Order Items
              </Text>
              {mockOrder.items.map((item, index) => (
                <OrderItem key={index}>
                  <ItemName>{item.name} x {item.quantity}</ItemName>
                  <ItemPrice>GHS {(item.price * item.quantity).toFixed(2)}</ItemPrice>
                </OrderItem>
              ))}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 2,
                borderTopColor: '#2ECC71'
              }}>
                <Text variant="body" weight="bold">Total</Text>
                <Text variant="body" weight="bold" color="primary">
                  GHS {mockOrder.total.toFixed(2)}
                </Text>
              </View>
            </OrderItems>
          </OrderCard>

          {/* Order Tracking */}
          <TrackingSection>
            <TrackingTitle>Order Progress</TrackingTitle>
            {trackingSteps.map((step, index) => (
              <View key={step.id} style={{ position: 'relative' }}>
                <TrackingStep 
                  completed={step.completed} 
                  current={step.current || false}
                >
                  <StepIcon completed={step.completed} current={step.current || false}>
                    <Icon 
                      name={step.icon} 
                      size={20} 
                      color={step.completed || step.current ? '#FFFFFF' : '#9CA3AF'} 
                    />
                  </StepIcon>
                  <StepContent>
                    <StepTitle 
                      completed={step.completed} 
                      current={step.current || false}
                    >
                      {step.title}
                    </StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </StepContent>
                </TrackingStep>
                {index < trackingSteps.length - 1 && (
                  <StepLine completed={step.completed} />
                )}
              </View>
            ))}
          </TrackingSection>

          {/* Delivery Information */}
          <DeliveryInfo>
            <Text variant="body" weight="semiBold" style={{ marginBottom: 16 }}>
              Delivery Information
            </Text>
            <DeliveryRow>
              <DeliveryLabel>Address:</DeliveryLabel>
              <DeliveryValue>{mockOrder.deliveryAddress}</DeliveryValue>
            </DeliveryRow>
            <DeliveryRow>
              <DeliveryLabel>ETA:</DeliveryLabel>
              <DeliveryValue>{mockOrder.estimatedDelivery}</DeliveryValue>
            </DeliveryRow>
            <DeliveryRow>
              <DeliveryLabel>Status:</DeliveryLabel>
              <DeliveryValue>
                {mockOrder.status === 'preparing' ? 'Being prepared' : 
                 mockOrder.status === 'out_for_delivery' ? 'On the way' : 
                 'Ready for delivery'}
              </DeliveryValue>
            </DeliveryRow>
          </DeliveryInfo>

          {/* Action Buttons */}
          <ActionButtons>
            <Button
              title="Contact Restaurant"
              variant="outline"
              onPress={() => {}}
              style={{ flex: 0.48 }}
            />
            <Button
              title="Track on Map"
              onPress={() => {}}
              style={{ flex: 0.48 }}
            />
          </ActionButtons>
        </Animated.View>
      </Content>
    </Container>
  );
};

export default OrderTrackingScreen;