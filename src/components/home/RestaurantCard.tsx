import React from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Restaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  style?: any;
}

const CardContainer = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  overflow: hidden;
  ${({ theme }) => theme.shadows.sm};
`;

const ImageContainer = styled.View`
  position: relative;
  height: 120px;
`;

const RestaurantImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const StatusBadge = styled.View<{ isOpen: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm}px;
  right: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  background-color: ${({ isOpen, theme }) => 
    isOpen ? theme.colors.status.success : theme.colors.status.error};
`;

const StatusText = styled.Text<{ isOpen: boolean }>`
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ContentContainer = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const RestaurantName = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const CuisineText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const InfoContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const RatingContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RatingText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-left: ${({ theme }) => theme.spacing.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const DeliveryInfo = styled.View`
  align-items: flex-end;
`;

const DeliveryTime = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const DeliveryFee = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const LoyaltyBadge = styled.View`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.sm}px;
  left: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.primary.orange};
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  flex-direction: row;
  align-items: center;
`;

const LoyaltyText = styled.Text`
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-left: ${({ theme }) => theme.spacing.xs}px;
`;

const RestaurantCard: React.FC<RestaurantCardProps> = ({ 
  restaurant, 
  onPress, 
  style 
}) => {
  return (
    <CardContainer onPress={onPress} style={style} activeOpacity={0.8}>
      <ImageContainer>
        <RestaurantImage 
          source={{ uri: restaurant.image }} 
          resizeMode="cover"
        />
        
        <StatusBadge isOpen={restaurant.isOpen}>
          <StatusText isOpen={restaurant.isOpen}>
            {restaurant.isOpen ? 'Open' : 'Closed'}
          </StatusText>
        </StatusBadge>

        <LoyaltyBadge>
          <Icon name="stars" size={12} color="#FFFFFF" />
          <LoyaltyText>Earn Points</LoyaltyText>
        </LoyaltyBadge>
      </ImageContainer>

      <ContentContainer>
        <RestaurantName numberOfLines={1}>
          {restaurant.name}
        </RestaurantName>
        
        <CuisineText numberOfLines={1}>
          {restaurant.cuisine.join(' • ')}
        </CuisineText>

        <InfoContainer>
          <RatingContainer>
            <Icon name="star" size={16} color="#F59E0B" />
            <RatingText>{restaurant.rating.toFixed(1)}</RatingText>
            <RatingText style={{ color: '#6B7280', marginLeft: 4 }}>
              ({restaurant.reviewCount})
            </RatingText>
          </RatingContainer>

          <DeliveryInfo>
            <DeliveryTime>{restaurant.deliveryTime}</DeliveryTime>
            <DeliveryFee>
              {restaurant.deliveryFee === 0 ? 'Free delivery' : `$${restaurant.deliveryFee} delivery`}
            </DeliveryFee>
          </DeliveryInfo>
        </InfoContainer>
      </ContentContainer>
    </CardContainer>
  );
};

export default RestaurantCard;