import React, { useRef, useEffect } from 'react';
import { View, ScrollView, Animated, Easing } from 'react-native';
import styled from 'styled-components/native';
import { Text } from '../components/common/Text';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled(ScrollView)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const ProfileScreen: React.FC = () => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Container>
      <Content>
        <Animated.View style={{ opacity: fadeAnimation }}>
          <Text variant="h2" weight="bold" style={{ marginBottom: 20 }}>
            Profile
          </Text>
          <Text variant="body">Profile functionality coming soon...</Text>
        </Animated.View>
      </Content>
    </Container>
  );
};

export default ProfileScreen;