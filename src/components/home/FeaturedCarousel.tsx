import React, { useRef, useState } from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Restaurant } from '../../types';
import RestaurantCard from './RestaurantCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const CARD_SPACING = 16;

interface FeaturedCarouselProps {
  restaurants: Restaurant[];
  onRestaurantPress: (restaurantId: string) => void;
}

const CarouselContainer = styled.View`
  height: 200px;
`;

const CarouselScrollView = styled(ScrollView)`
  flex: 1;
`;

const CarouselContent = styled.View`
  padding: 0 ${({ theme }) => theme.spacing.md}px;
`;

const CardWrapper = styled.View`
  width: ${CARD_WIDTH}px;
  margin-right: ${CARD_SPACING}px;
`;

const PaginationContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const PaginationDot = styled.View<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.neutral.lightGray};
  margin: 0 ${({ theme }) => theme.spacing.xs}px;
`;

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ 
  restaurants, 
  onRestaurantPress 
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (CARD_WIDTH + CARD_SPACING));
    setCurrentIndex(index);
  };

  const handleMomentumScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (CARD_WIDTH + CARD_SPACING));
    setCurrentIndex(index);
  };

  if (restaurants.length === 0) {
    return null;
  }

  return (
    <CarouselContainer>
      <CarouselScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
      >
        <CarouselContent>
          {restaurants.map((restaurant) => (
            <CardWrapper key={restaurant.id}>
              <RestaurantCard
                restaurant={restaurant}
                onPress={() => onRestaurantPress(restaurant.id)}
              />
            </CardWrapper>
          ))}
        </CarouselContent>
      </CarouselScrollView>

      {restaurants.length > 1 && (
        <PaginationContainer>
          {restaurants.map((_, index) => (
            <PaginationDot key={index} active={index === currentIndex} />
          ))}
        </PaginationContainer>
      )}
    </CarouselContainer>
  );
};

export default FeaturedCarousel;