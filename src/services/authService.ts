import { apiService } from './api';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'customer' | 'restaurant_owner';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface SocialLoginData {
  provider: 'google' | 'facebook' | 'apple';
  token: string;
  userInfo: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      await apiService.setAuthToken(response.token);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/register', userData);
      await apiService.setAuthToken(response.token);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
      await apiService.clearAuthToken();
    } catch (error: any) {
      // Even if logout fails on server, clear local token
      await apiService.clearAuthToken();
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  }

  async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    try {
      const response = await apiService.post<{ token: string; refreshToken: string }>('/auth/refresh');
      await apiService.setAuthToken(response.token);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  async socialLogin(provider: 'google' | 'facebook' | 'apple'): Promise<AuthResponse> {
    try {
      // This would integrate with the respective social login SDKs
      // For now, we'll simulate the flow
      const socialData = await this.getSocialLoginData(provider);
      
      const response = await apiService.post<AuthResponse>('/auth/social', {
        provider,
        ...socialData,
      });
      
      await apiService.setAuthToken(response.token);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Social login failed');
    }
  }

  private async getSocialLoginData(provider: 'google' | 'facebook' | 'apple'): Promise<SocialLoginData> {
    // This would integrate with actual social login SDKs
    // For now, return mock data
    switch (provider) {
      case 'google':
        return {
          provider: 'google',
          token: 'mock_google_token',
          userInfo: {
            id: 'google_user_id',
            email: 'user@gmail.com',
            name: 'John Doe',
            avatar: 'https://example.com/avatar.jpg',
          },
        };
      case 'facebook':
        return {
          provider: 'facebook',
          token: 'mock_facebook_token',
          userInfo: {
            id: 'facebook_user_id',
            email: 'user@facebook.com',
            name: 'John Doe',
            avatar: 'https://example.com/avatar.jpg',
          },
        };
      case 'apple':
        return {
          provider: 'apple',
          token: 'mock_apple_token',
          userInfo: {
            id: 'apple_user_id',
            email: 'user@icloud.com',
            name: 'John Doe',
          },
        };
      default:
        throw new Error('Unsupported social login provider');
    }
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await apiService.put<User>('/auth/profile', profileData);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiService.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await apiService.post('/auth/forgot-password', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiService.post('/auth/reset-password', {
        token,
        newPassword,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      await apiService.post('/auth/verify-email', { token });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Email verification failed');
    }
  }

  async resendVerificationEmail(): Promise<void> {
    try {
      await apiService.post('/auth/resend-verification');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to resend verification email');
    }
  }
}

export const authService = new AuthService();
export default authService;