import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, Animated, Easing, TouchableOpacity, Alert, Switch } from 'react-native';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { Text } from '../../components/common/Text';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const Section = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const SettingItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const SettingInfo = styled.View`
  flex: 1;
`;

const SettingLabel = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: 4px;
`;

const SettingDescription = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const SettingAction = styled.View`
  flex-direction: row;
  align-items: center;
`;

const SettingValue = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const ProfileSection = styled.View`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const ProfileImage = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${({ theme }) => theme.colors.primary + '20'};
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const ProfileName = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: 4px;
`;

const ProfileEmail = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EditButton = styled(TouchableOpacity)`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const EditButtonText = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const FormSection = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const HalfWidth = styled.View`
  flex: 0.48;
`;

const DangerSection = styled(Card)`
  background-color: ${({ theme }) => theme.colors.status.error + '10'};
  border-color: ${({ theme }) => theme.colors.status.error + '30'};
`;

const DangerButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.status.error};
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const RestaurantSettingsScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [settings, setSettings] = useState({
    // Restaurant Settings
    restaurantName: user?.restaurantInfo?.name || 'My Restaurant',
    restaurantAddress: user?.restaurantInfo?.address || '',
    restaurantPhone: user?.restaurantInfo?.phone || '',
    cuisine: user?.restaurantInfo?.cuisine || '',
    description: user?.restaurantInfo?.description || '',
    
    // Business Settings
    businessLicense: user?.restaurantInfo?.businessLicense || '',
    taxId: user?.restaurantInfo?.taxId || '',
    bankAccount: user?.restaurantInfo?.bankAccount || '',
    
    // Operational Settings
    isOpen: true,
    autoAcceptOrders: false,
    allowPreOrders: true,
    deliveryRadius: 10,
    preparationTime: 20,
    
    // Notification Settings
    orderNotifications: true,
    lowStockNotifications: true,
    reviewNotifications: true,
    
    // App Settings
    darkMode: false,
    language: 'en',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSaveSettings = () => {
    // Save settings logic here
    setIsEditing(false);
    Alert.alert('Success', 'Settings saved successfully');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Delete account logic here
            Alert.alert('Account Deleted', 'Your account has been deleted');
          },
        },
      ]
    );
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnimation }}>
          <Header>
            <Text variant="h2" weight="bold">Restaurant Settings</Text>
            <Button
              title={isEditing ? "Save" : "Edit"}
              onPress={isEditing ? handleSaveSettings : () => setIsEditing(true)}
              variant={isEditing ? "primary" : "outline"}
              size="small"
            />
          </Header>

          {/* Profile Section */}
          <Section>
            <ProfileSection>
              <ProfileImage>
                <Icon name="restaurant" size={40} color="#2ECC71" />
              </ProfileImage>
              <ProfileName>{settings.restaurantName}</ProfileName>
              <ProfileEmail>{user?.email}</ProfileEmail>
              {!isEditing && (
                <EditButton onPress={() => setIsEditing(true)}>
                  <EditButtonText>Edit Profile</EditButtonText>
                </EditButton>
              )}
            </ProfileSection>
          </Section>

          {/* Restaurant Information */}
          <Section>
            <SectionTitle>Restaurant Information</SectionTitle>
            
            <Input
              label="Restaurant Name"
              value={settings.restaurantName}
              onChangeText={(text) => updateSetting('restaurantName', text)}
              editable={isEditing}
              leftIcon="restaurant"
            />

            <Input
              label="Address"
              value={settings.restaurantAddress}
              onChangeText={(text) => updateSetting('restaurantAddress', text)}
              editable={isEditing}
              multiline
              leftIcon="location-on"
            />

            <Row>
              <HalfWidth>
                <Input
                  label="Phone"
                  value={settings.restaurantPhone}
                  onChangeText={(text) => updateSetting('restaurantPhone', text)}
                  editable={isEditing}
                  keyboardType="phone-pad"
                  leftIcon="phone"
                />
              </HalfWidth>
              <HalfWidth>
                <Input
                  label="Cuisine"
                  value={settings.cuisine}
                  onChangeText={(text) => updateSetting('cuisine', text)}
                  editable={isEditing}
                  leftIcon="restaurant-menu"
                />
              </HalfWidth>
            </Row>

            <Input
              label="Description"
              value={settings.description}
              onChangeText={(text) => updateSetting('description', text)}
              editable={isEditing}
              multiline
              leftIcon="description"
            />
          </Section>

          {/* Business Information */}
          <Section>
            <SectionTitle>Business Information</SectionTitle>
            
            <Input
              label="Business License"
              value={settings.businessLicense}
              onChangeText={(text) => updateSetting('businessLicense', text)}
              editable={isEditing}
              leftIcon="business"
            />

            <Input
              label="Tax ID"
              value={settings.taxId}
              onChangeText={(text) => updateSetting('taxId', text)}
              editable={isEditing}
              leftIcon="receipt"
            />

            <Input
              label="Bank Account"
              value={settings.bankAccount}
              onChangeText={(text) => updateSetting('bankAccount', text)}
              editable={isEditing}
              leftIcon="account-balance"
            />
          </Section>

          {/* Operational Settings */}
          <Section>
            <SectionTitle>Operational Settings</SectionTitle>
            
            <SettingItem>
              <SettingInfo>
                <SettingLabel>Restaurant Status</SettingLabel>
                <SettingDescription>Open or closed for orders</SettingDescription>
              </SettingInfo>
              <SettingAction>
                <Switch
                  value={settings.isOpen}
                  onValueChange={(value) => updateSetting('isOpen', value)}
                  disabled={!isEditing}
                />
              </SettingAction>
            </SettingItem>

            <SettingItem>
              <SettingInfo>
                <SettingLabel>Auto Accept Orders</SettingLabel>
                <SettingDescription>Automatically accept incoming orders</SettingDescription>
              </SettingInfo>
              <SettingAction>
                <Switch
                  value={settings.autoAcceptOrders}
                  onValueChange={(value) => updateSetting('autoAcceptOrders', value)}
                  disabled={!isEditing}
                />
              </SettingAction>
            </SettingItem>

            <SettingItem>
              <SettingInfo>
                <SettingLabel>Allow Pre-orders</SettingLabel>
                <SettingDescription>Allow customers to place advance orders</SettingDescription>
              </SettingInfo>
              <SettingAction>
                <Switch
                  value={settings.allowPreOrders}
                  onValueChange={(value) => updateSetting('allowPreOrders', value)}
                  disabled={!isEditing}
                />
              </SettingAction>
            </SettingItem>

            <SettingItem>
              <SettingInfo>
                <SettingLabel>Delivery Radius (km)</SettingLabel>
                <SettingDescription>Maximum delivery distance</SettingDescription>
              </SettingInfo>
              <SettingAction>
                <SettingValue>{settings.deliveryRadius}</SettingValue>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </SettingAction>
            </SettingItem>

            <SettingItem>
              <SettingInfo>
                <SettingLabel>Preparation Time (min)</SettingLabel>
                <SettingDescription>Average time to prepare orders</SettingDescription>
              </SettingInfo>
              <SettingAction>
                <SettingValue>{settings.preparationTime}</SettingValue>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </SettingAction>
            </SettingItem>
          </Section>

          {/* Notification Settings */}
          <Section>
            <SectionTitle>Notifications</SectionTitle>
            
            <SettingItem>
              <SettingInfo>
                <SettingLabel>Order Notifications</SettingLabel>
                <SettingDescription>Get notified of new orders</SettingDescription>
              </SettingInfo>
              <SettingAction>
                <Switch
                  value={settings.orderNotifications}
                  onValueChange={(value) => updateSetting('orderNotifications', value)}
                />
              </SettingAction>
            </SettingItem>

            <SettingItem>
              <SettingInfo>
                <SettingLabel>Low Stock Alerts</SettingLabel>
                <SettingDescription>Get notified when ingredients are low</SettingDescription>
              </SettingInfo>
              <SettingAction>
                <Switch
                  value={settings.lowStockNotifications}
                  onValueChange={(value) => updateSetting('lowStockNotifications', value)}
                />
              </SettingAction>
            </SettingItem>

            <SettingItem>
              <SettingInfo>
                <SettingLabel>Review Notifications</SettingLabel>
                <SettingDescription>Get notified of new reviews</SettingDescription>
              </SettingInfo>
              <SettingAction>
                <Switch
                  value={settings.reviewNotifications}
                  onValueChange={(value) => updateSetting('reviewNotifications', value)}
                />
              </SettingAction>
            </SettingItem>
          </Section>

          {/* App Settings */}
          <Section>
            <SectionTitle>App Settings</SectionTitle>
            
            <SettingItem>
              <SettingInfo>
                <SettingLabel>Dark Mode</SettingLabel>
                <SettingDescription>Use dark theme</SettingDescription>
              </SettingInfo>
              <SettingAction>
                <Switch
                  value={settings.darkMode}
                  onValueChange={(value) => updateSetting('darkMode', value)}
                />
              </SettingAction>
            </SettingItem>

            <SettingItem>
              <SettingInfo>
                <SettingLabel>Language</SettingLabel>
                <SettingDescription>App language</SettingDescription>
              </SettingInfo>
              <SettingAction>
                <SettingValue>English</SettingValue>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </SettingAction>
            </SettingItem>
          </Section>

          {/* Account Actions */}
          <Section>
            <SectionTitle>Account</SectionTitle>
            
            <SettingItem>
              <SettingInfo>
                <SettingLabel>Change Password</SettingLabel>
                <SettingDescription>Update your password</SettingDescription>
              </SettingInfo>
              <SettingAction>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </SettingAction>
            </SettingItem>

            <SettingItem>
              <SettingInfo>
                <SettingLabel>Privacy Policy</SettingLabel>
                <SettingDescription>View privacy policy</SettingDescription>
              </SettingInfo>
              <SettingAction>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </SettingAction>
            </SettingItem>

            <SettingItem>
              <SettingInfo>
                <SettingLabel>Terms of Service</SettingLabel>
                <SettingDescription>View terms of service</SettingDescription>
              </SettingInfo>
              <SettingAction>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </SettingAction>
            </SettingItem>
          </Section>

          {/* Danger Zone */}
          <DangerSection>
            <SectionTitle style={{ color: '#EF4444' }}>Danger Zone</SectionTitle>
            
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="outline"
              fullWidth
            />
            
            <DangerButton
              title="Delete Account"
              onPress={handleDeleteAccount}
              fullWidth
            />
          </DangerSection>
        </Animated.View>
      </ScrollView>
    </Container>
  );
};

export default RestaurantSettingsScreen;