import { apiService } from './api';
import { Order } from '../types';

class OrderService {
  async createOrder(orderData: {
    restaurantId: string;
    items: any[];
    deliveryAddress: any;
    paymentMethod: string;
    notes?: string;
    loyaltyPointsUsed?: number;
  }): Promise<Order> {
    try {
      const response = await apiService.post<Order>('/orders', orderData);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create order');
    }
  }

  async getOrders(): Promise<Order[]> {
    try {
      const response = await apiService.get<Order[]>('/orders');
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch orders');
    }
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await apiService.get<Order>(`/orders/${orderId}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch order');
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    try {
      const response = await apiService.patch<Order>(`/orders/${orderId}/status`, { status });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update order status');
    }
  }

  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      const response = await apiService.patch<Order>(`/orders/${orderId}/cancel`, { reason });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to cancel order');
    }
  }

  async rateOrder(orderId: string, rating: number, review?: string): Promise<Order> {
    try {
      const response = await apiService.post<Order>(`/orders/${orderId}/rate`, { rating, review });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to rate order');
    }
  }

  async getOrderHistory(params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ orders: Order[]; total: number }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.status) queryParams.append('status', params.status);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const response = await apiService.get<{ orders: Order[]; total: number }>(`/orders/history?${queryParams.toString()}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch order history');
    }
  }

  async reorder(orderId: string): Promise<Order> {
    try {
      const response = await apiService.post<Order>(`/orders/${orderId}/reorder`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to reorder');
    }
  }

  async getOrderTracking(orderId: string): Promise<{
    order: Order;
    tracking: {
      status: string;
      estimatedDelivery: string;
      location?: {
        latitude: number;
        longitude: number;
      };
    };
  }> {
    try {
      const response = await apiService.get<{
        order: Order;
        tracking: {
          status: string;
          estimatedDelivery: string;
          location?: {
            latitude: number;
            longitude: number;
          };
        };
      }>(`/orders/${orderId}/tracking`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch order tracking');
    }
  }
}

export const orderService = new OrderService();
export default orderService;