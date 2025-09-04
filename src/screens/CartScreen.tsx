import React, { useRef, useEffect } from 'react';
import { View, ScrollView, Animated, Easing } from 'react-native';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Text } from '../components/common/Text';
import { Button } from '../components/common/Button';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled(ScrollView)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const CartScreen: React.FC = () => {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Container>
      <Content>
        <Animated.View style={{ opacity: fadeAnimation }}>
          <Text variant="h2" weight="bold" style={{ marginBottom: 20 }}>
            Your Cart
          </Text>
          
          {items.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Text variant="h3" color="secondary" style={{ marginBottom: 16 }}>
                Your cart is empty
              </Text>
              <Text variant="body" color="secondary" align="center">
                Add some delicious items to get started!
              </Text>
            </View>
          ) : (
            <View>
              <Text variant="body">Total: ${total.toFixed(2)}</Text>
              <Button
                title="Proceed to Checkout"
                onPress={() => {}}
                fullWidth
                style={{ marginTop: 20 }}
              />
            </View>
          )}
        </Animated.View>
      </Content>
    </Container>
  );
};

export default CartScreen;