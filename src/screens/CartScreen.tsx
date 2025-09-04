import React, { useRef, useEffect } from 'react';
import { View, ScrollView, Animated, Easing, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { updateQuantity, removeFromCart } from '../store/slices/cartSlice';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Text } from '../components/common/Text';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';

type CartScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled(ScrollView)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const CartItem = styled(Card)`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const ItemImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const ItemInfo = styled.View`
  flex: 1;
`;

const ItemName = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.base}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-bottom: 4px;
`;

const ItemPrice = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const QuantityControls = styled.View`
  flex-direction: row;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.sm}px 0;
`;

const QuantityButton = styled(TouchableOpacity)`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
`;

const QuantityText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.base}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin: 0 ${({ theme }) => theme.spacing.md}px;
`;

const RemoveButton = styled(TouchableOpacity)`
  padding: ${({ theme }) => theme.spacing.sm}px;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const SummaryCard = styled(Card)`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SummaryLabel = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SummaryValue = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  border-top-width: 2px;
  border-top-color: ${({ theme }) => theme.colors.primary};
`;

const TotalLabel = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const TotalValue = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const EmptyCartContainer = styled.View`
  align-items: center;
  margin-top: 100px;
`;

const EmptyCartIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${({ theme }) => theme.colors.neutral.lightGray};
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { items, subtotal, deliveryFee, tax, total } = useSelector((state: RootState) => state.cart);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    dispatch(updateQuantity({ itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  return (
    <Container>
      <Content showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnimation }}>
          <Text variant="h2" weight="bold" style={{ marginBottom: 20 }}>
            Your Cart
          </Text>
          
          {items.length === 0 ? (
            <EmptyCartContainer>
              <EmptyCartIcon>
                <Icon name="shopping-cart" size={40} color="#9CA3AF" />
              </EmptyCartIcon>
              <Text variant="h3" color="secondary" style={{ marginBottom: 16 }}>
                Your cart is empty
              </Text>
              <Text variant="body" color="secondary" align="center" style={{ marginBottom: 24 }}>
                Add some delicious items to get started!
              </Text>
              <Button
                title="Browse Restaurants"
                onPress={() => navigation.navigate('Main')}
                fullWidth
              />
            </EmptyCartContainer>
          ) : (
            <>
              {/* Cart Items */}
              {items.map((item) => (
                <CartItem key={item.id}>
                  <ItemImage source={{ uri: item.menuItem.image }} />
                  <ItemInfo>
                    <ItemName>{item.menuItem.name}</ItemName>
                    <ItemPrice>GHS {item.menuItem.price.toFixed(2)} each</ItemPrice>
                    
                    <QuantityControls>
                      <QuantityButton onPress={() => handleQuantityChange(item.id, item.quantity - 1)}>
                        <Icon name="remove" size={16} color="#FFFFFF" />
                      </QuantityButton>
                      <QuantityText>{item.quantity}</QuantityText>
                      <QuantityButton onPress={() => handleQuantityChange(item.id, item.quantity + 1)}>
                        <Icon name="add" size={16} color="#FFFFFF" />
                      </QuantityButton>
                    </QuantityControls>
                  </ItemInfo>
                  
                  <View style={{ alignItems: 'flex-end' }}>
                    <ItemPrice>GHS {item.total.toFixed(2)}</ItemPrice>
                    <RemoveButton onPress={() => handleRemoveItem(item.id)}>
                      <Icon name="delete" size={20} color="#EF4444" />
                    </RemoveButton>
                  </View>
                </CartItem>
              ))}

              {/* Order Summary */}
              <SummaryCard>
                <Text variant="body" weight="semiBold" style={{ marginBottom: 16 }}>
                  Order Summary
                </Text>
                
                <SummaryRow>
                  <SummaryLabel>Subtotal</SummaryLabel>
                  <SummaryValue>GHS {subtotal.toFixed(2)}</SummaryValue>
                </SummaryRow>
                
                <SummaryRow>
                  <SummaryLabel>Delivery Fee</SummaryLabel>
                  <SummaryValue>GHS {deliveryFee.toFixed(2)}</SummaryValue>
                </SummaryRow>
                
                <SummaryRow>
                  <SummaryLabel>Tax</SummaryLabel>
                  <SummaryValue>GHS {tax.toFixed(2)}</SummaryValue>
                </SummaryRow>
                
                <TotalRow>
                  <TotalLabel>Total</TotalLabel>
                  <TotalValue>GHS {total.toFixed(2)}</TotalValue>
                </TotalRow>
              </SummaryCard>

              {/* Checkout Button */}
              <Button
                title="Proceed to Checkout"
                onPress={handleCheckout}
                fullWidth
                style={{ marginBottom: 20 }}
              />
            </>
          )}
        </Animated.View>
      </Content>
    </Container>
  );
};

export default CartScreen;