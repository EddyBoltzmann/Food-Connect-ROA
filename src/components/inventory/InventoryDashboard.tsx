import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchIngredients, checkLowStock, setSelectedCategory, setSearchQuery } from '../../store/slices/inventorySlice';
import { Text } from '../common/Text';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ingredient } from '../../types';

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

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.base}px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const CategoryFilter = styled.ScrollView`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const CategoryChip = styled(TouchableOpacity)<{ selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.surface};
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border};
`;

const CategoryText = styled(Text)<{ selected: boolean }>`
  color: ${({ selected, theme }) => 
    selected ? theme.colors.neutral.white : theme.colors.text.primary};
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

const IngredientCard = styled(Card)<{ isLowStock: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  border-left-width: 4px;
  border-left-color: ${({ isLowStock, theme }) => 
    isLowStock ? theme.colors.status.warning : theme.colors.status.success};
`;

const IngredientHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const IngredientInfo = styled.View`
  flex: 1;
`;

const IngredientName = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-bottom: 4px;
`;

const IngredientCategory = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: capitalize;
`;

const StockInfo = styled.View`
  align-items: flex-end;
`;

const StockAmount = styled(Text)<{ isLowStock: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ isLowStock, theme }) => 
    isLowStock ? theme.colors.status.warning : theme.colors.text.primary};
`;

const StockUnit = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const LowStockBadge = styled.View`
  background-color: ${({ theme }) => theme.colors.status.warning}20;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  margin-top: 4px;
`;

const LowStockText = styled(Text)`
  color: ${({ theme }) => theme.colors.status.warning};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
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

const categories = [
  { id: 'all', name: 'All', icon: 'inventory' },
  { id: 'protein', name: 'Protein', icon: 'restaurant' },
  { id: 'vegetable', name: 'Vegetables', icon: 'eco' },
  { id: 'dairy', name: 'Dairy', icon: 'local-drink' },
  { id: 'grain', name: 'Grains', icon: 'grain' },
  { id: 'spice', name: 'Spices', icon: 'spa' },
  { id: 'beverage', name: 'Beverages', icon: 'local-bar' },
  { id: 'other', name: 'Other', icon: 'category' },
];

interface InventoryDashboardProps {
  restaurantId: string;
  onAddIngredient: () => void;
  onEditIngredient: (ingredient: Ingredient) => void;
}

const InventoryDashboard: React.FC<InventoryDashboardProps> = ({
  restaurantId,
  onAddIngredient,
  onEditIngredient,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { ingredients, isLoading, lowStockItems, selectedCategory, searchQuery } = useSelector(
    (state: RootState) => state.inventory
  );

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchIngredients(restaurantId));
    dispatch(checkLowStock(restaurantId));
  }, [dispatch, restaurantId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchIngredients(restaurantId)),
      dispatch(checkLowStock(restaurantId)),
    ]);
    setRefreshing(false);
  };

  const handleCategorySelect = (categoryId: string) => {
    dispatch(setSelectedCategory(categoryId === 'all' ? null : categoryId));
  };

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesCategory = !selectedCategory || ingredient.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalValue = ingredients.reduce((sum, ingredient) => 
    sum + (ingredient.currentStock * ingredient.costPerUnit), 0
  );

  return (
    <Container>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Header>
          <Text variant="h2" weight="bold">Inventory Management</Text>
          <Button
            title="Add Item"
            onPress={onAddIngredient}
            size="small"
            icon="add"
          />
        </Header>

        {/* Search Bar */}
        <SearchContainer>
          <Icon name="search" size={20} color="#9CA3AF" />
          <SearchInput
            placeholder="Search ingredients..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#9CA3AF"
          />
        </SearchContainer>

        {/* Category Filter */}
        <CategoryFilter horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              selected={selectedCategory === category.id || (!selectedCategory && category.id === 'all')}
              onPress={() => handleCategorySelect(category.id)}
            >
              <CategoryText selected={selectedCategory === category.id || (!selectedCategory && category.id === 'all')}>
                {category.name}
              </CategoryText>
            </CategoryChip>
          ))}
        </CategoryFilter>

        {/* Stats */}
        <StatsContainer>
          <StatCard>
            <StatValue>{ingredients.length}</StatValue>
            <StatLabel>Total Items</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{lowStockItems.length}</StatValue>
            <StatLabel>Low Stock</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>GHS {totalValue.toFixed(0)}</StatValue>
            <StatLabel>Total Value</StatLabel>
          </StatCard>
        </StatsContainer>

        {/* Ingredients List */}
        {filteredIngredients.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <Icon name="inventory" size={40} color="#9CA3AF" />
            </EmptyIcon>
            <Text variant="h3" color="secondary" style={{ marginBottom: 16 }}>
              {searchQuery ? 'No ingredients found' : 'No ingredients yet'}
            </Text>
            <Text variant="body" color="secondary" align="center" style={{ marginBottom: 24 }}>
              {searchQuery ? 'Try adjusting your search terms' : 'Add your first ingredient to get started'}
            </Text>
            {!searchQuery && (
              <Button
                title="Add First Ingredient"
                onPress={onAddIngredient}
                fullWidth
              />
            )}
          </EmptyState>
        ) : (
          filteredIngredients.map((ingredient) => (
            <IngredientCard
              key={ingredient.id}
              isLowStock={ingredient.isLowStock}
              onPress={() => onEditIngredient(ingredient)}
            >
              <IngredientHeader>
                <IngredientInfo>
                  <IngredientName>{ingredient.name}</IngredientName>
                  <IngredientCategory>{ingredient.category}</IngredientCategory>
                </IngredientInfo>
                <StockInfo>
                  <StockAmount isLowStock={ingredient.isLowStock}>
                    {ingredient.currentStock}
                  </StockAmount>
                  <StockUnit>{ingredient.unit}</StockUnit>
                  {ingredient.isLowStock && (
                    <LowStockBadge>
                      <LowStockText>Low Stock</LowStockText>
                    </LowStockBadge>
                  )}
                </StockInfo>
              </IngredientHeader>
            </IngredientCard>
          ))
        )}
      </ScrollView>
    </Container>
  );
};

export default InventoryDashboard;