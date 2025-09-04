import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const FilterContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const FilterScrollView = styled(ScrollView)`
  flex-direction: row;
`;

const CategoryButton = styled(TouchableOpacity)<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.surface};
  border-width: 1px;
  border-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border};
  min-width: 80px;
  justify-content: center;
`;

const CategoryIcon = styled(Icon)<{ selected: boolean }>`
  margin-right: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ selected, theme }) => 
    selected ? theme.colors.neutral.white : theme.colors.text.secondary};
`;

const CategoryText = styled.Text<{ selected: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ selected, theme }) => 
    selected ? theme.colors.neutral.white : theme.colors.text.primary};
`;

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <FilterContainer>
      <FilterScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            selected={selectedCategory === category.id}
            onPress={() => onCategoryChange(category.id)}
            activeOpacity={0.8}
          >
            <CategoryIcon
              name={category.icon}
              size={18}
              selected={selectedCategory === category.id}
            />
            <CategoryText selected={selectedCategory === category.id}>
              {category.name}
            </CategoryText>
          </CategoryButton>
        ))}
      </FilterScrollView>
    </FilterContainer>
  );
};

export default CategoryFilter;