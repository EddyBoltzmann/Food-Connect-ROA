import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types';

// Import components
import { Text } from '../components/common/Text';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import MenuCategory from '../components/restaurant/MenuCategory';
import MenuItemCard from '../components/restaurant/MenuItemCard';

const { width } = Dimensions.get('window');

type RestaurantScreenRouteProp = RouteProp<RootStackParamList, 'Restaurant'>;
type RestaurantScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeaderImage = styled(Image)`
  width: 100%;
  height: 200px;
`;

const HeaderOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
`;

const HeaderContent = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const RestaurantName = styled(Text)`
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const RestaurantInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const RatingContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const RatingText = styled(Text)`
  color: ${({ theme }) => theme.colors.neutral.white};
  margin-left: ${({ theme }) => theme.spacing.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const DeliveryInfo = styled(Text)`
  color: ${({ theme }) => theme.colors.neutral.white};
  opacity: 0.9;
`;

const StatusBadge = styled.View<{ isOpen: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.lg}px;
  right: ${({ theme }) => theme.spacing.lg}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  background-color: ${({ isOpen, theme }) => 
    isOpen ? theme.colors.status.success : theme.colors.status.error};
`;

const StatusText = styled(Text)<{ isOpen: boolean }>`
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
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

const DescriptionCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const DescriptionText = styled(Text)`
  line-height: 22px;
`;

const CuisineTags = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const CuisineTag = styled.View`
  background-color: ${({ theme }) => theme.colors.primary}20;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const CuisineTagText = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const MenuSection = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const MenuItemsContainer = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const FloatingCartButton = styled(TouchableOpacity)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.shadows.lg};
`;

const CartBadge = styled.View`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${({ theme }) => theme.colors.status.error};
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  padding: 0 6px;
`;

const CartBadgeText = styled(Text)`
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const RestaurantScreen: React.FC = () => {
  const route = useRoute<RestaurantScreenRouteProp>();
  const navigation = useNavigation<RestaurantScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { restaurantId } = route.params;
  const { restaurants, currentRestaurant, menu, isLoading } = useSelector((state: RootState) => state.restaurants);
  const { items: cartItems } = useSelector((state: RootState) => state.cart);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // TODO: Fetch restaurant details and menu
    console.log('Fetching restaurant:', restaurantId);
  }, [restaurantId]);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Refresh restaurant data
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleMenuItemPress = (menuItem: any) => {
    navigation.navigate('MenuItem', { menuItem });
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const handleOrderNow = () => {
    if (cartItems.length > 0) {
      navigation.navigate('Cart');
    } else {
      // TODO: Show message to add items to cart
    }
  };

  // Mock restaurant data for now
  const restaurant = {
    id: restaurantId,
    name: 'Delicious Bites',
    description: 'Experience the finest flavors with our carefully crafted menu featuring fresh ingredients and authentic recipes.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    banner: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    rating: 4.5,
    reviewCount: 128,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    minimumOrder: 15,
    isOpen: true,
    cuisine: ['Italian', 'Mediterranean', 'Pizza'],
  };

  const mockMenu = [
    {
      id: '1',
      name: 'Appetizers',
      items: [
        {
          id: '1',
          name: 'Bruschetta',
          description: 'Toasted bread with fresh tomatoes, basil, and garlic',
          price: 8.99,
          image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400',
          isAvailable: true,
        },
        {
          id: '2',
          name: 'Caprese Salad',
          description: 'Fresh mozzarella, tomatoes, and basil drizzled with balsamic',
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
          isAvailable: true,
        },
      ],
    },
    {
      id: '2',
      name: 'Main Courses',
      items: [
        {
          id: '3',
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
          price: 16.99,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
          isAvailable: true,
        },
        {
          id: '4',
          name: 'Pasta Carbonara',
          description: 'Creamy pasta with eggs, cheese, and pancetta',
          price: 18.99,
          image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
          isAvailable: true,
        },
      ],
    },
  ];

  return (
    <Container>
      <View style={{ height: 200 }}>
        <HeaderImage source={{ uri: restaurant.banner }} resizeMode="cover" />
        <HeaderOverlay />
        
        <StatusBadge isOpen={restaurant.isOpen}>
          <StatusText isOpen={restaurant.isOpen}>
            {restaurant.isOpen ? 'Open' : 'Closed'}
          </StatusText>
        </StatusBadge>

        <HeaderContent>
          <RestaurantName>{restaurant.name}</RestaurantName>
          
          <RestaurantInfo>
            <RatingContainer>
              <Icon name="star" size={16} color="#F59E0B" />
              <RatingText>{restaurant.rating}</RatingText>
              <RatingText style={{ opacity: 0.8 }}>
                ({restaurant.reviewCount} reviews)
              </RatingText>
            </RatingContainer>
          </RestaurantInfo>

          <DeliveryInfo>
            {restaurant.deliveryTime} • {restaurant.deliveryFee === 0 ? 'Free delivery' : `$${restaurant.deliveryFee} delivery`}
          </DeliveryInfo>
        </HeaderContent>
      </View>

      <Content
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <ContentPadding>
          <DescriptionCard>
            <DescriptionText>{restaurant.description}</DescriptionText>
          </DescriptionCard>

          <CuisineTags>
            {restaurant.cuisine.map((cuisine, index) => (
              <CuisineTag key={index}>
                <CuisineTagText>{cuisine}</CuisineTagText>
              </CuisineTag>
            ))}
          </CuisineTags>

          <MenuSection>
            <SectionHeader>
              <SectionTitle>Menu</SectionTitle>
            </SectionHeader>

            {mockMenu.map((category) => (
              <MenuCategory key={category.id} category={category}>
                <MenuItemsContainer>
                  {category.items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onPress={() => handleMenuItemPress(item)}
                    />
                  ))}
                </MenuItemsContainer>
              </MenuCategory>
            ))}
          </MenuSection>
        </ContentPadding>
      </Content>

      {cartItems.length > 0 && (
        <FloatingCartButton onPress={handleCartPress}>
          <Icon name="shopping-cart" size={24} color="#FFFFFF" />
          <CartBadge>
            <CartBadgeText>{cartItems.length}</CartBadgeText>
          </CartBadge>
        </FloatingCartButton>
      )}
    </Container>
  );
};

export default RestaurantScreen;