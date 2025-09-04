import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, Animated, Easing, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchIngredients } from '../store/slices/inventorySlice';
import { Text } from '../components/common/Text';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InventoryDashboard from '../components/inventory/InventoryDashboard';
import IngredientForm from '../components/inventory/IngredientForm';
import MenuAvailabilityManager from '../components/inventory/MenuAvailabilityManager';
import { Ingredient, MenuItem } from '../types';

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

type TabType = 'overview' | 'inventory' | 'menu' | 'orders';

const RestaurantDashboardScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { ingredients, lowStockItems } = useSelector((state: RootState) => state.inventory);
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | undefined>();
  
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
    // This would typically update the menu item availability in the backend
    console.log(`Updating menu item ${menuItemId} availability to ${isAvailable}`);
  };

  const totalValue = ingredients.reduce((sum, ingredient) => 
    sum + (ingredient.currentStock * ingredient.costPerUnit), 0
  );

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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnimation }}>
          <Header>
            <Text variant="h2" weight="bold">Restaurant Dashboard</Text>
            <Button
              title="Settings"
              variant="outline"
              size="small"
              icon="settings"
            />
          </Header>

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
          </TabContainer>

          {activeTab === 'overview' && (
            <>
              {/* Stats */}
              <StatsContainer>
                <StatCard>
                  <StatValue>{ingredients.length}</StatValue>
                  <StatLabel>Total Ingredients</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{lowStockItems.length}</StatValue>
                  <StatLabel>Low Stock</StatLabel>
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
                  <ActionText>Menu Availability</ActionText>
                </ActionButton>
                <ActionButton onPress={() => setActiveTab('orders')}>
                  <ActionIcon>
                    <Icon name="receipt" size={24} color="#2ECC71" />
                  </ActionIcon>
                  <ActionText>View Orders</ActionText>
                </ActionButton>
              </QuickActions>

              {/* Recent Activity */}
              <Card>
                <Text variant="h3" weight="semiBold" style={{ marginBottom: 16 }}>
                  Recent Activity
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Icon name="warning" size={20} color="#F59E0B" />
                  <Text variant="body" style={{ marginLeft: 8 }}>
                    {lowStockItems.length} ingredients are low in stock
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Icon name="restaurant" size={20} color="#10B981" />
                  <Text variant="body" style={{ marginLeft: 8 }}>
                    {mockMenuItems.filter(item => item.isAvailable).length} menu items available
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="trending-up" size={20} color="#3B82F6" />
                  <Text variant="body" style={{ marginLeft: 8 }}>
                    Inventory value: GHS {totalValue.toFixed(2)}
                  </Text>
                </View>
              </Card>
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
            <Card>
              <Text variant="h3" weight="semiBold" style={{ marginBottom: 16 }}>
                Recent Orders
              </Text>
              <Text variant="body" color="secondary">
                Order management functionality coming soon...
              </Text>
            </Card>
          )}
        </Animated.View>
      </ScrollView>
    </Container>
  );
};

export default RestaurantDashboardScreen;