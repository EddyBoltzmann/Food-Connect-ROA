import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, Animated, Easing, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { Text } from '../../components/common/Text';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MenuItem } from '../../types';

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

const MenuItemCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
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

const MenuItemDescription = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const MenuItemActions = styled.View`
  flex-direction: row;
  align-items: center;
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
  margin-right: ${({ theme }) => theme.spacing.md}px;
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

const ActionButton = styled(TouchableOpacity)`
  padding: ${({ theme }) => theme.spacing.sm}px;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const AddMenuItemModal = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-height: 80%;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const ModalTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const CloseButton = styled(TouchableOpacity)`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.neutral.lightGray};
  justify-content: center;
  align-items: center;
`;

const FormSection = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const HalfWidth = styled.View`
  flex: 0.48;
`;

const CategoryGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const CategoryOption = styled(TouchableOpacity)<{ selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary + '20' : theme.colors.surface};
  border-width: 1px;
  border-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border};
`;

const CategoryText = styled(Text)<{ selected: boolean }>`
  color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.text.primary};
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
  'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Salads', 'Soups', 'Pizza', 'Pasta'
];

const MenuManagementScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    preparationTime: '',
    image: '',
  });
  
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAddMenuItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      preparationTime: '',
      image: '',
    });
    setShowAddModal(true);
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      preparationTime: item.preparationTime.toString(),
      image: item.image,
    });
    setShowAddModal(true);
  };

  const handleSaveMenuItem = () => {
    if (!formData.name || !formData.price || !formData.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newItem: MenuItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image || 'https://via.placeholder.com/300x200',
      category: formData.category,
      dietaryTags: [],
      customizations: [],
      isAvailable: true,
      preparationTime: parseInt(formData.preparationTime) || 15,
      order: menuItems.length + 1,
      ingredients: [],
      isLowStock: false,
      createdAt: editingItem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingItem) {
      setMenuItems(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
    } else {
      setMenuItems(prev => [...prev, newItem]);
    }

    setShowAddModal(false);
    setEditingItem(null);
  };

  const handleDeleteMenuItem = (itemId: string) => {
    Alert.alert(
      'Delete Menu Item',
      'Are you sure you want to delete this menu item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setMenuItems(prev => prev.filter(item => item.id !== itemId)),
        },
      ]
    );
  };

  const handleToggleAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnimation }}>
          <Header>
            <Text variant="h2" weight="bold">Menu Management</Text>
            <Button
              title="Add Item"
              onPress={handleAddMenuItem}
              icon="add"
            />
          </Header>

          {menuItems.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <Icon name="restaurant-menu" size={40} color="#9CA3AF" />
              </EmptyIcon>
              <Text variant="h3" color="secondary" style={{ marginBottom: 16 }}>
                No menu items yet
              </Text>
              <Text variant="body" color="secondary" align="center" style={{ marginBottom: 24 }}>
                Add your first menu item to get started
              </Text>
              <Button
                title="Add First Menu Item"
                onPress={handleAddMenuItem}
                fullWidth
              />
            </EmptyState>
          ) : (
            menuItems.map((item) => (
              <MenuItemCard key={item.id}>
                <MenuItemHeader>
                  <MenuItemInfo>
                    <MenuItemName>{item.name}</MenuItemName>
                    <MenuItemPrice>GHS {item.price.toFixed(2)}</MenuItemPrice>
                    <MenuItemDescription>{item.description}</MenuItemDescription>
                  </MenuItemInfo>
                  <MenuItemActions>
                    <AvailabilityToggle
                      isAvailable={item.isAvailable}
                      onPress={() => handleToggleAvailability(item.id)}
                    >
                      <ToggleThumb />
                    </AvailabilityToggle>
                    <ActionButton onPress={() => handleEditMenuItem(item)}>
                      <Icon name="edit" size={20} color="#3B82F6" />
                    </ActionButton>
                    <ActionButton onPress={() => handleDeleteMenuItem(item.id)}>
                      <Icon name="delete" size={20} color="#EF4444" />
                    </ActionButton>
                  </MenuItemActions>
                </MenuItemHeader>
              </MenuItemCard>
            ))
          )}
        </Animated.View>
      </ScrollView>

      {/* Add/Edit Menu Item Modal */}
      {showAddModal && (
        <AddMenuItemModal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </ModalTitle>
              <CloseButton onPress={() => setShowAddModal(false)}>
                <Icon name="close" size={20} color="#9CA3AF" />
              </CloseButton>
            </ModalHeader>

            <FormSection>
              <SectionTitle>Basic Information</SectionTitle>
              
              <Input
                label="Item Name"
                placeholder="Enter item name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                leftIcon="restaurant-menu"
              />

              <Input
                label="Description"
                placeholder="Enter item description"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                leftIcon="description"
              />

              <Row>
                <HalfWidth>
                  <Input
                    label="Price (GHS)"
                    placeholder="0.00"
                    value={formData.price}
                    onChangeText={(text) => setFormData({ ...formData, price: text })}
                    keyboardType="numeric"
                    leftIcon="attach-money"
                  />
                </HalfWidth>
                <HalfWidth>
                  <Input
                    label="Prep Time (min)"
                    placeholder="15"
                    value={formData.preparationTime}
                    onChangeText={(text) => setFormData({ ...formData, preparationTime: text })}
                    keyboardType="numeric"
                    leftIcon="schedule"
                  />
                </HalfWidth>
              </Row>

              <Input
                label="Image URL (Optional)"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChangeText={(text) => setFormData({ ...formData, image: text })}
                leftIcon="image"
              />
            </FormSection>

            <FormSection>
              <SectionTitle>Category</SectionTitle>
              <CategoryGrid>
                {categories.map((category) => (
                  <CategoryOption
                    key={category}
                    selected={formData.category === category}
                    onPress={() => setFormData({ ...formData, category })}
                  >
                    <CategoryText selected={formData.category === category}>
                      {category}
                    </CategoryText>
                  </CategoryOption>
                ))}
              </CategoryGrid>
            </FormSection>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <Button
                title="Cancel"
                onPress={() => setShowAddModal(false)}
                variant="outline"
                style={{ flex: 0.48 }}
              />
              <Button
                title={editingItem ? 'Update' : 'Add Item'}
                onPress={handleSaveMenuItem}
                style={{ flex: 0.48 }}
              />
            </View>
          </ModalContent>
        </AddMenuItemModal>
      )}
    </Container>
  );
};

export default MenuManagementScreen;