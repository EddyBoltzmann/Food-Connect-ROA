import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, CartItem, MenuItem, SelectedCustomization } from '../../types';

const initialState: CartState = {
  items: [],
  restaurantId: null,
  subtotal: 0,
  deliveryFee: 0,
  tax: 0,
  discount: 0,
  total: 0,
  loyaltyPointsUsed: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{
      menuItem: MenuItem;
      quantity: number;
      customizations: SelectedCustomization[];
      restaurantId: string;
    }>) => {
      const { menuItem, quantity, customizations, restaurantId } = action.payload;
      
      // If cart is empty or from different restaurant, clear it
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
        state.restaurantId = restaurantId;
      } else if (!state.restaurantId) {
        state.restaurantId = restaurantId;
      }

      // Calculate customizations total
      const customizationsTotal = customizations.reduce((total, customization) => {
        return total + customization.optionIds.reduce((optionTotal, optionId) => {
          const option = menuItem.customizations
            .find(c => c.id === customization.customizationId)
            ?.options.find(o => o.id === optionId);
          return optionTotal + (option?.price || 0);
        }, 0);
      }, 0);

      const itemTotal = (menuItem.price + customizationsTotal) * quantity;

      // Check if item with same customizations already exists
      const existingItemIndex = state.items.findIndex(item => 
        item.menuItem.id === menuItem.id &&
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        state.items[existingItemIndex].quantity += quantity;
        state.items[existingItemIndex].total += itemTotal;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${menuItem.id}-${Date.now()}`,
          menuItem,
          quantity,
          customizations,
          total: itemTotal,
        };
        state.items.push(newItem);
      }

      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      
      // If cart is empty, clear restaurant
      if (state.items.length === 0) {
        state.restaurantId = null;
      }
      
      cartSlice.caseReducers.calculateTotals(state);
    },

    updateQuantity: (state, action: PayloadAction<{
      itemId: string;
      quantity: number;
    }>) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== itemId);
        } else {
          const basePrice = item.menuItem.price;
          const customizationsTotal = item.customizations.reduce((total, customization) => {
            return total + customization.optionIds.reduce((optionTotal, optionId) => {
              const option = item.menuItem.customizations
                .find(c => c.id === customization.customizationId)
                ?.options.find(o => o.id === optionId);
              return optionTotal + (option?.price || 0);
            }, 0);
          }, 0);
          
          item.quantity = quantity;
          item.total = (basePrice + customizationsTotal) * quantity;
        }
      }

      // If cart is empty, clear restaurant
      if (state.items.length === 0) {
        state.restaurantId = null;
      }
      
      cartSlice.caseReducers.calculateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.subtotal = 0;
      state.deliveryFee = 0;
      state.tax = 0;
      state.discount = 0;
      state.total = 0;
      state.loyaltyPointsUsed = 0;
    },

    setDeliveryFee: (state, action: PayloadAction<number>) => {
      state.deliveryFee = action.payload;
      cartSlice.caseReducers.calculateTotals(state);
    },

    setDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
      cartSlice.caseReducers.calculateTotals(state);
    },

    setLoyaltyPointsUsed: (state, action: PayloadAction<number>) => {
      state.loyaltyPointsUsed = action.payload;
      cartSlice.caseReducers.calculateTotals(state);
    },

    calculateTotals: (state) => {
      state.subtotal = state.items.reduce((total, item) => total + item.total, 0);
      
      // Calculate tax (assuming 10% tax rate)
      state.tax = state.subtotal * 0.1;
      
      // Calculate total
      state.total = state.subtotal + state.deliveryFee + state.tax - state.discount;
      
      // Ensure total is not negative
      if (state.total < 0) {
        state.total = 0;
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setDeliveryFee,
  setDiscount,
  setLoyaltyPointsUsed,
} = cartSlice.actions;

export default cartSlice.reducer;