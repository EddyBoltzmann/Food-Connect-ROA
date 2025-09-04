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
import { register } from '../../store/slices/authSlice';

// Import components
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Text } from '../../components/common/Text';
import Logo from '../../components/common/Logo';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RestaurantRegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

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

const SectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const HalfWidth = styled.View`
  flex: 0.48;
`;

const FooterContainer = styled.View`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

const LinkText = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration-line: underline;
`;

const RestaurantRegisterScreen: React.FC = () => {
  const navigation = useNavigation<RestaurantRegisterScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Restaurant Information
    restaurantName: '',
    restaurantAddress: '',
    restaurantPhone: '',
    cuisine: '',
    description: '',
    
    // Business Information
    businessLicense: '',
    taxId: '',
    bankAccount: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    // Personal Information Validation
    if (!formData.name) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Restaurant Information Validation
    if (!formData.restaurantName) {
      newErrors.restaurantName = 'Restaurant name is required';
    }

    if (!formData.restaurantAddress) {
      newErrors.restaurantAddress = 'Restaurant address is required';
    }

    if (!formData.restaurantPhone) {
      newErrors.restaurantPhone = 'Restaurant phone is required';
    }

    if (!formData.cuisine) {
      newErrors.cuisine = 'Cuisine type is required';
    }

    // Business Information Validation
    if (!formData.businessLicense) {
      newErrors.businessLicense = 'Business license is required';
    }

    if (!formData.taxId) {
      newErrors.taxId = 'Tax ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'restaurant_owner',
        restaurantInfo: {
          name: formData.restaurantName,
          address: formData.restaurantAddress,
          phone: formData.restaurantPhone,
          cuisine: formData.cuisine,
          description: formData.description,
          businessLicense: formData.businessLicense,
          taxId: formData.taxId,
          bankAccount: formData.bankAccount,
        },
      })).unwrap();
    } catch (error: any) {
      Alert.alert('Registration Failed', error || 'An error occurred during registration');
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
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
                Restaurant Registration
              </Text>
              <Text variant="body" color="secondary" align="center" style={{ marginTop: 8 }}>
                Join Food Connect as a restaurant partner
              </Text>
            </TitleContainer>

            <FormContainer>
              {/* Personal Information */}
              <SectionTitle>Personal Information</SectionTitle>
              
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                error={errors.name}
                leftIcon="person"
              />

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
                label="Phone Number"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                error={errors.phone}
                keyboardType="phone-pad"
                leftIcon="phone"
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

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                error={errors.confirmPassword}
                secureTextEntry
                leftIcon="lock"
              />

              {/* Restaurant Information */}
              <SectionTitle>Restaurant Information</SectionTitle>
              
              <Input
                label="Restaurant Name"
                placeholder="Enter restaurant name"
                value={formData.restaurantName}
                onChangeText={(text) => setFormData({ ...formData, restaurantName: text })}
                error={errors.restaurantName}
                leftIcon="restaurant"
              />

              <Input
                label="Restaurant Address"
                placeholder="Enter restaurant address"
                value={formData.restaurantAddress}
                onChangeText={(text) => setFormData({ ...formData, restaurantAddress: text })}
                error={errors.restaurantAddress}
                leftIcon="location-on"
                multiline
              />

              <Row>
                <HalfWidth>
                  <Input
                    label="Restaurant Phone"
                    placeholder="Phone number"
                    value={formData.restaurantPhone}
                    onChangeText={(text) => setFormData({ ...formData, restaurantPhone: text })}
                    error={errors.restaurantPhone}
                    keyboardType="phone-pad"
                    leftIcon="phone"
                  />
                </HalfWidth>
                <HalfWidth>
                  <Input
                    label="Cuisine Type"
                    placeholder="e.g., Italian, Chinese"
                    value={formData.cuisine}
                    onChangeText={(text) => setFormData({ ...formData, cuisine: text })}
                    error={errors.cuisine}
                    leftIcon="restaurant-menu"
                  />
                </HalfWidth>
              </Row>

              <Input
                label="Restaurant Description"
                placeholder="Describe your restaurant"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                leftIcon="description"
                multiline
              />

              {/* Business Information */}
              <SectionTitle>Business Information</SectionTitle>
              
              <Input
                label="Business License Number"
                placeholder="Enter business license number"
                value={formData.businessLicense}
                onChangeText={(text) => setFormData({ ...formData, businessLicense: text })}
                error={errors.businessLicense}
                leftIcon="business"
              />

              <Input
                label="Tax ID"
                placeholder="Enter tax identification number"
                value={formData.taxId}
                onChangeText={(text) => setFormData({ ...formData, taxId: text })}
                error={errors.taxId}
                leftIcon="receipt"
              />

              <Input
                label="Bank Account (Optional)"
                placeholder="Enter bank account details"
                value={formData.bankAccount}
                onChangeText={(text) => setFormData({ ...formData, bankAccount: text })}
                leftIcon="account-balance"
              />

              <Button
                title="Register Restaurant"
                onPress={handleRegister}
                loading={isLoading}
                fullWidth
                style={{ marginTop: 16 }}
              />
            </FormContainer>

            <FooterContainer>
              <View style={{ flexDirection: 'row' }}>
                <Text variant="body" color="secondary">
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <LinkText variant="body" weight="medium">
                    Sign In
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

export default RestaurantRegisterScreen;