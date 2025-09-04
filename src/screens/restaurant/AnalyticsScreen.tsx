import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, Animated, Easing, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

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

const TimeFilterContainer = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: 4px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const TimeFilterButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary : 'transparent'};
  align-items: center;
`;

const TimeFilterText = styled(Text)<{ active: boolean }>`
  color: ${({ active, theme }) => 
    active ? theme.colors.neutral.white : theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StatCard = styled(Card)`
  width: ${(width - 60) / 2}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StatIcon = styled.View<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${({ color }) => color + '20'};
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StatValue = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: 4px;
`;

const StatLabel = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  text-align: center;
`;

const ChartCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const ChartHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const ChartTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const ChartContainer = styled.View`
  height: 200px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const ChartPlaceholder = styled.View`
  align-items: center;
`;

const ChartPlaceholderText = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const TopItemsCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const TopItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const ItemRank = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.primary + '20'};
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const RankText = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const ItemInfo = styled.View`
  flex: 1;
`;

const ItemName = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: 2px;
`;

const ItemStats = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const ItemValue = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const RevenueCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const RevenueItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const RevenueLabel = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RevenueValue = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const PerformanceCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const PerformanceItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const PerformanceLabel = styled(Text)`
  flex: 1;
`;

const PerformanceBar = styled.View`
  flex: 2;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.neutral.lightGray};
  border-radius: 4px;
  margin: 0 ${({ theme }) => theme.spacing.md}px;
  overflow: hidden;
`;

const PerformanceFill = styled.View<{ percentage: number; color: string }>`
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  background-color: ${({ color }) => color};
  border-radius: 4px;
`;

const PerformanceValue = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  min-width: 40px;
  text-align: right;
`;

type TimeFilter = 'today' | 'week' | 'month' | 'year';

const AnalyticsScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTimeFilter, setActiveTimeFilter] = useState<TimeFilter>('week');
  
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  // Mock analytics data
  const analyticsData = {
    today: {
      orders: 12,
      revenue: 245.50,
      customers: 8,
      avgOrderValue: 20.46,
      topItems: [
        { name: 'Margherita Pizza', orders: 5, revenue: 84.95 },
        { name: 'Caesar Salad', orders: 4, revenue: 51.96 },
        { name: 'Chicken Burger', orders: 3, revenue: 44.97 },
      ],
      revenueBreakdown: {
        delivery: 180.50,
        pickup: 65.00,
      },
      performance: {
        orderCompletion: 95,
        customerSatisfaction: 4.8,
        averagePrepTime: 18,
      },
    },
    week: {
      orders: 89,
      revenue: 1845.75,
      customers: 67,
      avgOrderValue: 20.74,
      topItems: [
        { name: 'Margherita Pizza', orders: 32, revenue: 543.68 },
        { name: 'Caesar Salad', orders: 28, revenue: 363.72 },
        { name: 'Chicken Burger', orders: 19, revenue: 284.81 },
        { name: 'Pasta Carbonara', orders: 15, revenue: 284.85 },
      ],
      revenueBreakdown: {
        delivery: 1345.75,
        pickup: 500.00,
      },
      performance: {
        orderCompletion: 97,
        customerSatisfaction: 4.7,
        averagePrepTime: 16,
      },
    },
    month: {
      orders: 342,
      revenue: 7125.30,
      customers: 245,
      avgOrderValue: 20.84,
      topItems: [
        { name: 'Margherita Pizza', orders: 125, revenue: 2123.75 },
        { name: 'Caesar Salad', orders: 98, revenue: 1273.02 },
        { name: 'Chicken Burger', orders: 76, revenue: 1139.24 },
        { name: 'Pasta Carbonara', orders: 65, revenue: 1234.35 },
      ],
      revenueBreakdown: {
        delivery: 5125.30,
        pickup: 2000.00,
      },
      performance: {
        orderCompletion: 96,
        customerSatisfaction: 4.6,
        averagePrepTime: 17,
      },
    },
    year: {
      orders: 4125,
      revenue: 85675.50,
      customers: 2890,
      avgOrderValue: 20.77,
      topItems: [
        { name: 'Margherita Pizza', orders: 1456, revenue: 24747.44 },
        { name: 'Caesar Salad', orders: 1234, revenue: 16042.02 },
        { name: 'Chicken Burger', orders: 987, revenue: 14795.13 },
        { name: 'Pasta Carbonara', orders: 876, revenue: 16644.24 },
      ],
      revenueBreakdown: {
        delivery: 61675.50,
        pickup: 24000.00,
      },
      performance: {
        orderCompletion: 95,
        customerSatisfaction: 4.5,
        averagePrepTime: 18,
      },
    },
  };

  const currentData = analyticsData[activeTimeFilter];

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const getTimeFilterLabel = (filter: TimeFilter) => {
    switch (filter) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
    }
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnimation }}>
          <Header>
            <Text variant="h2" weight="bold">Analytics</Text>
            <Icon name="analytics" size={24} color="#2ECC71" />
          </Header>

          {/* Time Filter */}
          <TimeFilterContainer>
            {(['today', 'week', 'month', 'year'] as TimeFilter[]).map((filter) => (
              <TimeFilterButton
                key={filter}
                active={activeTimeFilter === filter}
                onPress={() => setActiveTimeFilter(filter)}
              >
                <TimeFilterText active={activeTimeFilter === filter}>
                  {getTimeFilterLabel(filter)}
                </TimeFilterText>
              </TimeFilterButton>
            ))}
          </TimeFilterContainer>

          {/* Key Stats */}
          <StatsGrid>
            <StatCard>
              <StatIcon color="#2ECC71">
                <Icon name="receipt" size={24} color="#2ECC71" />
              </StatIcon>
              <StatValue>{currentData.orders}</StatValue>
              <StatLabel>Total Orders</StatLabel>
            </StatCard>

            <StatCard>
              <StatIcon color="#FF8C42">
                <Icon name="attach-money" size={24} color="#FF8C42" />
              </StatIcon>
              <StatValue>GHS {currentData.revenue.toFixed(0)}</StatValue>
              <StatLabel>Revenue</StatLabel>
            </StatCard>

            <StatCard>
              <StatIcon color="#3B82F6">
                <Icon name="people" size={24} color="#3B82F6" />
              </StatIcon>
              <StatValue>{currentData.customers}</StatValue>
              <StatLabel>Customers</StatLabel>
            </StatCard>

            <StatCard>
              <StatIcon color="#8B5CF6">
                <Icon name="trending-up" size={24} color="#8B5CF6" />
              </StatIcon>
              <StatValue>GHS {currentData.avgOrderValue.toFixed(2)}</StatValue>
              <StatLabel>Avg Order Value</StatLabel>
            </StatCard>
          </StatsGrid>

          {/* Revenue Chart */}
          <ChartCard>
            <ChartHeader>
              <ChartTitle>Revenue Trend</ChartTitle>
              <Icon name="show-chart" size={20} color="#2ECC71" />
            </ChartHeader>
            <ChartContainer>
              <ChartPlaceholder>
                <Icon name="show-chart" size={48} color="#9CA3AF" />
                <ChartPlaceholderText>Revenue chart visualization</ChartPlaceholderText>
              </ChartPlaceholder>
            </ChartContainer>
          </ChartCard>

          {/* Top Selling Items */}
          <TopItemsCard>
            <ChartHeader>
              <ChartTitle>Top Selling Items</ChartTitle>
              <Icon name="restaurant-menu" size={20} color="#2ECC71" />
            </ChartHeader>
            {currentData.topItems.map((item, index) => (
              <TopItem key={index}>
                <ItemRank>
                  <RankText>{index + 1}</RankText>
                </ItemRank>
                <ItemInfo>
                  <ItemName>{item.name}</ItemName>
                  <ItemStats>{item.orders} orders</ItemStats>
                </ItemInfo>
                <ItemValue>GHS {item.revenue.toFixed(2)}</ItemValue>
              </TopItem>
            ))}
          </TopItemsCard>

          {/* Revenue Breakdown */}
          <RevenueCard>
            <ChartHeader>
              <ChartTitle>Revenue Breakdown</ChartTitle>
              <Icon name="pie-chart" size={20} color="#2ECC71" />
            </ChartHeader>
            <RevenueItem>
              <RevenueLabel>Delivery Orders</RevenueLabel>
              <RevenueValue>GHS {currentData.revenueBreakdown.delivery.toFixed(2)}</RevenueValue>
            </RevenueItem>
            <RevenueItem>
              <RevenueLabel>Pickup Orders</RevenueLabel>
              <RevenueValue>GHS {currentData.revenueBreakdown.pickup.toFixed(2)}</RevenueValue>
            </RevenueItem>
          </RevenueCard>

          {/* Performance Metrics */}
          <PerformanceCard>
            <ChartHeader>
              <ChartTitle>Performance Metrics</ChartTitle>
              <Icon name="speed" size={20} color="#2ECC71" />
            </ChartHeader>
            
            <PerformanceItem>
              <PerformanceLabel>Order Completion Rate</PerformanceLabel>
              <PerformanceBar>
                <PerformanceFill 
                  percentage={currentData.performance.orderCompletion} 
                  color="#10B981" 
                />
              </PerformanceBar>
              <PerformanceValue>{currentData.performance.orderCompletion}%</PerformanceValue>
            </PerformanceItem>

            <PerformanceItem>
              <PerformanceLabel>Customer Satisfaction</PerformanceLabel>
              <PerformanceBar>
                <PerformanceFill 
                  percentage={(currentData.performance.customerSatisfaction / 5) * 100} 
                  color="#3B82F6" 
                />
              </PerformanceBar>
              <PerformanceValue>{currentData.performance.customerSatisfaction}/5</PerformanceValue>
            </PerformanceItem>

            <PerformanceItem>
              <PerformanceLabel>Avg Prep Time</PerformanceLabel>
              <PerformanceBar>
                <PerformanceFill 
                  percentage={Math.max(0, 100 - (currentData.performance.averagePrepTime / 30) * 100)} 
                  color="#F59E0B" 
                />
              </PerformanceBar>
              <PerformanceValue>{currentData.performance.averagePrepTime}m</PerformanceValue>
            </PerformanceItem>
          </PerformanceCard>
        </Animated.View>
      </ScrollView>
    </Container>
  );
};

export default AnalyticsScreen;