import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LoyaltyTransaction, LoyaltyReward, LoyaltyState } from '../../types';
import { loyaltyService } from '../../services/loyaltyService';

const initialState: LoyaltyState = {
  points: 0,
  transactions: [],
  rewards: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchLoyaltyData = createAsyncThunk(
  'loyalty/fetchLoyaltyData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await loyaltyService.getLoyaltyData();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch loyalty data');
    }
  }
);

export const fetchLoyaltyTransactions = createAsyncThunk(
  'loyalty/fetchLoyaltyTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await loyaltyService.getLoyaltyTransactions();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch loyalty transactions');
    }
  }
);

export const fetchLoyaltyRewards = createAsyncThunk(
  'loyalty/fetchLoyaltyRewards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await loyaltyService.getLoyaltyRewards();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch loyalty rewards');
    }
  }
);

export const redeemReward = createAsyncThunk(
  'loyalty/redeemReward',
  async (rewardId: string, { rejectWithValue }) => {
    try {
      const response = await loyaltyService.redeemReward(rewardId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to redeem reward');
    }
  }
);

export const earnPoints = createAsyncThunk(
  'loyalty/earnPoints',
  async ({ orderId, points }: { orderId: string; points: number }, { rejectWithValue }) => {
    try {
      const response = await loyaltyService.earnPoints(orderId, points);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to earn points');
    }
  }
);

const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addTransaction: (state, action: PayloadAction<LoyaltyTransaction>) => {
      state.transactions.unshift(action.payload);
    },
    updatePoints: (state, action: PayloadAction<number>) => {
      state.points = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch loyalty data
      .addCase(fetchLoyaltyData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLoyaltyData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.points = action.payload.points;
        state.transactions = action.payload.transactions;
        state.rewards = action.payload.rewards;
        state.error = null;
      })
      .addCase(fetchLoyaltyData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch loyalty transactions
      .addCase(fetchLoyaltyTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLoyaltyTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
        state.error = null;
      })
      .addCase(fetchLoyaltyTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch loyalty rewards
      .addCase(fetchLoyaltyRewards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLoyaltyRewards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rewards = action.payload;
        state.error = null;
      })
      .addCase(fetchLoyaltyRewards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Redeem reward
      .addCase(redeemReward.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(redeemReward.fulfilled, (state, action) => {
        state.isLoading = false;
        state.points = action.payload.points;
        state.transactions.unshift(action.payload.transaction);
        state.error = null;
      })
      .addCase(redeemReward.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Earn points
      .addCase(earnPoints.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(earnPoints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.points = action.payload.points;
        state.transactions.unshift(action.payload.transaction);
        state.error = null;
      })
      .addCase(earnPoints.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, addTransaction, updatePoints } = loyaltySlice.actions;
export default loyaltySlice.reducer;