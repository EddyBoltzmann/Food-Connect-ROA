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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';
import { RootState, AppDispatch } from '../../store';
import { login } from '../../store/slices/authSlice';

// Import components
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Text } from '../../components/common/Text';
import Logo from '../../components/common/Logo';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RestaurantLoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

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

const RoleSelector = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: 4px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const RoleOption = styled(TouchableOpacity)<{ selected: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : 'transparent'};
  align-items: center;
`;

const RoleText = styled(Text)<{ selected: boolean }>`
  color: ${({ selected, theme }) => 
    selected ? theme.colors.neutral.white : theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const RestaurantLoginScreen: React.FC = () => {
  const navigation = useNavigation<RestaurantLoginScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedRole, setSelectedRole] = useState<'customer' | 'restaurant'>('restaurant');

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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(login({
        email: formData.email,
        password: formData.password,
        role: selectedRole,
      })).unwrap();
    } catch (error: any) {
      Alert.alert('Login Failed', error || 'Invalid email or password');
    }
  };

  const handleRegister = () => {
    if (selectedRole === 'restaurant') {
      navigation.navigate('RestaurantRegister');
    } else {
      navigation.navigate('Register');
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

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
                Restaurant Login
              </Text>
              <Text variant="body" color="secondary" align="center" style={{ marginTop: 8 }}>
                Access your restaurant dashboard
              </Text>
            </TitleContainer>

            {/* Role Selector */}
            <RoleSelector>
              <RoleOption
                selected={selectedRole === 'customer'}
                onPress={() => setSelectedRole('customer')}
              >
                <RoleText selected={selectedRole === 'customer'}>
                  Customer
                </RoleText>
              </RoleOption>
              <RoleOption
                selected={selectedRole === 'restaurant'}
                onPress={() => setSelectedRole('restaurant')}
              >
                <RoleText selected={selectedRole === 'restaurant'}>
                  Restaurant
                </RoleText>
              </RoleOption>
            </RoleSelector>

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

              <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: 'flex-end', marginBottom: 16 }}>
                <LinkText variant="body" weight="medium">
                  Forgot Password?
                </LinkText>
              </TouchableOpacity>

              <Button
                title={selectedRole === 'restaurant' ? 'Login to Dashboard' : 'Login'}
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                style={{ marginBottom: 16 }}
              />

              {/* Social Login Buttons */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <Button
                  title="Google"
                  variant="outline"
                  onPress={() => {}}
                  style={{ flex: 0.48 }}
                  icon="google"
                />
                <Button
                  title="Facebook"
                  variant="outline"
                  onPress={() => {}}
                  style={{ flex: 0.48 }}
                  icon="facebook"
                />
              </View>
            </FormContainer>

            <FooterContainer>
              <View style={{ flexDirection: 'row' }}>
                <Text variant="body" color="secondary">
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity onPress={handleRegister}>
                  <LinkText variant="body" weight="medium">
                    {selectedRole === 'restaurant' ? 'Register Restaurant' : 'Sign Up'}
                  </LinkText>
                </TouchableOpacity>
              </View>
            </FooterContainer>
          </Animated.View>
        </Content>
      </ScrollContainer>
    </Container>
  );
};

export default RestaurantLoginScreen;