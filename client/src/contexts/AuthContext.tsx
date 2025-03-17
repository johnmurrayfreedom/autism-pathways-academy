import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserPreferences, LoginCredentials, RegisterData } from '../services/auth';
import AuthService from '../services/auth';

interface AuthContextType {
  user: User | null;
  preferences: UserPreferences | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to load user on initial mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (AuthService.isAuthenticated()) {
        setIsLoading(true);
        try {
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
          try {
            const prefsData = await AuthService.getUserPreferences();
            setPreferences(prefsData);
          } catch (prefsError) {
            console.error('Error loading preferences:', prefsError);
            // Continue even if preferences fail to load
          }
        } catch (error) {
          console.error('Error loading user:', error);
          // If we can't load the user, clear the token
          AuthService.logout();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.login(credentials);
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
      const prefsData = await AuthService.getUserPreferences();
      setPreferences(prefsData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred during login');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.register(data);
      // After registration, we login automatically
      await login({ username: data.email, password: data.password });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred during registration');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setPreferences(null);
  };

  const updateUserPreferences = async (newPreferences: Partial<UserPreferences>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedPreferences = await AuthService.updateUserPreferences(newPreferences);
      setPreferences(updatedPreferences);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred while updating preferences');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    preferences,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUserPreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext; 