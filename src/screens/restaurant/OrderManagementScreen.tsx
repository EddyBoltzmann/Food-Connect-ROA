import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, Animated, Easing, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { Text } from '../../components/common/Text';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Order } from '../../types';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const FilterContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const FilterButton = styled(TouchableOpacity)<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.surface};
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const FilterText = styled(Text)<{ active: boolean }>`
  color: ${({ active, theme }) => 
    active ? theme.colors.neutral.white : theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const OrderCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const OrderHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
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

const OrderStatus = styled.View<{ status: string }>`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'pending':
        return theme.colors.status.warning + '20';
      case 'confirmed':
        return theme.colors.status.info + '20';
      case 'preparing':
        return theme.colors.primary + '20';
      case 'ready':
        return theme.colors.status.success + '20';
      case 'completed':
        return theme.colors.neutral.lightGray;
      default:
        return theme.colors.neutral.lightGray;
    }
  }};
`;

const StatusText = styled(Text)<{ status: string }>`
  color: ${({ status, theme }) => {
    switch (status) {
      case 'pending':
        return theme.colors.status.warning;
      case 'confirmed':
        return theme.colors.status.info;
      case 'preparing':
        return theme.colors.primary;
      case 'ready':
        return theme.colors.status.success;
      case 'completed':
        return theme.colors.text.secondary;
      default:
        return theme.colors.text.secondary;
    }
  }};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const CustomerInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const CustomerIcon = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.primary + '20'};
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const CustomerDetails = styled.View`
  flex: 1;
`;

const CustomerName = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: 2px;
`;

const CustomerPhone = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const OrderItems = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const OrderItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const ItemName = styled(Text)`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const ItemQuantity = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const ItemPrice = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const OrderTotal = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.sm}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const TotalLabel = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
`;

const TotalAmount = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  color: ${({ theme }) => theme.colors.primary};
`;

const ActionButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const ActionButton = styled(Button)<{ variant?: 'primary' | 'secondary' | 'success' | 'warning' }>`
  flex: 1;
  margin: 0 ${({ theme }) => theme.spacing.xs}px;
`;

const EmptyState = styled.View`
  align-items: center;
  margin-top: 100px;
`;

const EmptyIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${({ theme }) => theme.colors.neutral.lightGray};
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
type FilterType = 'all' | 'pending' | 'preparing' | 'ready' | 'completed';

const OrderManagementScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: 'ORD-001',
      customerId: 'customer-1',
      restaurantId: user?.id || 'restaurant-1',
      items: [
        { menuItemId: '1', name: 'Margherita Pizza', quantity: 1, price: 16.99 },
        { menuItemId: '2', name: 'Caesar Salad', quantity: 2, price: 12.99 },
      ],
      total: 42.97,
      status: 'pending',
      paymentMethod: 'debit_card',
      deliveryAddress: {
        street: '123 Main St',
        city: 'Accra',
        postalCode: 'GA-123-4567',
        coordinates: { latitude: 5.6037, longitude: -0.1870 },
      },
      estimatedDeliveryTime: 30,
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
      updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: 'ORD-002',
      customerId: 'customer-2',
      restaurantId: user?.id || 'restaurant-1',
      items: [
        { menuItemId: '3', name: 'Chicken Burger', quantity: 1, price: 14.99 },
        { menuItemId: '4', name: 'French Fries', quantity: 1, price: 6.99 },
      ],
      total: 21.98,
      status: 'preparing',
      paymentMethod: 'mobile_money',
      deliveryAddress: {
        street: '456 Oak Ave',
        city: 'Accra',
        postalCode: 'GA-789-0123',
        coordinates: { latitude: 5.6037, longitude: -0.1870 },
      },
      estimatedDeliveryTime: 25,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: 'ORD-003',
      customerId: 'customer-3',
      restaurantId: user?.id || 'restaurant-1',
      items: [
        { menuItemId: '5', name: 'Pasta Carbonara', quantity: 1, price: 18.99 },
      ],
      total: 18.99,
      status: 'ready',
      paymentMethod: 'cash',
      deliveryAddress: {
        street: '789 Pine St',
        city: 'Accra',
        postalCode: 'GA-456-7890',
        coordinates: { latitude: 5.6037, longitude: -0.1870 },
      },
      estimatedDeliveryTime: 20,
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
      updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    },
  ];

  const mockCustomers = {
    'customer-1': { name: 'John Doe', phone: '+233 24 123 4567' },
    'customer-2': { name: 'Jane Smith', phone: '+233 20 987 6543' },
    'customer-3': { name: 'Mike Johnson', phone: '+233 26 555 1234' },
  };

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Load orders
    setOrders(mockOrders);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'all') return true;
    return order.status === activeFilter;
  });

  const getStatusActions = (order: Order) => {
    switch (order.status) {
      case 'pending':
        return [
          { title: 'Confirm', action: () => updateOrderStatus(order.id, 'confirmed'), variant: 'primary' as const },
          { title: 'Reject', action: () => rejectOrder(order.id), variant: 'secondary' as const },
        ];
      case 'confirmed':
        return [
          { title: 'Start Preparing', action: () => updateOrderStatus(order.id, 'preparing'), variant: 'primary' as const },
        ];
      case 'preparing':
        return [
          { title: 'Mark Ready', action: () => updateOrderStatus(order.id, 'ready'), variant: 'success' as const },
        ];
      case 'ready':
        return [
          { title: 'Complete', action: () => updateOrderStatus(order.id, 'completed'), variant: 'success' as const },
        ];
      default:
        return [];
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const rejectOrder = (orderId: string) => {
    Alert.alert(
      'Reject Order',
      'Are you sure you want to reject this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setOrders(prev => prev.filter(order => order.id !== orderId));
          },
        },
      ]
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'schedule';
      case 'confirmed': return 'check-circle';
      case 'preparing': return 'restaurant';
      case 'ready': return 'done';
      case 'completed': return 'check';
      default: return 'help';
    }
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnimation }}>
          <Header>
            <Text variant="h2" weight="bold">Order Management</Text>
            <Button
              title="Refresh"
              variant="outline"
              size="small"
              icon="refresh"
              onPress={() => setOrders([...mockOrders])}
            />
          </Header>

          {/* Filter Buttons */}
          <FilterContainer>
            {(['all', 'pending', 'preparing', 'ready', 'completed'] as FilterType[]).map((filter) => (
              <FilterButton
                key={filter}
                active={activeFilter === filter}
                onPress={() => setActiveFilter(filter)}
              >
                <FilterText active={activeFilter === filter}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </FilterText>
              </FilterButton>
            ))}
          </FilterContainer>

          {filteredOrders.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <Icon name="receipt" size={40} color="#9CA3AF" />
              </EmptyIcon>
              <Text variant="h3" color="secondary" style={{ marginBottom: 16 }}>
                No orders found
              </Text>
              <Text variant="body" color="secondary" align="center">
                {activeFilter === 'all' 
                  ? 'No orders have been placed yet'
                  : `No orders with status "${activeFilter}"`
                }
              </Text>
            </EmptyState>
          ) : (
            filteredOrders.map((order) => {
              const customer = mockCustomers[order.customerId as keyof typeof mockCustomers];
              const statusActions = getStatusActions(order);
              
              return (
                <OrderCard key={order.id}>
                  <OrderHeader>
                    <OrderInfo>
                      <OrderNumber>#{order.id}</OrderNumber>
                      <OrderTime>{formatTime(order.createdAt)}</OrderTime>
                    </OrderInfo>
                    <OrderStatus status={order.status}>
                      <StatusText status={order.status}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </StatusText>
                    </OrderStatus>
                  </OrderHeader>

                  <CustomerInfo>
                    <CustomerIcon>
                      <Icon name="person" size={16} color="#2ECC71" />
                    </CustomerIcon>
                    <CustomerDetails>
                      <CustomerName>{customer?.name || 'Unknown Customer'}</CustomerName>
                      <CustomerPhone>{customer?.phone || 'No phone'}</CustomerPhone>
                    </CustomerDetails>
                  </CustomerInfo>

                  <OrderItems>
                    {order.items.map((item, index) => (
                      <OrderItem key={index}>
                        <ItemName>{item.name}</ItemName>
                        <ItemQuantity>x{item.quantity}</ItemQuantity>
                        <ItemPrice>GHS {item.price.toFixed(2)}</ItemPrice>
                      </OrderItem>
                    ))}
                  </OrderItems>

                  <OrderTotal>
                    <TotalLabel>Total</TotalLabel>
                    <TotalAmount>GHS {order.total.toFixed(2)}</TotalAmount>
                  </OrderTotal>

                  {statusActions.length > 0 && (
                    <ActionButtons>
                      {statusActions.map((action, index) => (
                        <ActionButton
                          key={index}
                          title={action.title}
                          onPress={action.action}
                          variant={action.variant}
                        />
                      ))}
                    </ActionButtons>
                  )}
                </OrderCard>
              );
            })
          )}
        </Animated.View>
      </ScrollView>
    </Container>
  );
};

export default OrderManagementScreen;