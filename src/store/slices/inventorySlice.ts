import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Ingredient, MenuItemIngredient } from '../../types';
import { inventoryService } from '../../services/inventoryService';

interface InventoryState {
  ingredients: Ingredient[];
  isLoading: boolean;
  error: string | null;
  lowStockItems: Ingredient[];
  selectedCategory: string | null;
  searchQuery: string;
}

const initialState: InventoryState = {
  ingredients: [],
  isLoading: false,
  error: null,
  lowStockItems: [],
  selectedCategory: null,
  searchQuery: '',
};

// Async thunks
export const fetchIngredients = createAsyncThunk(
  'inventory/fetchIngredients',
  async (restaurantId: string) => {
    const response = await inventoryService.getIngredients(restaurantId);
    return response;
  }
);

export const addIngredient = createAsyncThunk(
  'inventory/addIngredient',
  async (ingredient: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt' | 'isLowStock'>) => {
    const response = await inventoryService.addIngredient(ingredient);
    return response;
  }
);

export const updateIngredient = createAsyncThunk(
  'inventory/updateIngredient',
  async ({ id, updates }: { id: string; updates: Partial<Ingredient> }) => {
    const response = await inventoryService.updateIngredient(id, updates);
    return response;
  }
);

export const deleteIngredient = createAsyncThunk(
  'inventory/deleteIngredient',
  async (id: string) => {
    await inventoryService.deleteIngredient(id);
    return id;
  }
);

export const updateStock = createAsyncThunk(
  'inventory/updateStock',
  async ({ id, newStock }: { id: string; newStock: number }) => {
    const response = await inventoryService.updateStock(id, newStock);
    return response;
  }
);

export const checkLowStock = createAsyncThunk(
  'inventory/checkLowStock',
  async (restaurantId: string) => {
    const response = await inventoryService.checkLowStock(restaurantId);
    return response;
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateIngredientStock: (state, action: PayloadAction<{ id: string; stock: number }>) => {
      const ingredient = state.ingredients.find(ing => ing.id === action.payload.id);
      if (ingredient) {
        ingredient.currentStock = action.payload.stock;
        ingredient.isLowStock = ingredient.currentStock <= ingredient.minimumStock;
      }
    },
    markAsLowStock: (state, action: PayloadAction<string>) => {
      const ingredient = state.ingredients.find(ing => ing.id === action.payload);
      if (ingredient) {
        ingredient.isLowStock = true;
        if (!state.lowStockItems.find(item => item.id === action.payload)) {
          state.lowStockItems.push(ingredient);
        }
      }
    },
    clearLowStock: (state, action: PayloadAction<string>) => {
      const ingredient = state.ingredients.find(ing => ing.id === action.payload);
      if (ingredient) {
        ingredient.isLowStock = false;
        state.lowStockItems = state.lowStockItems.filter(item => item.id !== action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch ingredients
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
        state.lowStockItems = action.payload.filter(ing => ing.isLowStock);
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch ingredients';
      })
      
      // Add ingredient
      .addCase(addIngredient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addIngredient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients.push(action.payload);
        if (action.payload.isLowStock) {
          state.lowStockItems.push(action.payload);
        }
      })
      .addCase(addIngredient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add ingredient';
      })
      
      // Update ingredient
      .addCase(updateIngredient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateIngredient.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.ingredients.findIndex(ing => ing.id === action.payload.id);
        if (index !== -1) {
          state.ingredients[index] = action.payload;
          
          // Update low stock items
          if (action.payload.isLowStock) {
            const lowStockIndex = state.lowStockItems.findIndex(item => item.id === action.payload.id);
            if (lowStockIndex === -1) {
              state.lowStockItems.push(action.payload);
            } else {
              state.lowStockItems[lowStockIndex] = action.payload;
            }
          } else {
            state.lowStockItems = state.lowStockItems.filter(item => item.id !== action.payload.id);
          }
        }
      })
      .addCase(updateIngredient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update ingredient';
      })
      
      // Delete ingredient
      .addCase(deleteIngredient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteIngredient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = state.ingredients.filter(ing => ing.id !== action.payload);
        state.lowStockItems = state.lowStockItems.filter(item => item.id !== action.payload);
      })
      .addCase(deleteIngredient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete ingredient';
      })
      
      // Update stock
      .addCase(updateStock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.ingredients.findIndex(ing => ing.id === action.payload.id);
        if (index !== -1) {
          state.ingredients[index] = action.payload;
          
          // Update low stock status
          if (action.payload.isLowStock) {
            const lowStockIndex = state.lowStockItems.findIndex(item => item.id === action.payload.id);
            if (lowStockIndex === -1) {
              state.lowStockItems.push(action.payload);
            } else {
              state.lowStockItems[lowStockIndex] = action.payload;
            }
          } else {
            state.lowStockItems = state.lowStockItems.filter(item => item.id !== action.payload.id);
          }
        }
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update stock';
      })
      
      // Check low stock
      .addCase(checkLowStock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkLowStock.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lowStockItems = action.payload;
      })
      .addCase(checkLowStock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to check low stock';
      });
  },
});

export const {
  setSelectedCategory,
  setSearchQuery,
  clearError,
  updateIngredientStock,
  markAsLowStock,
  clearLowStock,
} = inventorySlice.actions;

export default inventorySlice.reducer;