import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import RestaurantScreen from '../screens/RestaurantScreen';
import MenuItemScreen from '../screens/MenuItemScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import ChatScreen from '../screens/ChatScreen';
import QRScanScreen from '../screens/QRScanScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoyaltyScreen from '../screens/LoyaltyScreen';
import RestaurantDashboardScreen from '../screens/RestaurantDashboardScreen';

// Import types
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useSelector((state: RootState) => state.app);

  // Show splash screen while loading
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        {!isAuthenticated ? (
          // Unauthenticated stack
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        ) : (
          // Authenticated stack
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen 
              name="Restaurant" 
              component={RestaurantScreen}
              options={{
                headerShown: true,
                title: 'Restaurant',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen 
              name="MenuItem" 
              component={MenuItemScreen}
              options={{
                headerShown: true,
                title: 'Menu Item',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen 
              name="Cart" 
              component={CartScreen}
              options={{
                headerShown: true,
                title: 'Cart',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen 
              name="Checkout" 
              component={CheckoutScreen}
              options={{
                headerShown: true,
                title: 'Checkout',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen 
              name="OrderTracking" 
              component={OrderTrackingScreen}
              options={{
                headerShown: true,
                title: 'Order Tracking',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen 
              name="Chat" 
              component={ChatScreen}
              options={{
                headerShown: true,
                title: 'Chat',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen 
              name="QRScan" 
              component={QRScanScreen}
              options={{
                headerShown: true,
                title: 'Scan QR Code',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{
                headerShown: true,
                title: 'Profile',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen 
              name="Loyalty" 
              component={LoyaltyScreen}
              options={{
                headerShown: true,
                title: 'Loyalty Points',
                headerBackTitleVisible: false,
              }}
            />
            {user?.role === 'restaurant_owner' && (
              <Stack.Screen 
                name="RestaurantDashboard" 
                component={RestaurantDashboardScreen}
                options={{
                  headerShown: true,
                  title: 'Restaurant Dashboard',
                  headerBackTitleVisible: false,
                }}
              />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;