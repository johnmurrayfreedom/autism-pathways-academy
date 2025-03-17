import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API base URL - we'll load this from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Clear token and redirect to login page
      localStorage.removeItem('accessToken');
      // For a SPA, we'd redirect to login
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Handle other errors
    return Promise.reject(error);
  }
);

// Error handling helper
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Handle backend validation errors
    if (axiosError.response?.status === 422) {
      const validationErrors = axiosError.response.data as any;
      if (validationErrors.detail) {
        return Array.isArray(validationErrors.detail) 
          ? validationErrors.detail.map((err: any) => err.msg).join(', ')
          : validationErrors.detail;
      }
    }
    
    // Handle generic API errors
    if (axiosError.response?.data && (axiosError.response.data as any).detail) {
      return (axiosError.response.data as any).detail;
    }
    
    // Handle network errors
    if (axiosError.message === 'Network Error') {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    return axiosError.message || 'An unexpected error occurred';
  }
  
  return error?.message || 'An unexpected error occurred';
};

export default apiClient; 