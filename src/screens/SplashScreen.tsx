import React, { useEffect, useRef } from 'react';
import {
  View,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const { width, height } = Dimensions.get('window');

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

const Container = styled.View`
  flex: 1;
  background-color: #2ECC71;
`;

const GradientContainer = styled(LinearGradient)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LogoContainer = styled(Animated.View)`
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
`;

const LogoCircle = styled(Animated.View)`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: rgba(255, 255, 255, 0.2);
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const LogoIcon = styled(Animated.Text)`
  font-size: 60px;
  color: #FFFFFF;
  font-weight: bold;
`;

const AppName = styled(Animated.Text)`
  font-size: 32px;
  font-weight: bold;
  color: #FFFFFF;
  letter-spacing: 2px;
  margin-bottom: 8px;
`;

const Tagline = styled(Animated.Text)`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 300;
  letter-spacing: 1px;
`;

const LoadingContainer = styled(Animated.View)`
  position: absolute;
  bottom: 80px;
  align-items: center;
`;

const LoadingDots = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Dot = styled(Animated.View)`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #FFFFFF;
  margin: 0 4px;
`;

const LoadingText = styled(Animated.Text)`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin-top: 16px;
  font-weight: 300;
`;

const ParticleContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Particle = styled(Animated.View)`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: rgba(255, 255, 255, 0.6);
`;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useSelector((state: RootState) => state.app);

  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const appNameOpacity = useRef(new Animated.Value(0)).current;
  const appNameTranslateY = useRef(new Animated.Value(30)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(20)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;
  const dot1Scale = useRef(new Animated.Value(0.5)).current;
  const dot2Scale = useRef(new Animated.Value(0.5)).current;
  const dot3Scale = useRef(new Animated.Value(0.5)).current;

  // Particle animations
  const particles = useRef(
    Array.from({ length: 20 }, () => ({
      x: useRef(new Animated.Value(Math.random() * width)).current,
      y: useRef(new Animated.Value(Math.random() * height)).current,
      opacity: useRef(new Animated.Value(Math.random() * 0.5 + 0.2)).current,
      scale: useRef(new Animated.Value(Math.random() * 0.5 + 0.5)).current,
    }))
  ).current;

  useEffect(() => {
    startAnimations();
    
    // Navigate after animations complete
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace('Main');
      } else {
        navigation.replace('Onboarding');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigation]);

  const startAnimations = () => {
    // Logo entrance animation
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // App name animation
    Animated.parallel([
      Animated.timing(appNameOpacity, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(appNameTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Tagline animation
    Animated.parallel([
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 600,
        delay: 800,
        useNativeDriver: true,
      }),
      Animated.timing(taglineTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Loading animation
    Animated.timing(loadingOpacity, {
      toValue: 1,
      duration: 400,
      delay: 1200,
      useNativeDriver: true,
    }).start();

    // Loading dots animation
    const createDotAnimation = (dotScale: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(dotScale, {
            toValue: 1.2,
            duration: 600,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dotScale, {
            toValue: 0.5,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    createDotAnimation(dot1Scale, 0).start();
    createDotAnimation(dot2Scale, 200).start();
    createDotAnimation(dot3Scale, 400).start();

    // Particle animations
    particles.forEach((particle, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(particle.y, {
            toValue: particle.y._value - 100,
            duration: 3000 + Math.random() * 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: height + 50,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(particle.opacity, {
            toValue: 0.8,
            duration: 1000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: 0.2,
            duration: 1000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  const logoRotationInterpolate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="#2ECC71" />
      
      <GradientContainer
        colors={['#2ECC71', '#27AE60', '#229954']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating particles */}
        <ParticleContainer>
          {particles.map((particle, index) => (
            <Particle
              key={index}
              style={{
                transform: [
                  { translateX: particle.x },
                  { translateY: particle.y },
                  { scale: particle.scale },
                ],
                opacity: particle.opacity,
              }}
            />
          ))}
        </ParticleContainer>

        {/* Main content */}
        <LogoContainer>
          <LogoCircle
            style={{
              transform: [
                { scale: logoScale },
                { rotate: logoRotationInterpolate },
              ],
              opacity: logoOpacity,
            }}
          >
            <LogoIcon>🍽️</LogoIcon>
          </LogoCircle>

          <AppName
            style={{
              opacity: appNameOpacity,
              transform: [{ translateY: appNameTranslateY }],
            }}
          >
            FOOD CONNECT
          </AppName>

          <Tagline
            style={{
              opacity: taglineOpacity,
              transform: [{ translateY: taglineTranslateY }],
            }}
          >
            Connecting you to delicious food
          </Tagline>
        </LogoContainer>

        {/* Loading indicator */}
        <LoadingContainer
          style={{
            opacity: loadingOpacity,
          }}
        >
          <LoadingDots>
            <Dot
              style={{
                transform: [{ scale: dot1Scale }],
              }}
            />
            <Dot
              style={{
                transform: [{ scale: dot2Scale }],
              }}
            />
            <Dot
              style={{
                transform: [{ scale: dot3Scale }],
              }}
            />
          </LoadingDots>
          
          <LoadingText>
            {isAuthenticated ? `Welcome back, ${user?.name || 'Food Lover'}!` : 'Loading...'}
          </LoadingText>
        </LoadingContainer>
      </GradientContainer>
    </Container>
  );
};

export default SplashScreen;