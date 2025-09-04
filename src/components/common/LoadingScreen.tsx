import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { Text } from './Text';
import Logo from './Logo';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

const LogoContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']}px;
`;

const LoadingContainer = styled.View`
  align-items: center;
`;

const LoadingText = styled(Text)`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const LoadingScreen: React.FC = () => {
  return (
    <Container>
      <LogoContainer>
        <Logo size="large" />
      </LogoContainer>
      
      <LoadingContainer>
        <ActivityIndicator size="large" color="#2ECC71" />
        <LoadingText variant="body" weight="medium">
          Loading Food Connect...
        </LoadingText>
      </LoadingContainer>
    </Container>
  );
};

export default LoadingScreen;