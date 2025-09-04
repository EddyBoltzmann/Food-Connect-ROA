import { apiService } from './api';
import { LoyaltyTransaction, LoyaltyReward } from '../types';

class LoyaltyService {
  async getLoyaltyData(): Promise<{
    points: number;
    transactions: LoyaltyTransaction[];
    rewards: LoyaltyReward[];
  }> {
    try {
      const response = await apiService.get<{
        points: number;
        transactions: LoyaltyTransaction[];
        rewards: LoyaltyReward[];
      }>('/loyalty/data');
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch loyalty data');
    }
  }

  async getLoyaltyTransactions(): Promise<LoyaltyTransaction[]> {
    try {
      const response = await apiService.get<LoyaltyTransaction[]>('/loyalty/transactions');
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch loyalty transactions');
    }
  }

  async getLoyaltyRewards(): Promise<LoyaltyReward[]> {
    try {
      const response = await apiService.get<LoyaltyReward[]>('/loyalty/rewards');
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch loyalty rewards');
    }
  }

  async earnPoints(orderId: string, points: number): Promise<{
    points: number;
    transaction: LoyaltyTransaction;
  }> {
    try {
      const response = await apiService.post<{
        points: number;
        transaction: LoyaltyTransaction;
      }>('/loyalty/earn', {
        orderId,
        points,
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to earn points');
    }
  }

  async redeemReward(rewardId: string): Promise<{
    points: number;
    transaction: LoyaltyTransaction;
  }> {
    try {
      const response = await apiService.post<{
        points: number;
        transaction: LoyaltyTransaction;
      }>('/loyalty/redeem', {
        rewardId,
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to redeem reward');
    }
  }

  async getLoyaltyTier(): Promise<{
    tier: string;
    pointsToNextTier: number;
    benefits: string[];
  }> {
    try {
      const response = await apiService.get<{
        tier: string;
        pointsToNextTier: number;
        benefits: string[];
      }>('/loyalty/tier');
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch loyalty tier');
    }
  }

  async getLoyaltyHistory(params?: {
    type?: 'earn' | 'redeem';
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    transactions: LoyaltyTransaction[];
    total: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.type) queryParams.append('type', params.type);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const response = await apiService.get<{
        transactions: LoyaltyTransaction[];
        total: number;
      }>(`/loyalty/history?${queryParams.toString()}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch loyalty history');
    }
  }

  async transferPoints(recipientEmail: string, points: number): Promise<{
    points: number;
    transaction: LoyaltyTransaction;
  }> {
    try {
      const response = await apiService.post<{
        points: number;
        transaction: LoyaltyTransaction;
      }>('/loyalty/transfer', {
        recipientEmail,
        points,
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to transfer points');
    }
  }

  async getLoyaltyStats(): Promise<{
    totalPointsEarned: number;
    totalPointsRedeemed: number;
    totalOrders: number;
    averageOrderValue: number;
    favoriteRestaurant: string;
  }> {
    try {
      const response = await apiService.get<{
        totalPointsEarned: number;
        totalPointsRedeemed: number;
        totalOrders: number;
        averageOrderValue: number;
        favoriteRestaurant: string;
      }>('/loyalty/stats');
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch loyalty stats');
    }
  }
}

export const loyaltyService = new LoyaltyService();
export default loyaltyService;