import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Text } from '../components/common/Text';
import { Button } from '../components/common/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

const Container = styled.View`
  flex: 1;
  background-color: #FFFFFF;
`;

const GradientContainer = styled(LinearGradient)`
  flex: 1;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 40px;
`;

const SlideContainer = styled(Animated.View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const IconContainer = styled(Animated.View)`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: rgba(46, 204, 113, 0.1);
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled(Animated.Text)`
  font-size: 28px;
  font-weight: bold;
  color: #2C3E50;
  text-align: center;
  margin-bottom: 16px;
  line-height: 36px;
`;

const Description = styled(Animated.Text)`
  font-size: 16px;
  color: #7F8C8D;
  text-align: center;
  line-height: 24px;
  margin-bottom: 40px;
`;

const PaginationContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`;

const PaginationDot = styled(Animated.View)<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ active }) => (active ? '#2ECC71' : '#BDC3C7')};
  margin: 0 4px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  padding-bottom: 40px;
`;

const SkipButton = styled(TouchableOpacity)`
  position: absolute;
  top: 60px;
  right: 20px;
  padding: 10px 20px;
  background-color: rgba(46, 204, 113, 0.1);
  border-radius: 20px;
`;

const SkipText = styled(Text)`
  color: #2ECC71;
  font-size: 14px;
  font-weight: 500;
`;

const onboardingData = [
  {
    id: 1,
    icon: 'restaurant',
    title: 'Discover Amazing Food',
    description: 'Find the best restaurants and dishes in your area with our smart recommendations.',
    color: '#2ECC71',
  },
  {
    id: 2,
    icon: 'qr-code-scanner',
    title: 'Quick & Contactless',
    description: 'Scan QR codes on tables for instant menu access and contactless ordering.',
    color: '#FF8C42',
  },
  {
    id: 3,
    icon: 'stars',
    title: 'Earn Rewards',
    description: 'Get loyalty points with every order and redeem them for amazing rewards.',
    color: '#9B59B6',
  },
];

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Animation values
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const iconRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startSlideAnimation();
  }, [currentSlide]);

  const startSlideAnimation = () => {
    // Reset animations
    slideAnimation.setValue(0);
    fadeAnimation.setValue(0);
    scaleAnimation.setValue(0.8);
    iconRotation.setValue(0);

    // Start animations
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 600,
        delay: 200,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
      Animated.timing(iconRotation, {
        toValue: 1,
        duration: 800,
        delay: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    if (currentSlide < onboardingData.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate('Auth');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Auth');
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slideTranslateX = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0],
  });

  const iconRotationInterpolate = iconRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const currentData = onboardingData[currentSlide];

  return (
    <Container>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <GradientContainer
        colors={['#FFFFFF', '#F8F9FA', '#E9ECEF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SkipButton onPress={handleSkip}>
          <SkipText>Skip</SkipText>
        </SkipButton>

        <Content>
          <SlideContainer
            style={{
              transform: [
                { translateX: slideTranslateX },
                { scale: scaleAnimation },
              ],
              opacity: fadeAnimation,
            }}
          >
            <IconContainer
              style={{
                backgroundColor: `${currentData.color}20`,
                transform: [{ rotate: iconRotationInterpolate }],
              }}
            >
              <Icon 
                name={currentData.icon} 
                size={60} 
                color={currentData.color} 
              />
            </IconContainer>

            <Title>{currentData.title}</Title>
            <Description>{currentData.description}</Description>
          </SlideContainer>

          <PaginationContainer>
            {onboardingData.map((_, index) => (
              <PaginationDot
                key={index}
                active={index === currentSlide}
                style={{
                  transform: [
                    {
                      scale: index === currentSlide ? 1.2 : 1,
                    },
                  ],
                }}
              />
            ))}
          </PaginationContainer>

          <ButtonContainer>
            <Button
              title={currentSlide === onboardingData.length - 1 ? 'Get Started' : 'Next'}
              onPress={handleNext}
              fullWidth
              style={{ marginBottom: 16 }}
            />
            
            {currentSlide > 0 && (
              <Button
                title="Previous"
                onPress={handlePrevious}
                variant="outline"
                fullWidth
              />
            )}
          </ButtonContainer>
        </Content>
      </GradientContainer>
    </Container>
  );
};

export default OnboardingScreen;