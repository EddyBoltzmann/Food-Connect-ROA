import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import components
import { Text } from '../../components/common/Text';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import SearchBar from '../../components/home/SearchBar';
import FeaturedCarousel from '../../components/home/FeaturedCarousel';
import RestaurantCard from '../../components/home/RestaurantCard';
import CategoryFilter from '../../components/home/CategoryFilter';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xl}px;
  padding-top: ${({ theme }) => theme.spacing['2xl']}px;
`;

const HeaderTop = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const LocationContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
`;

const LocationText = styled(Text)`
  color: ${({ theme }) => theme.colors.neutral.white};
  margin-left: ${({ theme }) => theme.spacing.xs}px;
`;

const NotificationButton = styled(TouchableOpacity)`
  padding: ${({ theme }) => theme.spacing.sm}px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
`;

const WelcomeContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const Content = styled(ScrollView)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const Section = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const SeeAllButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
`;

const SeeAllText = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  margin-right: ${({ theme }) => theme.spacing.xs}px;
`;

const RestaurantsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const QuickActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const QuickActionButton = styled(TouchableOpacity)`
  flex: 1;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  margin: 0 ${({ theme }) => theme.spacing.xs}px;
  ${({ theme }) => theme.shadows.sm};
`;

const QuickActionIcon = styled.View`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  background-color: ${({ theme }) => theme.colors.primary}20;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { restaurants } = useSelector((state: RootState) => state.restaurants);
  const { theme } = useSelector((state: RootState) => state.app);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'restaurant' },
    { id: 'pizza', name: 'Pizza', icon: 'local-pizza' },
    { id: 'burger', name: 'Burger', icon: 'fastfood' },
    { id: 'asian', name: 'Asian', icon: 'ramen-dining' },
    { id: 'mexican', name: 'Mexican', icon: 'taco' },
    { id: 'dessert', name: 'Dessert', icon: 'cake' },
  ];

  const featuredRestaurants = restaurants.slice(0, 3);
  const nearbyRestaurants = restaurants.slice(3, 9);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch restaurants data
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleRestaurantPress = (restaurantId: string) => {
    navigation.navigate('Restaurant', { restaurantId });
  };

  const handleQRScan = () => {
    navigation.navigate('QRScan');
  };

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality
    console.log('Search query:', query);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // TODO: Filter restaurants by category
  };

  return (
    <Container>
      <Header>
        <HeaderTop>
          <LocationContainer>
            <Icon name="location-on" size={20} color="#FFFFFF" />
            <LocationText variant="body" weight="medium">
              Accra, Ghana
            </LocationText>
            <Icon name="keyboard-arrow-down" size={20} color="#FFFFFF" />
          </LocationContainer>
          
          <NotificationButton>
            <Icon name="notifications" size={24} color="#FFFFFF" />
          </NotificationButton>
        </HeaderTop>

        <WelcomeContainer>
          <Text variant="h3" color="inverse" weight="bold">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
          </Text>
          <Text variant="body" color="inverse" style={{ opacity: 0.9 }}>
            {user?.name || 'Food Lover'}
          </Text>
        </WelcomeContainer>

        <SearchBar onSearch={handleSearch} />
      </Header>

      <Content
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Section>
          <QuickActionsContainer>
            <QuickActionButton onPress={handleQRScan}>
              <QuickActionIcon>
                <Icon name="qr-code-scanner" size={24} color="#2ECC71" />
              </QuickActionIcon>
              <Text variant="caption" weight="medium" align="center">
                Scan QR
              </Text>
            </QuickActionButton>

            <QuickActionButton>
              <QuickActionIcon>
                <Icon name="local-offer" size={24} color="#FF8C42" />
              </QuickActionIcon>
              <Text variant="caption" weight="medium" align="center">
                Offers
              </Text>
            </QuickActionButton>

            <QuickActionButton>
              <QuickActionIcon>
                <Icon name="stars" size={24} color="#F59E0B" />
              </QuickActionIcon>
              <Text variant="caption" weight="medium" align="center">
                Loyalty
              </Text>
            </QuickActionButton>
          </QuickActionsContainer>
        </Section>

        <Section>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Featured Restaurants</SectionTitle>
            <SeeAllButton>
              <SeeAllText variant="body" weight="medium">See All</SeeAllText>
              <Icon name="chevron-right" size={20} color="#2ECC71" />
            </SeeAllButton>
          </SectionHeader>
          
          <FeaturedCarousel
            restaurants={featuredRestaurants}
            onRestaurantPress={handleRestaurantPress}
          />
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Nearby Restaurants</SectionTitle>
            <SeeAllButton>
              <SeeAllText variant="body" weight="medium">See All</SeeAllText>
              <Icon name="chevron-right" size={20} color="#2ECC71" />
            </SeeAllButton>
          </SectionHeader>
          
          <RestaurantsGrid>
            {nearbyRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onPress={() => handleRestaurantPress(restaurant.id)}
                style={{ width: (width - 48) / 2 }}
              />
            ))}
          </RestaurantsGrid>
        </Section>
      </Content>
    </Container>
  );
};

export default HomeScreen;