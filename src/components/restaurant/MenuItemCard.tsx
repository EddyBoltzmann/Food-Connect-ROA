import React from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InventoryStatusBadge from './InventoryStatusBadge';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
  isLowStock?: boolean;
  dietaryTags?: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
}

interface MenuItemCardProps {
  item: MenuItem;
  onPress: () => void;
}

const CardContainer = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  overflow: hidden;
  ${({ theme }) => theme.shadows.sm};
`;

const CardContent = styled.View`
  flex-direction: row;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const ImageContainer = styled.View`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  overflow: hidden;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const ItemImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: space-between;
`;

const ItemInfo = styled.View`
  flex: 1;
`;

const ItemName = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const ItemDescription = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 18px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const DietaryTags = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const DietaryTag = styled.View<{ color: string }>`
  background-color: ${({ color }) => color}20;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  flex-direction: row;
  align-items: center;
`;

const DietaryTagText = styled.Text<{ color: string }>`
  color: ${({ color }) => color};
  font-size: 10px;
  font-weight: 500;
  margin-left: 2px;
`;

const BottomRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const PriceContainer = styled.View`
  flex-direction: row;
  align-items: baseline;
`;

const Price = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const Currency = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.primary};
  margin-right: 2px;
`;

const AddButton = styled(TouchableOpacity)`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
`;

const UnavailableOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
`;

const UnavailableText = styled.Text`
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onPress }) => {
  const handlePress = () => {
    if (item.isAvailable) {
      onPress();
    }
  };

  return (
    <CardContainer onPress={handlePress} activeOpacity={0.8}>
      <CardContent>
        <ImageContainer>
          <ItemImage source={{ uri: item.image }} resizeMode="cover" />
        </ImageContainer>

        <ContentContainer>
          <ItemInfo>
            <ItemName numberOfLines={1}>{item.name}</ItemName>
            <ItemDescription numberOfLines={2}>
              {item.description}
            </ItemDescription>

            {item.dietaryTags && item.dietaryTags.length > 0 && (
              <DietaryTags>
                {item.dietaryTags.map((tag) => (
                  <DietaryTag key={tag.id} color={tag.color}>
                    <Icon name={tag.icon} size={10} color={tag.color} />
                    <DietaryTagText color={tag.color}>{tag.name}</DietaryTagText>
                  </DietaryTag>
                ))}
              </DietaryTags>
            )}

            {/* Inventory Status Badge */}
            <InventoryStatusBadge menuItem={item} />
          </ItemInfo>

          <BottomRow>
            <PriceContainer>
              <Currency>$</Currency>
              <Price>{item.price.toFixed(2)}</Price>
            </PriceContainer>

            {item.isAvailable ? (
              <AddButton>
                <Icon name="add" size={20} color="#FFFFFF" />
              </AddButton>
            ) : (
              <View style={{ width: 32, height: 32 }} />
            )}
          </BottomRow>
        </ContentContainer>
      </CardContent>

      {!item.isAvailable && (
        <UnavailableOverlay>
          <UnavailableText>Not Available</UnavailableText>
        </UnavailableOverlay>
      )}
    </CardContainer>
  );
};

export default MenuItemCard;