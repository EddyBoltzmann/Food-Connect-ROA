import { apiService } from './api';
import { ChatRoom, ChatMessage } from '../types';

class ChatService {
  async getChatRooms(): Promise<ChatRoom[]> {
    try {
      const response = await apiService.get<ChatRoom[]>('/chat/rooms');
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch chat rooms');
    }
  }

  async getChatMessages(orderId: string): Promise<ChatMessage[]> {
    try {
      const response = await apiService.get<ChatMessage[]>(`/chat/messages/${orderId}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch chat messages');
    }
  }

  async sendMessage(orderId: string, message: string, type: 'text' | 'image' = 'text'): Promise<ChatMessage> {
    try {
      const response = await apiService.post<ChatMessage>('/chat/messages', {
        orderId,
        message,
        type,
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send message');
    }
  }

  async markMessagesAsRead(orderId: string, messageIds: string[]): Promise<void> {
    try {
      await apiService.patch(`/chat/messages/read`, {
        orderId,
        messageIds,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to mark messages as read');
    }
  }

  async uploadImage(orderId: string, imageUri: string): Promise<ChatMessage> {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'chat-image.jpg',
      } as any);
      formData.append('orderId', orderId);

      const response = await apiService.uploadFile<ChatMessage>('/chat/upload-image', formData);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload image');
    }
  }

  async getUnreadCount(): Promise<{ total: number; byRoom: { [orderId: string]: number } }> {
    try {
      const response = await apiService.get<{ total: number; byRoom: { [orderId: string]: number } }>('/chat/unread-count');
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch unread count');
    }
  }

  async clearChatHistory(orderId: string): Promise<void> {
    try {
      await apiService.delete(`/chat/messages/${orderId}`);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to clear chat history');
    }
  }

  async reportMessage(messageId: string, reason: string): Promise<void> {
    try {
      await apiService.post('/chat/report', {
        messageId,
        reason,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to report message');
    }
  }

  async blockUser(userId: string): Promise<void> {
    try {
      await apiService.post('/chat/block', { userId });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to block user');
    }
  }

  async unblockUser(userId: string): Promise<void> {
    try {
      await apiService.delete(`/chat/block/${userId}`);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to unblock user');
    }
  }
}

export const chatService = new ChatService();
export default chatService;