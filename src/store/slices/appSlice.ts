import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../../types';

const initialState: AppState = {
  theme: 'light',
  language: 'en',
  isOnline: true,
  isLoading: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'en' | 'tw' | 'fr'>) => {
      state.language = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const {
  setTheme,
  setLanguage,
  setOnlineStatus,
  setLoading,
  toggleTheme,
} = appSlice.actions;

export default appSlice.reducer;