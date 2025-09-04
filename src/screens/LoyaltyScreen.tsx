import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, Animated, Easing, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Text } from '../components/common/Text';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled(ScrollView)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const PointsCard = styled(Card)`
  background: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%);
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const PointsContent = styled.View`
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const PointsValue = styled(Text)`
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: 48px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: 8px;
`;

const PointsLabel = styled(Text)`
  color: rgba(255, 255, 255, 0.9);
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: 16px;
`;

const ProgressContainer = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

const ProgressBar = styled.View`
  height: 8px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.View<{ percentage: number }>`
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-radius: 4px;
`;

const ProgressText = styled(Text)`
  color: rgba(255, 255, 255, 0.9);
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  text-align: center;
  margin-top: 8px;
`;

const RewardsSection = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const RewardCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const RewardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const RewardInfo = styled.View`
  flex: 1;
`;

const RewardName = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-bottom: 4px;
`;

const RewardDescription = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const RewardPoints = styled.View`
  align-items: center;
`;

const PointsRequired = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const PointsText = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const RedeemButton = styled(Button)<{ disabled: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

const HistorySection = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const HistoryItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const HistoryIcon = styled.View<{ type: 'earn' | 'redeem' }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ type, theme }) => 
    type === 'earn' ? theme.colors.status.success + '20' : theme.colors.status.warning + '20'};
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const HistoryInfo = styled.View`
  flex: 1;
`;

const HistoryDescription = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.base}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: 4px;
`;

const HistoryDate = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const HistoryPoints = styled(Text)<{ type: 'earn' | 'redeem' }>`
  color: ${({ type, theme }) => 
    type === 'earn' ? theme.colors.status.success : theme.colors.status.warning};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const LoyaltyScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  // Mock data for demonstration
  const currentPoints = user?.loyaltyPoints || 1250;
  const nextRewardThreshold = 1500;
  const progressPercentage = (currentPoints / nextRewardThreshold) * 100;

  const rewards = [
    {
      id: '1',
      name: 'Free Delivery',
      description: 'Get free delivery on your next order',
      pointsRequired: 500,
      isAvailable: currentPoints >= 500,
    },
    {
      id: '2',
      name: '10% Discount',
      description: '10% off your next order',
      pointsRequired: 1000,
      isAvailable: currentPoints >= 1000,
    },
    {
      id: '3',
      name: 'Free Appetizer',
      description: 'Choose any appetizer for free',
      pointsRequired: 1500,
      isAvailable: currentPoints >= 1500,
    },
    {
      id: '4',
      name: 'VIP Status',
      description: 'Priority support and exclusive offers',
      pointsRequired: 5000,
      isAvailable: currentPoints >= 5000,
    },
  ];

  const history = [
    {
      id: '1',
      type: 'earn' as const,
      description: 'Order completed',
      points: 50,
      date: '2 hours ago',
    },
    {
      id: '2',
      type: 'redeem' as const,
      description: 'Redeemed free delivery',
      points: -500,
      date: '1 day ago',
    },
    {
      id: '3',
      type: 'earn' as const,
      description: 'Order completed',
      points: 75,
      date: '3 days ago',
    },
    {
      id: '4',
      type: 'earn' as const,
      description: 'First order bonus',
      points: 100,
      date: '1 week ago',
    },
  ];

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRedeemReward = (rewardId: string) => {
    // Handle reward redemption
    console.log('Redeeming reward:', rewardId);
  };

  return (
    <Container>
      <Content showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnimation }}>
          {/* Points Card */}
          <PointsCard>
            <PointsContent>
              <PointsValue>{currentPoints.toLocaleString()}</PointsValue>
              <PointsLabel>Loyalty Points</PointsLabel>
              
              <ProgressContainer>
                <ProgressBar>
                  <ProgressFill percentage={Math.min(progressPercentage, 100)} />
                </ProgressBar>
                <ProgressText>
                  {nextRewardThreshold - currentPoints} points to next reward
                </ProgressText>
              </ProgressContainer>
            </PointsContent>
          </PointsCard>

          {/* Available Rewards */}
          <RewardsSection>
            <SectionTitle>Available Rewards</SectionTitle>
            {rewards.map((reward) => (
              <RewardCard key={reward.id}>
                <RewardHeader>
                  <RewardInfo>
                    <RewardName>{reward.name}</RewardName>
                    <RewardDescription>{reward.description}</RewardDescription>
                  </RewardInfo>
                  <RewardPoints>
                    <PointsRequired>{reward.pointsRequired}</PointsRequired>
                    <PointsText>points</PointsText>
                  </RewardPoints>
                </RewardHeader>
                <RedeemButton
                  title={reward.isAvailable ? 'Redeem' : 'Not Enough Points'}
                  onPress={() => handleRedeemReward(reward.id)}
                  disabled={!reward.isAvailable}
                  fullWidth
                />
              </RewardCard>
            ))}
          </RewardsSection>

          {/* Points History */}
          <HistorySection>
            <SectionTitle>Points History</SectionTitle>
            {history.map((item) => (
              <HistoryItem key={item.id}>
                <HistoryIcon type={item.type}>
                  <Icon 
                    name={item.type === 'earn' ? 'add' : 'remove'} 
                    size={20} 
                    color={item.type === 'earn' ? '#10B981' : '#F59E0B'} 
                  />
                </HistoryIcon>
                <HistoryInfo>
                  <HistoryDescription>{item.description}</HistoryDescription>
                  <HistoryDate>{item.date}</HistoryDate>
                </HistoryInfo>
                <HistoryPoints type={item.type}>
                  {item.type === 'earn' ? '+' : ''}{item.points}
                </HistoryPoints>
              </HistoryItem>
            ))}
          </HistorySection>
        </Animated.View>
      </Content>
    </Container>
  );
};

export default LoyaltyScreen;