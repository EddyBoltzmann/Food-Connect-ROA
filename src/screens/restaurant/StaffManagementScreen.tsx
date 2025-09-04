import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, Animated, Easing, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
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

const StaffCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StaffHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StaffAvatar = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${({ theme }) => theme.colors.primary + '20'};
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const StaffInfo = styled.View`
  flex: 1;
`;

const StaffName = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: 4px;
`;

const StaffEmail = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StaffRole = styled.View<{ role: string }>`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ role, theme }) => {
    switch (role) {
      case 'manager':
        return theme.colors.primary + '20';
      case 'chef':
        return theme.colors.status.warning + '20';
      case 'waiter':
        return theme.colors.status.info + '20';
      case 'cashier':
        return theme.colors.status.success + '20';
      default:
        return theme.colors.neutral.lightGray;
    }
  }};
`;

const RoleText = styled(Text)<{ role: string }>`
  color: ${({ role, theme }) => {
    switch (role) {
      case 'manager':
        return theme.colors.primary;
      case 'chef':
        return theme.colors.status.warning;
      case 'waiter':
        return theme.colors.status.info;
      case 'cashier':
        return theme.colors.status.success;
      default:
        return theme.colors.text.secondary;
    }
  }};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StaffStatus = styled.View<{ status: 'active' | 'inactive' }>`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StatusDot = styled.View<{ status: 'active' | 'inactive' }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ status, theme }) => 
    status === 'active' ? theme.colors.status.success : theme.colors.text.secondary};
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const StatusText = styled(Text)<{ status: 'active' | 'inactive' }>`
  color: ${({ status, theme }) => 
    status === 'active' ? theme.colors.status.success : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const StaffActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const ActionButton = styled(TouchableOpacity)<{ variant: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.surface;
      case 'danger':
        return theme.colors.status.error;
      default:
        return theme.colors.surface;
    }
  }};
  margin: 0 ${({ theme }) => theme.spacing.xs}px;
  align-items: center;
`;

const ActionButtonText = styled(Text)<{ variant: 'primary' | 'secondary' | 'danger' }>`
  color: ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return theme.colors.neutral.white;
      case 'secondary':
        return theme.colors.text.primary;
      case 'danger':
        return theme.colors.neutral.white;
      default:
        return theme.colors.text.primary;
    }
  }};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const AddStaffModal = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-height: 80%;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const ModalTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const CloseButton = styled(TouchableOpacity)`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.neutral.lightGray};
  justify-content: center;
  align-items: center;
`;

const FormSection = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const RoleSelector = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const RoleOption = styled(TouchableOpacity)<{ selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary + '20' : theme.colors.surface};
  border-width: 1px;
  border-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border};
`;

const RoleOptionText = styled(Text)<{ selected: boolean }>`
  color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const EmptyState = styled.View`
  align-items: center;
  margin-top: 100px;
`;

const EmptyIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${({ theme }) => theme.colors.neutral.lightGray};
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'chef' | 'waiter' | 'cashier';
  status: 'active' | 'inactive';
  phone?: string;
  joinDate: string;
  permissions: string[];
}

const StaffManagementScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'waiter' as 'manager' | 'chef' | 'waiter' | 'cashier',
  });
  
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  // Mock staff data
  const mockStaff: StaffMember[] = [
    {
      id: '1',
      name: 'John Manager',
      email: 'john@restaurant.com',
      role: 'manager',
      status: 'active',
      phone: '+233 24 123 4567',
      joinDate: '2024-01-15',
      permissions: ['manage_orders', 'manage_menu', 'manage_staff'],
    },
    {
      id: '2',
      name: 'Sarah Chef',
      email: 'sarah@restaurant.com',
      role: 'chef',
      status: 'active',
      phone: '+233 20 987 6543',
      joinDate: '2024-02-01',
      permissions: ['manage_orders', 'view_inventory'],
    },
    {
      id: '3',
      name: 'Mike Waiter',
      email: 'mike@restaurant.com',
      role: 'waiter',
      status: 'active',
      phone: '+233 26 555 1234',
      joinDate: '2024-02-15',
      permissions: ['view_orders'],
    },
    {
      id: '4',
      name: 'Lisa Cashier',
      email: 'lisa@restaurant.com',
      role: 'cashier',
      status: 'inactive',
      phone: '+233 24 777 8888',
      joinDate: '2024-01-20',
      permissions: ['manage_orders', 'view_reports'],
    },
  ];

  const roles = [
    { value: 'manager', label: 'Manager', description: 'Full access to all features' },
    { value: 'chef', label: 'Chef', description: 'Manage orders and view inventory' },
    { value: 'waiter', label: 'Waiter', description: 'View orders and customer service' },
    { value: 'cashier', label: 'Cashier', description: 'Handle payments and reports' },
  ];

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    setStaff(mockStaff);
  }, []);

  const handleAddStaff = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'waiter',
    });
    setShowAddModal(true);
  };

  const handleEditStaff = (staffMember: StaffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone || '',
      role: staffMember.role,
    });
    setShowAddModal(true);
  };

  const handleSaveStaff = () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newStaff: StaffMember = {
      id: editingStaff?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: 'active',
      joinDate: editingStaff?.joinDate || new Date().toISOString().split('T')[0],
      permissions: getRolePermissions(formData.role),
    };

    if (editingStaff) {
      setStaff(prev => prev.map(member => member.id === editingStaff.id ? newStaff : member));
    } else {
      setStaff(prev => [...prev, newStaff]);
    }

    setShowAddModal(false);
    setEditingStaff(null);
  };

  const handleToggleStatus = (staffId: string) => {
    setStaff(prev => prev.map(member => 
      member.id === staffId 
        ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
        : member
    ));
  };

  const handleDeleteStaff = (staffId: string) => {
    Alert.alert(
      'Delete Staff Member',
      'Are you sure you want to delete this staff member?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setStaff(prev => prev.filter(member => member.id !== staffId));
          },
        },
      ]
    );
  };

  const getRolePermissions = (role: string): string[] => {
    switch (role) {
      case 'manager':
        return ['manage_orders', 'manage_menu', 'manage_staff', 'view_reports', 'manage_inventory'];
      case 'chef':
        return ['manage_orders', 'view_inventory'];
      case 'waiter':
        return ['view_orders'];
      case 'cashier':
        return ['manage_orders', 'view_reports'];
      default:
        return [];
    }
  };

  const getRoleDescription = (role: string): string => {
    const roleInfo = roles.find(r => r.value === role);
    return roleInfo?.description || '';
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnimation }}>
          <Header>
            <Text variant="h2" weight="bold">Staff Management</Text>
            <Button
              title="Add Staff"
              onPress={handleAddStaff}
              icon="person-add"
            />
          </Header>

          {staff.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <Icon name="people" size={40} color="#9CA3AF" />
              </EmptyIcon>
              <Text variant="h3" color="secondary" style={{ marginBottom: 16 }}>
                No staff members yet
              </Text>
              <Text variant="body" color="secondary" align="center" style={{ marginBottom: 24 }}>
                Add your first staff member to get started
              </Text>
              <Button
                title="Add First Staff Member"
                onPress={handleAddStaff}
                fullWidth
              />
            </EmptyState>
          ) : (
            staff.map((member) => (
              <StaffCard key={member.id}>
                <StaffHeader>
                  <StaffAvatar>
                    <Icon name="person" size={24} color="#2ECC71" />
                  </StaffAvatar>
                  <StaffInfo>
                    <StaffName>{member.name}</StaffName>
                    <StaffEmail>{member.email}</StaffEmail>
                  </StaffInfo>
                  <StaffRole role={member.role}>
                    <RoleText role={member.role}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </RoleText>
                  </StaffRole>
                </StaffHeader>

                <StaffStatus status={member.status}>
                  <StatusDot status={member.status} />
                  <StatusText status={member.status}>
                    {member.status === 'active' ? 'Active' : 'Inactive'}
                  </StatusText>
                </StaffStatus>

                <StaffActions>
                  <ActionButton
                    variant="secondary"
                    onPress={() => handleEditStaff(member)}
                  >
                    <ActionButtonText variant="secondary">Edit</ActionButtonText>
                  </ActionButton>
                  <ActionButton
                    variant={member.status === 'active' ? 'secondary' : 'primary'}
                    onPress={() => handleToggleStatus(member.id)}
                  >
                    <ActionButtonText variant={member.status === 'active' ? 'secondary' : 'primary'}>
                      {member.status === 'active' ? 'Deactivate' : 'Activate'}
                    </ActionButtonText>
                  </ActionButton>
                  <ActionButton
                    variant="danger"
                    onPress={() => handleDeleteStaff(member.id)}
                  >
                    <ActionButtonText variant="danger">Delete</ActionButtonText>
                  </ActionButton>
                </StaffActions>
              </StaffCard>
            ))
          )}
        </Animated.View>
      </ScrollView>

      {/* Add/Edit Staff Modal */}
      {showAddModal && (
        <AddStaffModal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
              </ModalTitle>
              <CloseButton onPress={() => setShowAddModal(false)}>
                <Icon name="close" size={20} color="#9CA3AF" />
              </CloseButton>
            </ModalHeader>

            <FormSection>
              <SectionTitle>Basic Information</SectionTitle>
              
              <Input
                label="Full Name"
                placeholder="Enter full name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                leftIcon="person"
              />

              <Input
                label="Email"
                placeholder="Enter email address"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="email"
              />

              <Input
                label="Phone Number (Optional)"
                placeholder="Enter phone number"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
                leftIcon="phone"
              />
            </FormSection>

            <FormSection>
              <SectionTitle>Role & Permissions</SectionTitle>
              <RoleSelector>
                {roles.map((role) => (
                  <RoleOption
                    key={role.value}
                    selected={formData.role === role.value}
                    onPress={() => setFormData({ ...formData, role: role.value as any })}
                  >
                    <RoleOptionText selected={formData.role === role.value}>
                      {role.label}
                    </RoleOptionText>
                  </RoleOption>
                ))}
              </RoleSelector>
              <Text variant="body" color="secondary" style={{ marginTop: 8 }}>
                {getRoleDescription(formData.role)}
              </Text>
            </FormSection>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <Button
                title="Cancel"
                onPress={() => setShowAddModal(false)}
                variant="outline"
                style={{ flex: 0.48 }}
              />
              <Button
                title={editingStaff ? 'Update' : 'Add Staff'}
                onPress={handleSaveStaff}
                style={{ flex: 0.48 }}
              />
            </View>
          </ModalContent>
        </AddStaffModal>
      )}
    </Container>
  );
};

export default StaffManagementScreen;