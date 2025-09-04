import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { addIngredient, updateIngredient } from '../../store/slices/inventorySlice';
import { Text } from '../common/Text';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ingredient } from '../../types';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const FormContainer = styled(ScrollView)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const Section = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const CategoryGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const CategoryOption = styled(TouchableOpacity)<{ selected: boolean }>`
  flex: 1;
  min-width: 45%;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary + '20' : theme.colors.surface};
  border-width: 2px;
  border-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border};
  align-items: center;
`;

const CategoryIcon = styled.View<{ selected: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.neutral.lightGray};
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const CategoryName = styled(Text)<{ selected: boolean }>`
  color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-align: center;
`;

const UnitGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const UnitOption = styled(TouchableOpacity)<{ selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.surface};
  border-width: 1px;
  border-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border};
`;

const UnitText = styled(Text)<{ selected: boolean }>`
  color: ${({ selected, theme }) => 
    selected ? theme.colors.neutral.white : theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const HalfWidth = styled.View`
  flex: 0.48;
`;

const WarningNote = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.status.warning}20;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const WarningText = styled(Text)`
  color: ${({ theme }) => theme.colors.status.warning};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
  flex: 1;
`;

const categories = [
  { id: 'protein', name: 'Protein', icon: 'restaurant' },
  { id: 'vegetable', name: 'Vegetables', icon: 'eco' },
  { id: 'dairy', name: 'Dairy', icon: 'local-drink' },
  { id: 'grain', name: 'Grains', icon: 'grain' },
  { id: 'spice', name: 'Spices', icon: 'spa' },
  { id: 'beverage', name: 'Beverages', icon: 'local-bar' },
  { id: 'other', name: 'Other', icon: 'category' },
];

const units = [
  { id: 'kg', name: 'Kilograms' },
  { id: 'g', name: 'Grams' },
  { id: 'l', name: 'Liters' },
  { id: 'ml', name: 'Milliliters' },
  { id: 'pieces', name: 'Pieces' },
  { id: 'cups', name: 'Cups' },
  { id: 'tbsp', name: 'Tablespoons' },
  { id: 'tsp', name: 'Teaspoons' },
];

interface IngredientFormProps {
  ingredient?: Ingredient;
  onSave: () => void;
  onCancel: () => void;
}

const IngredientForm: React.FC<IngredientFormProps> = ({
  ingredient,
  onSave,
  onCancel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.inventory);

  const [formData, setFormData] = useState({
    name: ingredient?.name || '',
    category: ingredient?.category || 'other',
    unit: ingredient?.unit || 'pieces',
    currentStock: ingredient?.currentStock?.toString() || '0',
    minimumStock: ingredient?.minimumStock?.toString() || '0',
    costPerUnit: ingredient?.costPerUnit?.toString() || '0',
    supplier: ingredient?.supplier || '',
    expiryDate: ingredient?.expiryDate || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ingredient name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.unit) {
      newErrors.unit = 'Please select a unit';
    }

    const currentStock = parseFloat(formData.currentStock);
    if (isNaN(currentStock) || currentStock < 0) {
      newErrors.currentStock = 'Please enter a valid stock amount';
    }

    const minimumStock = parseFloat(formData.minimumStock);
    if (isNaN(minimumStock) || minimumStock < 0) {
      newErrors.minimumStock = 'Please enter a valid minimum stock';
    }

    const costPerUnit = parseFloat(formData.costPerUnit);
    if (isNaN(costPerUnit) || costPerUnit < 0) {
      newErrors.costPerUnit = 'Please enter a valid cost per unit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const ingredientData = {
        name: formData.name.trim(),
        category: formData.category as any,
        unit: formData.unit as any,
        currentStock: parseFloat(formData.currentStock),
        minimumStock: parseFloat(formData.minimumStock),
        costPerUnit: parseFloat(formData.costPerUnit),
        supplier: formData.supplier.trim() || undefined,
        expiryDate: formData.expiryDate || undefined,
      };

      if (ingredient) {
        await dispatch(updateIngredient({ id: ingredient.id, updates: ingredientData })).unwrap();
      } else {
        await dispatch(addIngredient(ingredientData)).unwrap();
      }

      onSave();
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to save ingredient');
    }
  };

  const isLowStock = parseFloat(formData.currentStock) <= parseFloat(formData.minimumStock);

  return (
    <Container>
      <FormContainer showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <Section>
          <SectionTitle>Basic Information</SectionTitle>
          
          <Input
            label="Ingredient Name"
            placeholder="e.g., Chicken Breast, Tomatoes"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            error={errors.name}
            leftIcon="inventory"
          />

          <Text variant="body" weight="medium" style={{ marginBottom: 12, marginTop: 16 }}>
            Category
          </Text>
          <CategoryGrid>
            {categories.map((category) => (
              <CategoryOption
                key={category.id}
                selected={formData.category === category.id}
                onPress={() => setFormData({ ...formData, category: category.id })}
              >
                <CategoryIcon selected={formData.category === category.id}>
                  <Icon 
                    name={category.icon} 
                    size={20} 
                    color={formData.category === category.id ? '#FFFFFF' : '#9CA3AF'} 
                  />
                </CategoryIcon>
                <CategoryName selected={formData.category === category.id}>
                  {category.name}
                </CategoryName>
              </CategoryOption>
            ))}
          </CategoryGrid>
        </Section>

        {/* Stock Information */}
        <Section>
          <SectionTitle>Stock Information</SectionTitle>
          
          <Text variant="body" weight="medium" style={{ marginBottom: 12 }}>
            Unit of Measurement
          </Text>
          <UnitGrid>
            {units.map((unit) => (
              <UnitOption
                key={unit.id}
                selected={formData.unit === unit.id}
                onPress={() => setFormData({ ...formData, unit: unit.id })}
              >
                <UnitText selected={formData.unit === unit.id}>
                  {unit.name}
                </UnitText>
              </UnitOption>
            ))}
          </UnitGrid>

          <Row style={{ marginTop: 16 }}>
            <HalfWidth>
              <Input
                label="Current Stock"
                placeholder="0"
                value={formData.currentStock}
                onChangeText={(text) => setFormData({ ...formData, currentStock: text })}
                error={errors.currentStock}
                keyboardType="numeric"
                leftIcon="inventory"
              />
            </HalfWidth>
            <HalfWidth>
              <Input
                label="Minimum Stock"
                placeholder="0"
                value={formData.minimumStock}
                onChangeText={(text) => setFormData({ ...formData, minimumStock: text })}
                error={errors.minimumStock}
                keyboardType="numeric"
                leftIcon="warning"
              />
            </HalfWidth>
          </Row>

          {isLowStock && (
            <WarningNote>
              <Icon name="warning" size={20} color="#F59E0B" />
              <WarningText>
                Current stock is at or below minimum stock level. This ingredient will be marked as low stock.
              </WarningText>
            </WarningNote>
          )}
        </Section>

        {/* Cost Information */}
        <Section>
          <SectionTitle>Cost Information</SectionTitle>
          
          <Input
            label="Cost per Unit (GHS)"
            placeholder="0.00"
            value={formData.costPerUnit}
            onChangeText={(text) => setFormData({ ...formData, costPerUnit: text })}
            error={errors.costPerUnit}
            keyboardType="numeric"
            leftIcon="attach-money"
          />

          <Input
            label="Supplier (Optional)"
            placeholder="e.g., Fresh Foods Ltd"
            value={formData.supplier}
            onChangeText={(text) => setFormData({ ...formData, supplier: text })}
            leftIcon="business"
          />

          <Input
            label="Expiry Date (Optional)"
            placeholder="YYYY-MM-DD"
            value={formData.expiryDate}
            onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
            leftIcon="event"
          />
        </Section>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <Button
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            style={{ flex: 0.48 }}
          />
          <Button
            title={ingredient ? 'Update' : 'Add Ingredient'}
            onPress={handleSave}
            loading={isLoading}
            style={{ flex: 0.48 }}
          />
        </View>
      </FormContainer>
    </Container>
  );
};

export default IngredientForm;