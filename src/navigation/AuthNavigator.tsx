import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from '../types';
import { screenTransitions } from './transitions';

// Import auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RestaurantLoginScreen from '../screens/auth/RestaurantLoginScreen';
import RestaurantRegisterScreen from '../screens/auth/RestaurantRegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: screenTransitions.Login.cardStyleInterpolator,
        transitionSpec: screenTransitions.Login.transitionSpec,
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          ...screenTransitions.Login,
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{
          ...screenTransitions.Register,
        }}
      />
      <Stack.Screen 
        name="RestaurantLogin" 
        component={RestaurantLoginScreen}
        options={{
          ...screenTransitions.Login,
        }}
      />
      <Stack.Screen 
        name="RestaurantRegister" 
        component={RestaurantRegisterScreen}
        options={{
          ...screenTransitions.Register,
        }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{
          ...screenTransitions.ForgotPassword,
          headerShown: true,
          title: 'Reset Password',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;