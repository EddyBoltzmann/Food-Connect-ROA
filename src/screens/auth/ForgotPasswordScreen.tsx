import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';

// Import components
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Text } from '../../components/common/Text';
import Logo from '../../components/common/Logo';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollContainer = styled(ScrollView)`
  flex: 1;
`;

const Content = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl}px;
  justify-content: center;
`;

const LogoContainer = styled.View`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing['3xl']}px;
`;

const TitleContainer = styled.View`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']}px;
`;

const FormContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const FooterContainer = styled.View`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

const LinkText = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration-line: underline;
`;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Animation values
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
    }, 2000);
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  if (emailSent) {
    return (
      <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollContainer
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Content>
            <Animated.View
              style={{
                opacity: fadeAnimation,
                transform: [{ translateY: slideAnimation }],
              }}
            >
              <LogoContainer>
                <Logo size="large" />
              </LogoContainer>

              <TitleContainer>
                <Text variant="h2" weight="bold" align="center">
                  Check Your Email
                </Text>
                <Text variant="body" color="secondary" align="center" style={{ marginTop: 8 }}>
                  We've sent a password reset link to {email}
                </Text>
              </TitleContainer>

              <FormContainer>
                <Button
                  title="Back to Login"
                  onPress={handleBackToLogin}
                  fullWidth
                />
              </FormContainer>
            </Animated.View>
          </Content>
        </ScrollContainer>
      </Container>
    );
  }

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollContainer
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Content>
          <Animated.View
            style={{
              opacity: fadeAnimation,
              transform: [{ translateY: slideAnimation }],
            }}
          >
            <LogoContainer>
              <Logo size="large" />
            </LogoContainer>

            <TitleContainer>
              <Text variant="h2" weight="bold" align="center">
                Reset Password
              </Text>
              <Text variant="body" color="secondary" align="center" style={{ marginTop: 8 }}>
                Enter your email address and we'll send you a reset link
              </Text>
            </TitleContainer>

            <FormContainer>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="email"
              />

              <Button
                title="Send Reset Link"
                onPress={handleResetPassword}
                loading={isLoading}
                fullWidth
                style={{ marginTop: 16 }}
              />
            </FormContainer>

            <FooterContainer>
              <TouchableOpacity onPress={handleBackToLogin}>
                <LinkText variant="body" weight="medium">
                  Back to Login
                </LinkText>
              </TouchableOpacity>
            </FooterContainer>
          </Animated.View>
        </Content>
      </ScrollContainer>
    </Container>
  );
};

export default ForgotPasswordScreen;