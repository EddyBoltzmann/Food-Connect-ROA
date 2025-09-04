import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Restaurant, MenuCategory, RestaurantsState } from '../../types';
import { restaurantService } from '../../services/restaurantService';

const initialState: RestaurantsState = {
  restaurants: [],
  currentRestaurant: null,
  menu: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async (params: { latitude?: number; longitude?: number; category?: string }, { rejectWithValue }) => {
    try {
      const response = await restaurantService.getRestaurants(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch restaurants');
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'restaurants/fetchRestaurantById',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      const response = await restaurantService.getRestaurantById(restaurantId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch restaurant');
    }
  }
);

export const fetchRestaurantMenu = createAsyncThunk(
  'restaurants/fetchRestaurantMenu',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      const response = await restaurantService.getRestaurantMenu(restaurantId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch menu');
    }
  }
);

const restaurantsSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRestaurant: (state, action: PayloadAction<Restaurant | null>) => {
      state.currentRestaurant = action.payload;
    },
    clearCurrentRestaurant: (state) => {
      state.currentRestaurant = null;
      state.menu = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch restaurants
      .addCase(fetchRestaurants.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.restaurants = action.payload;
        state.error = null;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch restaurant by ID
      .addCase(fetchRestaurantById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRestaurant = action.payload;
        state.error = null;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch restaurant menu
      .addCase(fetchRestaurantMenu.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.menu = action.payload;
        state.error = null;
      })
      .addCase(fetchRestaurantMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentRestaurant, clearCurrentRestaurant } = restaurantsSlice.actions;
export default restaurantsSlice.reducer;