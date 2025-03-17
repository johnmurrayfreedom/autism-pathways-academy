import apiClient, { handleApiError } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  is_active?: boolean;
  is_superuser?: boolean;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
}

export interface UserPreferences {
  id: number;
  user_id: number;
  communication_style: 'direct' | 'detailed' | 'visual';
  feedback_preference: 'explicit' | 'gentle' | 'positive';
  interaction_mode: 'text' | 'visual' | 'mixed';
  visual_support: boolean;
  reduced_motion: boolean;
  high_contrast: boolean;
  video_volume: number;
  video_playback_rate: number;
  video_brightness: number;
  video_contrast: number;
  video_muted: boolean;
  prefer_transcript: boolean;
  disable_autoplay: boolean;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export const AuthService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    try {
      // Convert to form data format required by OAuth2
      const formData = new URLSearchParams();
      formData.append('username', credentials.email); // FastAPI OAuth2 expects 'username'
      formData.append('password', credentials.password);
      
      const response = await apiClient.post<AuthTokens>('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      // Store token in localStorage
      if (response.data.access_token) {
        localStorage.setItem('accessToken', response.data.access_token);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await apiClient.post<User>('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  /**
   * Get current logged-in user data
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  /**
   * Get user preferences
   */
  async getUserPreferences(): Promise<UserPreferences> {
    try {
      const response = await apiClient.get<UserPreferences>('/preferences/me');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  /**
   * Update user preferences
   */
  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const response = await apiClient.put<UserPreferences>('/preferences/me', preferences);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  
  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    // Optional: Clear any other user-related data from localStorage
    localStorage.removeItem('user');
  },
  
  /**
   * Check if user is logged in
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
};

export default AuthService; 