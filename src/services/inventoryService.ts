import { api } from './api';
import { Ingredient, MenuItemIngredient } from '../types';

export const inventoryService = {
  // Get all ingredients for a restaurant
  getIngredients: async (restaurantId: string): Promise<Ingredient[]> => {
    const response = await api.get(`/restaurants/${restaurantId}/ingredients`);
    return response.data;
  },

  // Add a new ingredient
  addIngredient: async (ingredient: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt' | 'isLowStock'>): Promise<Ingredient> => {
    const response = await api.post('/ingredients', ingredient);
    return response.data;
  },

  // Update an ingredient
  updateIngredient: async (id: string, updates: Partial<Ingredient>): Promise<Ingredient> => {
    const response = await api.put(`/ingredients/${id}`, updates);
    return response.data;
  },

  // Delete an ingredient
  deleteIngredient: async (id: string): Promise<void> => {
    await api.delete(`/ingredients/${id}`);
  },

  // Update stock for an ingredient
  updateStock: async (id: string, newStock: number): Promise<Ingredient> => {
    const response = await api.patch(`/ingredients/${id}/stock`, { stock: newStock });
    return response.data;
  },

  // Check low stock items
  checkLowStock: async (restaurantId: string): Promise<Ingredient[]> => {
    const response = await api.get(`/restaurants/${restaurantId}/ingredients/low-stock`);
    return response.data;
  },

  // Get ingredients by category
  getIngredientsByCategory: async (restaurantId: string, category: string): Promise<Ingredient[]> => {
    const response = await api.get(`/restaurants/${restaurantId}/ingredients?category=${category}`);
    return response.data;
  },

  // Search ingredients
  searchIngredients: async (restaurantId: string, query: string): Promise<Ingredient[]> => {
    const response = await api.get(`/restaurants/${restaurantId}/ingredients/search?q=${query}`);
    return response.data;
  },

  // Update menu item ingredients
  updateMenuItemIngredients: async (menuItemId: string, ingredients: MenuItemIngredient[]): Promise<void> => {
    await api.put(`/menu-items/${menuItemId}/ingredients`, { ingredients });
  },

  // Check if menu item can be made with current stock
  checkMenuItemAvailability: async (menuItemId: string): Promise<{ canMake: boolean; missingIngredients: string[] }> => {
    const response = await api.get(`/menu-items/${menuItemId}/availability`);
    return response.data;
  },

  // Update menu item availability based on stock
  updateMenuItemAvailability: async (menuItemId: string): Promise<void> => {
    await api.patch(`/menu-items/${menuItemId}/availability`);
  },

  // Bulk update stock
  bulkUpdateStock: async (updates: { id: string; stock: number }[]): Promise<Ingredient[]> => {
    const response = await api.patch('/ingredients/bulk-stock', { updates });
    return response.data;
  },

  // Get inventory analytics
  getInventoryAnalytics: async (restaurantId: string): Promise<{
    totalIngredients: number;
    lowStockCount: number;
    totalValue: number;
    categoryBreakdown: { category: string; count: number; value: number }[];
  }> => {
    const response = await api.get(`/restaurants/${restaurantId}/inventory/analytics`);
    return response.data;
  },
};