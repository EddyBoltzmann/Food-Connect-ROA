import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, Animated, Easing, TouchableOpacity, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState, AppDispatch } from '../../store';
import { fetchIngredients } from '../../store/slices/inventorySlice';
import { Text } from '../../components/common/Text';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InventoryDashboard from '../../components/inventory/InventoryDashboard';
import IngredientForm from '../../components/inventory/IngredientForm';
import MenuAvailabilityManager from '../../components/inventory/MenuAvailabilityManager';
import OrderManagementScreen from './OrderManagementScreen';
import AnalyticsScreen from './AnalyticsScreen';
import RestaurantSettingsScreen from './RestaurantSettingsScreen';
import { Ingredient, MenuItem, RootStackParamList } from '../../types';

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

const WelcomeCard = styled(Card)`
  background: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%);
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const WelcomeContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const WelcomeText = styled.View`
  flex: 1;
`;

const WelcomeTitle = styled(Text)`
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: 4px;
`;

const WelcomeSubtitle = styled(Text)`
  color: rgba(255, 255, 255, 0.9);
  font-size: ${({ theme }) => theme.typography.fontSize.base}px;
`;

const RestaurantIcon = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.2);
  justify-content: center;
  align-items: center;
`;

const TabContainer = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: 4px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const Tab = styled(TouchableOpacity)<{ active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary : 'transparent'};
  align-items: center;
`;

const TabText = styled(Text)<{ active: boolean }>`
  color: ${({ active, theme }) => 
    active ? theme.colors.neutral.white : theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StatsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StatCard = styled(Card)`
  flex: 1;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin: 0 ${({ theme }) => theme.spacing.xs}px;
`;

const StatValue = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

const StatLabel = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

const QuickActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const ActionButton = styled(TouchableOpacity)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin: 0 ${({ theme }) => theme.spacing.xs}px;
  align-items: center;
`;

const ActionIcon = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.primary}20;
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const ActionText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-align: center;
`;

const RecentActivity = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const ActivityItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const ActivityIcon = styled.View<{ type: 'warning' | 'success' | 'info' }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'warning':
        return theme.colors.status.warning + '20';
      case 'success':
        return theme.colors.status.success + '20';
      case 'info':
        return theme.colors.status.info + '20';
      default:
        return theme.colors.neutral.lightGray;
    }
  }};
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const ActivityText = styled(Text)`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const ActivityTime = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

type TabType = 'overview' | 'inventory' | 'menu' | 'orders' | 'analytics' | 'settings';

type RestaurantOwnerDashboardNavigationProp = StackNavigationProp<RootStackParamList>;

const RestaurantOwnerDashboard: React.FC = () => {
  const navigation = useNavigation<RestaurantOwnerDashboardNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { ingredients, lowStockItems } = useSelector((state: RootState) => state.inventory);
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  // Mock data for demonstration
  const mockMenuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato and mozzarella',
      price: 16.99,
      image: 'https://example.com/pizza.jpg',
      category: 'Main Course',
      dietaryTags: [],
      customizations: [],
      isAvailable: true,
      preparationTime: 20,
      order: 1,
      ingredients: [
        { ingredientId: '1', ingredientName: 'Pizza Dough', quantity: 1, unit: 'piece', isRequired: true },
        { ingredientId: '2', ingredientName: 'Tomato Sauce', quantity: 2, unit: 'tbsp', isRequired: true },
        { ingredientId: '3', ingredientName: 'Mozzarella', quantity: 100, unit: 'g', isRequired: true },
      ],
      isLowStock: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with caesar dressing',
      price: 12.99,
      image: 'https://example.com/salad.jpg',
      category: 'Salads',
      dietaryTags: [],
      customizations: [],
      isAvailable: true,
      preparationTime: 10,
      order: 2,
      ingredients: [
        { ingredientId: '4', ingredientName: 'Romaine Lettuce', quantity: 1, unit: 'head', isRequired: true },
        { ingredientId: '5', ingredientName: 'Caesar Dressing', quantity: 3, unit: 'tbsp', isRequired: true },
        { ingredientId: '6', ingredientName: 'Parmesan Cheese', quantity: 50, unit: 'g', isRequired: false },
      ],
      isLowStock: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  const mockRecentActivity = [
    { id: '1', type: 'warning', text: 'Tomatoes are running low (5kg remaining)', time: '2 hours ago' },
    { id: '2', type: 'success', text: 'New order received: #ORD-001', time: '3 hours ago' },
    { id: '3', type: 'info', text: 'Menu item "Caesar Salad" updated', time: '5 hours ago' },
    { id: '4', type: 'success', text: 'Inventory restocked: Mozzarella (20kg)', time: '1 day ago' },
  ];

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Fetch ingredients when component mounts
    if (user?.id) {
      dispatch(fetchIngredients(user.id));
    }
  }, [dispatch, user?.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (user?.id) {
      await dispatch(fetchIngredients(user.id));
    }
    setRefreshing(false);
  };

  const handleAddIngredient = () => {
    setEditingIngredient(undefined);
    setShowIngredientForm(true);
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setShowIngredientForm(true);
  };

  const handleSaveIngredient = () => {
    setShowIngredientForm(false);
    setEditingIngredient(undefined);
  };

  const handleCancelIngredient = () => {
    setShowIngredientForm(false);
    setEditingIngredient(undefined);
  };

  const handleUpdateMenuAvailability = (menuItemId: string, isAvailable: boolean) => {
    console.log(`Updating menu item ${menuItemId} availability to ${isAvailable}`);
  };

  const totalValue = ingredients.reduce((sum, ingredient) => 
    sum + (ingredient.currentStock * ingredient.costPerUnit), 0
  );

  const availableMenuItems = mockMenuItems.filter(item => item.isAvailable).length;

  if (showIngredientForm) {
    return (
      <IngredientForm
        ingredient={editingIngredient}
        onSave={handleSaveIngredient}
        onCancel={handleCancelIngredient}
      />
    );
  }

  return (
    <Container>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnimation }}>
          <Header>
            <Text variant="h2" weight="bold">Dashboard</Text>
            <Button
              title="Settings"
              variant="outline"
              size="small"
              icon="settings"
              onPress={() => navigation.navigate('RestaurantSettings')}
            />
          </Header>

          {/* Welcome Card */}
          <WelcomeCard>
            <WelcomeContent>
              <WelcomeText>
                <WelcomeTitle>Welcome back, {user?.name || 'Restaurant Owner'}!</WelcomeTitle>
                <WelcomeSubtitle>Manage your restaurant efficiently</WelcomeSubtitle>
              </WelcomeText>
              <RestaurantIcon>
                <Icon name="restaurant" size={30} color="#FFFFFF" />
              </RestaurantIcon>
            </WelcomeContent>
          </WelcomeCard>

          {/* Tab Navigation */}
          <TabContainer>
            <Tab active={activeTab === 'overview'} onPress={() => setActiveTab('overview')}>
              <TabText active={activeTab === 'overview'}>Overview</TabText>
            </Tab>
            <Tab active={activeTab === 'inventory'} onPress={() => setActiveTab('inventory')}>
              <TabText active={activeTab === 'inventory'}>Inventory</TabText>
            </Tab>
            <Tab active={activeTab === 'menu'} onPress={() => setActiveTab('menu')}>
              <TabText active={activeTab === 'menu'}>Menu</TabText>
            </Tab>
            <Tab active={activeTab === 'orders'} onPress={() => setActiveTab('orders')}>
              <TabText active={activeTab === 'orders'}>Orders</TabText>
            </Tab>
            <Tab active={activeTab === 'analytics'} onPress={() => setActiveTab('analytics')}>
              <TabText active={activeTab === 'analytics'}>Analytics</TabText>
            </Tab>
          </TabContainer>

          {activeTab === 'overview' && (
            <>
              {/* Stats */}
              <StatsContainer>
                <StatCard>
                  <StatValue>{ingredients.length}</StatValue>
                  <StatLabel>Ingredients</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{lowStockItems.length}</StatValue>
                  <StatLabel>Low Stock</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{availableMenuItems}</StatValue>
                  <StatLabel>Menu Items</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>GHS {totalValue.toFixed(0)}</StatValue>
                  <StatLabel>Inventory Value</StatLabel>
                </StatCard>
              </StatsContainer>

              {/* Quick Actions */}
              <QuickActions>
                <ActionButton onPress={() => setActiveTab('inventory')}>
                  <ActionIcon>
                    <Icon name="inventory" size={24} color="#2ECC71" />
                  </ActionIcon>
                  <ActionText>Manage Inventory</ActionText>
                </ActionButton>
                <ActionButton onPress={() => setActiveTab('menu')}>
                  <ActionIcon>
                    <Icon name="restaurant-menu" size={24} color="#2ECC71" />
                  </ActionIcon>
                  <ActionText>Menu Items</ActionText>
                </ActionButton>
                <ActionButton onPress={() => setActiveTab('orders')}>
                  <ActionIcon>
                    <Icon name="receipt" size={24} color="#2ECC71" />
                  </ActionIcon>
                  <ActionText>View Orders</ActionText>
                </ActionButton>
              </QuickActions>

              {/* Recent Activity */}
              <RecentActivity>
                <Text variant="h3" weight="semiBold" style={{ marginBottom: 16 }}>
                  Recent Activity
                </Text>
                {mockRecentActivity.map((activity) => (
                  <ActivityItem key={activity.id}>
                    <ActivityIcon type={activity.type as any}>
                      <Icon 
                        name={
                          activity.type === 'warning' ? 'warning' :
                          activity.type === 'success' ? 'check-circle' : 'info'
                        } 
                        size={16} 
                        color={
                          activity.type === 'warning' ? '#F59E0B' :
                          activity.type === 'success' ? '#10B981' : '#3B82F6'
                        } 
                      />
                    </ActivityIcon>
                    <ActivityText>{activity.text}</ActivityText>
                    <ActivityTime>{activity.time}</ActivityTime>
                  </ActivityItem>
                ))}
              </RecentActivity>
            </>
          )}

          {activeTab === 'inventory' && (
            <InventoryDashboard
              restaurantId={user?.id || ''}
              onAddIngredient={handleAddIngredient}
              onEditIngredient={handleEditIngredient}
            />
          )}

          {activeTab === 'menu' && (
            <MenuAvailabilityManager
              restaurantId={user?.id || ''}
              menuItems={mockMenuItems}
              onUpdateAvailability={handleUpdateMenuAvailability}
            />
          )}

          {activeTab === 'orders' && (
            <OrderManagementScreen />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsScreen />
          )}

          {activeTab === 'settings' && (
            <RestaurantSettingsScreen />
          )}
        </Animated.View>
      </ScrollView>
    </Container>
  );
};

export default RestaurantOwnerDashboard;