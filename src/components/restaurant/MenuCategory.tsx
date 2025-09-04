import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface MenuCategoryProps {
  category: {
    id: string;
    name: string;
    description?: string;
  };
  children: React.ReactNode;
}

const CategoryContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const CategoryHeader = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const CategoryInfo = styled.View`
  flex: 1;
`;

const CategoryName = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const CategoryDescription = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ChevronIcon = styled(Icon)<{ expanded: boolean }>`
  transform: ${({ expanded }) => expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.3s ease;
`;

const MenuItemsContainer = styled.View<{ expanded: boolean }>`
  max-height: ${({ expanded }) => expanded ? 'none' : '0px'};
  overflow: hidden;
  opacity: ${({ expanded }) => expanded ? 1 : 0};
  transition: all 0.3s ease;
`;

const MenuCategory: React.FC<MenuCategoryProps> = ({ category, children }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <CategoryContainer>
      <CategoryHeader onPress={toggleExpanded} activeOpacity={0.7}>
        <CategoryInfo>
          <CategoryName>{category.name}</CategoryName>
          {category.description && (
            <CategoryDescription>{category.description}</CategoryDescription>
          )}
        </CategoryInfo>
        <ChevronIcon 
          name="keyboard-arrow-down" 
          size={24} 
          color="#6B7280"
          expanded={expanded}
        />
      </CategoryHeader>
      
      <MenuItemsContainer expanded={expanded}>
        {children}
      </MenuItemsContainer>
    </CategoryContainer>
  );
};

export default MenuCategory;