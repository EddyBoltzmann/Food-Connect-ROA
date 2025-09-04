import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Animated, Easing } from 'react-native';
import styled from 'styled-components/native';
import { Text } from '../common/Text';
import { Card } from '../common/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NotificationContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const NotificationCard = styled(Card)<{ type: 'success' | 'warning' | 'error' | 'info' }>`
  margin: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'success':
        return theme.colors.status.success;
      case 'warning':
        return theme.colors.status.warning;
      case 'error':
        return theme.colors.status.error;
      case 'info':
        return theme.colors.status.info;
      default:
        return theme.colors.primary;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 8;
`;

const NotificationContent = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const NotificationIcon = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const NotificationText = styled.View`
  flex: 1;
`;

const NotificationTitle = styled(Text)`
  color: ${({ theme }) => theme.colors.neutral.white};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: 4px;
`;

const NotificationMessage = styled(Text)`
  color: rgba(255, 255, 255, 0.9);
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const CloseButton = styled(TouchableOpacity)`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.2);
  justify-content: center;
  align-items: center;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const ProgressBar = styled.View`
  height: 3px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.View<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-radius: 2px;
`;

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
  autoClose?: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onRemove,
}) => {
  const [progressAnimations, setProgressAnimations] = useState<{ [key: string]: Animated.Value }>({});

  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.autoClose !== false && notification.duration) {
        const progressAnimation = new Animated.Value(0);
        setProgressAnimations(prev => ({ ...prev, [notification.id]: progressAnimation }));

        // Animate progress bar
        Animated.timing(progressAnimation, {
          toValue: 100,
          duration: notification.duration,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();

        // Auto remove notification
        setTimeout(() => {
          onRemove(notification.id);
        }, notification.duration);
      }
    });
  }, [notifications, onRemove]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'notifications';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <NotificationContainer>
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} type={notification.type}>
          <NotificationContent>
            <NotificationIcon>
              <Icon 
                name={getIcon(notification.type)} 
                size={20} 
                color="#FFFFFF" 
              />
            </NotificationIcon>
            <NotificationText>
              <NotificationTitle>{notification.title}</NotificationTitle>
              <NotificationMessage>{notification.message}</NotificationMessage>
            </NotificationText>
            <CloseButton onPress={() => onRemove(notification.id)}>
              <Icon name="close" size={16} color="#FFFFFF" />
            </CloseButton>
          </NotificationContent>
          {notification.autoClose !== false && notification.duration && progressAnimations[notification.id] && (
            <ProgressBar>
              <Animated.View
                style={{
                  height: '100%',
                  width: progressAnimations[notification.id].interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: '#FFFFFF',
                  borderRadius: 2,
                }}
              />
            </ProgressBar>
          )}
        </NotificationCard>
      ))}
    </NotificationContainer>
  );
};

export default NotificationCenter;