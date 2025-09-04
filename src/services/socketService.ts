import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { chatActions } from '../store/slices/chatSlice';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect() {
    if (this.socket?.connected) {
      return;
    }

    const API_URL = __DEV__ 
      ? 'http://localhost:3000' 
      : 'https://your-production-api.com';

    this.socket = io(API_URL, {
      transports: ['websocket'],
      timeout: 20000,
    });

    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Chat events
    this.socket.on('message', (message) => {
      store.dispatch(chatActions.receiveMessage(message));
    });

    this.socket.on('messageRead', (data) => {
      store.dispatch(chatActions.markMessageAsRead(data.messageId));
    });

    // Order events
    this.socket.on('orderUpdate', (order) => {
      // TODO: Handle order updates
      console.log('Order update received:', order);
    });

    // Restaurant events
    this.socket.on('menuUpdate', (menuData) => {
      // TODO: Handle menu updates
      console.log('Menu update received:', menuData);
    });
  }

  // Chat methods
  joinChatRoom(orderId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('joinChatRoom', { orderId });
    }
  }

  leaveChatRoom(orderId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leaveChatRoom', { orderId });
    }
  }

  sendMessage(orderId: string, message: string, type: 'text' | 'image' = 'text') {
    if (this.socket && this.isConnected) {
      this.socket.emit('sendMessage', {
        orderId,
        message,
        type,
        timestamp: new Date().toISOString(),
      });
    }
  }

  markMessageAsRead(messageId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('markMessageAsRead', { messageId });
    }
  }

  // Order methods
  joinOrderRoom(orderId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('joinOrderRoom', { orderId });
    }
  }

  leaveOrderRoom(orderId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leaveOrderRoom', { orderId });
    }
  }

  // Restaurant methods
  joinRestaurantRoom(restaurantId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('joinRestaurantRoom', { restaurantId });
    }
  }

  leaveRestaurantRoom(restaurantId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leaveRestaurantRoom', { restaurantId });
    }
  }

  // Utility methods
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
export default socketService;