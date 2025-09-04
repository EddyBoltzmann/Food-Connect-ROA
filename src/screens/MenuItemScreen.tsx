import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList, MenuItem } from '../types';

// Import components
import { Text } from '../components/common/Text';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

type MenuItemScreenRouteProp = RouteProp<RootStackParamList, 'MenuItem'>;
type MenuItemScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ImageContainer = styled.View`
  height: 300px;
  position: relative;
`;

const MenuImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const BackButton = styled(TouchableOpacity)`
  position: absolute;
  top: 50px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const Content = styled(ScrollView)`
  flex: 1;
  margin-top: -20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ContentPadding = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const TitleContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const PriceContainer = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Description = styled(Text)`
  line-height: 24px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const CustomizationSection = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const CustomizationOption = styled(TouchableOpacity)<{ selected: boolean }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary + '20' : theme.colors.surface};
  border-width: 1px;
  border-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const OptionInfo = styled.View`
  flex: 1;
`;

const OptionName = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: 4px;
`;

const OptionPrice = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const QuantityContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const QuantityButton = styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
`;

const QuantityText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin: 0 ${({ theme }) => theme.spacing.lg}px;
`;

const AddToCartButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const MenuItemScreen: React.FC = () => {
  const route = useRoute<MenuItemScreenRouteProp>();
  const navigation = useNavigation<MenuItemScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { menuItem } = route.params;
  const { restaurantId } = useSelector((state: RootState) => state.cart);

  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<{[key: string]: string[]}>({});
  const [totalPrice, setTotalPrice] = useState(menuItem.price);

  // Animation values
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    startAnimations();
    calculateTotalPrice();
  }, [quantity, selectedCustomizations]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const calculateTotalPrice = () => {
    let basePrice = menuItem.price;
    let customizationsPrice = 0;

    // Calculate customizations price
    Object.values(selectedCustomizations).forEach(optionIds => {
      optionIds.forEach(optionId => {
        const option = menuItem.customizations
          .find(c => c.options.some(o => o.id === optionId))
          ?.options.find(o => o.id === optionId);
        if (option) {
          customizationsPrice += option.price;
        }
      });
    });

    setTotalPrice((basePrice + customizationsPrice) * quantity);
  };

  const handleCustomizationToggle = (customizationId: string, optionId: string) => {
    const customization = menuItem.customizations.find(c => c.id === customizationId);
    if (!customization) return;

    setSelectedCustomizations(prev => {
      const current = prev[customizationId] || [];
      let newSelection;

      if (customization.type === 'single') {
        newSelection = current.includes(optionId) ? [] : [optionId];
      } else {
        newSelection = current.includes(optionId)
          ? current.filter(id => id !== optionId)
          : [...current, optionId];
      }

      return {
        ...prev,
        [customizationId]: newSelection,
      };
    });
  };

  const handleAddToCart = () => {
    const customizations = Object.entries(selectedCustomizations).map(([customizationId, optionIds]) => ({
      customizationId,
      optionIds,
    }));

    dispatch(addToCart({
      menuItem,
      quantity,
      customizations,
      restaurantId: 'current-restaurant-id', // This should come from the restaurant context
    }));

    navigation.goBack();
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <Container>
      <ImageContainer>
        <MenuImage source={{ uri: menuItem.image }} resizeMode="cover" />
        <BackButton onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#FFFFFF" />
        </BackButton>
      </ImageContainer>

      <Content
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <ContentPadding>
          <Animated.View
            style={{
              opacity: fadeAnimation,
              transform: [{ translateY: slideAnimation }],
            }}
          >
            <TitleContainer>
              <Text variant="h2" weight="bold" style={{ marginBottom: 8 }}>
                {menuItem.name}
              </Text>
              <PriceContainer>
                <Text variant="h3" color="primary" weight="bold">
                  ${totalPrice.toFixed(2)}
                </Text>
                {quantity > 1 && (
                  <Text variant="body" color="secondary" style={{ marginLeft: 8 }}>
                    (${(totalPrice / quantity).toFixed(2)} each)
                  </Text>
                )}
              </PriceContainer>
            </TitleContainer>

            <Description>{menuItem.description}</Description>

            {menuItem.customizations && menuItem.customizations.length > 0 && (
              <CustomizationSection>
                <SectionTitle>Customizations</SectionTitle>
                {menuItem.customizations.map((customization) => (
                  <View key={customization.id} style={{ marginBottom: 16 }}>
                    <Text variant="body" weight="medium" style={{ marginBottom: 8 }}>
                      {customization.name}
                      {customization.required && (
                        <Text color="error"> *</Text>
                      )}
                    </Text>
                    {customization.options.map((option) => (
                      <CustomizationOption
                        key={option.id}
                        selected={selectedCustomizations[customization.id]?.includes(option.id) || false}
                        onPress={() => handleCustomizationToggle(customization.id, option.id)}
                      >
                        <OptionInfo>
                          <OptionName>{option.name}</OptionName>
                          {option.price > 0 && (
                            <OptionPrice>+${option.price.toFixed(2)}</OptionPrice>
                          )}
                        </OptionInfo>
                        <Icon
                          name={selectedCustomizations[customization.id]?.includes(option.id) ? 'radio-button-checked' : 'radio-button-unchecked'}
                          size={20}
                          color={selectedCustomizations[customization.id]?.includes(option.id) ? '#2ECC71' : '#BDC3C7'}
                        />
                      </CustomizationOption>
                    ))}
                  </View>
                ))}
              </CustomizationSection>
            )}

            <QuantityContainer>
              <Text variant="body" weight="medium">Quantity</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <QuantityButton onPress={() => handleQuantityChange(quantity - 1)}>
                  <Icon name="remove" size={20} color="#FFFFFF" />
                </QuantityButton>
                <QuantityText>{quantity}</QuantityText>
                <QuantityButton onPress={() => handleQuantityChange(quantity + 1)}>
                  <Icon name="add" size={20} color="#FFFFFF" />
                </QuantityButton>
              </View>
            </QuantityContainer>

            <AddToCartButton
              title={`Add to Cart - $${totalPrice.toFixed(2)}`}
              onPress={handleAddToCart}
              fullWidth
            />
          </Animated.View>
        </ContentPadding>
      </Content>
    </Container>
  );
};

export default MenuItemScreen;