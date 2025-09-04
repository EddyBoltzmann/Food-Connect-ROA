import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatRoom, ChatMessage, ChatState } from '../../types';
import { chatService } from '../../services/chatService';

const initialState: ChatState = {
  rooms: [],
  currentRoom: null,
  messages: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchChatRooms = createAsyncThunk(
  'chat/fetchChatRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.getChatRooms();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch chat rooms');
    }
  }
);

export const fetchChatMessages = createAsyncThunk(
  'chat/fetchChatMessages',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await chatService.getChatMessages(orderId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch chat messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ orderId, message, type = 'text' }: { orderId: string; message: string; type?: 'text' | 'image' }, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage(orderId, message, type);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRoom: (state, action: PayloadAction<ChatRoom | null>) => {
      state.currentRoom = action.payload;
    },
    receiveMessage: (state, action: PayloadAction<ChatMessage>) => {
      const message = action.payload;
      
      // Add message to messages list
      state.messages.push(message);
      
      // Update room's last message and unread count
      const room = state.rooms.find(r => r.orderId === message.orderId);
      if (room) {
        room.lastMessage = message;
        if (message.senderType !== 'customer') {
          room.unreadCount += 1;
        }
      }
    },
    markMessageAsRead: (state, action: PayloadAction<{ messageId: string }>) => {
      const message = state.messages.find(m => m.id === action.payload.messageId);
      if (message) {
        message.read = true;
      }
    },
    markRoomAsRead: (state, action: PayloadAction<{ orderId: string }>) => {
      const room = state.rooms.find(r => r.orderId === action.payload.orderId);
      if (room) {
        room.unreadCount = 0;
      }
      
      // Mark all messages in this room as read
      state.messages.forEach(message => {
        if (message.orderId === action.payload.orderId) {
          message.read = true;
        }
      });
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch chat rooms
      .addCase(fetchChatRooms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rooms = action.payload;
        state.error = null;
      })
      .addCase(fetchChatRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch chat messages
      .addCase(fetchChatMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
        state.error = null;
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload);
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setCurrentRoom,
  receiveMessage,
  markMessageAsRead,
  markRoomAsRead,
  clearMessages,
} = chatSlice.actions;
export default chatSlice.reducer;