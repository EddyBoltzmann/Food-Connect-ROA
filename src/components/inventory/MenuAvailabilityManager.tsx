import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchIngredients } from '../../store/slices/inventorySlice';
import { Text } from '../common/Text';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MenuItem, Ingredient } from '../../types';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MenuItemCard = styled(Card)<{ isAvailable: boolean; hasLowStock: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  border-left-width: 4px;
  border-left-color: ${({ isAvailable, hasLowStock, theme }) => {
    if (!isAvailable) return theme.colors.status.error;
    if (hasLowStock) return theme.colors.status.warning;
    return theme.colors.status.success;
  }};
`;

const MenuItemHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const MenuItemInfo = styled.View`
  flex: 1;
`;

const MenuItemName = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-bottom: 4px;
`;

const MenuItemPrice = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const AvailabilityToggle = styled(TouchableOpacity)<{ isAvailable: boolean }>`
  width: 50px;
  height: 30px;
  border-radius: 15px;
  background-color: ${({ isAvailable, theme }) => 
    isAvailable ? theme.colors.status.success : theme.colors.neutral.lightGray};
  justify-content: center;
  align-items: ${({ isAvailable }) => isAvailable ? 'flex-end' : 'flex-start'};
  padding: 2px;
`;

const ToggleThumb = styled.View`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  background-color: ${({ theme }) => theme.colors.neutral.white};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 2px;
  elevation: 2;
`;

const StatusBadge = styled.View<{ type: 'available' | 'low-stock' | 'unavailable' }>`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  margin-top: 8px;
  align-self: flex-start;
`;

const StatusText = styled(Text)<{ type: 'available' | 'low-stock' | 'unavailable' }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ type, theme }) => {
    switch (type) {
      case 'available':
        return theme.colors.status.success;
      case 'low-stock':
        return theme.colors.status.warning;
      case 'unavailable':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  }};
`;

const IngredientsList = styled.View`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const IngredientItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs}px 0;
`;

const IngredientName = styled(Text)`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const IngredientStatus = styled.View<{ isAvailable: boolean; isLowStock: boolean }>`
  flex-direction: row;
  align-items: center;
`;

const StatusIcon = styled(Icon)<{ isAvailable: boolean; isLowStock: boolean }>`
  margin-right: 4px;
`;

const BulkActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const BulkActionButton = styled(Button)`
  flex: 0.48;
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

interface MenuAvailabilityManagerProps {
  restaurantId: string;
  menuItems: MenuItem[];
  onUpdateAvailability: (menuItemId: string, isAvailable: boolean) => void;
}

const MenuAvailabilityManager: React.FC<MenuAvailabilityManagerProps> = ({
  restaurantId,
  menuItems,
  onUpdateAvailability,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { ingredients } = useSelector((state: RootState) => state.inventory);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchIngredients(restaurantId));
  }, [dispatch, restaurantId]);

  const checkIngredientAvailability = (ingredientId: string, requiredQuantity: number): { isAvailable: boolean; isLowStock: boolean } => {
    const ingredient = ingredients.find(ing => ing.id === ingredientId);
    if (!ingredient) {
      return { isAvailable: false, isLowStock: false };
    }

    const isAvailable = ingredient.currentStock >= requiredQuantity;
    const isLowStock = ingredient.isLowStock;

    return { isAvailable, isLowStock };
  };

  const getMenuItemStatus = (menuItem: MenuItem): { status: 'available' | 'low-stock' | 'unavailable'; canMake: boolean; missingIngredients: string[] } => {
    const missingIngredients: string[] = [];
    let hasLowStock = false;
    let canMake = true;

    menuItem.ingredients.forEach(ingredient => {
      const { isAvailable, isLowStock } = checkIngredientAvailability(ingredient.ingredientId, ingredient.quantity);
      
      if (!isAvailable && ingredient.isRequired) {
        canMake = false;
        missingIngredients.push(ingredient.ingredientName);
      }
      
      if (isLowStock) {
        hasLowStock = true;
      }
    });

    if (!menuItem.isAvailable) {
      return { status: 'unavailable', canMake: false, missingIngredients };
    }

    if (!canMake) {
      return { status: 'unavailable', canMake: false, missingIngredients };
    }

    if (hasLowStock) {
      return { status: 'low-stock', canMake: true, missingIngredients };
    }

    return { status: 'available', canMake: true, missingIngredients };
  };

  const handleToggleAvailability = (menuItemId: string, currentAvailability: boolean) => {
    onUpdateAvailability(menuItemId, !currentAvailability);
  };

  const handleBulkAction = (action: 'enable' | 'disable') => {
    if (selectedItems.length === 0) {
      Alert.alert('No Selection', 'Please select menu items first');
      return;
    }

    const actionText = action === 'enable' ? 'enable' : 'disable';
    Alert.alert(
      'Bulk Action',
      `Are you sure you want to ${actionText} ${selectedItems.length} menu item(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            selectedItems.forEach(itemId => {
              onUpdateAvailability(itemId, action === 'enable');
            });
            setSelectedItems([]);
          },
        },
      ]
    );
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const availableItems = menuItems.filter(item => getMenuItemStatus(item).status === 'available').length;
  const lowStockItems = menuItems.filter(item => getMenuItemStatus(item).status === 'low-stock').length;
  const unavailableItems = menuItems.filter(item => getMenuItemStatus(item).status === 'unavailable').length;

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <Card style={{ flex: 1, alignItems: 'center', padding: 16, margin: 4 }}>
            <Text variant="h3" weight="bold" color="success">{availableItems}</Text>
            <Text variant="caption" color="secondary">Available</Text>
          </Card>
          <Card style={{ flex: 1, alignItems: 'center', padding: 16, margin: 4 }}>
            <Text variant="h3" weight="bold" color="warning">{lowStockItems}</Text>
            <Text variant="caption" color="secondary">Low Stock</Text>
          </Card>
          <Card style={{ flex: 1, alignItems: 'center', padding: 16, margin: 4 }}>
            <Text variant="h3" weight="bold" color="error">{unavailableItems}</Text>
            <Text variant="caption" color="secondary">Unavailable</Text>
          </Card>
        </View>

        {/* Bulk Actions */}
        <BulkActions>
          <BulkActionButton
            title="Enable Selected"
            onPress={() => handleBulkAction('enable')}
            variant="outline"
            disabled={selectedItems.length === 0}
          />
          <BulkActionButton
            title="Disable Selected"
            onPress={() => handleBulkAction('disable')}
            variant="outline"
            disabled={selectedItems.length === 0}
          />
        </BulkActions>

        {/* Menu Items */}
        {menuItems.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <Icon name="restaurant-menu" size={40} color="#9CA3AF" />
            </EmptyIcon>
            <Text variant="h3" color="secondary" style={{ marginBottom: 16 }}>
              No menu items found
            </Text>
            <Text variant="body" color="secondary" align="center">
              Add menu items to manage their availability
            </Text>
          </EmptyState>
        ) : (
          menuItems.map((menuItem) => {
            const { status, canMake, missingIngredients } = getMenuItemStatus(menuItem);
            const isSelected = selectedItems.includes(menuItem.id);

            return (
              <MenuItemCard
                key={menuItem.id}
                isAvailable={menuItem.isAvailable}
                hasLowStock={status === 'low-stock'}
                onPress={() => handleSelectItem(menuItem.id)}
                style={{
                  backgroundColor: isSelected ? '#2ECC7120' : undefined,
                  borderColor: isSelected ? '#2ECC71' : undefined,
                }}
              >
                <MenuItemHeader>
                  <MenuItemInfo>
                    <MenuItemName>{menuItem.name}</MenuItemName>
                    <MenuItemPrice>GHS {menuItem.price.toFixed(2)}</MenuItemPrice>
                    <StatusBadge type={status}>
                      <StatusText type={status}>
                        {status === 'available' ? 'Available' :
                         status === 'low-stock' ? 'Low Stock' : 'Unavailable'}
                      </StatusText>
                    </StatusBadge>
                  </MenuItemInfo>
                  <AvailabilityToggle
                    isAvailable={menuItem.isAvailable}
                    onPress={() => handleToggleAvailability(menuItem.id, menuItem.isAvailable)}
                  >
                    <ToggleThumb />
                  </AvailabilityToggle>
                </MenuItemHeader>

                {menuItem.ingredients.length > 0 && (
                  <IngredientsList>
                    <Text variant="caption" color="secondary" style={{ marginBottom: 8 }}>
                      Ingredients:
                    </Text>
                    {menuItem.ingredients.map((ingredient, index) => {
                      const { isAvailable, isLowStock } = checkIngredientAvailability(
                        ingredient.ingredientId, 
                        ingredient.quantity
                      );
                      
                      return (
                        <IngredientItem key={index}>
                          <IngredientName>
                            {ingredient.ingredientName} ({ingredient.quantity} {ingredient.unit})
                          </IngredientName>
                          <IngredientStatus isAvailable={isAvailable} isLowStock={isLowStock}>
                            <StatusIcon
                              name={isAvailable ? 'check-circle' : 'cancel'}
                              size={16}
                              color={isAvailable ? (isLowStock ? '#F59E0B' : '#10B981') : '#EF4444'}
                              isAvailable={isAvailable}
                              isLowStock={isLowStock}
                            />
                          </IngredientStatus>
                        </IngredientItem>
                      );
                    })}
                  </IngredientsList>
                )}

                {missingIngredients.length > 0 && (
                  <View style={{ marginTop: 8, padding: 8, backgroundColor: '#FEF2F2', borderRadius: 8 }}>
                    <Text variant="caption" color="error" weight="medium">
                      Missing: {missingIngredients.join(', ')}
                    </Text>
                  </View>
                )}
              </MenuItemCard>
            );
          })
        )}
      </ScrollView>
    </Container>
  );
};

export default MenuAvailabilityManager;