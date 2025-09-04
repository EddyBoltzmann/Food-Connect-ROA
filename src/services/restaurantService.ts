import { apiService } from './api';
import { Restaurant, MenuCategory } from '../types';

class RestaurantService {
  async getRestaurants(params?: {
    latitude?: number;
    longitude?: number;
    category?: string;
    search?: string;
  }): Promise<Restaurant[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.latitude) queryParams.append('latitude', params.latitude.toString());
      if (params?.longitude) queryParams.append('longitude', params.longitude.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);

      const response = await apiService.get<Restaurant[]>(`/restaurants?${queryParams.toString()}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch restaurants');
    }
  }

  async getRestaurantById(restaurantId: string): Promise<Restaurant> {
    try {
      const response = await apiService.get<Restaurant>(`/restaurants/${restaurantId}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch restaurant');
    }
  }

  async getRestaurantMenu(restaurantId: string): Promise<MenuCategory[]> {
    try {
      const response = await apiService.get<MenuCategory[]>(`/menu/${restaurantId}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch menu');
    }
  }

  async getNearbyRestaurants(latitude: number, longitude: number, maxDistance: number = 10000): Promise<Restaurant[]> {
    try {
      const response = await apiService.get<Restaurant[]>(
        `/restaurants/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch nearby restaurants');
    }
  }

  async searchRestaurants(query: string): Promise<Restaurant[]> {
    try {
      const response = await apiService.get<Restaurant[]>(`/restaurants/search?q=${encodeURIComponent(query)}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to search restaurants');
    }
  }

  async getRestaurantReviews(restaurantId: string): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>(`/restaurants/${restaurantId}/reviews`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch reviews');
    }
  }

  async createRestaurant(restaurantData: Partial<Restaurant>): Promise<Restaurant> {
    try {
      const response = await apiService.post<Restaurant>('/restaurants', restaurantData);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create restaurant');
    }
  }

  async updateRestaurant(restaurantId: string, restaurantData: Partial<Restaurant>): Promise<Restaurant> {
    try {
      const response = await apiService.put<Restaurant>(`/restaurants/${restaurantId}`, restaurantData);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update restaurant');
    }
  }

  async deleteRestaurant(restaurantId: string): Promise<void> {
    try {
      await apiService.delete(`/restaurants/${restaurantId}`);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete restaurant');
    }
  }
}

export const restaurantService = new RestaurantService();
export default restaurantService;