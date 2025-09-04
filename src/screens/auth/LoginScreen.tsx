import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';
import { RootState, AppDispatch } from '../../store';
import { login, socialLogin } from '../../store/slices/authSlice';

// Import components
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import Logo from '../../components/common/Logo';
import Icon from 'react-native-vector-icons/MaterialIcons';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

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

const SocialButtonsContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SocialButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const DividerContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.xl}px 0;
`;

const DividerLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
`;

const DividerText = styled(Text)`
  margin: 0 ${({ theme }) => theme.spacing.md}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FooterContainer = styled.View`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

const LinkText = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration-line: underline;
`;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(login(formData)).unwrap();
    } catch (error: any) {
      Alert.alert('Login Failed', error || 'An error occurred during login');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      await dispatch(socialLogin(provider)).unwrap();
    } catch (error: any) {
      Alert.alert('Login Failed', error || 'Social login failed');
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollContainer
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Content>
          <LogoContainer>
            <Logo size="large" />
          </LogoContainer>

          <TitleContainer>
            <Text variant="h2" weight="bold" align="center">
              Welcome Back
            </Text>
            <Text variant="body" color="secondary" align="center" style={{ marginTop: 8 }}>
              Sign in to continue to Food Connect
            </Text>
          </TitleContainer>

          <FormContainer>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              error={errors.password}
              secureTextEntry
              leftIcon="lock"
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={{ marginTop: 16 }}
            />
          </FormContainer>

          <DividerContainer>
            <DividerLine />
            <DividerText>or</DividerText>
            <DividerLine />
          </DividerContainer>

          <SocialButtonsContainer>
            <SocialButton
              title="Continue with Google"
              onPress={() => handleSocialLogin('google')}
              variant="outline"
              fullWidth
              icon={<Icon name="google" size={20} color="#DB4437" />}
            />

            <SocialButton
              title="Continue with Facebook"
              onPress={() => handleSocialLogin('facebook')}
              variant="outline"
              fullWidth
              icon={<Icon name="facebook" size={20} color="#4267B2" />}
            />

            {Platform.OS === 'ios' && (
              <SocialButton
                title="Continue with Apple"
                onPress={() => handleSocialLogin('apple')}
                variant="outline"
                fullWidth
                icon={<Icon name="apple" size={20} color="#000000" />}
              />
            )}
          </SocialButtonsContainer>

          <FooterContainer>
            <Button
              title="Forgot Password?"
              onPress={handleForgotPassword}
              variant="ghost"
            />

            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <Text variant="body" color="secondary">
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={handleRegister}>
                <LinkText variant="body" weight="medium">
                  Sign Up
                </LinkText>
              </TouchableOpacity>
            </View>
          </FooterContainer>
        </Content>
      </ScrollContainer>
    </Container>
  );
};

export default LoginScreen;